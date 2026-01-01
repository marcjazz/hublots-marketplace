'use server';

import { getProductPrice } from '@/lib/helpers/get-product-price';
import { sortProducts } from '@/lib/helpers/sort-products';
import { HttpTypes } from '@/types/medusa';
import { SortOptions } from '@/types/product';
import { SellerProps } from '@/types/seller';

import { sdk } from '../config';
import { getAuthHeaders } from './cookies';
import { getRegion, retrieveRegion } from './regions';

export const listProducts = async ({
  pageParam = 1,
  queryParams,
  countryCode,
  regionId,
  category_id,
  collection_id,
  forceCache = false
}: {
  pageParam?: number;
  queryParams?: HttpTypes.FindParams &
    HttpTypes.StoreProductParams & {
      handle?: string[];
    };
  category_id?: string;
  collection_id?: string;
  countryCode?: string;
  regionId?: string;
  forceCache?: boolean;
}): Promise<{
  response: {
    products: (HttpTypes.StoreProduct & { seller?: SellerProps })[];
    count: number;
  };
  nextPage: number | null;
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductParams;
}> => {
  if (!countryCode && !regionId) {
    throw new Error('Country code or region ID is required');
  }

  const limit = queryParams?.limit || 12;
  const _pageParam = Math.max(pageParam, 1);
  const offset = (_pageParam - 1) * limit;

  let region: HttpTypes.StoreRegion | undefined | null;

  if (countryCode) {
    region = (await getRegion(countryCode)) as unknown as HttpTypes.StoreRegion;
  } else {
    region = (await retrieveRegion(regionId!)) as unknown as HttpTypes.StoreRegion;
  }

  if (!region) {
    return {
      response: { products: [], count: 0 },
      nextPage: null
    };
  }

  const headers = {
    ...(await getAuthHeaders())
  };

  const useCached = forceCache || (limit <= 8 && !category_id && !collection_id);

  return sdk.client
    .fetch<{
      products: (HttpTypes.StoreProduct & { seller?: SellerProps })[];
      count: number;
    }>(`/store/products`, {
      method: 'GET',
      query: {
        country_code: countryCode,
        category_id,
        collection_id,
        limit,
        offset,
        region_id: region?.id,
        fields:
          '*variants.calculated_price,+variants.inventory_quantity,*seller,*variants,*attribute_values,*attribute_values.attribute',
        ...queryParams
      },
      headers,
      next: useCached ? { revalidate: 60 } : undefined,
      cache: useCached ? 'force-cache' : 'no-cache'
    })
    .then(
      ({
        products: productsRaw,
        count
      }: {
        products: (HttpTypes.StoreProduct & { seller?: SellerProps })[];
        count: number;
      }) => {
        const products = productsRaw.filter(
          product => product.seller?.store_status !== 'SUSPENDED'
        );

        const nextPage = count > offset + limit ? pageParam + 1 : null;

        const response = products.map(prod => {
          const reviews = prod.seller?.reviews?.filter((item: unknown) => !!item) ?? [];
          return {
            ...prod,
            seller: prod.seller ? { ...prod.seller, reviews } : undefined
          };
        });

        return {
          response: {
            products: response,
            count
          },
          nextPage: nextPage,
          queryParams
        };
      }
    )
    .catch((error: any) => {
      console.error('listProducts - Error fetching products:', error);
      return {
        response: {
          products: [],
          count: 0
        },
        nextPage: 0,
        queryParams
      };
    });
};

/**
 * This will fetch 100 products to the Next.js cache and sort them based on the sortBy parameter.
 * It will then return the paginated products based on the page and limit parameters.
 */
export const listProductsWithSort = async ({
  page = 1,
  queryParams,
  sortBy = 'created_at',
  countryCode,
  category_id,
  seller_id,
  collection_id,
  filters
}: {
  page?: number;
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductParams;
  sortBy?: SortOptions;
  countryCode: string;
  category_id?: string;
  seller_id?: string;
  collection_id?: string;
  filters?: Record<string, string>;
}): Promise<{
  response: {
    products: HttpTypes.StoreProduct[];
    count: number;
  };
  nextPage: number | null;
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductParams;
}> => {
  const limit = queryParams?.limit || 12;

  const {
    response: { products, count }
  } = await listProducts({
    pageParam: 0,
    queryParams: {
      ...queryParams,
      limit: 100
    },
    category_id,
    collection_id,
    countryCode
  });

  let filteredProducts = seller_id
    ? (products as (HttpTypes.StoreProduct & { seller?: SellerProps })[]).filter(
        product => product.seller?.id === seller_id
      )
    : products;

  // Apply filters from search params
  if (filters) {
    if (filters.size) {
      const sizes = filters.size.split(',').filter(Boolean);
      filteredProducts = filteredProducts.filter((product: any) =>
        product.attribute_values?.some(
          (av: any) => av.attribute?.handle === 'size' && sizes.includes(av.value)
        )
      );
    }
    if (filters.color) {
      const colors = filters.color.split(',').filter(Boolean);
      filteredProducts = filteredProducts.filter((product: any) =>
        product.attribute_values?.some(
          (av: any) => av.attribute?.handle === 'color' && colors.includes(av.value)
        )
      );
    }
    if (filters.condition) {
      const conditions = filters.condition.split(',').filter(Boolean);
      filteredProducts = filteredProducts.filter((product: any) =>
        product.attribute_values?.some(
          (av: any) => av.attribute?.handle === 'condition' && conditions.includes(av.value)
        )
      );
    }
    if (filters.min_price) {
      const minPrice = parseFloat(filters.min_price);
      filteredProducts = filteredProducts.filter(product => {
        const { cheapestPrice } = getProductPrice({ product });
        return (cheapestPrice?.calculated_price_number || 0) >= minPrice;
      });
    }
    if (filters.max_price) {
      const maxPrice = parseFloat(filters.max_price);
      filteredProducts = filteredProducts.filter(product => {
        const { cheapestPrice } = getProductPrice({ product });
        return (cheapestPrice?.calculated_price_number || 0) <= maxPrice;
      });
    }
  }

  const pricedProducts = filteredProducts.filter(prod =>
    prod.variants?.some((variant: any) => {
      console.log(`Product ${prod.id} variant calculated_price:`, variant.calculated_price);
      return variant.calculated_price !== null;
    })
  );

  const sortedProducts = sortProducts(pricedProducts as HttpTypes.StoreProduct[], sortBy);

  const pageParam = (page - 1) * limit;

  const nextPage = count > pageParam + limit ? pageParam + limit : null;

  const paginatedProducts = sortedProducts.slice(pageParam, pageParam + limit);

  return {
    response: {
      products: paginatedProducts,
      count
    },
    nextPage,
    queryParams
  };
};

import { 
  StoreProductsListRes, 
  StoreGetProductsParams, 
  Region,
  ProductVariant,
  Cart,
  Order,
  Customer,
  ProductCategory,
  ProductCollection,
  StoreCartsRes,
  StoreOrdersRes,
  StoreCustomersRes,
  StoreGetProductCategoriesRes,
  StoreCollectionsListRes
} from '@medusajs/client-types'

export namespace HttpTypes {
  export type StoreProduct = StoreProductsListRes["products"][0]
  export type StoreCart = Cart
  export type StoreOrder = Order
  export type StoreRegion = Region
  export type StoreCustomer = Customer
  export type StoreProductCategory = ProductCategory
  export type StoreCollection = ProductCollection
  export type StoreVariant = ProductVariant
  export type StoreProductParams = StoreGetProductsParams
  export type FindParams = any
  export type StoreCartResponse = StoreCartsRes
  export type StoreOrderResponse = StoreOrdersRes
  export type StoreCustomerResponse = StoreCustomersRes
  export type StoreProductCategoryListResponse = StoreGetProductCategoriesRes
  export type StoreCollectionListResponse = StoreCollectionsListRes
}

export type {
  StoreProductsListRes,
  StoreGetProductsParams,
  Region,
  ProductVariant,
  Cart,
  Order,
  Customer,
  ProductCategory,
  ProductCollection
}

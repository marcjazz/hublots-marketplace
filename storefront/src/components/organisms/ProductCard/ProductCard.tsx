"use client"

import Image from "next/image"
import { Button } from "@/components/atoms"
import { HttpTypes } from '@/types/medusa'
import { cn } from "@/lib/utils"
import LocalizedClientLink from "@/components/molecules/LocalizedLink/LocalizedLink"
import { getProductPrice } from "@/lib/helpers/get-product-price"

export const ProductCard = ({
  product,
  api_product,
  className,
}: {
  product: HttpTypes.StoreProduct
  api_product?: HttpTypes.StoreProduct | null
  className?: string
}) => {
  const displayProduct = api_product || product

  if (!displayProduct) {
    return null
  }

  const { cheapestPrice } = getProductPrice({
    product: displayProduct,
  })

  const productName = String(displayProduct.title || "Product")

  return (
    <div
      className={cn(
        "relative group border rounded-sm flex flex-col justify-between p-1 w-full lg:w-[calc(25%-1rem)] min-w-[250px]",
        className
      )}
    >
      <div className="relative w-full h-full bg-primary aspect-square">
        <LocalizedClientLink
          href={`/products/${displayProduct.handle}`}
          aria-label={`View ${productName}`}
          title={`View ${productName}`}
        >
          <div className="overflow-hidden rounded-sm w-full h-full flex justify-center align-center ">
            {displayProduct.thumbnail ? (
              <Image
                priority
                fetchPriority="high"
                src={decodeURIComponent(displayProduct.thumbnail)}
                alt={`${productName} image`}
                width={100}
                height={100}
                sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover aspect-square w-full object-center h-full lg:group-hover:-mt-14 transition-all duration-300 rounded-xs"
              />
            ) : (
              <Image
                priority
                fetchPriority="high"
                src="/images/placeholder.svg"
                alt={`${productName} image placeholder`}
                width={100}
                height={100}
                sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
              />
            )}
          </div>
        </LocalizedClientLink>
        <LocalizedClientLink
          href={`/products/${displayProduct.handle}`}
          aria-label={`See more about ${productName}`}
          title={`See more about ${productName}`}
        >
          <Button className="absolute rounded-sm bg-action text-action-on-primary h-auto lg:h-[48px] lg:group-hover:block hidden w-full uppercase bottom-1 z-10">
            See More
          </Button>
        </LocalizedClientLink>
      </div>
      <LocalizedClientLink
        href={`/products/${displayProduct.handle}`}
        aria-label={`Go to ${productName} page`}
        title={`Go to ${productName} page`}
      >
        <div className="flex justify-between p-4">
          <div className="w-full">
            <h3 className="heading-sm truncate">{displayProduct.title}</h3>
            <div className="flex items-center gap-2 mt-2">
              <p className="font-medium">{cheapestPrice?.calculated_price}</p>
              {cheapestPrice?.calculated_price !==
                cheapestPrice?.original_price && (
                <p className="text-sm text-gray-500 line-through">
                  {cheapestPrice?.original_price}
                </p>
              )}
            </div>
          </div>
        </div>
      </LocalizedClientLink>
    </div>
  )
}

import type {
  Region,
  ProductVariant,
  Cart,
  Order,
  Customer,
  ProductCategory,
  ProductCollection,
  StoreGetProductsParams,
  StoreProductsListRes,
} from "@medusajs/client-types"

import { HttpTypes as MedusaHttpTypes } from "@medusajs/types"

export namespace HttpTypes {
  export type StoreProduct = MedusaHttpTypes.StoreProduct
  export type StoreCart = MedusaHttpTypes.StoreCart & { promotions?: any[] }
  export type StoreOrder = MedusaHttpTypes.StoreOrder
  export type StoreRegion = MedusaHttpTypes.StoreRegion
  export type StoreCustomer = MedusaHttpTypes.StoreCustomer
  export type StoreProductCategory = MedusaHttpTypes.StoreProductCategory
  export type StoreCollection = MedusaHttpTypes.StoreCollection
  export type StoreVariant = MedusaHttpTypes.StoreProductVariant
  export type StoreProductVariant = MedusaHttpTypes.StoreProductVariant
  export type StoreProductParams = MedusaHttpTypes.StoreProductParams
  export type FindParams = any
  export type StoreCartResponse = MedusaHttpTypes.StoreCartResponse
  export type StoreOrderResponse = MedusaHttpTypes.StoreOrderResponse
  export type StoreCustomerResponse = MedusaHttpTypes.StoreCustomerResponse
  export type StoreProductCategoryListResponse = MedusaHttpTypes.StoreProductCategoryListResponse
  export type StoreCollectionListResponse = MedusaHttpTypes.StoreCollectionListResponse
  export type StoreCartAddress = MedusaHttpTypes.StoreCartAddress
  export type StoreCartLineItem = MedusaHttpTypes.StoreCartLineItem
  export type StoreOrderLineItem = MedusaHttpTypes.StoreOrderLineItem
  export type StoreCartShippingMethod = MedusaHttpTypes.StoreCartShippingMethod
  export type StoreCartShippingOption = MedusaHttpTypes.StoreCartShippingOption
  export type StoreCustomerAddress = MedusaHttpTypes.StoreCustomerAddress
  export type StorePaymentSession = MedusaHttpTypes.StorePaymentSession
  export type StoreProductOption = MedusaHttpTypes.StoreProductOption
  export type StoreProductOptionValue = MedusaHttpTypes.StoreProductOptionValue
  export type StoreProductTag = MedusaHttpTypes.StoreProductTag
  export type StoreReturnReason = MedusaHttpTypes.StoreReturnReason
  export type StoreUpdateCart = MedusaHttpTypes.StoreUpdateCart
  export type StoreUpdateCustomer = MedusaHttpTypes.StoreUpdateCustomer
  export type StoreUpdateCustomerAddress = MedusaHttpTypes.StoreUpdateCustomerAddress
  export type StorePaymentProviderListResponse = any
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
  ProductCollection,
}
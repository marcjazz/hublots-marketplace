import { 
  StoreProductListResponse as MedusaStoreProductListResponse, 
  StoreProductParams as MedusaStoreProductParams, 
  StoreRegion as MedusaStoreRegion,
  StoreCart as MedusaStoreCart,
  StoreOrder as MedusaStoreOrder,
  StoreCustomer as MedusaStoreCustomer,
  StoreProductCategory as MedusaStoreProductCategory,
  StoreCartResponse as MedusaStoreCartResponse,
  StoreOrderResponse as MedusaStoreOrderResponse,
  StoreCustomerResponse as MedusaStoreCustomerResponse,
  StoreProductCategoryListResponse as MedusaStoreProductCategoryListResponse,
  StoreCollectionListResponse as MedusaStoreCollectionListResponse,
  StoreCartLineItem as MedusaStoreCartLineItem,
  StoreOrderLineItem as MedusaStoreOrderLineItem,
  StoreCartShippingMethod as MedusaStoreCartShippingMethod,
  StoreCartShippingOption as MedusaStoreCartShippingOption,
  StorePaymentSession as MedusaStorePaymentSession,
  StoreProductOption as MedusaStoreProductOption,
  StoreProductOptionValue as MedusaStoreProductOptionValue,
  StoreProductTag as MedusaStoreProductTag,
  StoreReturnReason as MedusaStoreReturnReason,
  StoreUpdateCart as MedusaStoreUpdateCart,
  StoreUpdateCustomer as MedusaStoreUpdateCustomer,
  StoreUpdateCustomerAddress as MedusaStoreUpdateCustomerAddress,
} from '@medusajs/types'

export namespace HttpTypes {
  export type StoreProduct = MedusaStoreProductListResponse["products"][0]
  export type StoreCart = MedusaStoreCart & { promotions?: any[] }
  export type StoreOrder = MedusaStoreOrder
  export type StoreRegion = MedusaStoreRegion
  export type StoreCustomer = MedusaStoreCustomer
  export type StoreProductCategory = MedusaStoreProductCategory
  export type StoreCollection = MedusaStoreCollectionListResponse["collections"][0]
  export type StoreVariant = NonNullable<StoreProduct["variants"]>[0]
  export type StoreProductVariant = StoreVariant
  export type StoreProductParams = MedusaStoreProductParams
  export type FindParams = any
  export type StoreCartResponse = MedusaStoreCartResponse
  export type StoreOrderResponse = MedusaStoreOrderResponse
  export type StoreCustomerResponse = MedusaStoreCustomerResponse
  export type StoreProductCategoryListResponse = MedusaStoreProductCategoryListResponse
  export type StoreCollectionListResponse = MedusaStoreCollectionListResponse
  export type StoreCartAddress = any // MedusaStoreAddress was missing
  export type StoreCartLineItem = MedusaStoreCartLineItem
  export type StoreOrderLineItem = MedusaStoreOrderLineItem
  export type StoreCartShippingMethod = MedusaStoreCartShippingMethod
  export type StoreCartShippingOption = MedusaStoreCartShippingOption
  export type StoreCustomerAddress = any // MedusaStoreAddress was missing
  export type StorePaymentSession = MedusaStorePaymentSession
  export type StoreProductOption = MedusaStoreProductOption
  export type StoreProductOptionValue = MedusaStoreProductOptionValue
  export type StoreProductTag = MedusaStoreProductTag
  export type StoreReturnReason = MedusaStoreReturnReason
  export type StoreUpdateCart = MedusaStoreUpdateCart
  export type StoreUpdateCustomer = MedusaStoreUpdateCustomer
  export type StoreUpdateCustomerAddress = MedusaStoreUpdateCustomerAddress
  export type StorePaymentProviderListResponse = any
}

export type {
  MedusaStoreProductListResponse as StoreProductListResponse,
  MedusaStoreProductParams as StoreProductParams,
  MedusaStoreRegion as StoreRegion,
  MedusaStoreCart as StoreCart,
  MedusaStoreOrder as StoreOrder,
  MedusaStoreCustomer as StoreCustomer,
  MedusaStoreProductCategory as StoreProductCategory
}
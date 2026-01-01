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
  StoreCollectionsListRes,
  Address,
  LineItem,
  ShippingMethod,
  PricedShippingOption,
  PaymentSession,
  ProductOption,
  ProductOptionValue,
  ProductTag,
  ReturnReason,
  StorePostCartsCartReq,
  StorePostCustomersCustomerReq,
  StorePostCustomersCustomerAddressesAddressReq,
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
  export type StoreCartAddress = Address
  export type StoreCartLineItem = LineItem
  export type StoreOrderLineItem = LineItem
  export type StoreCartShippingMethod = ShippingMethod
  export type StoreCartShippingOption = PricedShippingOption
  export type StoreCustomerAddress = Address
  export type StorePaymentSession = PaymentSession
  export type StoreProductOption = ProductOption
  export type StoreProductOptionValue = ProductOptionValue
  export type StoreProductTag = ProductTag
  export type StoreReturnReason = ReturnReason
  export type StoreUpdateCart = StorePostCartsCartReq
  export type StoreUpdateCustomer = StorePostCustomersCustomerReq
  export type StoreUpdateCustomerAddress = StorePostCustomersCustomerAddressesAddressReq
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
  ProductCollection
}

import type { HttpTypes } from "@medusajs/types"

export interface Cart extends HttpTypes.StoreCart {
  promotions?: any[];
}

export interface StoreCartLineItemOptimisticUpdate
  extends Partial<HttpTypes.StoreCartLineItem> {
  tax_total: number
}

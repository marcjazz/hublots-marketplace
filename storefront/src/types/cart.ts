import { HttpTypes } from "@medusajs/types"

export interface Cart extends HttpTypes.StoreCart {
  promotions?: any[];
  discount_subtotal?: number;
  item_subtotal?: number;
  shipping_subtotal?: number;
  tax_total?: number;
  total?: number;
}

export interface StoreCartLineItemOptimisticUpdate
  extends Partial<HttpTypes.StoreCartLineItem> {
  tax_total: number
}

import { HttpTypes } from '@/types/medusa'

export interface Cart extends HttpTypes.StoreCart {
//  promotions?: any[]
 discount_subtotal?: number
}

export interface StoreCartLineItemOptimisticUpdate
 extends Partial<HttpTypes.StoreCartLineItem> {
 tax_total: number
}

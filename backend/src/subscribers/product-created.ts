import type { SubscriberArgs, SubscriberConfig } from '@medusajs/framework'
import { ProductEvents } from '@medusajs/framework/utils'

console.log('[Product Subscriber] File loaded')

export default async function productCreateHandler({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>) {
  const productId = data.id

  const productModuleService = container.resolve('product')

  const product = await productModuleService.retrieveProduct(productId)

  console.log(`[Product Subscriber] The product ${product.title} was created`)
}

export const config: SubscriberConfig = {
  event: ProductEvents.PRODUCT_CREATED,
  context: {
    subscriberId: 'product-subscriber',
  },
}

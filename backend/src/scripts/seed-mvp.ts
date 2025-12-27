import { ExecArgs } from '@medusajs/framework/types'
import GeolocationService from '../modules/geolocation/service'
import SubscriptionService from '../modules/subscription/service'
import { StoreStatus } from '@mercurjs/framework'

export default async function seed({ container }: ExecArgs) {
  const sellerModule = container.resolve('seller')
  const subscriptionService =
    container.resolve<SubscriptionService>('subscription')
  const geolocationService =
    container.resolve<GeolocationService>('geolocation')

  console.log('Seeding subscription plans...')
  const basique = await subscriptionService.createSubscriptionPlans({
    name: 'Basique',
    price_monthly: 0,
    commission_rate: 0.2,
    visibility_boost: false,
  })

  const pro = await subscriptionService.createSubscriptionPlans({
    name: 'Pro',
    price_monthly: 10000, // 100.00
    commission_rate: 0.1,
    visibility_boost: true,
  })

  console.log('Seeding Sellers (Stores)...')

  // Paris Store (Pro)
  const [seller1] = await sellerModule.createSellers([
    {
      name: 'Paris Tech Experts',
      description: 'High-end tech repairs in Paris',
      store_status: StoreStatus.ACTIVE,
    },
  ])
  await subscriptionService.activateSubscription(seller1.id, pro.id)
  await geolocationService.upsertStoreLocation(seller1.id, 48.8566, 2.3522)

  // Lyon Store (Basique)
  const [seller2] = await sellerModule.createSellers([
    {
      name: 'Lyon Gadget Fix',
      description: 'Fast gadget repairs in Lyon',
      store_status: StoreStatus.ACTIVE,
    },
  ])
  await subscriptionService.activateSubscription(seller2.id, basique.id)
  await geolocationService.upsertStoreLocation(seller2.id, 45.764, 4.8357)

  // Pending Store (Paris)
  const [seller3] = await sellerModule.createSellers([
    {
      name: 'Newbie Repairs',
      description: 'Just starting out',
      store_status: StoreStatus.INACTIVE,
    },
  ])
  await geolocationService.upsertStoreLocation(seller3.id, 48.8584, 2.2945)

  console.log('Seed completed successfully.')
}

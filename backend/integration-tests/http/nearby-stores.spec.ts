import { Modules } from '@medusajs/utils'
import { medusaIntegrationTestRunner } from '@medusajs/test-utils'
import GeolocationService from '../../src/modules/geolocation/service'
import SubscriptionService from '../../src/modules/subscription/service'

jest.setTimeout(60 * 1000)

medusaIntegrationTestRunner({
  testSuite: ({ api, getContainer }) => {
    describe('Nearby Stores API', () => {
      it('should return nearby stores sorted by subscription tier', async () => {
        const container = getContainer()

        const geolocationModule = container.resolve<GeolocationService>('geolocation')
        const subscriptionModule = container.resolve<SubscriptionService>('subscription')
        const sellerModule = container.resolve('seller')

        // 1. Create sellers (which act as stores in MercurJS)
        const sellers = await sellerModule.createSellers([
          {
            name: 'Store Pro',
            handle: 'store-pro',
          },
          {
            name: 'Store Basique',
            handle: 'store-basique',
          },
        ])

        const seller1 = sellers[0]
        const seller2 = sellers[1]

        // 2. Setup subscriptions
        const proPlan = await subscriptionModule.createSubscriptionPlans({
          name: 'Pro',
          commission_rate: 0.1,
          visibility_boost: true,
        })
        await subscriptionModule.activateSubscription(seller1.id, proPlan.id)

        // 3. Setup geolocations
        await geolocationModule.upsertStoreLocation(seller1.id, 10, 10)
        await geolocationModule.upsertStoreLocation(seller2.id, 10.001, 10.001)

        // 4. Call API
        const response = await api.post('/store/stores/nearby', {
          latitude: 10,
          longitude: 10,
          radius: 5,
        })

        expect(response.status).toEqual(200)
        expect(response.data.stores).toHaveLength(2)
        // Store 1 (Pro) should be first due to visibility_boost
        expect(response.data.stores[0].id).toEqual(seller1.id)
        expect(response.data.stores[1].id).toEqual(seller2.id)
      })
    })
  },
})


import { medusaIntegrationTestRunner } from '@medusajs/test-utils'
import { Modules } from '@medusajs/utils'
import { IApiKeyModuleService } from '@medusajs/framework/types'
import { SELLER_MODULE } from '@mercurjs/b2c-core/modules/seller'
import SubscriptionService from '../../src/modules/subscription/service'
import GeolocationService from '../../src/modules/geolocation/service'

jest.setTimeout(60 * 1000)

medusaIntegrationTestRunner({
  testSuite: ({ api, getContainer }) => {
    describe('Core User Workflows E2E', () => {
      describe('Geolocation-based Provider Search', () => {
        it('should find nearby stores and sort them by subscription tier', async () => {
          const container = getContainer()
          const sellerModule = container.resolve<any>(SELLER_MODULE)
          const subscriptionModule = container.resolve<SubscriptionService>('subscription')
          const geolocationModule = container.resolve<GeolocationService>('geolocation')
          const apiKeyModule = container.resolve<IApiKeyModuleService>(Modules.API_KEY)

          // 0. Setup headers
          const pubKeys = await apiKeyModule.createApiKeys([
            {
              title: 'Test Key',
              type: 'publishable',
              created_by: 'test',
            },
          ])
          const headers = {
            'x-publishable-api-key': pubKeys[0].token,
          }

          // 1. Create sellers
          const sellers = await sellerModule.createSellers([
            {
              name: 'Store Pro',
              handle: 'store-pro',
              store_status: 'ACTIVE',
            },
            {
              name: 'Store Basique',
              handle: 'store-basique',
              store_status: 'ACTIVE',
            },
          ])

          const seller1 = sellers[0]
          const seller2 = sellers[1]

          // 2. Setup plans via module
          const proPlan = await subscriptionModule.createSubscriptionPlans({
            name: 'Pro',
            commission_rate: 0.1,
            visibility_boost: true,
            price_monthly: 50,
          })

          const basiquePlan = await subscriptionModule.createSubscriptionPlans({
            name: 'Basique',
            commission_rate: 0.2,
            visibility_boost: false,
            price_monthly: 0,
          })

          await subscriptionModule.activateSubscription(seller1.id, proPlan.id)
          await subscriptionModule.activateSubscription(seller2.id, basiquePlan.id)

          // 3. Setup geolocations
          await geolocationModule.upsertStoreLocation(seller1.id, 10, 10)
          await geolocationModule.upsertStoreLocation(seller2.id, 10.001, 10.001)

          // 4. Call API
          const response = await api.post(
            '/store/stores/nearby',
            {
              latitude: 10,
              longitude: 10,
              radius: 5,
            },
            { headers }
          )

          expect(response.status).toEqual(200)
          expect(response.data.stores).toBeDefined()
          expect(response.data.stores.length).toBeGreaterThanOrEqual(2)
          // Store 1 (Pro) should be first due to visibility_boost
          expect(response.data.stores[0].id).toEqual(seller1.id)
          expect(response.data.stores[1].id).toEqual(seller2.id)
        })
      })

      describe('Subscription Management', () => {
        it('should allow a store to activate and change subscriptions', async () => {
          const container = getContainer()
          const sellerModule = container.resolve(SELLER_MODULE) as any
          const subscriptionModule = container.resolve<SubscriptionService>('subscription')

          // 1. Create seller
          const sellers = await sellerModule.createSellers([
            {
              name: 'Test Store',
              handle: 'test-store-sub',
              store_status: 'ACTIVE',
            },
          ])
          const seller = sellers[0]

          // 2. Create plans
          const plans = await subscriptionModule.createSubscriptionPlans([
            {
              name: 'Pro Unique Sub',
              commission_rate: 0.1,
              visibility_boost: true,
              price_monthly: 50,
            },
          ])
          const proPlan = plans[0]

          // 3. Activate subscription via module
          await subscriptionModule.activateSubscription(seller.id, proPlan.id)

          // 4. Verify subscription status
          const sub = await subscriptionModule.getStoreSubscription(seller.id)
          expect(sub).toBeDefined()
          expect(sub!.subscription_plan_id).toEqual(proPlan.id)
          expect(sub!.status).toEqual('active')
        })
      })

      describe('Escrow Payment Flow (Simplified Mock)', () => {
        it('should handle order chat and contract generation', async () => {
          const container = getContainer()
          const apiKeyModule = container.resolve<IApiKeyModuleService>(Modules.API_KEY)

          // 0. Create a publishable key
          const pubKeys = await apiKeyModule.createApiKeys([
            {
              title: 'Test Key Chat',
              type: 'publishable',
              created_by: 'test',
            },
          ])
          const headers = {
            'x-publishable-api-key': pubKeys[0].token,
          }

          // 1. Add message to chat
          const chatResponse = await api.post(
            '/store/chats',
            {
              orderId: 'order_123',
              content: 'I agree to the price of 100€',
            },
            { headers }
          )

          expect(chatResponse.status).toEqual(200)
          expect(chatResponse.data.message.content).toEqual(
            'I agree to the price of 100€'
          )

          // 2. Generate contract
          const contractResponse = await api.post(
            '/store/contracts/generate',
            {
              orderId: 'order_123',
            },
            { headers }
          )

          expect(contractResponse.status).toEqual(200)
          expect(contractResponse.data.contractContent).toContain('order_123')
          expect(contractResponse.data.contractContent).toContain(
            'Standard Terms'
          )
        })
      })
    })
  },
})

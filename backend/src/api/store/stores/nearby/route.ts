import { MedusaRequest, MedusaResponse } from '@medusajs/framework/http'
import { ContainerRegistrationKeys } from '@medusajs/framework/utils'
import GeolocationService from '../../../../modules/geolocation/service'
import SubscriptionService from '../../../../modules/subscription/service'

type NearbyStoreRequest = {
  latitude: number
  longitude: number
  radius?: number
}

export const POST = async (
  req: MedusaRequest<NearbyStoreRequest>,
  res: MedusaResponse
) => {
  const { latitude, longitude, radius = 5 } = req.body
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  const geolocationModule = req.scope.resolve(
    'geolocation'
  ) as GeolocationService
  const subscriptionModule = req.scope.resolve(
    'subscription'
  ) as SubscriptionService

  // 1. Find store IDs within radius
  const storeIds = await geolocationModule.findStoresInRadius(
    latitude,
    longitude,
    radius
  )

  if (storeIds.length === 0) {
    return res.json({ stores: [] })
  }

  // 2. Fetch Seller details using remoteQuery (since Sellers act as stores)
  const { data: stores } = await query.graph({
    entity: 'seller',
    fields: ['id', 'name', 'description', 'store_status', 'metadata'],
    filters: {
      id: storeIds,
      store_status: 'ACTIVE',
    },
  })

  // 3. For each store, get its subscription boost for sorting
  // (In a full implementation, this would be part of the graph query if links are defined)
  const enrichedStores = await Promise.all(
    stores.map(async (store) => {
      const entitlements = await subscriptionModule.getEntitlements(store.id)
      return {
        ...store,
        entitlements,
      }
    })
  )

  // 4. Sort by visibility boost
  enrichedStores.sort((a, b) => {
    if (a.entitlements.visibility_boost && !b.entitlements.visibility_boost)
      return -1
    if (!a.entitlements.visibility_boost && b.entitlements.visibility_boost)
      return 1
    return 0
  })

  res.json({
    stores: enrichedStores,
  })
}

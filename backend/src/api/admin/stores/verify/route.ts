import { MedusaRequest, MedusaResponse } from '@medusajs/framework/http'
import { StoreStatus } from '@mercurjs/framework'

type VerifyStoreRequest = {
  storeId: string
  action: 'approve' | 'reject'
}

export const POST = async (
  req: MedusaRequest<VerifyStoreRequest>,
  res: MedusaResponse
) => {
  const { storeId, action } = req.body
  const sellerModule = req.scope.resolve('seller')

  const store = await sellerModule.updateSellers({
    id: storeId,
    store_status: action === 'approve' ? StoreStatus.ACTIVE : StoreStatus.INACTIVE,
  })

  // Optional: Trigger notification or link creation

  res.json({
    store,
  })
}

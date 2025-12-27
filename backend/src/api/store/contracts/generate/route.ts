import { MedusaRequest, MedusaResponse } from '@medusajs/framework/http'
import ChatService from '../../../../modules/chat/service'

export const POST = async (
  req: MedusaRequest<{ orderId: string }>,
  res: MedusaResponse
) => {
  const { orderId } = req.body
  const chatService: ChatService = req.scope.resolve('chat')

  const contractContent = await chatService.generateContract(orderId)

  const orderService = req.scope.resolve('order')
  await orderService.updateOrders(orderId, {
    metadata: { contract: contractContent },
  })

  res.json({
    contractContent,
  })
}

import { MedusaRequest, MedusaResponse } from '@medusajs/framework/http'
import ChatService from '../../../modules/chat/service'

export const POST = async (
  req: MedusaRequest<{ orderId: string; content: string }>,
  res: MedusaResponse
) => {
  const { orderId, content } = req.body
  const chatService = req.scope.resolve<ChatService>('chat')

  const message = await chatService.addMessage(orderId, 'system', content)

  res.json({
    message,
  })
}

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const { orderId } = req.query as { orderId: string }
  const chatService = req.scope.resolve<ChatService>('chat')

  const messages = await chatService.getMessages(orderId)

  res.json({
    messages,
  })
}

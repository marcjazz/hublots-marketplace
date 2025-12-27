import { MedusaRequest, MedusaResponse } from '@medusajs/framework/http'
import ChatService from '../../../modules/chat/service'

export const POST = async (
  req: MedusaRequest<{ orderId: string; content: string }>,
  res: MedusaResponse
) => {
  const { orderId, content } = req.body
  const chatService = req.scope.resolve<ChatService>('chat')
  const senderId = (req.scope.resolve('loggedInCustomer') as { id: string }).id; // Or other property holding the authenticated user's ID
  const message = await chatService.addMessage(orderId, senderId, content)

  res.json({
    message,
  })
}

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const { orderId } = req.query as { orderId?: string }
  if (!orderId) {
    // Handle missing orderId error
    return res.status(400).json({ message: 'orderId is required' });
  }
  const chatService = req.scope.resolve<ChatService>('chat')

  const messages = await chatService.getMessages(orderId)

  res.json({
    messages,
  })
}

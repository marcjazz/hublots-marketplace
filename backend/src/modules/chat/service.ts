import { MedusaService } from '@medusajs/framework/utils'
import { ChatMessage } from './models'
import { MedusaContainer } from '@medusajs/framework/types'

export default class ChatService extends MedusaService({
  ChatMessage,
}) {
  protected __container__: MedusaContainer

  constructor(container: MedusaContainer) {
    super(...arguments)
    this.__container__ = container
  }

  async getMessages(
    orderId: string,
    sharedContext = {}
  ): Promise<ChatMessageDTO[]> {
    const messages = await this.listChatMessages(
      { order_id: orderId },
      {},
      sharedContext
    )
    return messages.map((m) => this.transformToDto(m))
  }

  async addMessage(
    orderId: string,
    senderId: string,
    content: string,
    sharedContext = {}
  ): Promise<ChatMessageDTO> {
    const message = await this.createChatMessages(
      {
        order_id: orderId,
        sender_id: senderId,
        content,
      },
      sharedContext
    )
    return this.transformToDto(message)
  }

  private transformToDto(message: ChatMessageDTO): ChatMessageDTO {
    return {
      id: message.id,
      order_id: message.order_id,
      sender_id: message.sender_id,
      content: message.content,
      metadata: message.metadata,
    }
  }

  async generateContract(orderId: string, sharedContext = {}): Promise<string> {
    const messages = await this.getMessages(orderId, sharedContext)
    // Simple logic to extract contract terms from chat history
    // In a real MVP, this could use LLM or specific regex on messages
    const terms = messages
      .filter(
        (m) =>
          m.content.toLowerCase().includes('term') ||
          m.content.toLowerCase().includes('price')
      )
      .map((m) => m.content)
      .join('\n')

    const contractContent = `
CONTRACT FOR ORDER ${orderId}
----------------------------
Date: ${new Date().toISOString().split('T')[0]}

TERMS EXTRACTED FROM CHAT:
${terms || 'No specific terms extracted from chat history.'}

Standard Terms:
1. Escrow payment will be released upon completion.
2. Commission will be deducted per subscription tier.
    `.trim()

    console.log(`Generated contract for order ${orderId}`)
    return contractContent
  }
}

type ChatMessageDTO = {
  id: string
  order_id: string
  sender_id: string
  content: string
  metadata: Record<string, any> | null
}

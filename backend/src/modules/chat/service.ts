import { MedusaService } from "@medusajs/framework/utils"
import { ChatMessage } from "./models"
import { MedusaContainer, Logger } from "@medusajs/framework/types"

const ModelMap = {
  ChatMessage,
}

export default class ChatService extends MedusaService(ModelMap) {
  protected readonly logger_: Logger

  constructor(container: MedusaContainer) {
    super(container)
    this.logger_ = container.resolve("logger")
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

  async generateContract(
    orderId: string,
    sharedContext = {}
  ): Promise<string> {
    const messages = await this.getMessages(orderId, sharedContext)

    const terms = messages
      .filter(
        (m) =>
          m.content.toLowerCase().includes("term") ||
          m.content.toLowerCase().includes("price")
      )
      .map((m) => m.content)
      .join("\n")

    const contractContent = `
CONTRACT FOR ORDER ${orderId}
----------------------------
Date: ${new Date().toISOString().split("T")[0]}

TERMS EXTRACTED FROM CHAT:
${terms || "No specific terms extracted from chat history."}

Standard Terms:
1. Escrow payment will be released upon completion.
2. Commission will be deducted per subscription tier.
    `.trim()

    this.logger_.info(`Generated contract for order ${orderId}`)
    return contractContent
  }

  private transformToDto(message: {
    id: string
    order_id: string
    sender_id: string
    content: string
    metadata: Record<string, any> | null
  }): ChatMessageDTO {
    return {
      id: message.id,
      order_id: message.order_id,
      sender_id: message.sender_id,
      content: message.content,
      metadata: message.metadata,
    }
  }
}

type ChatMessageDTO = {
  id: string
  order_id: string
  sender_id: string
  content: string
  metadata: Record<string, any> | null
}

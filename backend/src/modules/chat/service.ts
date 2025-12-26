import { MedusaService } from "@medusajs/framework/utils"
import { ChatMessage } from "./models"
import { MedusaContainer } from "@medusajs/framework/types"

const ModelMap = {
  ChatMessage,
}

export default class ChatService extends MedusaService(ModelMap) {
  protected __container__: MedusaContainer

  constructor(container: MedusaContainer) {
    super(...arguments)
    this.__container__ = container
  }

  async getMessages(orderId: string, sharedContext = {}): Promise<ChatMessageDTO[]> {
    const messages = await this.listChatMessages({ order_id: orderId }, {}, sharedContext)
    return messages as unknown as ChatMessageDTO[];
  }

  async addMessage(orderId: string, senderId: string, content: string, sharedContext = {}): Promise<ChatMessageDTO> {
    const message = await this.createChatMessages({
      order_id: orderId,
      sender_id: senderId,
      content,
    }, sharedContext)
    return message as unknown as ChatMessageDTO;
  }

  async generateContract(orderId: string, sharedContext = {}): Promise<string> {
    const messages = await this.getMessages(orderId, sharedContext)
    
    // Simple logic to extract contract terms from chat history
    // In a real MVP, this could use LLM or specific regex on messages
    const terms = messages
      .filter(m => m.content.toLowerCase().includes("term") || m.content.toLowerCase().includes("price"))
      .map(m => m.content)
      .join("\n")

    const contractContent = `
CONTRACT FOR ORDER ${orderId}
----------------------------
Date: ${new Date().toLocaleDateString()}

TERMS EXTRACTED FROM CHAT:
${terms || "No specific terms extracted from chat history."}

Standard Terms:
1. Escrow payment will be released upon completion.
2. Commission will be deducted per subscription tier.
    `.trim()

    console.log(`Generated contract for order ${orderId}`);
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


import { MedusaService } from "@medusajs/framework/utils";
import { Chat, ChatMessage } from "../models";

class ChatService extends MedusaService({
  Chat,
  ChatMessage,
}) {
  async createMessage(data: {
    chat_id: string;
    sender_id: string;
    content: string;
  }) {
    return await this.createChatMessages(data);
  }

  async getMessages(chat_id: string) {
    return await this.listChatMessages({
      where: { chat_id },
      order: { created_at: "ASC" },
    });
  }
}

export default ChatService;

import { model } from "@medusajs/framework/utils"

export const ChatMessage = model.define("ChatMessage", {
  id: model.id().primaryKey(),
  order_id: model.text(),
  sender_id: model.text(),
  content: model.text(),
  metadata: model.json().nullable(),
})

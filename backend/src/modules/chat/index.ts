import ChatService from "./service"
import { Module } from "@medusajs/framework/utils"

export const CHAT_MODULE = "chat"

export default Module(CHAT_MODULE, {
  service: ChatService,
})

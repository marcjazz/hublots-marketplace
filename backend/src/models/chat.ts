import { BaseEntity } from "@medusajs/utils";
import { Entity, OneToMany } from "typeorm";
import { ChatMessage } from "./chat-message";

@Entity()
export class Chat extends BaseEntity {
  @OneToMany(() => ChatMessage, (message) => message.chat)
  messages: ChatMessage[];
}

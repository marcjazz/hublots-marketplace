import MercurService from "./service"
import { Module } from "@medusajs/framework/utils"

export const CUSTOM_MERCUR_MODULE = "custom_mercur"

export default Module(CUSTOM_MERCUR_MODULE, {
  service: MercurService,
})

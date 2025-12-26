import SubscriptionService from "./service"
import { Module } from "@medusajs/framework/utils"
import { SubscriptionPlan, StoreSubscription } from "./models"

export const SUBSCRIPTION_MODULE = "subscription"

export default Module(SUBSCRIPTION_MODULE, {
  service: SubscriptionService,
})

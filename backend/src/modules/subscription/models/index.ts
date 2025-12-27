import { model } from "@medusajs/framework/utils"

export const SubscriptionPlan = model.define("SubscriptionPlan", {
  id: model.id().primaryKey(),
  name: model.text(), // Basique, Pro
  price_monthly: model.number(),
  commission_rate: model.number(), // 0.20 for Basique, 0.10 for Pro
  visibility_boost: model.boolean().default(false),
  metadata: model.json().nullable(),
})

export const StoreSubscription = model.define("StoreSubscription", {
  id: model.id().primaryKey(),
  store_id: model.text(),
  subscription_plan_id: model.text(),
  status: model.text().default("active"),
  starts_at: model.dateTime(),
  ends_at: model.dateTime().nullable(),
})

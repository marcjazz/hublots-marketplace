import { model } from "@medusajs/framework/utils"

export const Payout = model.define("Payout", {
  id: model.id().primaryKey(),
  store_id: model.text(),
  amount: model.float(),
  status: model.text().default("pending"), // pending, paid, failed
  metadata: model.json().nullable(),
})

export const Review = model.define("Review", {
  id: model.id().primaryKey(),
  store_id: model.text(),
  customer_id: model.text(),
  rating: model.number(),
  comment: model.text().nullable(),
  metadata: model.json().nullable(),
})

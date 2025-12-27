import { model } from "@medusajs/framework/utils"

export const StoreLocation = model.define("StoreLocation", {
  id: model.id().primaryKey(),
  store_id: model.text().unique(),
  latitude: model.number(),
  longitude: model.number(),
  // For Phase 1 we will use numeric lat/lon,
  // and manually construct PostGIS queries in the service for radius search.
  metadata: model.json().nullable(),
})

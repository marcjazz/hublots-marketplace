import { MedusaService } from "@medusajs/framework/utils"
import { StoreLocation } from "./models"

export default class GeolocationService extends MedusaService({
  StoreLocation,
}) {
  async upsertStoreLocation(storeId: string, lat: number, lon: number): Promise<void> {
    const existing = await this.listStoreLocations({ store_id: storeId })
    if (existing.length > 0) {
      await this.updateStoreLocations({
        id: existing[0].id,
        latitude: lat,
        longitude: lon,
      })
    } else {
      await this.createStoreLocations({
        store_id: storeId,
        latitude: lat,
        longitude: lon,
      })
    }
  }

  async findStoresInRadius(lat: number, lon: number, radiusKm: number): Promise<string[]> {
    // Attempt to use raw SQL for PostGIS
    try {
      const pgConnection = (this as any).__container__.resolve("pg_connection")
      const radiusInMeters = radiusKm * 1000

      // We assume the table name is geolocation_store_location
      // based on Medusa's default naming convention for modules
      const results = await pgConnection.query(`
        SELECT
          sl.store_id,
          sp.visibility_boost
        FROM
          geolocation_store_location sl
        LEFT JOIN
          store_subscription ss ON sl.store_id = ss.store_id AND ss.status = 'active'
        LEFT JOIN
          subscription_plan sp ON ss.subscription_plan_id = sp.id
        WHERE
          ST_DWithin(
            ST_SetSRID(ST_MakePoint(sl.longitude, sl.latitude), 4326)::geography,
            ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography,
            $3
          )
        ORDER BY
          sp.visibility_boost DESC NULLS LAST;
      `, [lon, lat, radiusInMeters])

      return results.rows.map((row: { store_id: string }) => row.store_id)
    } catch (error) {
      console.error("PostGIS query failed:", error)
      throw new Error("Could not retrieve stores due to a database error.")
    }
  }
}

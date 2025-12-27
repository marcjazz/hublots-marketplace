import { MedusaService } from "@medusajs/framework/utils";
import { StoreLocation } from "./models";

export default class GeolocationService extends MedusaService({
  StoreLocation,
}) {
  async upsertStoreLocation(storeId: string, lat: number, lon: number): Promise<void> {
    // This requires a custom repository method or raw query to be truly atomic.
    // For example, using PostgreSQL's ON CONFLICT:
    // const query = `
    //   INSERT INTO \"store_location\" (id, store_id, latitude, longitude, created_at, updated_at)
    //   VALUES ($1, $2, $3, $4, NOW(), NOW())
    //   ON CONFLICT (store_id) DO UPDATE
    //   SET latitude = $3, longitude = $4, updated_at = NOW();
    // `;
    // const pgConnection = (this as any).__container__.resolve(\"pg_connection\");
    // await pgConnection.query(query, [generateEntityId(), storeId, lat, lon]);

    // As a temporary fix for the race condition without raw SQL:
    try {
      await this.createStoreLocations({
        store_id: storeId,
        latitude: lat,
        longitude: lon,
      });
    } catch (error) {
      // Assuming the error is a unique constraint violation
      if (error.code === '23505') { // PostgreSQL unique violation error code
        const existing = await this.listStoreLocations({ store_id: storeId });
        if (existing.length > 0) {
          await this.updateStoreLocations({
            id: existing[0].id,
            latitude: lat,
            longitude: lon,
          });
        }
      } else {
        throw error;
      }
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
      console.warn("PostGIS query failed, falling back to in-memory filtering for MVP development", error)
      
      const allLocations = await this.listStoreLocations({})

      // Haversine distance formula for fallback
      const haversineDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371; // Radius of Earth in kilometers
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                  Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
                  Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
      };

      return allLocations
        .filter(l => haversineDistance(lat, lon, l.latitude, l.longitude) <= radiusKm)
        .map(l => l.store_id);

    }
  }
}

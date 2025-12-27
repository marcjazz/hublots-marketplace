import { MedusaService, generateEntityId } from "@medusajs/framework/utils"
import { MedusaContainer, Logger } from "@medusajs/types"
import { StoreLocation } from "./models"

type PgConnection = {
  query: (
    sql: string,
    params?: unknown[]
  ) => Promise<{ rows: any[] }>
}

export default class GeolocationService extends MedusaService({
  StoreLocation,
}) {
  protected readonly logger_: Logger
  protected readonly pg_: PgConnection

  constructor(container: MedusaContainer) {
    super(container)

    this.logger_ = container.resolve<Logger>("logger")
    this.pg_ = container.resolve<PgConnection>("pg_connection")
  }

  async upsertStoreLocation(
    storeId: string,
    lat: number,
    lon: number
  ): Promise<void> {
    const query = `
      INSERT INTO store_location
        (id, store_id, latitude, longitude, created_at, updated_at)
      VALUES
        ($1, $2, $3, $4, NOW(), NOW())
      ON CONFLICT (store_id)
      DO UPDATE SET
        latitude = $3,
        longitude = $4,
        updated_at = NOW();
    `

    await this.pg_.query(query, [
      generateEntityId(),
      storeId,
      lat,
      lon,
    ])
  }

  async findStoresInRadius(
    lat: number,
    lon: number,
    radiusKm: number
  ): Promise<string[]> {
    try {
      return await this.findStoresInRadiusPostgis(lat, lon, radiusKm)
    } catch (error) {
      this.logger_.warn(
        `PostGIS failed, using fallback. ${error instanceof Error ? error.message : ""}`
      )
      return this.findStoresInRadiusFallback(lat, lon, radiusKm)
    }
  }

  private async findStoresInRadiusPostgis(
    lat: number,
    lon: number,
    radiusKm: number
  ): Promise<string[]> {
    const radiusMeters = radiusKm * 1000

    const result = await this.pg_.query(
      `
      SELECT sl.store_id
      FROM geolocation_store_location sl
      WHERE ST_DWithin(
        ST_SetSRID(ST_MakePoint(sl.longitude, sl.latitude), 4326)::geography,
        ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography,
        $3
      );
      `,
      [lon, lat, radiusMeters]
    )

    return result.rows.map((r) => r.store_id)
  }

  private async findStoresInRadiusFallback(
    lat: number,
    lon: number,
    radiusKm: number
  ): Promise<string[]> {
    const locations = await this.listStoreLocations({})

    const distanceKm = (
      lat1: number,
      lon1: number,
      lat2: number,
      lon2: number
    ) => {
      const R = 6371
      const dLat = ((lat2 - lat1) * Math.PI) / 180
      const dLon = ((lon2 - lon1) * Math.PI) / 180
      const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos((lat1 * Math.PI) / 180) *
          Math.cos((lat2 * Math.PI) / 180) *
          Math.sin(dLon / 2) ** 2
      return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    }

    return locations
      .filter(
        (l) =>
          distanceKm(lat, lon, l.latitude, l.longitude) <= radiusKm
      )
      .map((l) => l.store_id)
  }
}

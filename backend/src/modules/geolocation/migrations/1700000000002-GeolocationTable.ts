import { Migrator } from "@medusajs/framework"

export const up = async ({ manager }) => {
  await manager.query(`
    -- Create PostGIS extension if not exists
    CREATE EXTENSION IF NOT EXISTS postgis;

    CREATE TABLE IF NOT EXISTS "geolocation_store_location"
    (
        "id"                  VARCHAR(255) PRIMARY KEY,
        "store_id"            VARCHAR(255) NOT NULL UNIQUE,
        "latitude"            NUMERIC NOT NULL,
        "longitude"           NUMERIC NOT NULL,
        "created_at"          TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        "updated_at"          TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        CONSTRAINT "FK_geolocation_store_location_store_id" FOREIGN KEY ("store_id") REFERENCES "store" (id) ON DELETE CASCADE
    );

    -- Create a spatial index for fast radius searches
    CREATE INDEX IF NOT EXISTS "IDX_store_location_spatial" ON "geolocation_store_location" USING GIST (ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)::geography);
`)
}

export const down = async ({ manager }) => {
  await manager.query(`
    DROP TABLE IF EXISTS "geolocation_store_location";
  `)
}

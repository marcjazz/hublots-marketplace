import { Migrator } from "@medusajs/framework"
import { generateEntityId } from "@medusajs/utils"

export const up = async ({ manager }) => {
  await manager.query(`
      CREATE TABLE IF NOT EXISTS "subscription_plan"
      (
          "id"                VARCHAR(255) PRIMARY KEY,
          "name"              VARCHAR(255) NOT NULL UNIQUE,
          "price_monthly"     NUMERIC      NOT NULL,
          "commission_rate"   NUMERIC      NOT NULL,
          "visibility_boost"  BOOLEAN      DEFAULT FALSE,
          "metadata"          JSONB,
          "created_at"        TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          "updated_at"        TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS "store_subscription"
      (
          "id"                   VARCHAR(255) PRIMARY KEY,
          "store_id"             VARCHAR(255) NOT NULL,
          "subscription_plan_id" VARCHAR(255) NOT NULL REFERENCES "subscription_plan" (id) ON DELETE CASCADE,
          "status"               VARCHAR(255) DEFAULT 'active',
          "starts_at"            TIMESTAMP WITH TIME ZONE NOT NULL,
          "ends_at"              TIMESTAMP WITH TIME ZONE,
          "created_at"           TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          "updated_at"           TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          CONSTRAINT "FK_store_subscription_store_id" FOREIGN KEY ("store_id") REFERENCES "store" (id) ON DELETE CASCADE
      );

      -- Add indexes for performance
      CREATE INDEX IF NOT EXISTS "IDX_store_subscription_store_id" ON "store_subscription" (store_id);
      CREATE INDEX IF NOT EXISTS "IDX_store_subscription_status" ON "store_subscription" (status);
      CREATE INDEX IF NOT EXISTS "IDX_subscription_plan_name" ON "subscription_plan" (name);
  `)

  // Seed initial subscription plans
  const basiquePlanId = generateEntityId('subplan')
  const proPlanId = generateEntityId('subplan')

  await manager.query(`
      INSERT INTO "subscription_plan" (id, name, price_monthly, commission_rate, visibility_boost)
      VALUES
          ('${basiquePlanId}', 'Basique', 0, 0.20, FALSE),
          ('${proPlanId}', 'Pro', 15000, 0.10, TRUE)
      ON CONFLICT (name) DO NOTHING;
  `)
}

export const down = async ({ manager }) => {
  await manager.query(`
      DROP TABLE IF EXISTS "store_subscription";
      DROP TABLE IF EXISTS "subscription_plan";
  `)
}
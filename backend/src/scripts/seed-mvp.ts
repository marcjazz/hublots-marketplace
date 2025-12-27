import { ExecArgs } from "@medusajs/framework/types"
import GeolocationService from "../modules/geolocation/service"
import SubscriptionService from "../modules/subscription/service"

export default async function seed({ container }: ExecArgs) {
  const sellerModule = container.resolve("seller") as any
  const subscriptionModule = container.resolve("subscription") as SubscriptionService
  const geolocationModule = container.resolve("geolocation") as GeolocationService

  console.log("Seeding subscription plans...")

  const basique = await subscriptionModule.createSubscriptionPlans({
    name: "Basique",
    price_monthly: 0,
    commission_rate: 0.20,
    visibility_boost: false,
  })

  const pro = await subscriptionModule.createSubscriptionPlans({
    name: "Pro",
    price_monthly: 10000, // 100.00
    commission_rate: 0.10,
    visibility_boost: true,
  })

  console.log("Seeding Sellers (Stores)...")

  // Paris Store (Pro)
  const [seller1] = await sellerModule.createSellers([{
    name: "Paris Tech Experts",
    description: "High-end tech repairs in Paris",
    store_status: "active",
  }])
  await subscriptionModule.activateSubscription(seller1.id, pro.id)
  await geolocationModule.upsertStoreLocation(seller1.id, 48.8566, 2.3522)

  // Lyon Store (Basique)
  const [seller2] = await sellerModule.createSellers([{
    name: "Lyon Gadget Fix",
    description: "Fast gadget repairs in Lyon",
    store_status: "active",
  }])
  await subscriptionModule.activateSubscription(seller2.id, basique.id)
  await geolocationModule.upsertStoreLocation(seller2.id, 45.7640, 4.8357)

  // Pending Store (Paris)
  const [seller3] = await sellerModule.createSellers([{
    name: "Newbie Repairs",
    description: "Just starting out",
    store_status: "inactive",
  }])
  await geolocationModule.upsertStoreLocation(seller3.id, 48.8584, 2.2945)

  console.log("Seed completed successfully.")
}

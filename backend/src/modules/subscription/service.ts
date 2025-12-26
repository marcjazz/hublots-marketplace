import { MedusaService } from "@medusajs/framework/utils"
import { SubscriptionPlan, StoreSubscription } from "./models"
import { MedusaContainer } from "@medusajs/framework/types"

const ModelMap = {
  SubscriptionPlan,
  StoreSubscription,
}

export default class SubscriptionService extends MedusaService(ModelMap) {
  // @ts-ignore
  async createSubscriptionPlans(data: any): Promise<any> {
    const plans = Array.isArray(data) ? data : [data]
    return await super.createSubscriptionPlans(plans)
  }

  async getEntitlements(storeId: string): Promise<EntitlementsDTO> {
    const subscriptions = await this.listStoreSubscriptions(
      { store_id: storeId, status: "active" },
      { relations: ["subscription_plan"] }
    )

    if (subscriptions.length === 0) {
      // Fallback to default Basique or return null
      // For Phase 1, let's assume every store starts with Basique if no active sub
      return { commission_rate: 0.2, visibility_boost: false }
    }

    const activeSub = subscriptions[0] as unknown as StoreSubscriptionDTO
    const plan = activeSub.subscription_plan

    return {
      commission_rate: plan.commission_rate,
      visibility_boost: plan.visibility_boost,
      plan_name: plan.name,
    }
  }

  async activateSubscription(storeId: string, planId: string, sharedContext = {}): Promise<void> {
    // 1. Deactivate existing active subscriptions
    const existingActive = await this.listStoreSubscriptions({
      store_id: storeId,
      status: "active",
    }, {}, sharedContext)

    if (existingActive.length > 0) {
      await this.updateStoreSubscriptions(
        existingActive.map((sub) => ({
          id: sub.id,
          status: "inactive",
          ends_at: new Date(),
        })),
        sharedContext
      )
    }

    // 2. Create new StoreSubscription with 30-day window
    const startsAt = new Date()
    const endsAt = new Date()
    endsAt.setDate(startsAt.getDate() + 30)

    await this.createStoreSubscriptions({
      store_id: storeId,
      subscription_plan_id: planId,
      status: "active",
      starts_at: startsAt,
      ends_at: endsAt,
    }, sharedContext)
  }

  async getStoreSubscription(storeId: string): Promise<StoreSubscriptionDTO | undefined> {
    const subs = await this.listStoreSubscriptions({ store_id: storeId })
    return subs[0] as unknown as StoreSubscriptionDTO | undefined;
  }
}

type EntitlementsDTO = {
  commission_rate: number
  visibility_boost: boolean
  plan_name?: string
}

type SubscriptionPlanDTO = {
  id: string
  name: string
  price_monthly: number
  commission_rate: number
  visibility_boost: boolean
  metadata: Record<string, any> | null
}

type StoreSubscriptionDTO = {
  id: string
  store_id: string
  subscription_plan_id: string
  status: string
  starts_at: Date
  ends_at: Date | null
  subscription_plan: SubscriptionPlanDTO
}


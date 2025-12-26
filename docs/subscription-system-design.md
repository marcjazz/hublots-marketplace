
# Provider Subscription System Design

This document provides a detailed design for the provider subscription model. It outlines the plan structure, the specific entitlements for each tier, and the technical implementation for enforcing these rules within the MedusaJS and MercurJS architecture.

---

### **1. Subscription Tiers & Objectives**

The subscription model is designed to offer clear value to providers as they grow their business on the platform. The tiers are structured to align with provider needs at different stages, from initial entry to established operation.

| Plan Tier | Name (FR) | Monthly Price (XAF) | Target Provider | Core Value Proposition |
| :--- | :--- | :--- | :--- | :--- |
| **Tier 1** | **Basique** | Free | New or occasional providers | No-risk entry to the platform. |
| **Tier 2** | **Pro** | 15,000 XAF (example) | Full-time, active providers | Lower costs and better visibility. |
| **Tier 3** | **Premium** | 45,000 XAF (example) | Established businesses | Maximum visibility and lowest costs. |

---

### **2. Entitlements Logic**

Entitlements are the specific features or benefits a provider receives based on their subscription tier.

| Feature / Entitlement | Tier 1: Basique | Tier 2: Pro | Tier 3: Premium |
| :--- | :--- | :--- | :--- |
| **Platform Commission Rate** | **20%** | **12%** | **7%** |
| **Search Visibility Boost** | Normal | **Higher** (1.5x boost) | **Highest** (2.5x boost) |
| **Priority Request Access** | Standard Queue | **Priority Queue** | **Instant Access** |
| **Number of Service Categories** | Up to 2 | Up to 10 | Unlimited |
| **Multi-Technician Support**| No | Up to 5 Technicians | Unlimited Technicians |
| **Analytics Dashboard** | Basic (earnings only) | Advanced (bookings, earnings) | Full Suite (conversion, profile views) |

*Note: Features marked for Phase 2 (like Priority Request Access, Multi-Technician, and advanced Analytics) will be implemented post-MVP but are designed into the model from the start.*

---

### **3. MVP Scope for Subscriptions**

As defined in the MVP Scope, the initial launch will feature a simplified version of this model to accelerate development:

-   **Tiers:** `Basique` (Free) and `Pro` (Paid).
-   **Primary Entitlement:** Commission Rate.
    -   `Basique`: 20%
    -   `Pro`: 10%
-   All other entitlements (Visibility Boost, etc.) will be implemented in Phase 2.

---

### **4. Technical Implementation & Enforcement Points**

The subscription logic will be managed by a custom `SubscriptionService` within the Medusa backend.

#### **a. Data Model**
The `Subscription` and `Provider` entities defined in the Domain Model will be used.

-   `SubscriptionPlan` entity: Stores the details of each tier (name, price, entitlements as a JSONB field).
-   `Provider` entity: Has a foreign key `subscription_plan_id` to link a provider to their current plan.

#### **b. Subscription Management Flow**
-   **Treating Subscriptions as Products:** A Medusa `Product` will be created for the "Pro" and "Premium" plans. These products will have a special flag (e.g., `is_subscription: true` in metadata).
-   **Purchase Flow:**
    1.  A provider in their panel clicks "Upgrade".
    2.  This adds the corresponding subscription "product" to a cart.
    3.  The provider completes a standard Medusa checkout process to pay for the first month.
-   **Activation:** A Medusa `Order` completion webhook will listen for orders containing a subscription product. When detected, it will call the `SubscriptionService`.
-   **`SubscriptionService.activateSubscription(providerId, planId)`**: This method updates the `provider.subscription_plan_id` and sets an `expires_at` timestamp (e.g., 30 days from now).

#### **c. Enforcement Points**

This is where the system actively applies the subscription rules.

**1. Commission Rate (MVP)**
-   **Location:** In the Payout processing logic, after a customer marks a booking "Complete".
-   **Process:**
    1.  The system retrieves the `booking.agreed_price`.
    2.  It calls `SubscriptionService.getEntitlements(booking.provider_id)`.
    3.  This method returns the provider's current `commission_rate`.
    4.  The system calculates `commission = agreed_price * commission_rate`.
    5.  The `payout_amount` is calculated as `agreed_price - commission`.
    6.  The payout is processed for the final `payout_amount`.

**2. Search Visibility Boost (Phase 2)**
-   **Location:** In the `GeolocationService.findProvidersInRadius` method.
-   **Process:**
    1.  The initial PostGIS query fetches all providers within the radius.
    2.  The service then iterates through the results, retrieving the `visibility_boost` factor for each provider from the `SubscriptionService`.
    3.  The final list of providers returned to the frontend is re-sorted, applying the boost factor to providers on higher tiers. For example, they can be simply moved to the top of the list.

**3. Priority Request Access (Phase 2)**
-   **Location:** In the future "Request Broadcasting" service.
-   **Process:**
    1.  When a custom job is posted, the system finds all nearby providers.
    2.  It groups them by subscription tier (`Premium`, `Pro`, `Basique`).
    3.  Notifications are sent out in waves: `Premium` providers are notified instantly, `Pro` providers after 30 seconds, and `Basique` providers after 90 seconds.

This design provides a clear and robust framework for managing provider subscriptions, starting with a simple MVP and scaling to a full-featured system that drives platform revenue and provider engagement.

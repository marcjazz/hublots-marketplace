# Phase 1 MVP Implementation Plan (MercurJS Terminology)

This plan translates the Phase 1 MVP scope into MercurJS terminology, mapping the domain model to MercurJS concepts and outlining concrete steps for the MedusaJS backend implementation.

References to base documents:
- Domain model: [`docs/domain-model.md`](`docs/domain-model.md`)
- MVP scope: [`docs/mvp-scope.md`](`docs/mvp-scope.md`)
- Technical architecture: [`docs/technical-architecture.md`](`docs/technical-architecture.md`)
- Subscription design: [`docs/subscription-system-design.md`](`docs/subscription-system-design.md`)
- Risks & mitigations: [`docs/technical-risks-and-mitigation.md`](`docs/technical-risks-and-mitigation.md`)

Objective
Implement Phase 1 MVP features for a service marketplace using MedusaJS as the backend core and MercurJS for multi-store orchestration. The MVP includes the escrow payment flow via Notch Pay, a geolocation-backed provider search, chat, contract generation, and a simplified subscription model. All entities and services should align with MercurJS terminology (Store and Seller).

MercurJS Terminology Mapping
- Provider -> Store
- Technician -> Seller
- Service -> Product (extended with provider linkage)
- Booking -> Order (as per Medusa core)
- SubscriptionPlan -> SubscriptionPlan (custom entity)
- ProviderSubscription -> StoreSubscription (custom entity)
- Delivery of Notch Pay escrow and payout remains via the Medusa/Notch Pay plugin

Data Model Mapping (Phase 1 MVP)
- User (Customer) remains Medusa Customer
- Store (Provider) stores business data and is linked to a Medusa User for authentication
- Seller (Technician) is a worker under a Store
- Product (Service) represents a pre-defined service linked to a Store
- Order (Booking) represents an engagement, with metadata used for service-specific details
- Payment and Payout align with escrow semantics via Notch Pay
- Review remains linked to a Booking/Store/User
- Chat and ChatMessage implement booking-specific real-time collaboration
- SubscriptionPlan and StoreSubscription implement the MVP tiers Basique and Pro

Plan by Milestones (Phase 1 MVP, ordered)
1) Environment scaffolding and baseline configuration
- Prepare Medusa backend configuration for MVP (backend/medusa-config.ts) with PostgreSQL + PostGIS enabled
- Create a Notch Pay scaffold (backend/medusa-plugins/medusa-payment-notchpay) with interfaces for authorize and capture
- Wire MercurJS store mapping hooks (Store aggregations) and ensure admin vetting flow is accessible
- Establish environment variables and seed scripts for MVP data

2) Domain model and Medusa customization (MercurJS alignment)
- Implement custom entities under backend/src/entities or backend/src/modules as Store, Seller, Product, Order extension, Payment, Payout, Review, Chat, SubscriptionPlan, StoreSubscription
- Extend Medusa base models as needed and define exact relations to reflect MercurJS conventions
- Create migrations and seeds for Stores (providers), Sellers, Products, Orders, and contract metadata fields; add an admin vetting flag for Store visibility

3) Geolocation service (Phase 1 MVP)
- Implement geolocation.service.ts with:
  - upsertStoreLocation(storeId, lat, lon)
  - findStoresInRadius(lat, lon, radiusKm, activeTiers)
- Use PostGIS ST_DWithin queries and include sorting by active subscription tier (visibility boost)
- Expose API endpoint: POST /store/stores/nearby to return nearby Stores

4) Subscriptions MVP (Basique and Pro)
- Data models: SubscriptionPlan (name, price_monthly, commission_rate, visibility_boost, max_store_categories, etc.) and StoreSubscription (store_id, subscription_plan_id, status, starts_at, ends_at)
- Implement SubscriptionService:
  - getEntitlements(storeId) -> returns commission_rate and other entitlements from active StoreSubscription
  - activateSubscription(storeId, planId) -> deactivate existing active, create new StoreSubscription with active status and 30-day window
- Seed MVP plans Basique (20% commission) and Pro (10% commission)
- Integrate commission logic into payout flow: payout_amount = order_amount - (order_amount * commission_rate)

5) Notch Pay Escrow Plugin Scaffold (MVP)
- Create a medusa-payment-notchpay plugin scaffold with authorize and capture methods
- Implement idempotent payment handling and a basic reconciliation flow
- Integrate with Order creation: on booking creation, authorize and place funds in escrow; on capture, calculate commission and trigger payout to Store's linked payout details

6) Chat service (MVP)
- Implement in-process Socket.IO-based chat within Medusa backend
- Create a chat room per Order (booking_id); persist ChatMessage entries
- API endpoints: create/fetch messages; generate and store contract content in Order.metadata via a contract_generation endpoint

7) API endpoints for MVP workflows
- Provider searchNearby: POST /store/stores/nearby (lat, lon, radius) returning Stores with distance and entitlements
- Booking initiation: create an Order with metadata and link to Store and Customer
- Chat operations: postMessage and getChatHistory for a given Order
- Contract generation/acceptance: endpoints to generate contract from chat history and to accept the contract
- Escrow payment flow: endpoint triggers for Notch Pay authorize on booking creation and capture on completion

8) Admin provider verification workflow (MVP)
- Vetting flow: Pending status and Admin approve/reject in Medusa Admin panel
- Visibility gating: Stores visible to customers only after approval

9) Data seeding and migrations
- Seed two MVP Plans and initial Stores for testing; include fixed addresses for PostGIS radius tests
- Implement migrations for Store, Seller, Contract metadata fields, Chat tables, etc.

10) Documentation & onboarding
- Update docs with MercurJS glossary and terms; provide API specs and a concise local-setup guide
- Link to MercurJS glossary where terminology is defined

11) Review & Next steps
- Plan review and approval steps; outline the next iteration when Phase 2 features will be introduced

Acceptance Criteria (Phase 1 MVP)
- Nearby Store search within 5 km using fixed addresses and PostGIS indexing
- Booking workflow initiated by Customer, with a dedicated Chat room per Order
- Contract generation from chat and acceptance by parties
- Escrow payment held on booking creation and captured on completion, with payout to Store after commission deduction
- MVP subscription tiers Basique and Pro exist with commission rates 20% and 10%
- Admin verification flow exists and gates Store visibility until approval

References
- Domain model: [`docs/domain-model.md`](`docs/domain-model.md`)
- MVP scope: [`docs/mvp-scope.md`](`docs/mvp-scope.md`)
- Technical architecture: [`docs/technical-architecture.md`](`docs/technical-architecture.md`)
- Subscription design: [`docs/subscription-system-design.md`](`docs/subscription-system-design.md`)
- Risks: [`docs/technical-risks-and-mitigation.md`](`docs/technical-risks-and-mitigation.md`)


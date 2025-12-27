# Phase 1 MVP Implementation Plan

This plan outlines a concrete, step-by-step approach to implementing Phase 1 MVP features for the service marketplace, building on the documents:
- [`docs/domain-model.md`](docs/domain-model.md:1)
- [`docs/mvp-scope.md`](docs/mvp-scope.md:1)
- [`docs/technical-architecture.md`](docs/technical-architecture.md:1)
- [`docs/subscription-system-design.md`](docs/subscription-system-design.md:1)
- [`docs/technical-risks-and-mitigation.md`](docs/technical-risks-and-mitigation.md:1)

## Objective
Implement Phase 1 MVP features in a MedusaJS-based backend with MercurJS integration, custom domain entities, a Notch Pay escrow plugin scaffold, and API endpoints to support provider search, booking, chat, contract agreement, and escrow payment.

# Scope and Boundaries
- Focus exclusively on Phase 1 MVP features as defined in the MVP scope; do not implement Phase 2 features.
- Implement custom entities and services following the domain model and architectural guidance in the provided documents.
- Build a minimal but production-ready Notch Pay escrow plugin scaffold with authorize on booking creation and capture flow for MVP.
- Build essential API endpoints for the core user workflow and ensure they integrate with Medusa's order, payment, and chat flows.

# Architecture & Tech Stack (Phase 1)
- Backend: MedusaJS core with PostgreSQL + PostGIS; MercurJS marketplace engine for multi-store capabilities.
- Custom modules/services: GeolocationService, SubscriptionService, ChatService, NotchPay Plugin scaffold.
- Frontend: Next.js storefront and provider panel (existing repo structure).
- Real-time: Socket.IO inside Medusa for MVP chat (in-process).

# Data Model Mapping (Phase 1 MVP)
- Map domain-model.md entities to Medusa concepts:
  - User -> Medusa Customer
  - Provider -> Custom Provider entity linked to a Medusa User for login
  - Technician -> Custom Technician entity
  - Service -> Medusa Product with extended fields
  - Booking -> Medusa Order with rich metadata in order.metadata
  - Payment -> Medusa Payment, with escrow semantics in Notch Pay
  - Payout -> Custom entity correlating to Notch Pay payouts
  - Review -> Medusa Review linked to Booking/Provider/User
  - Chat -> Custom Chat with ChatMessage records
  - SubscriptionPlan -> Custom SubscriptionPlan entity
  - ProviderSubscription -> Custom ProviderSubscription entity

# Implementation Plan
- Phase 1 Milestones (sub-tasks, sequential):
  1. Repository and environment setup
     - Ensure backend/ Medusa config is ready for MVP
     - Enable PostGIS in DB setup and migrations scaffolding
     - Prepare Notch Pay integration scaffold
  2. Domain model and Medusa customization
     - Create Medusa custom entities: Provider, Technician, Service, Booking, Payment, Payout, Review, Chat, SubscriptionPlan, ProviderSubscription
     - Extend User model or map to Medusa Customer where appropriate
  3. Geolocation service
     - Implement geolocation.service.ts with methods:
       - upsertProviderLocation(providerId, lat, lon)
       - findProvidersInRadius(lat, lon, radiusInKm, activeTiers)
     - Add endpoint POST /store/providers/nearby
  4. Subscriptions (MVP)
     - Implement SubscriptionPlan and ProviderSubscription data models
     - Implement SubscriptionService with getEntitlements(providerId) and activateSubscription(providerId, planId)
     - Seed two MVP plans Basique and Pro with respective commissions 20% and 10%
  5. Notch Pay Escrow Plugin scaffold
     - Create medusa-payment-notchpay scaffold and implement authorize and capture
     - Ensure idempotent payment handling; connect to Notch Pay for escrow
  6. Notch Pay payout integration
     - Implement payout calculations using entitlements
     - Wire to Notch Pay payout API
  7. Chat service (MVP)
     - Implement chat.service.ts with Socket.IO in Medusa
     - Create chat room per Booking; persist ChatMessage rows
     - Implement generateContract API that stores contract details in Booking.metadata
  8. API endpoints for core MVP workflows
     - Provider search near location (integrated with geolocation)
     - Booking initiation endpoint
     - Chat endpoints (send message, fetch history)
     - Contract generation and acceptance
     - Escrow payment flow (authorize, capture, payout)
  9. Admin provider verification workflow
     - Admin panel integration to view and approve pending providers
     - Tie provider visibility to verification status
  10. Data seeding & migrations
     - Seed MVP data: 2 subscription plans, some providers
     - Create necessary migrations for new entities
  11. Documentation & onboarding
     - Update docs and create developer README for setup

## Acceptance Criteria (Phase 1 MVP)
- MVP supports search by nearby providers within 5km of user location and fixed provider addresses
- Customer can initiate a booking for a service; a chat room is created
- A contract flow is available to generate and accept contract in-chat
- Payment is escrowed via Notch Pay at booking creation and captured upon service completion, leading to payout to provider after commission calculation
- Reviews, provider profiles, and admin provider verification exist for MVP readiness
- MVP subscription tiers Basique and Pro exist with corresponding commission rates (20% and 10%)

## API contract notes
- Endpoints will be defined in subsequent API spec docs; plan to keep stable, backwards-compatible

## Risks & Mitigations
- Geolocation performance addressed via PostGIS indexing and caching strategies
- Payment flow integrity handled by idempotent transactions and reconciliation jobs
- Chat scalability kept MVP in-process with a plan to shift to dedicated service later

## Next Steps
- Review and approve this plan
- Begin work in backend/ with the tasks enumerated above

## References
- Domain model: [`docs/domain-model.md`](docs/domain-model.md:1)
- MVP scope: [`docs/mvp-scope.md`](docs/mvp-scope.md:1)
- Technical architecture: [`docs/technical-architecture.md`](docs/technical-architecture.md:1)
- Subscription system design: [`docs/subscription-system-design.md`](docs/subscription-system-design.md:1)
- Risks: [`docs/technical-risks-and-mitigation.md`](docs/technical-risks-and-mitigation.md:1)

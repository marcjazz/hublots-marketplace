Phase 1 MVP Test Plan
=====================

Overview
--------
This document defines a comprehensive test plan for the Phase 1 MVP, covering unit, integration, and end-to-end (E2E) tests across the core features:
- Geolocation-based provider search with PostGIS radius filtering and subscription-based sorting
- Subscription management for Basique and Pro tiers with dynamic entitlements and activation/deactivation logic
- Escrow payment flow with Notch Pay (authorization, capture, and commission calculation)
- Chat and contract generation
- Admin provider verification workflow

Scope and Objectives
---------------------
- Validate core functionality and interactions between services while ensuring data integrity and security.
- Detect regressions early through automated tests with clear pass/fail criteria.
- Provide a repeatable, environment-agnostic test plan that can run in CI/CD pipelines.

References to repository components
-----------------------------------
- Geolocation and PostGIS integration: [`backend/src/modules/geolocation/service.ts`](backend/src/modules/geolocation/service.ts)
- Subscription management: [`backend/src/modules/subscription/service.ts`](backend/src/modules/subscription/service.ts)
- Notch Pay integration: [`backend/medusa-plugins/medusa-payment-notchpay/index.ts`](backend/medusa-plugins/medusa-payment-notchpay/index.ts)
- Chat and contract generation: [`backend/src/modules/chat/service.ts`](backend/src/modules/chat/service.ts)
- Admin provider verification workflow: [`backend/src/api/admin/stores/verify/route.ts`](backend/src/api/admin/stores/verify/route.ts)

Testing Strategy
----------------
- Test Levels
  - Unit tests: isolated logic, pure functions, and small components
  - Integration tests: interactions between modules and services (e.g., geolocation with repository, Notch Pay adapter with order workflow)
  - E2E tests: end-to-end user journeys across the system
- Tools and Frameworks
  - Backend unit/integration tests: Jest with ts-jest for TypeScript support
  - API testing: Supertest for REST endpoints
  - E2E testing: Playwright or Cypress for browser-like end-to-end flows; API-driven E2E tests where a browser is unnecessary
  - Database and PostGIS: test containers with PostGIS-enabled database; use migrations and seed scripts for reproducibility
  - Notch Pay mocking: local mock server or test doubles that simulate authorization, capture, and webhook callbacks
  - CI/CD integration: GitHub Actions or similar to run test matrix on PRs and main branch
- Test Data and Environments
  - Seed data for providers with geolocations and subscription tiers
  - Mocked Notch Pay responses for authorization and capture
  - Admin verification data for providers (KYC/documents)

Test Case Design
----------------
Each test case includes preconditions, steps, expected results, and type (Unit / Integration / E2E).

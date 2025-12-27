# MercurJS Terminology & Phase 1 MVP Setup

## Terminology Mapping
- **Provider** -> `Store`
- **Technician** -> `Seller`
- **Service** -> `Product` (linked to Store)
- **Booking** -> `Order`

## Key API Endpoints
- `POST /store/stores/nearby`: Search for stores near a location.
- `POST /store/chats`: Send/receive messages for an order.
- `POST /store/contracts/generate`: Generate a contract from chat history.
- `POST /admin/stores/verify`: Admin verification of stores.

## Phase 1 Implementation Details
- **Notch Pay Escrow**: Initial scaffold implemented in `backend/medusa-plugins/medusa-payment-notchpay`.
- **Geolocation**: PostGIS-ready module in `backend/src/modules/geolocation`.
- **Subscriptions**: Basique (20% commission) and Pro (10% commission) tiers seeded via `backend/src/scripts/seed-mvp.ts`.
- **Chat**: In-process chat module in `backend/src/modules/chat`.

## Local Setup
1. Configure `.env` with PostgreSQL credentials.
2. Run `yarn seed` to populate MVP data.
3. Use `POST /store/stores/nearby` with `latitude` and `longitude` to test search.
# MercurJS Glossary & Terminology Mapping

| Concept | MercurJS Term | MedusaJS Mapping | Description |
|---|---|---|---|
| Service Provider | **Store** | `Store` (Custom Module) | The business entity providing services. |
| Technician/Worker | **Seller** | `Seller` (Custom Module) | Individual worker belonging to a Store. |
| Service | **Product** | `Product` | Standard Medusa product representing a service. |
| Engagement/Booking | **Order** | `Order` | Medusa order with service metadata. |
| Subscription Tier | **Plan** | `SubscriptionPlan` | Basique (20% fee) or Pro (10% fee). |
| Holding Funds | **Escrow** | `NotchPayPlugin` | Notch Pay authorize/capture flow. |

## Phase 1 MVP Workflow
1. **Onboarding**: Providers create a `Store`. Admin verifies via `POST /admin/stores/verify`.
2. **Discovery**: Customers find nearby stores via `POST /store/stores/nearby`.
3. **Engagement**: Chat room created per `Order`. Terms negotiated.
4. **Contract**: `POST /store/contracts/generate` extracts terms into a PDF/text contract.
5. **Payment**: `Notch Pay` authorizes funds at booking.
6. **Completion**: Funds captured, commission deducted per `Plan`, payout triggered to `Store`.
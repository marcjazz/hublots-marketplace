# Technical Architecture

This document outlines the technical architecture for the service marketplace platform, built upon MedusaJS and the MercurJS marketplace engine. It details the responsibilities of each core component and the design of custom modules required to meet the platform's unique feature set.

---

### **1. Core Platform & Technology Stack**

-   **Backend Framework:** MedusaJS (Node.js, Express, PostgreSQL)
-   **Marketplace Engine:** MercurJS
-   **Database:** PostgreSQL with PostGIS extension for geospatial capabilities.
-   **Frontend:** Next.js (Storefront and Provider Panels)
-   **Infrastructure:** Google Cloud Platform (GCP), managed via Terraform.
-   **Real-time Communication:** Socket.IO or a managed WebSocket service.

---

### **2. System Architecture Diagram**

The architecture is designed as a modular monolith, with MedusaJS at the core. Custom functionalities are built as plugins or services within the Medusa ecosystem, ensuring clean separation of concerns while maintaining a single codebase for the MVP.

```
+--------------------------------+      +--------------------------+      +------------------------+
|       Next.js Storefront       |----->|                          |<---->|    External Services   |
+--------------------------------+      |                          |      +------------------------+
                                        |      MedusaJS Backend    |      | - Notch Pay (Payments) |
+--------------------------------+      |      (GCP / GKE)         |      | - SendGrid (Email)     |
|     Next.js Provider Panel     |----->|                          |      | - Twilio (SMS)         |
+--------------------------------+      |                          |      +------------------------+
                                        |                          |
                                        |  +---------------------+ |
                                        |  | Medusa Core         | |
                                        |  | - Customers (Users) | |
                                        |  | - Products (Services) | |
                                        |  | - Orders (Bookings)   | |
                                        |  +---------------------+ |
                                        |                          |
                                        |  +---------------------+ |
                                        |  | MercurJS Engine     | |
                                        |  | - Stores (Providers)| |
                                        |  | - Payouts           | |
                                        |  +---------------------+ |
                                        |                          |
                                        |  +---------------------+ |
| +----------------------------+        |  | Custom Modules      | |
| | PostgreSQL w/ PostGIS DB |<------->|  | - Geolocation Svc.  | |
| +----------------------------+        |  | - Chat Svc.         | |
|                                       |  | - Subscription Svc. | |
| +----------------------------+        |  | - Notch Pay Plugin  | |
| |      Cloud Storage       |<------->|  +---------------------+ |
| +----------------------------+        |                          |
                                        +--------------------------+
```

---

### **3. Component Responsibilities**

#### **a. MedusaJS Core**
Medusa's native functionalities will be mapped to our domain model to handle standard e-commerce logic.

-   **`Customer`**: Maps directly to our `User` entity. Provides authentication and basic profile management.
-   **`Product`**: Maps to our `Service` entity. We will leverage its structure for defining services, including title, description, and categories. The pricing will be customized.
-   **`Order`**: This is the cornerstone entity, mapping to our `Booking`. Its lifecycle (`placed`, `completed`, `canceled`) maps directly to our booking statuses. We will heavily use its `metadata` field to store booking-specific information like `service_address`, `agreed_price`, and `contract_details`.
-   **Regions & Currencies**: Used to manage service areas and the local currency (XAF).

#### **b. MercurJS Marketplace Engine**
MercurJS extends Medusa to support multiple vendors.

-   **`Store`**: Maps directly to our `Provider` entity. MercurJS handles the association of a `Provider` to their `Services` (Products).
-   **`Payouts`**: MercurJS provides the data model and logic for tracking earnings and processing payouts to providers, which we will integrate with Notch Pay.

#### **c. Custom Modules & Extensions**
This is where the platform's unique features are implemented.

**1. Geolocation Service**
-   **Technology:** PostgreSQL's **PostGIS** extension. This is a production-ready, high-performance solution for geospatial queries.
-   **Implementation:** A dedicated `geolocation.service.ts` within Medusa's services.
    -   `updateProviderLocation(providerId, lat, lon)`: Upserts the provider's real-time coordinates. To be called from the provider's mobile app.
    -   `findProvidersInRadius(lat, lon, radiusInKm, subscriptionTiers)`: Executes a `ST_DWithin` PostGIS query to find all verified providers in the specified radius. The query will also factor in the provider's `subscription_tier` to sort providers with higher tiers first (visibility boost).
-   **API Endpoint:** A custom endpoint `POST /store/providers/nearby` will be created to expose this functionality to the frontend.

**2. Secure Escrow Payments (Notch Pay Plugin)**
-   **Implementation:** A custom Medusa Payment Processor plugin (`medusa-payment-notchpay`).
-   **Escrow Flow:**
    1.  **Authorization:** When a `Booking` (Order) is created, the customer pays. Our plugin calls Notch Pay to authorize the payment, placing the funds in a "holding" or "escrow" state within our Notch Pay account. Medusa's payment status is set to `authorized`.
    2.  **Service Completion:** Upon successful completion of the service (customer confirms in-app), an internal API is triggered.
    3.  **Capture & Payout:**
        -   The system calls our plugin's `capturePayment` method. This formally captures the funds.
        -   Immediately after capture, the system calculates the platform commission and the provider's net earning based on their subscription tier.
        -   It then calls a `processPayout` method which uses Notch Pay's API to transfer the net amount to the provider's linked mobile money wallet or bank account.

**3. Integrated Secure Chat**
-   **Technology:** **Socket.IO**. It will be integrated directly into the Medusa backend process for the MVP to keep the architecture simple. It can be scaled to a separate microservice later if needed.
-   **Implementation:**
    -   A `chat.service.ts` will manage chat logic.
    -   When a `Booking` is confirmed, a unique chat `room` is created (e.g., using the `booking_id`).
    -   Both the `User` and `Provider` will connect to the WebSocket server and join this room upon entering the booking's chat screen.
    -   Messages are broadcasted to the room and persisted to the `ChatMessage` table for history.
    -   The `generateContract` feature will be an API call that pulls the chat history, formats it, and stores it in the `Booking`'s `metadata`.

**4. Provider Subscription System**
-   **Implementation:** A `subscription.service.ts` and a set of custom entities: `SubscriptionPlan` and `ProviderSubscription`.
-   **Logic:**
    -   Providers can subscribe to plans via the provider panel. This will use Medusa's cart and order system, treating a subscription as a non-shippable product.
    -   The `subscriptionService` will have a `getProviderEntitlements(providerId)` method that returns the provider's current commission rate, visibility boost, etc.
-   **Enforcement Points:**
    -   **Search Ranking:** The `geolocationService` will call `getProviderEntitlements` to apply the visibility boost.
    -   **Commissions:** The Payout processing logic will use the entitlements to calculate the final payout amount.
    -   **Request Access:** When implementing request broadcasting (Phase 2), this service will determine which providers get priority access.

---

### **4. Infrastructure & Deployment**

-   **Compute:** The Medusa backend will be containerized (Docker) and deployed on **Google Kubernetes Engine (GKE)** for scalability and managed infrastructure.
-   **Database:** A managed **Cloud SQL for PostgreSQL** instance will be used. The PostGIS extension must be enabled on this instance.
-   **Storage:** **Google Cloud Storage** will be used for storing all user and provider-uploaded assets (profile pictures, logos, etc.).
-   **Provisioning:** All cloud resources will be defined and managed using **Terraform** to ensure the infrastructure is version-controlled and easily replicable across different environments (staging, production).

This architecture provides a scalable and maintainable foundation for the marketplace, leveraging the strengths of Medusa and MercurJS while extending them with robust, custom-built modules for the platform's core features.
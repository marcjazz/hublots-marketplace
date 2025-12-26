
# MVP Scope Definition

This document defines the scope for the Minimum Viable Product (MVP) of the service marketplace. The features are divided into two phases to ensure a focused and rapid initial launch, followed by strategic enhancements.

---

### **Phase 1: MVP (Must-Haves for Day 1 Launch)**

The goal of the MVP is to validate the core business model: connecting customers with local service providers and facilitating a secure, completed transaction.

#### **1. Core User & Provider Onboarding**
-   **User (Customer):**
    -   Email/password registration and login.
    -   Basic profile management (name, phone number).
-   **Provider (Business):**
    -   Email/password registration and login.
    -   Detailed business profile creation (business name, description, address, logo).
    -   **Manual Verification:** A simple "pending" status on signup. Admins will use the Medusa Admin panel to manually vet and approve providers before they are visible on the platform.

#### **2. Service & Availability Management**
-   **Services:** Providers can create, update, and delete pre-defined services from their panel, including a title, description, category, and a **price range** (min/max price).
-   **Availability:** Providers can set a simple, recurring weekly availability schedule (e.g., Monday to Friday, 08:00 - 17:00).
-   **Location:** Providers must set a single, fixed business address. Real-time location is deferred to Phase 2.

#### **3. The Core "Happy Path" Workflow**
-   **Search:** Customers can search for services. The search will find providers whose fixed address is within a 5km radius of the customer's location.
-   **Booking Initiation:** Customers can select a service from a provider and initiate a booking request.
-   **Integrated Chat:** A dedicated chat channel is created for each booking request. The customer and provider can communicate here to discuss details.
-   **Contract Agreement:** The provider can, from the chat, generate a formal "Service Agreement" that states the final, agreed-upon price. Both the customer and provider must click "Accept" on this agreement in-app.
-   **Escrow Payment:** After the agreement is accepted, the customer is prompted to pay the final price. The system, via the Notch Pay integration, will hold these funds in escrow.
-   **Service Completion:** After the service is rendered, the customer must mark the booking as "Complete" in the app.
-   **Payout:** The "Complete" action triggers the release of the escrowed funds to the provider, minus the platform's commission.

#### **4. Reviews & Ratings**
-   **Verified Reviews:** Only after a booking is successfully completed and paid for can a customer leave a review.
-   **Simple Rating:** The review will consist of a 1-5 star rating and a text comment.
-   **Public Display:** The provider's average star rating and all reviews will be visible on their public profile.

#### **5. Provider Subscriptions (Simplified)**
-   **Two Tiers:** A `Free` tier and a single `Paid` tier.
-   **Core Differentiator:** The *only* difference for the MVP will be the **commission rate**. For example:
    -   Free Tier: 20% commission.
    -   Paid Tier: 10% commission.
-   **Management:** Providers can view and upgrade to the Paid tier from their panel, with payments handled via Medusa's standard checkout flow.

#### **6. Admin**
-   **Provider Verification:** Admins must be able to view pending provider applications, review their details, and approve or reject them.
-   **Basic Oversight:** Admins can view users, providers, and bookings in the Medusa Admin panel.

---

### **Phase 2: Post-MVP Enhancements**

These features are important for long-term growth and competitiveness but are not critical for the initial launch.

#### **1. Advanced Geolocation & Service Requests**
-   **Real-Time Provider Location:** Implement the functionality for providers to opt-in to sharing their live location when "Available".
-   **Request Broadcasting:** Allow customers to post a custom job request (e.g., "Leaking pipe under my sink") that gets broadcasted to all nearby, available providers.

#### **2. Advanced Provider & Service Features**
-   **Multi-Technician Accounts:** Allow a provider (business) to create sub-accounts for their individual technicians, and assign specific bookings to them.
-   **Complex Availability:** Introduce a proper calendar system for providers to manage their availability, block out specific times, and potentially sync with external calendars.

#### **3. Full-Fledged Subscription Model**
-   **Visibility Boost:** Implement the search algorithm logic that ranks providers on higher-tier plans more prominently.
-   **Priority Access:** Give paid-tier providers priority notifications for broadcasted job requests.
-   **Analytics:** A dedicated analytics dashboard for providers.

#### **4. Formal Dispute Resolution**
-   **In-App Mediation:** A structured workflow for customers or providers to raise a dispute.
-   **Admin Intervention:** An interface for admins to review chat logs, the service agreement, and other evidence to resolve the dispute by either releasing funds or issuing a refund.

#### **5. Notifications**
-   **Push & SMS Notifications:** Integrate services like Firebase Cloud Messaging and Twilio to send real-time alerts for critical events (new messages, booking confirmations, payment alerts).

This phased approach ensures the most critical features are delivered first, allowing the platform to launch, gather user feedback, and iterate effectively.

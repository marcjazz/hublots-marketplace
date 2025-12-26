
# Marketplace Domain Model

Here is the proposed domain model for the service marketplace platform. This model outlines the core entities, their attributes, and their relationships, serving as the blueprint for the database schema and technical architecture.

---

### **Core Entities & Relationships**

The primary entities in the system are:

-   **User:** Represents a customer seeking a service.
-   **Provider:** Represents a business offering services. A provider can have multiple technicians.
-   **Technician:** An individual service person who performs the work, linked to a provider.
-   **Service:** A pre-defined service offered by a provider.
-   **Booking:** Represents a specific job or service request linking a User, a Provider, a Service, and potentially a Technician.
-   **Payment & Payout:** Entities tracking the flow of funds from the customer to the platform and from the platform to the provider.
-   **Review:** A rating and comment left by a User for a completed Booking.
-   **Chat:** A communication channel linked to a Booking.
-   **SubscriptionPlan:** Defines the available subscription tiers for providers.
-   **ProviderSubscription:** Tracks a provider's specific subscription history (e.g., their active plan).

**Visual Relationship Diagram (Conceptual):**

```
[User] --< (has many) -- [Booking] --< (has one) -- [Review]
  |                                 |
(has many)                          |
  |                                 |
[Chat] >-- (belongs to) -- [Booking] -- (belongs to) --< [Provider]
  |                                 |                   |
(has many)                          |                   |
  |                                 |                   ^
[Provider] --< (has many) -- [Booking]                   | (has many)
                                    |                   |
                                    |------------ (has one) --- [ProviderSubscription] -- (belongs to) --> [SubscriptionPlan]
                                    |
                                    |------------ (belongs to) -- [Service]
                                    |
                                    `------------ (has one) --- [Payment] -- (has one) --> [Payout]

[Provider] --< (has many) -- [Technician]
```

---

### **Entity Definitions**

#### 1. User
Represents the customer. This can extend Medusa's native `Customer` entity.

| Field | Type | Description | Notes |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | Primary Key | (Medusa default) |
| `first_name` | `String` | User's first name | |
| `last_name` | `String` | User's last name | |
| `email` | `String` | Unique email for login | (Medusa default) |
| `password_hash` | `String` | Hashed password | (Medusa default) |
| `phone_number` | `String` | Verified phone number | Crucial for communication |
| `profile_picture_url`| `String` | URL to profile image | |
| `created_at` | `DateTime`| Timestamp of creation | (Medusa default) |
| `updated_at` | `DateTime`| Timestamp of last update | (Medusa default) |

**Relationships:**
- Has many `Bookings`
- Has many `Reviews`

---

#### 2. Provider
Represents the service provider business. This will be a custom entity linked to a Medusa `User` for authentication.

| Field | Type | Description | Notes |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | Primary Key | |
| `business_name`| `String` | Official name of the business | |
| `description` | `Text` | Detailed description of the provider | |
| `logo_url` | `String` | URL to business logo | |
| `phone_number`| `String` | Verified business phone number | |
| `address` | `String` | Main business address | |
| `status` | `Enum` | `pending`, `verified`, `suspended` | For manual verification |
| `location_type`| `Enum` | `fixed`, `real-time` | Determines geo-query logic |
| `current_location`| `PostGIS Point` | Stores `(latitude, longitude)` | Indexed for geo-queries |
| `availability_schedule`| `JSONB` | Stores weekly availability | e.g., `{"mon": "08:00-17:00"}` |
| `user_id` | `UUID` | Foreign Key to a Medusa `User` for login | |

**Relationships:**
- Belongs to a Medusa `User` (for panel access)
- Has many `ProviderSubscriptions`
- Has many `Technicians`
- Has many `Services`
- Has many `Bookings`

---

#### 3. Technician
Represents an individual worker associated with a Provider.

| Field | Type | Description | Notes |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | Primary Key | |
| `provider_id` | `UUID` | Foreign Key to `Provider` | |
| `first_name` | `String` | Technician's first name | |
| `last_name` | `String` | Technician's last name | |
| `phone_number`| `String` | Technician's direct line | Optional |
| `profile_picture_url`| `String` | Photo of the technician | |

**Relationships:**
- Belongs to one `Provider`
- Can be assigned to many `Bookings` (one at a time)

---

#### 4. Service
Represents a pre-defined service offered by a Provider. This can be modeled using Medusa's `Product` entity.

| Field | Type | Description | Notes |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | Primary Key | (Medusa default) |
| `title` | `String` | Name of the service | e.g., "Réparation de fuite d'eau" |
| `description` | `Text` | Detailed description of the service | |
| `category` | `String` | e.g., "Plomberie", "Électricité" | For filtering |
| `provider_id` | `UUID` | Foreign Key to `Provider` | (via MercurJS) |
| `min_price` | `Decimal` | The minimum price for the range | Stored in cents (XAF) |
| `max_price` | `Decimal` | The maximum price for the range | Stored in cents (XAF) |

**Relationships:**
- Belongs to one `Provider`
- Can be part of many `Bookings`

---

#### 5. Booking
The central entity representing a job. This will be modeled using Medusa's `Order` entity, with custom metadata.

| Field | Type | Description | Notes |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | Primary Key | (Medusa default) |
| `user_id` | `UUID` | Foreign Key to `User` (Customer) | |
| `provider_id` | `UUID` | Foreign Key to `Provider` | |
| `service_id` | `UUID` | Foreign Key to `Service` | |
| `assigned_technician_id`| `UUID` | Foreign Key to `Technician` | Nullable |
| `status` | `Enum` | `pending`, `accepted`, `in_progress`, `completed`, `cancelled`, `disputed` | |
| `service_address`| `String` | Location where service is needed | |
| `service_location`| `PostGIS Point` | `(latitude, longitude)` of the job | |
| `agreed_price` | `Decimal` | Final price from the contract | In cents (XAF) |
| `scheduled_at` | `DateTime`| The agreed time for the service | |
| `completed_at` | `DateTime`| Timestamp when service was marked complete | |
| `contract_details`| `JSONB` | Stores the final agreed-upon contract text and acceptance timestamps | |

**Relationships:**
- Belongs to one `User`
- Belongs to one `Provider`
- Belongs to one `Service`
- Has one `Payment`
- Has one `Review`
- Has one `Chat`

---

#### 6. Payment & Payout
These entities manage the financial transactions.

**Payment (Based on Medusa `Payment`)**
| Field | Type | Description | Notes |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | Primary Key | (Medusa default) |
| `booking_id` | `UUID` | Foreign Key to `Booking` | |
| `amount` | `Decimal` | Total amount paid by customer | |
| `status` | `Enum` | `pending`, `captured`, `refunded` | `captured` means held in escrow |
| `gateway` | `String` | "notchpay" | |
| `transaction_id`| `String` | ID from Notch Pay | |
| `captured_at` | `DateTime`| Timestamp of payment capture | |

**Payout (Custom Entity)**
| Field | Type | Description | Notes |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | Primary Key | |
| `payment_id` | `UUID` | Foreign Key to `Payment` | |
| `provider_id` | `UUID` | Foreign Key to `Provider` | |
| `amount` | `Decimal` | Amount paid to provider | After commission |
| `commission_amount`| `Decimal` | Platform commission | |
| `status` | `Enum` | `pending`, `processed`, `failed` | |
| `processed_at` | `DateTime`| Timestamp of payout processing | |

---

#### 7. Review
User feedback for a completed service.

| Field | Type | Description | Notes |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | Primary Key | |
| `booking_id` | `UUID` | Foreign Key to `Booking` | Ensures only paying users can review |
| `user_id` | `UUID` | Foreign Key to `User` | |
| `rating` | `Integer`| 1 to 5 stars | |
| `comment` | `Text` | Public review text | |
| `created_at` | `DateTime`| Timestamp of creation | |

**Relationships:**
- Belongs to one `Booking` (and through it, to the `Provider` and `User`)

---

#### 8. Chat & Chat Message
Real-time communication for a booking.

**Chat**
| Field | Type | Description | Notes |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | Primary Key | |
| `booking_id` | `UUID` | Foreign Key to `Booking` | |

**Chat Message**
| Field | Type | Description | Notes |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | Primary Key | |
| `chat_id` | `UUID` | Foreign Key to `Chat` | |
| `sender_id` | `UUID` | Foreign Key to `User` or `Provider`'s `user_id` | |
| `content` | `Text` | The message body | |
| `sent_at` | `DateTime`| Timestamp message was sent | |

---

#### 9. SubscriptionPlan
Defines the available subscription tiers for providers.

| Field | Type | Description | Notes |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | Primary Key | |
| `name` | `String` | "Free", "Pro", "Premium" | |
| `commission_rate`| `Decimal` | e.g., 0.15 for 15%. Use Decimal for precision. |
| `visibility_boost`| `Integer`| A weighting factor for search | e.g., 0, 1, 2 |
| `max_requests` | `Integer`| Max requests per month | `null` for unlimited |
| `price_monthly` | `Decimal` | Monthly subscription fee | |

---

#### 10. ProviderSubscription
Join table to track the history of subscriptions for each provider.

| Field | Type | Description | Notes |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | Primary Key | |
| `provider_id` | `UUID` | Foreign Key to `Provider` | |
| `subscription_plan_id` | `UUID` | Foreign Key to `SubscriptionPlan` | |
| `status` | `Enum` | `active`, `expired`, `cancelled` | |
| `starts_at` | `DateTime`| Timestamp when the subscription becomes active | |
| `ends_at` | `DateTime`| Timestamp when the subscription expires | |

**Relationships:**
- Belongs to one `Provider`
- Belongs to one `SubscriptionPlan`

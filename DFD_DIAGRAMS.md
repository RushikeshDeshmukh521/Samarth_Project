# FarmDirect - Data Flow Diagrams (DFD)

## Level 0 DFD (Context Diagram)

The Level 0 DFD shows the FarmDirect system as a single process and its interaction with external entities.

```
                    ┌─────────────────────────────────────┐
                    │                                     │
                    │      FARMDIRECT SYSTEM              │
                    │                                     │
                    │  E-Commerce Order & Delivery        │
                    │  Management System                  │
                    │                                     │
                    └─────────────────────────────────────┘
                               │         │
                   ────────────┼─────────┼────────────
                   │           │         │           │
                   ▼           ▼         ▼           ▼
              ┌────────┐  ┌────────┐ ┌────────┐ ┌──────────┐
              │Customer│  │ Admin  │ │Delivery│ │ Payment  │
              │ (User) │  │        │ │  Boy   │ │ Gateway  │
              └────────┘  └────────┘ └────────┘ └──────────┘
                   ▲           ▲         ▲           ▲
                   │           │         │           │
                   ────────────┼─────────┼────────────
                               │         │
                    ┌──────────────────────────────┐
                    │   1. Auth & User Data        │
                    │   2. Product Info            │
                    │   3. Order Updates           │
                    │   4. Delivery Status         │
                    │   5. Payment Status          │
                    │   6. Chat Messages           │
                    └──────────────────────────────┘


### Data Flows (Context Level):
1. **Customer → System**: Browse products, Place orders, Manage cart, Track orders, Chat
2. **System → Customer**: Product listings, Order confirmation, Delivery updates, Chat messages
3. **Admin → System**: Manage groceries, View orders, Assign deliveries, View analytics
4. **System → Admin**: Order reports, Delivery reports, Product inventory
5. **Delivery Boy → System**: Accept assignments, Update location, Update order status, Chat
6. **System → Delivery Boy**: Assignment notifications, Route info, Chat messages
7. **System → Payment Gateway**: Payment requests, Refund requests
8. **Payment Gateway → System**: Payment confirmation, Payment status updates

---

## Level 1 DFD (Detailed Process Diagram)

The Level 1 DFD breaks down the system into major processes and shows data flows between them.

```
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│                                                                                          │
│                    FARMDIRECT SYSTEM - LEVEL 1 DFD                                       │
│                                                                                          │
│  ┌─────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐        │
│  │  Customer   │     │    Admin     │     │Delivery Boy  │     │   Payment    │        │
│  │   (User)    │     │              │     │              │     │   Gateway    │        │
│  └──────┬──────┘     └──────┬───────┘     └──────┬───────┘     └──────┬───────┘        │
│         │                   │                   │                    │                 │
│         │                   │                   │                    │                 │
│  ┌──────▼─────────────────────────────────────────────────────────────────────┐        │
│  │                                                                             │        │
│  │  D1: Users Database         D2: Groceries DB      D3: Orders DB           │        │
│  │                                                                             │        │
│  └─────────────────────────────────────────────────────────────────────────────┘        │
│                                                                                          │
│  ┌──────────────────────────────────────────────────────────────┐                       │
│  │ P1: USER AUTHENTICATION & PROFILE                            │                      │
│  │ ├─ Login/Register                                            │                      │
│  │ ├─ JWT Token Generation                                      │                      │
│  │ ├─ Email Verification                                        │                      │
│  │ ├─ Update Profile                                            │                      │
│  └──────────────────────────────────────────────────────────────┘                       │
│         ▲                              ▼                                                │
│         │                    ┌─────────────────────┐                                   │
│         │                    │ D1: Users DB        │                                   │
│         │                    │ Stores: Credentials │                                   │
│         │                    │ Role, Profile Info  │                                   │
│         │                    └─────────────────────┘                                   │
│         └────────────────────────────────────────┘                                     │
│                                                                                          │
│  ┌──────────────────────────────────────────────────────────────┐                       │
│  │ P2: GROCERY MANAGEMENT                                        │                      │
│  │ ├─ Browse Products (View by Category)                        │                      │
│  │ ├─ Search Products                                            │                      │
│  │ ├─ View Product Details                                       │                      │
│  │ ├─ Admin: Add/Edit/Delete Products                            │                      │
│  │ ├─ Manage Stock Levels                                        │                      │
│  │ ├─ Manage Categories                                          │                      │
│  └──────────────────────────────────────────────────────────────┘                       │
│         ▲                              ▼                                                │
│         │                    ┌─────────────────────┐                                   │
│         │                    │ D2: Groceries DB    │                                   │
│         │                    │ Stores: Products    │                                   │
│         │                    │ Categories, Stock   │                                   │
│         │                    └─────────────────────┘                                   │
│         └────────────────────────────────────────┘                                     │
│                                                                                          │
│  ┌──────────────────────────────────────────────────────────────┐                       │
│  │ P3: ORDER MANAGEMENT                                          │                      │
│  │ ├─ Add Items to Cart                                          │                      │
│  │ ├─ Update Cart Quantities                                     │                      │
│  │ ├─ Remove Items from Cart                                     │                      │
│  │ ├─ Place Order                                                │                      │
│  │ ├─ View Orders List                                           │                      │
│  │ ├─ View Order Details                                         │                      │
│  │ ├─ Update Order Status (Admin only)                           │                      │
│  │ ├─ Cancel Order                                               │                      │
│  └──────────────────────────────────────────────────────────────┘                       │
│         ▲                              ▼                                                │
│         │                    ┌─────────────────────┐                                   │
│         │                    │ D3: Orders DB       │                                   │
│         │                    │ Stores: Orders      │                                   │
│         │                    │ Order Items, Status │                                   │
│         │                    └─────────────────────┘                                   │
│         └────────────────────────────────────────┘                                     │
│                                                                                          │
│  ┌──────────────────────────────────────────────────────────────┐                       │
│  │ P4: PAYMENT PROCESSING                                        │                      │
│  │ ├─ Generate Payment Token                                     │                      │
│  │ ├─ Process Payment                                            │                      │
│  │ ├─ Handle Payment Confirmation                                │                      │
│  │ ├─ Handle Payment Failure                                     │                      │
│  │ ├─ Process Refunds                                            │                      │
│  │ ├─ Update Payment Status                                      │                      │
│  └──────────────────────────────────────────────────────────────┘                       │
│         ▲                              ▼                                                │
│         │                    ┌─────────────────────┐                                   │
│         │                    │ Payment Gateway     │                                   │
│         │                    │ (External API)      │                                   │
│         │                    └─────────────────────┘                                   │
│         └────────────────────────────────────────┘                                     │
│                                                                                          │
│  ┌──────────────────────────────────────────────────────────────┐                       │
│  │ P5: DELIVERY MANAGEMENT                                       │                      │
│  │ ├─ Create Delivery Assignment                                 │                      │
│  │ ├─ View Assigned Orders (Delivery Boy)                        │                      │
│  │ ├─ Accept/Reject Assignment                                   │                      │
│  │ ├─ Update Order Status                                        │                      │
│  │ ├─ Send Location Updates                                      │                      │
│  │ ├─ Generate OTP for Delivery                                  │                      │
│  │ ├─ Verify OTP & Mark Delivered                                │                      │
│  └──────────────────────────────────────────────────────────────┘                       │
│         ▲                              ▼                                                │
│         │                    ┌─────────────────────┐                                   │
│         │                    │ D3: Orders DB       │                                   │
│         │                    │ D4: Delivery Assign │                                   │
│         │                    │ Location Updates    │                                   │
│         │                    └─────────────────────┘                                   │
│         └────────────────────────────────────────┘                                     │
│                                                                                          │
│  ┌──────────────────────────────────────────────────────────────┐                       │
│  │ P6: REAL-TIME COMMUNICATION (Chat)                            │                      │
│  │ ├─ Create Chat Session                                        │                      │
│  │ ├─ Send Message (User/Delivery Boy)                           │                      │
│  │ ├─ Receive Message                                            │                      │
│  │ ├─ View Chat History                                          │                      │
│  │ ├─ Send Location Data                                         │                      │
│  │ ├─ Real-time Notifications (Socket.io)                        │                      │
│  └──────────────────────────────────────────────────────────────┘                       │
│         ▲                              ▼                                                │
│         │                    ┌─────────────────────┐                                   │
│         │                    │ D5: Chats DB        │                                   │
│         │                    │ D6: Messages DB     │                                   │
│         │                    │ Socket.io Streams   │                                   │
│         │                    └─────────────────────┘                                   │
│         └────────────────────────────────────────┘                                     │
│                                                                                          │
└──────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## Detailed Process Specifications

### **P1: User Authentication & Profile Management**

```
    Customer              P1              D1
       │                  │              │
       │ Username/Email ──→│──────────────→│
       │ Password          │ Verify Creds  │
       │                   │              │
       │←─ JWT Token ──────│←─ Auth Result │
       │                   │              │
       │ Profile Data ────→│──────────────→│
       │                   │ Store Profile │
       │←─ Confirmation ───│              │
       │                   │              │
```

**Inputs:**
- Username, Email, Password
- Profile information

**Processes:**
- Validate credentials against D1
- Hash password using bcryptjs
- Generate JWT token
- Update user profile

**Outputs:**
- JWT Token
- Authentication status
- User profile data

**Data Store:** D1 (Users Database)

---

### **P2: Grocery Management**

```
    Customer              P2              D2              Admin
       │                  │              │               │
       │ Search Query ────→│──────────────→│               │
       │                   │ Query         │               │
       │←─ Product List ───│←─ Results ────│               │
       │                   │              │               │
       │ Filter By        │ Browse, Sort  │               │
       │ Category ────────→│──────────────→│               │
       │                   │              │               │
       │←─ Filtered List ──│←─ Return ────│               │
       │                   │              │ Add Product ──→│
       │                   │              │ Edit Product   │
       │                   │←─ Update ─────│ Delete Product │
       │                   │              │               │
```

**Inputs:**
- Search query
- Category filter
- Product management requests (Admin)

**Processes:**
- Query groceries database
- Filter by category
- Sort and paginate results
- Add/Edit/Delete products (Admin)
- Update stock levels

**Outputs:**
- Product listings
- Product details
- Confirmation of operations

**Data Store:** D2 (Groceries Database)

---

### **P3: Order Management**

```
    Customer              P3              D3              Admin
       │                  │              │               │
       │ Add to Cart ─────→│              │               │
       │ Update Qty       │ Validate      │               │
       │                   │ Quantities    │               │
       │←─ Cart Confirm ───│              │               │
       │                   │              │               │
       │ Place Order ─────→│──────────────→│               │
       │ (Items+Address)   │ Create Order  │               │
       │                   │ Save Items    │               │
       │←─ Order # & Total │←─ Stored ─────│               │
       │                   │              │ View Orders ──→│
       │ View My Orders ───→│──────────────→│ Generate Report
       │                   │ Query by User │               │
       │←─ Orders List ────│←─ Return ─────│               │
       │                   │              │ Update Status ─→
       │ Cancel Order ─────→│──────────────→│ (Confirmed,   │
       │                   │ Update Status │  Cancelled)   │
       │←─ Confirmation ───│←─ Updated ────│               │
       │                   │              │               │
```

**Inputs:**
- Product IDs and quantities
- Delivery address
- Order cancellation requests
- Status updates (Admin)

**Processes:**
- Validate product availability
- Calculate order total
- Create order record
- Create order items
- Update order status
- Handle cancellations

**Outputs:**
- Order confirmation
- Order ID and total amount
- Order list with status
- Order reports (Admin)

**Data Store:** D3 (Orders Database)

---

### **P4: Payment Processing**

```
    Customer              P4         Payment Gateway
       │                  │               │
       │ Order placed ────→│               │
       │                   │ Generate Token│
       │                   │───────────────→
       │                   │ Token Created
       │←─ Payment Link ───│←──────────────│
       │                   │               │
       │ Enter Card Details│ Submit to PG
       │───────────────────────────────────→
       │                   │ Process Payment
       │                   │ (Encrypted)
       │←─ Confirmation ───│←──────────────│
       │                   │ Update D3: Payment Status
       │                   │───────────────→ D3
       │                   │               │
```

**Inputs:**
- Order ID
- Total amount
- Payment method
- Card details (via Payment Gateway)

**Processes:**
- Generate payment token
- Validate payment amount
- Send to payment gateway
- Handle payment response
- Update order payment status
- Trigger refund if needed

**Outputs:**
- Payment confirmation
- Payment status (paid/failed)
- Payment reference ID
- Refund confirmation

**Data Store:** D3 (Orders - Payment Status), External: Payment Gateway

---

### **P5: Delivery Management**

```
    Admin                 P5              D3 & D4         Delivery Boy
       │                  │               │               │
       │ Assign Order ────→│──────────────→│               │
       │                   │ Create Assign │ Assignment    │
       │                   │               │ Notification ─→
       │                   │               │               │
       │                   │←─ Assignment ID               │
       │                   │               │ Accept/Reject │
       │                   │←───────────────────────────────│
       │                   │ Update Status │               │
       │←─ Confirmation ───│─────────────→ │               │
       │                   │               │ Location Update│
       │ Track Order ─────→│──────────────→│←──────────────│
       │                   │ Get Location  │ Send Location │
       │←─ Live Location ──│←──────────────│               │
       │                   │               │ Update Delivery│
       │                   │               │ Mark Delivered│
       │                   │←───────────────────────────────│
       │                   │ Generate OTP  │               │
       │                   │───────────────→ Verify OTP    │
       │ View Report ─────→│◄─ Delivery ID                 │
       │←─ Delivery Report │               │               │
```

**Inputs:**
- Order ID
- Assigned delivery boy ID
- Accept/Reject assignment
- Location coordinates
- OTP verification

**Processes:**
- Create delivery assignment
- Send notification to delivery boy
- Accept/reject assignment
- Track real-time location
- Update delivery status
- Verify OTP for delivery
- Mark order as delivered

**Outputs:**
- Assignment confirmation
- Real-time location
- Delivery status updates
- Delivery completion confirmation
- Delivery reports (Admin)

**Data Store:** D3 (Orders), D4 (Delivery Assignments), Location data stream

---

### **P6: Real-Time Communication (Chat)**

```
    Customer              P6              D5 & D6         Delivery Boy
       │                  │               │               │
       │ Create Chat ─────→│──────────────→│               │
       │                   │ Link Order    │               │
       │                   │───────────────→ Chat Ready    │
       │ Send Message ─────→│──────────────→│──────────────→│
       │ (Socket.io)       │ Store Message │ Real-time     │
       │                   │               │ Notification  │
       │←─ Confirmation ───│               │               │
       │                   │               │ Send Message ─→│
       │←─ Received Msg ───│←──────────────│←──────────────│
       │ (Socket.io)       │ Broadcast     │ (Real-time)  │
       │ View Chat History │               │               │
       │────────────────────→────────────────→←──────────────│
       │←─ Message List ───│               │               │
       │ Send Location ────→│──────────────→│───────────────→│
       │ Update (Delivery) │ Broadcast     │ Location Data  │
       │←─ Delivery Location               │               │
       │                   │               │               │
```

**Inputs:**
- Order ID (to create chat)
- Message content
- Sender ID
- Location coordinates

**Processes:**
- Create chat session for order
- Store messages in database
- Broadcast via Socket.io
- Real-time location updates
- Message history retrieval

**Outputs:**
- Chat confirmation
- Real-time message delivery
- Chat history
- Location updates

**Data Store:** D5 (Chats), D6 (Messages), Socket.io event streams

---

## Data Dictionary

### **D1: Users Database**
| Field | Type | Purpose |
|-------|------|---------|
| user_id | INT | Unique identifier |
| name | VARCHAR | User full name |
| email | VARCHAR | Unique email |
| password_hash | VARCHAR | Bcrypt hashed password |
| role | ENUM | user/admin/deliveryboy |
| phone | VARCHAR | Contact number |
| address | JSON | User address |
| isVerified | BOOLEAN | Email verification status |
| created_at | TIMESTAMP | Account creation time |

### **D2: Groceries Database**
| Field | Type | Purpose |
|-------|------|---------|
| product_id | INT | Unique identifier |
| name | VARCHAR | Product name |
| description | TEXT | Product details |
| price | DECIMAL | Product price |
| image_url | VARCHAR | Product image |
| category_id | INT | Category reference |
| stock | INT | Available quantity |
| created_at | TIMESTAMP | Product creation date |

### **D3: Orders Database**
| Field | Type | Purpose |
|-------|------|---------|
| order_id | INT | Unique identifier |
| user_id | INT | Customer reference |
| status | ENUM | pending/confirmed/delivered/cancelled |
| total | DECIMAL | Order total amount |
| address | JSON | Delivery address |
| payment_status | ENUM | pending/paid/failed |
| delivery_boy_id | INT | Assigned delivery personnel |
| created_at | TIMESTAMP | Order creation time |

### **D4: Delivery Assignments**
| Field | Type | Purpose |
|-------|------|---------|
| assignment_id | INT | Unique identifier |
| order_id | INT | Order reference |
| delivery_boy_id | INT | Delivery personnel |
| status | ENUM | pending/accepted/completed |
| assigned_at | TIMESTAMP | Assignment time |

### **D5: Chats Database**
| Field | Type | Purpose |
|-------|------|---------|
| chat_id | INT | Unique identifier |
| order_id | INT | Order reference |
| user_id | INT | Customer reference |
| delivery_boy_id | INT | Delivery personnel |
| created_at | TIMESTAMP | Chat creation time |

### **D6: Messages Database**
| Field | Type | Purpose |
|-------|------|---------|
| message_id | INT | Unique identifier |
| chat_id | INT | Chat reference |
| sender_id | INT | Message sender |
| receiver_type | ENUM | user/deliveryboy/ai |
| content | TEXT | Message body |
| is_ai_message | BOOLEAN | AI-generated flag |
| timestamp | TIMESTAMP | Message time |

---

## Data Flow Summary Table

| From | To | Data | Purpose |
|------|----|----|---------|
| Customer | P1 | Credentials | Authentication |
| P1 | D1 | Profile Data | Store user info |
| P1 | Customer | JWT Token | Session management |
| Customer | P2 | Search Query | Browse products |
| P2 | D2 | Query | Fetch products |
| D2 | P2 | Product List | Display to user |
| Customer | P3 | Order Data | Place order |
| P3 | D3 | Order Record | Store order |
| Admin | P5 | Assignment | Assign delivery |
| P5 | D3 & D4 | Status Update | Track delivery |
| Customer | P6 | Message | Send chat |
| P6 | D5/D6 | Message Record | Store chat |
| P6 | Customer | Broadcast | Real-time delivery |
| P4 | Payment Gateway | Payment Request | Process payment |
| Payment Gateway | P4 | Payment Status | Confirmation |

---

## System Interactions

### Customer Journey Flow
1. **Register/Login** → P1 (Authentication)
2. **Browse Products** → P2 (Grocery Management)
3. **Add to Cart & Checkout** → P3 (Order Management)
4. **Process Payment** → P4 (Payment Processing)
5. **Track Delivery** → P5 (Delivery Management)
6. **Real-time Chat** → P6 (Communication)

### Admin Operations
1. **Manage Products** → P2 (Add/Edit/Delete)
2. **View Orders** → P3 (Order Reports)
3. **Assign Delivery** → P5 (Create Assignments)

### Delivery Boy Operations
1. **View Assignments** → P5 (List Assigned Orders)
2. **Accept Assignment** → P5 (Update Status)
3. **Update Location** → P5 (Send Coordinates)
4. **Chat with Customer** → P6 (Send Messages)
5. **Mark Delivered** → P5 (Complete Delivery)

---

## External Entities

| Entity | Interaction | Data Exchange |
|--------|-----------|-----------------|
| Payment Gateway | Online Payment Processing | Payment request → Payment confirmation |
| Email Service | User Notifications | Order confirmation, Delivery updates |
| SMS Service | Alerts & OTP | OTP delivery, Status alerts |
| Map Service | Location Tracking | Coordinates, Route optimization |
| Socket.io | Real-time Updates | Chat, Location, Status updates |

---

## Mermaid DFD Structures

The following diagrams provide renderable Mermaid structures for Level 0, Level 1, and Level 2 DFDs.

### Level 0 DFD (Context Diagram) - Mermaid

```mermaid
flowchart LR
    U[Customer / User]
    A[Admin]
    D[Delivery Boy]
    PG[Payment Gateway]
    S((FarmDirect System))

    U -->|Browse products, place orders, track, chat| S
    S -->|Catalog, confirmations, status, chat updates| U

    A -->|Manage products, categories, orders, assignments| S
    S -->|Reports, inventory, operational data| A

    D -->|Accept assignments, update location/status, chat| S
    S -->|Assignment notifications, order details, chat| D

    S -->|Payment/refund requests| PG
    PG -->|Payment status/confirmation| S
```

### Level 1 DFD (Major Processes) - Mermaid

```mermaid
flowchart LR
    %% External entities
    U[Customer]
    A[Admin]
    D[Delivery Boy]
    PG[Payment Gateway]

    %% Processes
    P1((P1 Authentication
    and Profile))
    P2((P2 Grocery
    Management))
    P3((P3 Order
    Management))
    P4((P4 Payment
    Processing))
    P5((P5 Delivery
    Management))
    P6((P6 Real-Time
    Communication))

    %% Data stores
    D1[(D1 Users DB)]
    D2[(D2 Groceries DB)]
    D3[(D3 Orders DB)]
    D4[(D4 Delivery Assignments)]
    D5[(D5 Chats DB)]
    D6[(D6 Messages DB)]

    %% Entity to process
    U --> P1
    U --> P2
    U --> P3
    U --> P6

    A --> P2
    A --> P3
    A --> P5

    D --> P5
    D --> P6

    %% Process to data store
    P1 <--> D1
    P2 <--> D2
    P3 <--> D3
    P5 <--> D3
    P5 <--> D4
    P6 <--> D5
    P6 <--> D6

    %% Payment integration
    P3 --> P4
    P4 <--> PG
    P4 --> D3

    %% Operational coupling
    P3 --> P5
    P5 --> P6
```

### Level 2 DFD (Detailed Decomposition) - Mermaid

```mermaid
flowchart TB
    %% External entities
    U[Customer]
    A[Admin]
    DBoy[Delivery Boy]
    PG[Payment Gateway]

    %% Data stores
    D1[(Users)]
    D2[(Groceries/Categories)]
    D3[(Orders/Order Items)]
    D4[(Delivery Assignments)]
    D5[(Chats)]
    D6[(Messages)]

    %% P1 decomposition
    subgraph P1[1.0 Authentication and Profile]
        P11((1.1 Register/Login))
        P12((1.2 Token and Session))
        P13((1.3 Profile Update))
    end

    %% P2 decomposition
    subgraph P2[2.0 Grocery Management]
        P21((2.1 Browse Categories))
        P22((2.2 View Product Details))
        P23((2.3 Admin Product and Category CRUD))
    end

    %% P3 decomposition
    subgraph P3[3.0 Order Management]
        P31((3.1 Cart Operations))
        P32((3.2 Place Order))
        P33((3.3 Order Tracking and Status))
    end

    %% P4 decomposition
    subgraph P4[4.0 Payment]
        P41((4.1 Create Payment Request))
        P42((4.2 Verify Callback/Status))
    end

    %% P5 decomposition
    subgraph P5[5.0 Delivery]
        P51((5.1 Assign Delivery Boy))
        P52((5.2 Accept and Update Delivery))
        P53((5.3 Location and Completion))
    end

    %% P6 decomposition
    subgraph P6[6.0 Chat and Real-Time]
        P61((6.1 Create Chat Session))
        P62((6.2 Send and Receive Messages))
        P63((6.3 Broadcast Events))
    end

    %% Authentication flows
    U -->|credentials| P11
    P11 <--> D1
    P11 --> P12
    P12 -->|JWT/auth result| U
    U -->|profile data| P13
    P13 <--> D1

    %% Grocery flows
    U -->|browse/search| P21
    P21 <--> D2
    U -->|view product| P22
    P22 <--> D2
    A -->|manage catalog| P23
    P23 <--> D2

    %% Order flows
    U -->|cart actions| P31
    P31 --> P32
    P32 <--> D3
    U -->|my orders| P33
    A -->|status updates| P33
    P33 <--> D3

    %% Payment flows
    P32 --> P41
    P41 <--> PG
    PG -->|payment status| P42
    P42 --> D3
    P42 --> P33

    %% Delivery flows
    A -->|assign order| P51
    P51 <--> D4
    P51 --> D3
    DBoy -->|accept/reject| P52
    P52 <--> D4
    P52 --> D3
    DBoy -->|location/complete| P53
    P53 --> D4
    P53 --> D3

    %% Chat flows
    U -->|start chat| P61
    DBoy -->|join chat| P61
    P61 <--> D5
    U -->|messages| P62
    DBoy -->|messages| P62
    P62 <--> D6
    P62 --> P63
    P63 -->|real-time updates| U
    P63 -->|real-time updates| DBoy
```


# FarmDirect Database Design

## Database Name
**farmdirect**

---

## Tables Overview

### 1. **categories**
Stores product categories for organizing groceries.

| Column | Type | Constraints |
|--------|------|-----------|
| id | INT | AUTO_INCREMENT, PRIMARY KEY |
| name | VARCHAR(100) | NOT NULL |
| imageUrl | VARCHAR(500) | NULL |

**Purpose:** Organize products into categories like Fruits, Vegetables, Dairy, etc.

---

### 2. **users**
Stores all users including regular customers, admins, and delivery personnel.

| Column | Type | Constraints |
|--------|------|-----------|
| id | INT | AUTO_INCREMENT, PRIMARY KEY |
| name | VARCHAR(100) | NOT NULL |
| email | VARCHAR(150) | UNIQUE, NOT NULL |
| password | VARCHAR(255) | NOT NULL (bcrypt hashed) |
| role | ENUM | ('user', 'admin', 'deliveryboy'), DEFAULT 'user' |
| phone | VARCHAR(20) | NULL |
| address | JSON | NULL |
| isVerified | BOOLEAN | DEFAULT FALSE |
| createdAt | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |
| updatedAt | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE |

**Purpose:** Central user management for all user types.

**Roles:**
- `user`: Regular customer
- `admin`: Administrator with full system access
- `deliveryboy`: Delivery personnel

---

### 3. **groceries**
Product catalog with details and inventory.

| Column | Type | Constraints |
|--------|------|-----------|
| id | INT | AUTO_INCREMENT, PRIMARY KEY |
| name | VARCHAR(200) | NOT NULL |
| description | TEXT | NULL |
| price | DECIMAL(10,2) | NOT NULL |
| imageUrl | VARCHAR(500) | NULL |
| categoryId | INT | FOREIGN KEY → categories(id) |
| stock | INT | DEFAULT 0 |
| createdAt | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |

**Purpose:** Store all available grocery products with pricing and stock information.

---

### 4. **orders**
Main orders table tracking customer purchase orders.

| Column | Type | Constraints |
|--------|------|-----------|
| id | INT | AUTO_INCREMENT, PRIMARY KEY |
| userId | INT | NOT NULL, FOREIGN KEY → users(id) |
| status | ENUM | ('pending', 'confirmed', 'processing', 'picked', 'shipped', 'delivered', 'cancelled'), DEFAULT 'pending' |
| total | DECIMAL(10,2) | NOT NULL |
| address | JSON | NOT NULL |
| paymentStatus | ENUM | ('pending', 'paid', 'failed'), DEFAULT 'pending' |
| deliveryBoyId | INT | NULL, FOREIGN KEY → users(id) |
| createdAt | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |

**Purpose:** Track customer orders and their status throughout the fulfillment lifecycle.

**Order Status Flow:**
- `pending` → `confirmed` → `processing` → `picked` → `shipped` → `delivered`
- Any status can transition to `cancelled`

---

### 5. **order_items**
Line items for each order (products within an order).

| Column | Type | Constraints |
|--------|------|-----------|
| id | INT | AUTO_INCREMENT, PRIMARY KEY |
| orderId | INT | NOT NULL, FOREIGN KEY → orders(id) ON DELETE CASCADE |
| groceryId | INT | NOT NULL, FOREIGN KEY → groceries(id) |
| quantity | INT | NOT NULL |
| price | DECIMAL(10,2) | NOT NULL |

**Purpose:** Store individual products and quantities included in each order.

---

### 6. **delivery_assignments**
Assigns delivery boys to orders.

| Column | Type | Constraints |
|--------|------|-----------|
| id | INT | AUTO_INCREMENT, PRIMARY KEY |
| orderId | INT | NOT NULL, UNIQUE, FOREIGN KEY → orders(id) |
| deliveryBoyId | INT | NOT NULL, FOREIGN KEY → users(id) |
| status | ENUM | ('pending', 'accepted', 'completed'), DEFAULT 'pending' |
| assignedAt | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |

**Purpose:** Track delivery assignments and acceptance status by delivery personnel.

**Status Flow:**
- `pending`: Assignment created, waiting for delivery boy response
- `accepted`: Delivery boy accepted the assignment
- `completed`: Delivery completed

---

### 7. **chats**
Conversation sessions between users and delivery boys for a specific order.

| Column | Type | Constraints |
|--------|------|-----------|
| id | INT | AUTO_INCREMENT, PRIMARY KEY |
| orderId | INT | NOT NULL, UNIQUE, FOREIGN KEY → orders(id) |
| userId | INT | NOT NULL, FOREIGN KEY → users(id) |
| deliveryBoyId | INT | NOT NULL, FOREIGN KEY → users(id) |
| createdAt | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |

**Purpose:** Create one chat session per order for communication between customer and delivery boy.

---

### 8. **messages**
Individual messages within a chat session.

| Column | Type | Constraints |
|--------|------|-----------|
| id | INT | AUTO_INCREMENT, PRIMARY KEY |
| chatId | INT | NOT NULL, FOREIGN KEY → chats(id) ON DELETE CASCADE |
| senderId | INT | NOT NULL, FOREIGN KEY → users(id) |
| receiverType | ENUM | ('user', 'deliveryboy', 'ai'), NOT NULL |
| content | TEXT | NOT NULL |
| isAIMessage | BOOLEAN | DEFAULT FALSE |
| timestamp | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |

**Purpose:** Store all messages in the chat system, supporting human and AI messages.

**Receiver Types:**
- `user`: Message to customer
- `deliveryboy`: Message to delivery boy
- `ai`: AI-generated message

---

## Entity Relationship Diagram

```
categories (1) ——→ (*) groceries
users (1) ——→ (*) orders (as userId)
users (1) ——→ (*) orders (as deliveryBoyId - nullable)
users (1) ——→ (*) delivery_assignments (as deliveryBoyId)
orders (1) ——→ (*) order_items
groceries (1) ——→ (*) order_items
orders (1) ——→ (1) delivery_assignments
orders (1) ——→ (1) chats
users (1) ——→ (*) chats (as userId)
users (1) ——→ (*) chats (as deliveryBoyId)
chats (1) ——→ (*) messages
users (1) ——→ (*) messages (as senderId)
```

---

## Key Relationships

### One-to-Many
- **users → orders**: One user can place multiple orders
- **categories → groceries**: One category can have multiple products
- **orders → order_items**: One order can have multiple line items
- **groceries → order_items**: One product can appear in multiple orders
- **chats → messages**: One chat can have multiple messages

### Foreign Keys
- `groceries.categoryId` → `categories.id`
- `orders.userId` → `users.id`
- `orders.deliveryBoyId` → `users.id`
- `order_items.orderId` → `orders.id` (CASCADE DELETE)
- `order_items.groceryId` → `groceries.id`
- `delivery_assignments.orderId` → `orders.id`
- `delivery_assignments.deliveryBoyId` → `users.id`
- `chats.orderId` → `orders.id`
- `chats.userId` → `users.id`
- `chats.deliveryBoyId` → `users.id`
- `messages.chatId` → `chats.id` (CASCADE DELETE)
- `messages.senderId` → `users.id`

---

## Constraints & Validations

| Constraint | Table(s) | Details |
|-----------|----------|---------|
| UNIQUE | users.email | Each user must have unique email |
| UNIQUE | delivery_assignments.orderId | One delivery assignment per order |
| UNIQUE | chats.orderId | One chat session per order |
| CASCADE DELETE | order_items | When order is deleted, all line items are deleted |
| CASCADE DELETE | messages | When chat is deleted, all messages are deleted |

---

## Indexes (Recommended)

For optimal query performance, consider adding these indexes:
```sql
CREATE INDEX idx_orders_userId ON orders(userId);
CREATE INDEX idx_orders_deliveryBoyId ON orders(deliveryBoyId);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_groceries_categoryId ON groceries(categoryId);
CREATE INDEX idx_order_items_orderId ON order_items(orderId);
CREATE INDEX idx_order_items_groceryId ON order_items(groceryId);
CREATE INDEX idx_delivery_assignments_deliveryBoyId ON delivery_assignments(deliveryBoyId);
CREATE INDEX idx_chats_userId ON chats(userId);
CREATE INDEX idx_chats_deliveryBoyId ON chats(deliveryBoyId);
CREATE INDEX idx_messages_chatId ON messages(chatId);
CREATE INDEX idx_users_email ON users(email);
```

---

## Data Types & Sizes

| Data Type | Usage | Max Size |
|-----------|-------|----------|
| INT | IDs, Quantities, Stock | Up to 2.1 billion |
| VARCHAR(100-500) | Names, URLs | 100-500 characters |
| TEXT | Descriptions, Messages | 65k characters |
| DECIMAL(10,2) | Prices | 99,999,999.99 |
| JSON | Addresses, Complex data | 16MB per field |
| ENUM | Predefined values | Limited to defined options |
| BOOLEAN | True/False flags | 0 or 1 |
| TIMESTAMP | Date/Time tracking | Auto-updates on INSERT/UPDATE |

---

## User Roles & Permissions

### Admin
- Full system access
- Create/Update/Delete groceries
- Manage categories
- View all orders
- Manage delivery assignments
- View analytics

### User
- Browse groceries
- Place orders
- View own orders
- Chat with delivery boys
- Track deliveries

### Delivery Boy
- View assigned orders
- Accept/Reject assignments
- Update delivery status
- Send location updates
- Chat with customers

---

## Sample Queries

### Get User Orders with Items
```sql
SELECT o.*, oi.*, g.name, g.price 
FROM orders o
JOIN order_items oi ON o.id = oi.orderId
JOIN groceries g ON oi.groceryId = g.id
WHERE o.userId = ?;
```

### Get Active Delivery Assignment
```sql
SELECT d.*, o.*, u.name as deliveryBoyName
FROM delivery_assignments d
JOIN orders o ON d.orderId = o.id
JOIN users u ON d.deliveryBoyId = u.id
WHERE d.status = 'pending';
```

### Get Chat History for Order
```sql
SELECT m.*, u.name, u.email
FROM messages m
JOIN users u ON m.senderId = u.id
WHERE m.chatId IN (SELECT id FROM chats WHERE orderId = ?)
ORDER BY m.timestamp ASC;
```

---

## Notes

- All timestamps use `CURRENT_TIMESTAMP` for automatic server-time tracking
- Passwords are stored using bcrypt hashing (min 10 rounds)
- JSON fields store complex data like addresses
- Order status is tightly controlled via ENUMs
- CASCADE DELETE on order_items and messages ensures referential integrity

# FarmDirect Project Details

## 1. Abstract
FarmDirect is a full-stack web application for online grocery ordering and delivery management. The system connects customers, administrators, and delivery personnel on one platform. Customers can browse categories and products, place orders, and track status updates. Administrators can manage products, categories, and orders through an admin dashboard, while delivery staff can view assigned deliveries and update order progress. The platform uses a Node.js + Express backend, a MySQL relational database, and a responsive HTML/CSS/JavaScript frontend, with Socket.io integration for near real-time communication and order updates.

## 2. Introduction
Traditional grocery shopping often involves travel time, queue delays, limited stock visibility, and poor delivery coordination. FarmDirect addresses these gaps by digitizing the complete order lifecycle:
- Product discovery by category
- Cart and checkout flow
- Order placement and tracking
- Admin-side operational control
- Delivery-side fulfillment workflow

The project is designed as a practical e-commerce and logistics management system with role-based access for user, admin, and deliveryboy accounts.

## 3. Proposed System
The proposed system is a centralized web platform with the following modules:

1. User Module
- Registration and login using JWT-based authentication
- Browse categories and groceries
- Add products to cart and place orders
- Track order status and communicate when needed

2. Admin Module
- Secure admin login
- Category management
- Grocery/product management (add, edit, delete)
- Order monitoring and status updates
- Delivery assignment oversight

3. Delivery Module
- Deliveryboy login and role-based dashboard
- View assigned orders
- Accept/update delivery status
- Share progress updates for order tracking

4. Real-Time Communication Module
- Socket.io events for order status/location updates
- Chat/event-driven communication support

5. Data Management Layer
- MySQL schema with normalized entities for users, groceries, orders, and chat-related data
- Foreign key constraints for referential integrity

## 4. Need of the System
The system is needed to solve operational and user-experience challenges in grocery fulfillment:

- Minimize manual order handling and communication delays
- Provide transparent order lifecycle visibility to customers
- Improve inventory and category organization
- Enable role-based accountability (admin, deliveryboy, customer)
- Support scalable and structured data storage for orders and transactions
- Reduce errors in delivery assignment and status tracking
- Provide a base platform that can be extended with advanced payment and analytics features

## 5. Hardware and Software Requirements

### 5.1 Hardware Requirements (Development/Deployment Baseline)
- Processor: Intel i3/Ryzen 3 or higher
- RAM: Minimum 4 GB (8 GB recommended)
- Storage: Minimum 2 GB free for project, dependencies, logs, and DB
- Network: Stable internet for package installation and external assets (CDN/images)

### 5.2 Software Requirements
- Operating System: Windows 10/11, Linux, or macOS
- Runtime: Node.js (LTS recommended)
- Package Manager: npm
- Database Server: MySQL 8.x (or compatible)
- API/Server Framework: Express.js
- Frontend: HTML5, CSS3, Vanilla JavaScript
- Real-Time Layer: Socket.io
- Authentication: JWT + bcryptjs
- Environment Config: dotenv
- Browser: Chrome/Edge/Firefox (latest versions)
- Development Tools: VS Code, terminal/PowerShell

### 5.3 Project Dependencies (Current)
- express
- mysql2
- bcryptjs
- jsonwebtoken
- socket.io
- cors
- dotenv
- multer
- nodemailer
- helmet
- socket.io-client
- nodemon (dev)

## 6. Future Scope
FarmDirect can be extended in multiple directions:

- Payment gateway integration (UPI, card, wallets, COD reconciliation)
- Advanced search and recommendation engine
- Promo codes, loyalty points, and subscriptions
- Stock forecasting and demand analytics dashboard
- Multi-vendor marketplace support
- Pincode/geo-based delivery routing optimization
- Push notifications (SMS/Email/WhatsApp)
- Mobile apps (Android/iOS) with shared backend APIs
- Enhanced security: refresh tokens, rate limiting, audit logs
- Cloud-native deployment with CI/CD and auto-scaling

## 7. Conclusion
FarmDirect demonstrates a complete and practical online grocery ordering system with integrated admin and delivery workflows. The project combines core e-commerce operations, role-based authentication, database-backed order processing, and real-time communication capabilities. Its modular architecture and clearly separated frontend, backend, and data layers make it maintainable and extensible for future production-grade enhancements.

## 8. References
1. Project source files
- package.json (technology stack and dependencies)
- db/schema.sql (database schema)
- DATABASE_DESIGN.md (data model and constraints)
- DFD_DIAGRAMS.md (data flow architecture)
- server/server.js and routes/* (backend service structure)

2. Official documentation
- Node.js: https://nodejs.org/docs/latest/api/
- Express.js: https://expressjs.com/
- MySQL 8.0 Reference Manual: https://dev.mysql.com/doc/refman/8.0/en/
- Socket.io: https://socket.io/docs/v4/
- JSON Web Token (JWT): https://jwt.io/introduction
- bcryptjs (npm): https://www.npmjs.com/package/bcryptjs
- dotenv (npm): https://www.npmjs.com/package/dotenv

---
Prepared for: FarmDirect Project Documentation

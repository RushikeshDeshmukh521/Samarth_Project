# FarmDirect TODO

## Completed
- [x] package.json

## Phase 1: DB & Config
- [ ] db/schema.sql
- [ ] .env.example
- [ ] config/db.js (MySQL connection)

## Phase 2: Backend Core
- [ ] server/server.js (Express + Socket.io)
- [ ] middleware/auth.js (JWT verify)
- [ ] routes/auth.js (register/login)
- [ ] routes/user.js (groceries, my-orders, place-order)

## Phase 3: Backend Full
- [ ] routes/admin.js (CRUD grocery/order)
- [ ] routes/delivery.js (assignments, accept, OTP)
- [ ] routes/chat.js
- [ ] utils/imageUpload.js
- [ ] utils/sendEmail.js

## Phase 4: Frontend
- [ ] public/index.html (home)
- [ ] public/login.html
- [ ] public/register.html
- [ ] public/user-dashboard.html (groceries/cart)
- [ ] public/cart.html
- [ ] public/checkout.html
- [ ] public/track-order.html (live map/chat)
- [ ] public/admin-dashboard.html
- [ ] public/delivery-dashboard.html
- [ ] public/chat.html
- [ ] public/style.css
- [ ] public/app.js (common)

## Phase 5: Test
- [ ] Run npm install
- [ ] Setup MySQL, import schema
- [ ] npm start
- [ ] Test auth, CRUD, orders, real-time

# Finance Data & Access Control Backend 🚀

This repository houses the backend architecture for a modular, secure, and highly scalable Finance Dashboard. The codebase has been strictly engineered around **Domain-Driven Design (DDD)** principles, separating routing, business logic, access control, and data persistence.

---

## 🧠 System Blueprints & Flow

Before diving into the code, here is the complete visual documentation of how the system works. These hand-drawn architecture diagrams explain our data handling, security validations, and API routing step-by-step.

### 1. Simple System Overview
This diagram demonstrates the high-level flow of a user request mapping linearly through the Gateway, Security Middlewares, the Core Services, and safely storing inside our database.
![Simple Overview](./assets/Simple_Overview.png)

### 2. Request Lifecycle & Modular Architecture
A detailed look at the internal request handling pipeline. Notice how every request is first scrubbed by `Helmet` and `Rate-Limiting` to prevent abuse. It then undergoes rigorous `JWT Authentication` and `RBAC (Role-Based Access Control)` verification. Only perfectly validated, authorized payloads using `Zod` ever reach the database engines.
![Detailed Architecture](./assets/Detailed_Architecture.png)

### 3. Role-Based Access Control (RBAC) Hierarchy
Understanding how permissions propagate. A new user is defaulted to `VIEWER` and can only view dashboard totals. The system's root `ADMIN` assigns roles via our protected endpoints, upgrading users to `ANALYST` (view full logs) or granting them full `ADMIN` power (modify records).
![Roles & Permissions](./assets/Roles.png)

### 4. API Routing Topology
A complete mapping of all endpoints exposed by our backend structure. The endpoints are strictly split by domain (`/auth`, `/dashboard`, `/transactions`, `/users`) with specific protection boundaries clearly illustrated. Notice how Dashboard APIs separate aggregation requests (Summing vs Trends).
![API Routes](./assets/API_ROUTES.png)

### 5. Database Models & Schema Design
To guarantee analytical accuracy for financial calculations, we utilize a strictly typed relational database (PostgreSQL) managed by Prisma. This schema demonstrates our use of UUID primary keys, typed enum restrictions (`Type` & `Role`), a `1-to-Many` Foreign Key connection, and explicit soft-delete flagging to prevent destructive record loss.
![Database Models](./assets/Models.png)

---

## 🔓 Test Credentials

To explore the **ZORVYN Finance OS** and its Role-Based Access Control (RBAC), you can use the following pre-seeded accounts. Each role provides a different level of access and UI experience.

| Role | Email | Password | Permissions |
| :--- | :--- | :--- | :--- |
| **ADMIN** | `admin@finance.com` | `admin123` | Full access, user management, and data mutation. |
| **ANALYST** | `analyst@finance.com` | `analyst123` | View-only access to all dashboard and transaction logs. |
| **VIEWER** | `viewer@finance.com` | `password123` | Access to high-level dashboard summaries only. |

---

## 🖥️ Role-Based UI Previews

Below is how the **ZORVYN** dashboard adapts its interface based on the logged-in user's role.

### 👑 Admin View
Full control with the "Manage Users" and "Add Transaction" capabilities.
![Admin UI Preview](./assets/Admin.png)

### 📊 Analyst View
Comprehensive data visualization and transaction logs, but without mutation powers.
![Analyst UI Preview](./assets/Analyst.png)

### 👁️ Viewer View
A high-level, "Observer" dashboard showing only key metrics and trends.
![Viewer UI Preview](./assets/Viewer.png)

---

## 🛠 Features Implemented

*   **Custom Global Error Handling:** Utilizing `ApiError` and `ApiResponse` wrappers guarantees that the client *always* receives a predictable `{ success, data, message }` JSON shape.
*   **Security & Throttling:** `express-rate-limit` prevents brute-force logins. `helmet` obscures backend framework headers.
*   **API Live Documentation:** Swagger JS Docs are mapped directly into the code and served visually via `/api-docs`.
*   **Testing Infrastructure:** The backend leverages native `Jest` + `Supertest` to validate critical integrations.

## 🚀 Setup & Execution

### 1. Database Configuration
Ensure PostgreSQL is running locally or via a cloud provider. Add your connection string.
```bash
# Add to your backend/.env
DATABASE_URL="postgresql://user:password@localhost:5432/finance_db"
JWT_SECRET="your_highly_secure_secret"
```

### 2. Bootstrap the Environment
```bash
# 1. Provide dependencies
npm install

# 2. Push schema to Postgres
npx prisma db push

# 3. Seed initial users & mock transactions
npx prisma db seed

# 4. Start the development server
npm run dev
```

### 3. Check Documentation & Tests
```bash
# Run Jest Unit/Integration Tests
npm test

# Visit Live Swagger Docs
http://localhost:5001/api-docs
```

---

## 📝 Final Note

I have built similar financial tracking systems in the past, but I found the challenge of implementing such a robust, modular RBAC system and the premium "ZORVYN" aesthetic to be incredibly fun and interesting to revisit and refine.

Feel free to check out one of my previous e-commerce projects here: [Pettshop E-commerce](https://github.com/SirLance007/Pettshop-ecommerce)

**Built with ❤️ for High-Performance Finance.**

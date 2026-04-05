# 🌌 ZORVYN Finance OS
### *The Premium Multi-Role Financial Command Center*

**ZORVYN** is a state-of-the-art Finance Dashboard designed for high-performance data tracking and robust **Role-Based Access Control (RBAC)**. Built with a focus on premium aesthetics and security, it allows organizations to manage transactions while strictly controlling who sees what.

---

## 🚀 Quick Demo (Try it Now!)
A person looking at your repo can jump straight in using these pre-seeded accounts:

| Role | Email | Password | What can they do? |
| :--- | :--- | :--- | :--- |
| **👑 Admin** | `admin@finance.com` | `admin123` | Control users, add/delete transactions, see everything. |
| **📊 Analyst** | `analyst@finance.com` | `analyst123` | Monitor all trends and logs (Read-only access). |
| **👁️ Viewer** | `viewer@finance.com` | `password123` | See high-level totals and charts only. |

---

## 🖥️ Role-Based UI Previews
ZORVYN's interface transforms dynamically based on your permissions. 

### 1. Admin Dashboard (Full Control)
*Manage your team and your money in one place.*
![Admin View](./assets/Admin.png)

### 2. Analyst Dashboard (Data Clarity)
*Deep dive into trends without risk of accidental data modification.*
![Analyst View](./assets/Analyst.png)

### 3. Viewer Dashboard (High-level Overview)
*Simplified analytics for those who just need the bottom line.*
![Viewer View](./assets/Viewer.png)

---

## 🧠 Logic & Architecture Deep Dive
If you are curious about the "engine" under the hood, here is the complete technical breakdown of ZORVYN.

### 1. System Request Flow
Every transaction undergoes a multi-layer security check before reaching the database.
![System Architecture](./assets/Simple_Overview.png)

### 2. Request Lifecycle & Modular Pipeline
A detailed look at the internal request handling—from Helmet security to Zod validation.
![Detailed Architecture](./assets/Detailed_Architecture.png)

### 3. Permissions Hierarchy (RBAC)
Our RBAC system is modular and strictly enforced at both the API and UI levels.
![Role Logic](./assets/Roles.png)

### 4. API Routing Topology
A complete mapping of all endpoints exposed by our backend structure.
![API Routes](./assets/API_ROUTES.png)

### 5. Database Schema & Data Models
PostgreSQL + Prisma schema design for high-integrity financial calculations.
![Database Models](./assets/Models.png)

---

## 🛠️ Tech Stack & Features
- **Frontend:** React 19, Tailwind CSS, Recharts (Modern Dark Mode).
- **Backend:** Node.js, Express, Prisma (Clean Architecture).
- **Security:** JWT Auth, Zod Validation, RBAC Middlewares, Rate Limiting.
- **Extras:** Custom Glassmorphic CSS, Sticky Headers, Toast Notifications.

---

## 🔧 Installation & Local Setup

**1. Clone & Env Setup**
```bash
# Add to your backend/.env
DATABASE_URL="postgresql://user:password@localhost:5432/finance_db"
JWT_SECRET="your_secret_key"
```

**2. Backend Launch**
```bash
cd backend
npm install
npx prisma db push
npx prisma db seed # 👈 Crucial: This adds the Demo Accounts!
npm run dev
```

**3. Frontend Launch**
```bash
cd frontend
npm install
npm run dev
```

---

## 📝 A Personal Note
I have built similar financial tracking systems in the past, but I found the challenge of implementing such a robust, modular RBAC system and the premium "ZORVYN" aesthetic to be incredibly fun and interesting to revisit and refine. It’s a project born out of a love for clean code and sleek UI.

**Explore my other work:** 
🛒 [Pettshop E-commerce](https://github.com/SirLance007/Pettshop-ecommerce)

---
**Built with ❤️ by [SirLance007](https://github.com/SirLance007)**

# Finance Data & Access Control Backend 🚀

This repository houses the backend architecture for a modular, secure, and highly scalable Finance Dashboard. The codebase has been strictly engineered around **Domain-Driven Design (DDD)** principles, separating routing, business logic, access control, and data persistence.

---

## 🧠 Architectural Thinking & Flow

Rather than writing dense paragraphs, below are system diagrams illustrating how core decisions and data flow were designed from the ground up.

### 1. Request Lifecycle & Modular Architecture
To keep the codebase maintainable, the application uses a strict Controller-Service pattern. Every incoming HTTP request passes through multiple security and validation gates before it even touches business logic.

```mermaid
flowchart TD
    Client(["🌐 Client (React/Browser)"]) -->|HTTP Request| Helmet["🛡 Helmet (Security Headers)"]
    Helmet --> RateLimiter["⏱ Rate Limiter (Max 100/15m)"]
    RateLimiter --> Router["🔀 Express Router"]
    
    subgraph "Middleware Layer"
        Router --> AuthCheck{"🔐 Auth Middleware"}
        AuthCheck -- "No Token / Invalid" --> E401["❌ 401 Unauthorized"]
        AuthCheck -- "Valid JWT" --> RBAC{"👮‍♂️ RBAC Policy"}
        RBAC -- "Role Disallowed" --> E403["❌ 403 Forbidden"]
        RBAC -- "Role Allowed" --> Validation{"✅ Zod Validator"}
        Validation -- "Bad Payload" --> E400["❌ 400 Bad Request"]
    end

    Validation -- "Safe Payload" --> Controller["🎮 Controller (HTTP Parsing)"]

    subgraph "Business & Data Layer"
        Controller --> Service["⚙️ Service (Business Logic)"]
        Service --> Prisma["🔺 Prisma ORM (Type-Safe Query Builder)"]
        Prisma --> DB[("🐘 PostgreSQL DB")]
    end

    DB -.->|Raw Data| Prisma
    Prisma -.->|Typed Result| Service
    Service -.->|Processed Data| ApiResponse["📦 Custom ApiResponse Wrapper"]
    ApiResponse -.->|200 OK| Client
    
    %% Global Error catching
    Service -- "Exceptions/Errors" --> GlobalErrorHandler["🚨 Global Error Handler"]
    GlobalErrorHandler -.->|Standardized JSON| Client
```

---

### 2. Access Control Strategy (RBAC)
Role-based access is evaluated completely dynamically via a unified higher-order function. We don't rely on hardcoded static checks inside controllers.

```mermaid
sequenceDiagram
    participant App as Client
    participant Auth as Auth Middleware
    participant RBAC as Policy Guard
    participant DB as Resources (Transactions)

    App->>Auth: GET /api/transactions (Token)
    Note over Auth: Verify JWT signature
    Auth->>RBAC: Token Valid (User = ANALYST)
    
    Note over RBAC: Check route policy: rbac('ADMIN', 'ANALYST')
    alt Role matches Policy
        RBAC->>DB: Proceed to Controller
        DB-->>App: 200 OK (Data returned)
    else Role strictly VIEWER
        RBAC-->>App: 403 Forbidden (Insufficient Scope)
    end
```

---

### 3. Data Aggregation & Database Choice
**Trade-off Considered:** I moved away from MongoDB/Document stores to **PostgreSQL + Prisma ORM**.
*Why?* Financial dashboards require mathematically accurate operations (SUM, GROUP BY). Relational DBs do this natively at the engine level much faster than in-memory JavaScript reduce functions.

```mermaid
flowchart LR
    subgraph "Postgres SQL Engine (Direct Aggregation)"
        RawData[("Millions of Transactions")]
        Engine["⚙️ DB Aggregate Engine"]
        RawData --> Engine
    end

    subgraph "Dashboard API Requests"
        T1["GET /summary"] -->|Prisma: _sum| Engine
        T2["GET /by-category"] -->|Prisma: groupBy| Engine
        T3["GET /trends"] -->|Date Math| Engine
    end
    
    Engine -->|"Extremely Fast O(1) Fetch"| JSON["Dashboard UI"]
```

---

### 4. Entity Relationship (ER) Data Model
A strict schema ensures data integrity. If a user is deleted, their transactions can either be cascaded or preserved. Furthermore, transactions employ **Soft Deletion** (`isDeleted: true`) — meaning critical finance logs are never permanently wiped from the ledger.

```mermaid
erDiagram
    USER ||--o{ TRANSACTION : "creates"
    USER {
        uuid id PK
        string name
        string email UK
        string password
        enum role "ADMIN | ANALYST | VIEWER"
        boolean isActive
        datetime createdAt
    }
    TRANSACTION {
        uuid id PK
        uuid userId FK
        float amount
        enum type "INCOME | EXPENSE"
        string category
        date transactionDate
        string notes
        boolean isDeleted "Soft Delete Flag"
    }
```

---

## 🛠 Features Implemented (Beyond Core Reqs)

*   **Custom Global Error Handling:** Utilizing `ApiError` and `ApiResponse` wrappers guarantees that the client *always* receives a predictable `{ success, data, message }` JSON shape, even if the Node layer panics.
*   **Security & Throttling:** `express-rate-limit` prevents brute-force logins and basic DDoS attempts. `helmet` obscures backend framework headers.
*   **API Live Documentation:** Swagger JS Docs are mapped directly into the code and served visually via `/api-docs`.
*   **Testing Infrastructure:** The backend leverages ES-module native `Jest` + `Supertest` to validate critical integrations and ensure health checks stay green.

## 🚀 Setup & Execution

### 1. Database Configuration
Ensure PostgreSQL is running locally or via a cloud provider. Add your connection string.
```bash
# Add to your root .env
DATABASE_URL="postgresql://user:password@localhost:5432/finance_db"
JWT_SECRET="your_highly_secure_secret"
```

### 2. Bootstrap the Environment
```bash
# 1. Install dependencies
npm install

# 2. Push schema to Postgres
npx prisma db push

# 3. Seed initial users & mock transactions
npx prisma db seed

# 4. Start the development server (auto-reloads)
npm run dev
```

### 3. Check Documentation & Tests
```bash
# Run Jest Unit/Integration Tests
npm test

# Visit Live Docs
open http://localhost:5001/api-docs
```

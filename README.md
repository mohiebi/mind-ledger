# 🧠 MindLedger Core

> **MindLedger Core** is a modular, production-ready backend built with **NestJS**, **PostgreSQL**, and **TypeORM**.  
> It provides secure authentication, task management, and financial tracking — forming the foundation for a personal productivity and finance ecosystem.

---

## 🚀 Overview

MindLedger Core is the **first phase** of the MindLedger ecosystem — a SaaS-style backend platform focused on **personal productivity**, **financial awareness**, and **data-driven insights**.

### Includes
- 🔐 **Authentication & Authorization** — JWT + rotating refresh tokens, RBAC  
- ✅ **Task Management** — track and update tasks with progress and status  
- 💰 **Financial Tracker** — manage income, expenses, and categories  
- 📘 **Swagger Documentation** — auto-generated API docs  
- 🧪 **Automated Testing** — unit and e2e tests with Jest + Supertest  
- 🐳 **Dockerized Development** — reproducible local setup with PostgreSQL  
- ⚙️ **GitLab CI/CD** — automated linting, testing, and builds  

---

## 🏗️ Architecture

**Type:** Modular Monolith  
**Framework:** [NestJS](https://nestjs.com/)  
**Database:** PostgreSQL (via TypeORM)  
**Authentication:** JWT (access + refresh tokens)  
**Documentation:** Swagger (OpenAPI)  
**Testing:** Jest + Supertest  
**Containerization:** Docker + Docker Compose  
**CI/CD:** GitLab pipelines  

### 🧩 Modules

| Module | Description |
|:--|:--|
| `auth` | Handles registration, login, JWT, and refresh logic |
| `users` | Manages user profiles and roles |
| `tasks` | Task CRUD operations, progress tracking, and status workflow |
| `finance` | Transactions, categories, and monthly summaries |
| `common` | Shared guards, interceptors, DTOs, and helpers |

---

## 🧱 Database Schema (ERD)

```text
User ───< RefreshToken
 │
 ├──< Task
 │
 ├──< Category ───< Transaction
```

- **User**: account, role, and preferences  
- **Task**: status (open / in_progress / done), progress %, due_date  
- **Transaction**: amount, type (income/expense), category, date  
- **Category**: user-defined income/expense groups  
- **RefreshToken**: hashed stored tokens for session management  

---

## ⚙️ Getting Started

### 1️⃣ Clone & Install

```bash
git clone https://gitlab.com/your-username/mindledger-core.git
cd mindledger-core
npm install
```

### 2️⃣ Create `.env`

```
PORT=3000
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=mindledger
POSTGRES_PASSWORD=secret
POSTGRES_DB=mindledger_dev
JWT_ACCESS_SECRET=your-access-secret
JWT_REFRESH_SECRET=your-refresh-secret
JWT_ACCESS_EXP=900s
JWT_REFRESH_EXP=30d
```

### 3️⃣ Run with Docker

```bash
docker compose up -d
npm run start:dev
```

App runs at → **http://localhost:3000**  
Swagger docs → **http://localhost:3000/api/docs**

---

## 🧪 Running Tests

```bash
npm run test       # Unit tests
npm run test:e2e   # End-to-end tests
npm run test:cov   # Coverage report
```

### Includes
- Authentication flow (register → login → refresh)
- Task CRUD lifecycle
- Transaction CRUD + monthly summary

---

## 🧰 Development Commands

| Command | Description |
|:--|:--|
| `npm run start:dev` | Start app in watch mode |
| `npm run build` | Build production bundle |
| `npm run lint` | Run ESLint |
| `npm run format` | Format codebase |
| `npm run test:e2e` | Run integration tests |

---

## 🧾 API Summary

### 🔐 Auth

| Method | Endpoint | Description |
|:--|:--|:--|
| `POST` | `/auth/register` | Register new user |
| `POST` | `/auth/login` | Login (returns access + refresh tokens) |
| `POST` | `/auth/refresh` | Rotate refresh token |
| `POST` | `/auth/logout` | Revoke refresh token |

### 👤 Users

| Method | Endpoint | Description |
|:--|:--|:--|
| `GET` | `/users/me` | Get current user |
| `PATCH` | `/users/me` | Update profile |
| `GET` | `/admin/users` | Admin-only: list all users |

### 📋 Tasks

| Method | Endpoint | Description |
|:--|:--|:--|
| `GET` | `/tasks` | List tasks (filter by status/date) |
| `POST` | `/tasks` | Create new task |
| `PATCH` | `/tasks/:id` | Update task details |
| `DELETE` | `/tasks/:id` | Delete task |

### 💰 Finance

| Method | Endpoint | Description |
|:--|:--|:--|
| `GET` | `/transactions` | List transactions |
| `POST` | `/transactions` | Add income/expense |
| `GET` | `/summary/monthly` | Get monthly totals |
| `GET` | `/categories` | List categories |
| `POST` | `/categories` | Create new category |

---

## 🐙 CI/CD (GitLab)

The GitLab CI pipeline runs:
1. **Lint** → code style and static analysis  
2. **Test** → unit + e2e tests  
3. **Build** → Docker image creation and push  

Example `.gitlab-ci.yml` structure:
```yaml
stages:
  - lint
  - test
  - build
```

---

## 🔒 Security Features

- Bcrypt password hashing (12+ rounds)  
- Rotating refresh tokens stored as hashes  
- Role-based access control (`user`, `admin`)  
- Input validation using `class-validator`  
- Helmet + CORS protection  
- Rate limiting on authentication endpoints  

---

## 🧭 Roadmap

| Phase | Focus | Status |
|:--|:--|:--|
| **Phase 1** | Core (Auth + Tasks + Finance) | ✅ In Progress |
| **Phase 2** | Automation & Insights Service | ⏳ Planned |
| **Phase 3** | Analytics, Integrations & Monitoring | 🔜 Upcoming |

---

## 🧑‍💻 Author

**Mohammad Hosein**  
Fullstack Developer — NestJS / PHP / Vue / DevOps Enthusiast  
[LinkedIn](#) · [GitLab](#) · [GitHub](#)

---

## 🏁 License

MIT License © 2026 Mohammad Hosein

---

## ⭐ Summary

**MindLedger Core** demonstrates:
- Clean modular NestJS architecture  
- Secure JWT authentication and refresh flows  
- Domain separation for Tasks and Finance  
- Fully tested and Dockerized environment  
- Scalable structure ready for microservices (Phase 2+)

> _This project serves as both a learning base and a professional portfolio piece — built to showcase senior-level backend architecture and design skills._

# HabitPulse — Full-Stack Habit Tracker

> **Full-Stack Track Submission** | Personal Habit & Discipline Tracker built with React 19, TypeScript, Express, and MongoDB.

---

## 🔗 Live Deployments & References

| Resource                   | Link                                                                                                                                     |
| :------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------- |
| **Live Frontend**          | [https://habit-pulse-lokeshwar.vercel.app/](https://habit-pulse-lokeshwar.vercel.app/)                                                   |
| **Live Backend API**       | [https://habit-pulse-lokeshwar-api.vercel.app/](https://habit-pulse-lokeshwar-api.vercel.app/)                                           |
| **Postman API Collection** | [https://www.postman.com/lokeshwar-dewangan/workspace/habit-tracker](https://www.postman.com/lokeshwar-dewangan/workspace/habit-tracker) |
| **Figma Design Reference** | [Figma Habit Tracker App](https://www.figma.com/file/37Ky6s3RjFkuEwUnzhdtxI/Habit-Tracker-App?node-id=0%3A1)                             |

---

## 🛠 Tech Stack

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS v4, `@fontsource/outfit`, shadcn/ui, TanStack Query v5, React Hook Form, Zod, Axios, Recharts, Lucide React, Sonner.
- **Backend:** Node.js (ESM), Express 5, MongoDB (Mongoose 9), JWT, bcryptjs, Zod validation.
- **Monorepo & Package Management:** `bun` workspaces, Supertest, Vitest + React Testing Library, Oxlint.

---

## ✨ Completed Features

### Must-Have (P0 Core Requirements)

- [x] **Authentication & Session:** JWT-based signup, login, logout with password hashing (bcrypt). Reverse route guarding (`PublicRoute` redirects logged-in users to `/home`).
- [x] **Tenant Isolation:** Enforces strict user ownership across all habit and completion CRUD operations.
- [x] **Habit Lifecycle:** Create, read, edit, archive, and delete routines with custom frequencies (Daily/Weekly).
- [x] **Idempotent Completion Tracking:** Mark complete or undo for any date. Duplicate records prevented via compound unique index `{ habitId: 1, date: 1 }`.
- [x] **Calendar History:** Interactive month-grid calendar modal inspecting historical checkoffs for any habit.
- [x] **Dynamic Dashboard Statistics:** Streaks, active counts, and overall completion percentages dynamically aggregated from actual database records.

### Optional Extensions (P1 Completed)

- [x] **Pomodoro Focus Timer (`/timer`):** 25-minute focus & 5-minute break cycles with interval progress ring.
- [x] **7-Day Consistency Analytics:** Recharts bar chart showing trailing 7-day completion distributions.
- [x] **CSV Data Export:** One-click download of all habit records with streaks and completion metrics.
- [x] **Mobile Drawer Navigation:** Responsive top bar with hamburger menu drawer for seamless phone/tablet use.
- [x] **Labels Management:** Filter and organize routines by custom tags (`/labels`).

---

## ⚙️ Environment Variables

### Backend (`packages/server/.env`)

```env
PORT=5000
NODE_ENV=production
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/habit_tracker
JWT_SECRET=your-secure-jwt-secret-key
JWT_EXPIRES_IN=7d
CLIENT_URL=https://habit-pulse-lokeshwar.vercel.app
```

### Frontend (`packages/client/.env`)

```env
# Leave empty in local dev to use the Vite proxy; set in Vercel for live backend
VITE_API_URL=https://habit-pulse-lokeshwar-api.vercel.app
```

---

## 🚀 Local Development Setup

Prerequisites: [Bun](https://bun.sh/) (v1.2+) and MongoDB.

```bash
# 1. Clone repository
git clone <repo-url>
cd habit-tracker-take-home

# 2. Install dependencies across workspace
bun install

# 3. Start full-stack application concurrently (server on :5000, client on :5173)
bun run dev
```

---

## 🧪 Running Automated Tests

All tests run in-memory and require no external database setup.

```bash
# Run both backend (Supertest + Mongo Memory Server) and frontend (Vitest + RTL)
bun run test

# Run frontend lint check (Oxlint)
cd packages/client && bun run lint

# Run frontend production build
cd packages/client && bun run build
```

**Test Coverage Summary:**

- **Backend:** 14 integration tests covering Auth, Ownership Isolation, CRUD, Idempotency, and Stats.
- **Frontend:** 8 component & route guard tests verifying Habit Cards, Login, Mobile Navigation, and Guest Guards.

---

## 📐 Assumptions & Engineering Decisions

1. **Idempotent Completions:** Duplicate records for identical habit and calendar date are prevented at the database schema layer using a compound unique index `{ habitId: 1, date: 1 }`.
2. **ESM Compliance for Vercel:** All backend relative imports include explicit `.js` extensions, meeting Node.js ESM runtime requirements on Vercel Serverless.
3. **Optimistic UI Updates:** Daily checkoffs toggle instantly with TanStack Query cache invalidation and rollback safeguards.

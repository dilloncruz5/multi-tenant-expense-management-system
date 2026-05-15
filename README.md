# Production Finance App

A professional, production-ready, full-stack financial tracking application. Built with a clean architecture, strict multi-tenancy, and robust role-based access control (RBAC).

## Tech Stack

**Backend:**
- Node.js & Express
- TypeScript
- PostgreSQL (Neon)
- Prisma ORM
- Zod (Validation)
- JWT (Authentication)
- Pino (Logging)

**Frontend:**
- Next.js 14 (App Router)
- React Query (Server State)
- Tailwind CSS
- React Hook Form + Zod
- Axios

---

## Folder Structure

The repository is logically divided into backend and frontend applications:

- `/src`: Backend API containing controllers, services, repositories, and middleware following a layered architecture.
- `/frontend`: Next.js frontend application with modular components, hooks, and API services.

---

## Setup Steps

### 1. Backend Setup

Install dependencies:
```bash
npm install
```

Copy the example environment file and configure it:
```bash
cp .env.example .env
```
Ensure `DATABASE_URL` is pointing to your PostgreSQL instance.

Sync database schema and run the seed script:
```bash
npx prisma db push
npx prisma db seed
```

Start the backend server:
```bash
npm run dev
```

### 2. Frontend Setup

Navigate to the frontend directory:
```bash
cd frontend
npm install
```

Start the frontend development server:
```bash
npm run dev
```

---

## Sample Credentials

The seed script (`npx prisma db seed`) automatically generates the following accounts for testing:

- **Admin Account**
  - **Email:** `admin@seed.com`
  - **Password:** `password123`

- **Accountant Account**
  - **Email:** `accountant@seed.com`
  - **Password:** `password123`

---

## Deployment Links
*(Update these links once the app is deployed)*

- **Frontend:** [https://multi-tenant-expense-management-sys.vercel.app/login](https://multi-tenant-expense-management-sys.vercel.app/login)
- **Backend API:** [https://multi-tenant-expense-management-system.onrender.com/](https://multi-tenant-expense-management-system.onrender.com/)

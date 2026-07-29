# Multi-Club Management System (MERN Stack)

A full-stack college multi-club management system built with MongoDB, Express, React (Vite), and Node.js featuring role-based access control (RBAC), JWT authentication via httpOnly cookies, live budget utilization tracking, financial reporting with Recharts, image gallery with Multer uploads, noticeboard with pinned/urgent tags, and super-admin drill-down overview.

---

## 🛠️ Tech Stack

- **Frontend**: React (Vite), React Router, Axios, Recharts (`/frontend`)
- **Backend**: Node.js, Express (`/backend`)
- **Database**: MongoDB with Mongoose
- **Auth**: JWT (Access Token in httpOnly Cookie), bcryptjs for password hashing
- **File Uploads**: Multer (disk storage in `/backend/uploads`)
- **Styling**: Dark Brutalist Minimal CSS with CSS variables (`Space Grotesk` headings, `JetBrains Mono` body)

---

## 🔑 User Roles & Permissions

| Role | Scope | Permissions |
| --- | --- | --- |
| `super_admin` | All Clubs | View all-clubs overview, create/deactivate clubs, assign club admins, drill-down view into any club's dashboard |
| `club_admin` | Assigned Club | Full CRUD on club finance, gallery, noticeboard, and members |
| `member` | Assigned Club | Read-only view of club dashboard, noticeboard, and gallery; summary-only finance view |

*Every API route enforces authentication (valid JWT) and authorization (role + club ownership verification).*

---

## ⚙️ Environment Setup

Check `.env` inside `/backend` directory:

```env
PORT=3001
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/collegeDB
JWT_SECRET=super_secret_jwt_key_2026_antigravity
REFRESH_TOKEN_SECRET=super_secret_refresh_jwt_key_2026
CLIENT_URL=http://localhost:5173
```

---

## 🚀 Getting Started

### 1. Install Dependencies
Run from the root project directory:
```bash
npm run install:all
```

### 2. Seed Sample Data
Populate 4 sample clubs (`CS`, `RO`, `ME`, `DS`), transactions, noticeboard items, gallery events, and accounts:
```bash
npm run seed
```

#### 🔐 Demo Credentials (Password for all seeded accounts: `password123`)
- **Super Admin**: `admin@college.edu`
- **CS Club Admin**: `cs_admin@college.edu`
- **CS Member**: `cs_member@college.edu`
- **Robotics Admin**: `ro_admin@college.edu`
- **Mechanical Admin**: `me_admin@college.edu`

### 3. Run Development Server
To launch both frontend and backend concurrently:
```bash
npm run dev
```
- **Frontend**: `http://localhost:5173`
- **Backend API**: `http://localhost:3001/api`

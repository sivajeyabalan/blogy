# Memories

A full‑stack social app to capture, share, and rediscover life moments.

## 📌 About

Memories is a modern web application where users can create posts with images, add tags, like and comment, and search across content. It includes secure authentication, responsive UI, and a production‑ready backend with file uploads and a relational database.

## ✨ End‑to‑End Features

- Authentication with email/password and Google OAuth (JWT based)
- Create, edit, delete posts with image uploads (Cloudinary)
- Like and comment on posts
- Search by text and tags, with pagination
- Optimized, responsive UI with Material‑UI
- Health check endpoint and robust error handling
- Database migrations and seed/reset scripts

## 🧰 Tech Stack

- Frontend: React, Vite, React Router, Redux, Redux Thunk, Redux Persist, Material‑UI (MUI), Axios
- Backend: Node.js, Express.js, JWT, Multer, Cloudinary
- Database: PostgreSQL (via postgres.js client)
- Deployment: Frontend → Vercel, Backend → Render (recommended)

## 📁 Project Structure

```
Memories-Project/
├── client/                # React frontend (Vite)
│   ├── src/
│   └── package.json
├── server/                # Express backend (ESM)
│   ├── config/            # cloudinary config
│   ├── controllers/       # route controllers
│   ├── database/          # sql client, schema, queries
│   ├── middleware/        # auth, upload
│   ├── routes/            # posts, users
│   ├── scripts/           # migrate/seed/test utilities
│   └── package.json
├── README.md              # Root readme (this file)
├── client/README.md       # Frontend documentation
└── server/README.md       # Backend documentation
```

## ⚙️ Installation

1.  Clone repository

```bash
git clone <your-repo-url>
cd Memories-Project
```

2.  Install dependencies

```bash
# Frontend
cd client && npm install

# Backend (in a separate shell or after the above)
cd ../server && npm install
```

3.  Configure environment variables (see the next section)

4.  Prepare database (backend)

```bash
cd server
npm run migrate   # create tables
npm run db:seed   # seed sample data (optional)
# or
node scripts/reset-and-seed.js  # wipe and seed realistic demo data
```

## 🔐 Environment Variables

Configure each app separately.

### Frontend (`client/.env`)

```env
VITE_API_BASE_URL=http://localhost:5000
# Optional: Google OAuth
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

### Backend (`server/.env`)

```env
# Server
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# Database (choose one approach)
DATABASE_URL=postgresql://USER:PASS@HOST:5432/DBNAME
# Or Render‑style variables (used to build the URL if DATABASE_URL is not provided)
PGHOST=your_host
PGPORT=5432
PGDB=your_db
PGUSER=your_user
PGPASSWORD=your_password
DB_CONNECTION_LIMIT=5

# Auth
JWT_SECRET=your_super_secret_jwt_key

# Cloudinary (image uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Refer to `client/README.md` and `server/README.md` for deeper details.

## ▶️ Usage (Local Development)

1.  Start the backend

```bash
cd server
npm run dev
# Server on http://localhost:5000
```

2.  Start the frontend

```bash
cd client
npm run dev
# Frontend on http://localhost:5173
```

The frontend is configured to call the backend at `VITE_API_BASE_URL`.

## 🌐 API Overview

- Base URL (local): `http://localhost:5000`
- Health check: `GET /health`
- Authentication: `POST /user/signup`, `POST /user/signin`, `POST /user/googleSignIn`
- Posts: `GET /posts`, `GET /posts/:id`, `POST /posts`, `PATCH /posts/:id`, `DELETE /posts/:id`, `PATCH /posts/:id/likePost`, `PATCH /posts/:id/commentPost`, `GET /posts/search`

For complete request/response details, see: `server/README.md`.

## 🧭 Workflow

```ascii
       [ User Browser ]
              |
              v
     [ Frontend: React + Vite ]
              |
       REST API calls (axios)
              |
              v
  [ Backend: Express + Node.js ]
              |
     SQL queries via postgres.js
              |
              v
       [ PostgreSQL DB ]

- Images: Uploaded from the frontend using multipart/form-data → handled by Multer → stored on Cloudinary (if creds present) or in-memory fallback.
- Auth: Frontend stores JWT (from `/user/signin` or `/user/signup`) in localStorage.
  - Subsequent API calls include `Authorization: Bearer <token>`.
- State: Redux manages UI state, posts cache, and auth user; Redux Persist keeps select slices across refreshes.
```

## 🖼️ Screenshots / Demo

![Home Feed](client/homepage.png)

![Create Post](client/createpost.png)

![Authentication](client/auth.png)

![Post Details](client/postdetail.png)

## 🚀 Deployment

Recommended setup:

- Frontend → Vercel
  - Build command: `npm run build`
  - Output directory: `dist`
  - Env: `VITE_API_BASE_URL` pointing to your backend URL
- Backend → Render (Web Service)
  - Start command: `npm start`
  - Env: all backend `.env` vars, including DB and Cloudinary
  - Add a Render PostgreSQL instance or external Postgres
- Database → Managed PostgreSQL (Render, Railway, Supabase, Neon, etc.)

Notes:

- Update CORS `FRONTEND_URL` in the backend `.env` for production domain(s).
- Ensure JWT secret is strong and kept private.
- Configure Cloudinary keys for production image uploads.

## 🤝 Contributing

1.  Fork the repo
2.  Create a feature branch: `git checkout -b feat/awesome`
3.  Commit changes: `git commit -m "feat: add awesome thing"`
4.  Push: `git push origin feat/awesome`
5.  Open a Pull Request

## 📄 License

MIT

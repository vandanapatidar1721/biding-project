# Deploy RegripBid (Frontend + Backend) Online

Your app needs:
- **Frontend:** Static files (Vite build) + API URL pointing to backend
- **Backend:** Node.js, **MySQL**, **Redis**, env vars (DATABASE_URL, REDIS_URL, JWT_SECRET)

Below are two simple options. Option A is usually the fastest.

---

## Option A: Vercel (Frontend) + Railway (Backend + MySQL + Redis)

### 1. Deploy Backend on Railway

1. Go to [railway.app](https://railway.app) and sign in (e.g. with GitHub).
2. **New Project** → **Deploy from GitHub repo** → select your repo.
3. Railway will detect the repo. You need to deploy the **backend** only:
   - Either use a **monorepo** setup: set **Root Directory** to `backend` in the service settings.
   - Or push only the `backend` folder to a separate repo and connect that repo.
4. Add **MySQL** and **Redis**:
   - In the project: **+ New** → **Database** → **MySQL** (and again for **Redis**).
   - Railway will give you URLs. Copy the **MySQL** connection URL and the **Redis** URL.
5. Add **Environment Variables** for the backend service:
   - `DATABASE_URL` = MySQL connection string (from Railway MySQL)
   - `REDIS_URL` = Redis URL (from Railway Redis)
   - `JWT_SECRET` = a long random string (e.g. generate with `openssl rand -base64 32`)
   - `PORT` = Railway sets this automatically; you can leave it unset.
6. Set **Build & Start** (if using Root Directory `backend`):
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start` (runs `node dist/server.js`)
   - **Root Directory:** `backend`
7. Deploy. After deploy, open the service → **Settings** → **Generate Domain**. Copy the URL (e.g. `https://your-backend.up.railway.app`). This is your **backend URL**.

**Docker on Railway (alternative):** You can use your existing `backend/Dockerfile`. In the same project, add a service from the same repo, set **Root Directory** to `backend`, and set **Dockerfile Path** to `Dockerfile`. Add the same env vars above.

---

### 2. Deploy Frontend on Vercel

1. Go to [vercel.com](https://vercel.com) and sign in (e.g. with GitHub).
2. **Add New** → **Project** → import your **GitHub repo**.
3. Configure the project:
   - **Root Directory:** `frontend` (click **Edit** and set to `frontend`).
   - **Framework Preset:** Vite (should be auto-detected).
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. **Environment Variables** (important for production):
   - **Key:** `VITE_API_URL`  
   - **Value:** your backend URL from step 1, e.g. `https://your-backend.up.railway.app`  
   - (No trailing slash.)
5. Deploy. Vercel will give you a URL like `https://your-app.vercel.app`. The frontend will call your backend at `VITE_API_URL`.

**Note:** `VITE_*` variables are baked in at **build time**. If you change `VITE_API_URL`, redeploy the frontend.

---

## Option B: Netlify (Frontend) + Render (Backend)

### 1. Backend on Render

1. Go to [render.com](https://render.com) and sign in.
2. **New** → **Web Service** → connect your GitHub repo.
3. Settings:
   - **Root Directory:** `backend`
   - **Runtime:** Node
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
4. Add **MySQL** and **Redis**:
   - Use **Render** add-ons if available, or use external services:
     - **MySQL:** e.g. [PlanetScale](https://planetscale.com) (free tier) or [Railway MySQL](https://railway.app).
     - **Redis:** e.g. [Upstash](https://upstash.com) (free tier) or [Redis Cloud](https://redis.com/try-free/).
5. **Environment** on the Web Service:
   - `DATABASE_URL` = your MySQL connection string
   - `REDIS_URL` = your Redis URL
   - `JWT_SECRET` = long random string
6. Deploy and copy the service URL (e.g. `https://your-backend.onrender.com`).

### 2. Frontend on Netlify

1. Go to [netlify.com](https://netlify.com) and sign in.
2. **Add new site** → **Import an existing project** → connect your repo.
3. Settings:
   - **Base directory:** `frontend`
   - **Build command:** `npm run build`
   - **Publish directory:** `frontend/dist`
4. **Environment variables:**
   - `VITE_API_URL` = your Render backend URL (e.g. `https://your-backend.onrender.com`)
5. Deploy.

---

## Checklist (any option)

| Where        | Variable        | Example / Note                                      |
|-------------|------------------|-----------------------------------------------------|
| Backend     | `DATABASE_URL`   | `mysql://user:pass@host:3306/dbname`                |
| Backend     | `REDIS_URL`      | `redis://default:pass@host:port` or Upstash URL     |
| Backend     | `JWT_SECRET`     | Long random string (e.g. `openssl rand -base64 32`) |
| Backend     | `PORT`           | Often set by platform (Railway, Render); optional   |
| Frontend    | `VITE_API_URL`   | Full backend URL, e.g. `https://api.yoursite.com`   |

- **CORS:** Your backend uses `origin: '*'`, so the frontend domain is allowed. For production you can later restrict this to your frontend URL only.
- **HTTPS:** Use HTTPS URLs for `VITE_API_URL` and for any database/Redis URLs when the provider supports it.

---

## Quick reference

- **Frontend build:** From repo root, `cd frontend && npm run build` → output in `frontend/dist`.  
- **Backend start:** From repo root, `cd backend && npm run build && npm start` (or use your Dockerfile).  
- **Backend URL** must be set in frontend as `VITE_API_URL` at build time so the deployed app talks to your deployed backend.

After deployment, test: open the frontend URL → sign up → create an auction (admin) → place a bid (dealer).

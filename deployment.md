# Deployment Instructions

This guide provides steps to deploy your jewellery marketplace application to **Render** and **Vercel**.

## 1. Deploying to Render (Full Stack)
Render is ideal for this project because it can host both your Node.js backend and your React frontend as a single service.

### Steps:
1.  **Prepare your Repository**:
    *   Ensure your `package.json` in the root directory has a script to build the frontend and start the backend. (I have already set this up or verified).
2.  **Create a New Web Service on Render**:
    *   Go to [Render Dashboard](https://dashboard.render.com/) and click **New +** > **Web Service**.
    *   Connect your GitHub/GitLab repository.
3.  **Configure Build & Deploy Settings**:
    *   **Name**: `jewellery-app` (or your choice).
    *   **Environment**: `Node`.
    *   **Build Command**: `cd frontend && npm install && npm run build && cd ../backend && npm install`.
    *   **Start Command**: `cd backend && node server.js`.
4.  **Add Environment Variables**:
    *   Click the **Environment** tab.
    *   Add the following:
        *   `METAL_PRICE_API_KEY`: Your API key.
        *   `NEWS_API_KEY`: Your news API key.
        *   `PORT`: `5000` (Render will override this, but it's good practice).
        *   `CACHE_DURATION_HOURS`: `24` (as per requirement).
5.  **Deploy**: Click **Create Web Service**.

---

## 2. Deploying to Vercel (Frontend + Serverless)
Vercel is great for frontend-heavy apps. For the backend, you would typically use Vercel Functions.

### Option A: Frontend Only
If you only want to deploy the frontend to Vercel and keep the backend elsewhere (like Render):
1.  Connect your repo to Vercel.
2.  Set the **Root Directory** to `frontend`.
3.  Vercel will auto-detect Vite settings.
4.  Add environment variables for any frontend-specific keys.

### Option B: Full Stack on Vercel
Vercel requires a specific structure for backend (placing files in `/api`). Your current backend is a monolithic Express app.
*   **Recommendation**: Use Render for the full stack. If you MUST use Vercel for the backend, you'll need to refactor `backend/server.js` into Vercel Serverless Functions.

---

## Comparison: Render vs. Vercel

| Feature | Render (Recommended) | Vercel |
| :--- | :--- | :--- |
| **Backend Support** | Native Node.js (Express) | Serverless Functions |
| **Database** | Easy PostgreSQL integration | PlanetScale/Vercel Postgres |
| **Ease of Setup** | High (for monolithic Express) | Medium (requires refactor for backend) |
| **Cost** | Free tier available | Free tier available |

### Final Recommendation
For this specific project structure (Express Backend + Vite Frontend), **Render** is the easiest and most robust choice. It allows you to run the persistent cache logic seamlessly.

> [!IMPORTANT]
> Since Render's free tier spins down after inactivity, your `metal-cache.json` might be lost on restarts if not using a persistent disk. For a small project, this is fine as it will just fetch fresh data on restart.


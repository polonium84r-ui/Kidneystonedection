# Deployment Guide: Free Tier Hosting

This guide explains how to deploy the **Heart Angiography Detection System** for free using the following stack:
- **Frontend:** Vercel (Free & Fast)
- **Backend:** Render.com (Free Web Service)
- **Database:** MongoDB Atlas (Free Sandbox Tier)

---

## Phase 1: Database Setup (MongoDB Atlas)

1.  Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) and sign up/login.
2.  Create a new **Project**.
3.  Click **Build a Database** and select the **FREE** (Shared) option.
4.  **Cluster Settings:**
    -   Provider: AWS
    -   Region: Pick one close to you (e.g., N. Virginia).
    -   Name: `Cluster0` (default is fine).
    -   Click **Create**.
5.  **Security Quickstart:**
    -   **Username/Password:** Create a database user (e.g., `admin` / `securepassword123`). **Write this down!**
    -   **IP Access List:** Add `0.0.0.0/0` (Allow Access from Anywhere) so Render can connect to it.
    -   Click **Finish and Close**.
6.  **Get Connection String:**
    -   Click **Connect** > **Drivers** (Node.js).
    -   Copy the connection string. It looks like:
        `mongodb+srv://admin:<password>@cluster0.abcde.mongodb.net/?retryWrites=true&w=majority`
    -   Replace `<password>` with your actual password.

---

## Phase 2: Backend Deployment (Render.com)

1.  Push your code to **GitHub** if you haven't already.
2.  Go to [Render.com](https://render.com/) and sign up.
3.  Click **New +** > **Web Service**.
4.  Connect your GitHub repository.
5.  **Configure the Service:**
    -   **Name:** `blood-angio-backend`
    -   **Region:** Matches your MongoDB region (e.g., US East).
    -   **Branch:** `main` (or master).
    -   **Root Directory:** `blood angio` (This is important! Because your server code is inside this folder).
    -   **Runtime:** Node
    -   **Build Command:** `npm install`
    -   **Start Command:** `npm run server`
    -   **Instance Type:** Free
6.  **Environment Variables:**
    Scroll down to "Environment Variables" and add these:
    -   `NODE_ENV`: `production`
    -   `MONGO_URI`: (Paste your MongoDB connection string from Phase 1)
    -   `JWT_SECRET`: (Create a random long string, e.g., `mysecretkey12345`)
    -   `VITE_ROBOFLOW_API_KEY`: `R8FMaPoYSNTZ8c7cw4aa`
7.  Click **Create Web Service**.
8.  Wait for deployment to finish. Render will give you a URL like: `https://blood-angio-backend.onrender.com`. **Copy this URL.**

---

## Phase 3: Frontend Deployment (Vercel)

1.  Go to [Vercel.com](https://vercel.com/) and sign up.
2.  Click **Add New...** > **Project**.
3.  Import your GitHub repository.
4.  **Project Settings:**
    -   **Framework Preset:** Vite
    -   **Root Directory:** Click "Edit" and select `blood angio`.
5.  **Environment Variables:**
    -   `VITE_API_URL`: Paste your **Render Backend URL** (e.g., `https://blood-angio-backend.onrender.com`).
        *   *Note: Do not add a trailing slash `/` at the end.*
    -   `VITE_ROBOFLOW_API_KEY`: `R8FMaPoYSNTZ8c7cw4aa` (Optional if hardcoded, but good practice).
6.  Click **Deploy**.

---

## Phase 4: Final Connection Check

1.  Open your new **Vercel URL** (e.g., `https://blood-angio.vercel.app`).
2.  Try to **Log In** with the Admin account:
    -   Email: `radarprojects.com`
    -   Password: `Radar@2028`
3.  If it works, you are live! 🚀

---

## Troubleshooting

-   **Login Fails?** check the Network tab in your browser's Developer Tools (F12).
    -   If the request URL is `localhost`, you didn't set `VITE_API_URL` correctly in Vercel.
    -   If the request URL is correct but fails, check the Render logs for database connection errors.
-   **"Server Error" on Render?** Check Render logs. Did you whitelist `0.0.0.0/0` in MongoDB Network Access?

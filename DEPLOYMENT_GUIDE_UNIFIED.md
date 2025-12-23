# Unified Deployment Guide: One Service + Database

Great news! The application has been refactored to run as a **Single Service**. 
This means you **do not** need separate hosting for the frontend. You can host both the website and the API on one platform.

**Total Platforms Used:**
1.  **Render:** Hosts your App (Frontend + Backend) - **FREE**
2.  **MongoDB Atlas:** Hosts your Database - **FREE**

*(Note: Hosting the database on the same free instance as the app is not recommended because free "app" instances sleep and lose data. MongoDB Atlas is the best free permanent storage.)*

---

## Phase 1: Database Setup (MongoDB Atlas) -- SAME AS BEFORE

1.  Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register).
2.  Create a **Free Cluster**.
3.  Create a Database User (`admin`/`password`).
4.  Allow Network Access (`0.0.0.0/0`).
5.  **Copy your Connection String:**
    `mongodb+srv://admin:<password>@cluster0.abcde.mongodb.net/?retryWrites=true&w=majority`

---

## Phase 2: Deploy Unified App (Render)

1.  Push your latest code to **GitHub**.
2.  Log in to [Render.com](https://render.com/).
3.  Click **New +** -> **Web Service**.
4.  Connect your GitHub repo.
5.  **Settings:**
    -   **Name:** `blood-angio-app`
    -   **Runtime:** `Node`
    -   **Build Command:** `npm install && npm run build`
        *(This installs dependencies AND builds the frontend)*
    -   **Start Command:** `npm start`
    -   **Instance Type:** Free
6.  **Environment Variables:**
    -   `NODE_ENV`: `production`
    -   `MONGO_URI`: (Paste your connection string)
    -   `JWT_SECRET`: (Any secure secret key)
    -   `VITE_ROBOFLOW_API_KEY`: `R8FMaPoYSNTZ8c7cw4aa`
    
    *(Note: You do NOT need VITE_API_URL anymore because the frontend and backend are on the same server!)*

7.  Click **Create Web Service**.

**Done!** Your app will be live at `https://blood-angio-app.onrender.com`.

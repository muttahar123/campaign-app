# Campaign Management System

A full-stack Advertising Agency Campaign Management System with integrated AI features, real-time notifications, and a responsive dashboard.

## 🚀 Live Demo
- **Frontend**: [https://campaign-app-theta.vercel.app/](https://campaign-app-theta.vercel.app/)
*(Note: Ensure the backend is running to see live data and AI features.)*

## 🛠 Tech Stack
- **Frontend**: React, Tailwind CSS, Recharts, Socket.io-client.
- **Backend**: Node.js, Express, PostgreSQL, Socket.io.
- **AI**: OpenAI API (with Gemini fallback capability).
- **Infrastructure**: Docker & Docker Compose.

---

## 🏗 Project Structure
- `/src`: Backend Node.js Express API (Controllers, Models, Routes).
- `/frontend`: React application (Vite-based).
- `docker-compose.yml`: Infrastructure orchestration.

---

## ⚙️ Local Setup

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [Docker & Docker Compose](https://www.docker.com/products/docker-desktop/)

### 2. Environment Configuration
Create a `.env` file in the **project root** directory:

```env
PORT=4000
DATABASE_URL=postgres://demo_user:password@localhost:5433/campaign_db
JWT_SECRET=your_secret_key_here
OPENAI_API_KEY=sk-your-openai-key
GEMINI_API_KEY=your-gemini-key
```

> [!IMPORTANT]
> **API Key Update:** You MUST update the `OPENAI_API_KEY` in the root `.env` for the AI Suite (Creative Brief, Social Generator) to function.

### 3. Run with Docker (Recommended)
This will start both the PostgreSQL database and the Backend API on port 4000.

```bash
docker-compose up --build
```

---

## 🧪 User Flow & Testing Guide
Follow these steps to test the full-stack integration:

### 1. Authentication Flow
- **Register**: Go to the login screen, click "Create an account", and register a new user.
- **Login**: Use your credentials to log in. This stores a JWT in your browser for secure API access.

### 2. Campaign Management (CRUD)
- **Create**: Navigate to "Campaigns" and click "New Campaign". Fill in the name, client, and a budget (e.g., $1000).
- **Dashboard**: Go to the "Dashboard" to see the KPI cards (Impressions, Spend, CTR) update based on your active campaigns.

### 3. Real-time Budget Alerts (WebSockets)
- Find your campaign in the table and click **Edit**.
- Set the **Spend** to something greater than 90% of the budget (e.g., Spend $950 for a $1000 budget).
- Click **Save**.
- **Result**: A real-time notification will appear in the top-right "Bell" icon immediately, triggered by the backend logic and sent via Socket.io.

### 4. AI Builder Suite
- **Creative Brief**: Input your product and goal. Watch the AI stream the brief content in real-time.
- **Social Media**: Generate platform-specific captions with one click.
- **Hashtags**: Generate 10 SEO-optimized hashtags based on your content.

---

## 🌍 Deployment Guide

### Backend Deployment (Node.js + Postgres)
Since the frontend is on Vercel, you need a hosting provider for the API and Database.

#### Recommended: **Render** or **Railway**
1. **Database**: Create a PostgreSQL instance on Render/Railway.
2. **API**: 
   - Connect your GitHub repo.
   - Set the root directory to `/`.
   - Set build command to `npm install`.
   - Set start command to `node src/index.js`.
3. **Environment Variables**: Add `DATABASE_URL`, `JWT_SECRET`, and `OPENAI_API_KEY` to the provider's dashboard.

### Frontend Deployment (Vercel)
- **Root Directory**: `frontend/`
- Ensure `VITE_API_BASE_URL` in Vercel settings points to your deployed backend.

---

## 📜 Database Schema
The database is initialized via `src/db/schema.sql`.

- **Users**: Auth and profile data.
- **Campaigns**: Performance metrics and budget tracking.
- **Alerts**: Persistent history of budget threshold violations.

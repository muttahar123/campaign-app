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
- `/frontend`: React application (Vite-based).
- `/backend`: Node.js Express API and Database models.
- `docker-compose.yml`: Local infrastructure orchestration.

---

## ⚙️ Local Setup

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [Docker & Docker Compose](https://www.docker.com/products/docker-desktop/)

### 2. Environment Configuration
Create a `.env` file in the `backend/` directory (use the existing one or copy the template):

```env
PORT=4000
DATABASE_URL=postgres://demo_user:password@localhost:5433/campaign_db
JWT_SECRET=your_secret_key_here
OPENAI_API_KEY=sk-your-openai-key
GEMINI_API_KEY=your-gemini-key
```

> [!IMPORTANT]
> **API Key Update:** You MUST update the `OPENAI_API_KEY` or `GEMINI_API_KEY` in `backend/.env` for the AI Suite (Creative Brief, Social Generator) to function.

### 3. Run with Docker (Recommended)
This will start both the PostgreSQL database and the Backend API on port 4000.

```bash
docker-compose up --build
```

### 4. Running Manually
If you want to run the backend without Docker (ensure you have a local Postgres instance on port 5433):

```bash
cd backend
npm install
npm run dev
```

For the frontend:

```bash
cd frontend
npm install
npm run dev
```

---

## 🌍 Deployment Guide

### Backend Deployment (Node.js + Postgres)
Since the frontend is on Vercel, you need a hosting provider for the API and Database.

#### Recommended: **Render** or **Railway**
1. **Database**: Create a PostgreSQL instance on Render/Railway.
2. **API**: 
   - Connect your GitHub repo.
   - Set the root directory to `backend/`.
   - Set build command to `npm install`.
   - Set start command to `node src/index.js`.
3. **Environment Variables**: Add `DATABASE_URL`, `JWT_SECRET`, and `OPENAI_API_KEY` to the provider's dashboard.

### Frontend Deployment (Vercel)
If you need to redeploy or update:
1. Ensure the `VITE_API_BASE_URL` in your frontend points to your deployed backend URL (e.g., `https://your-api.onrender.com`).
2. Deploy the `frontend/` folder to Vercel.

---

## 📝 Features
- **Dashboard**: Real-time KPIs and performance charts using Recharts.
- **CRUD**: Full Create, Read, Update, Delete for campaigns with PostgreSQL.
- **AI Suite**: Generate Creative Briefs (SSE Stream), Social Captions, and Hashtags.
- **Real-Time Alerts**: Budget threshold notifications via WebSockets.
- **Responsive UI**: Polished mobile-first design with a floating sidebar.

---

## 📜 Database Schema
The database is initialized automatically via Docker using `backend/src/db/schema.sql`.

- **Users**: Authentication and JWT handling.
- **Campaigns**: Storage for metrics (Impressions, Spend, Conversions).
- **Alerts**: Persistence for budget threshold violations.

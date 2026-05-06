# BrokeBoy. — Cinematic Student Finance 💸

**BrokeBoy.** is a premium, full-stack expense tracking application designed specifically for students who want to manage their money with style. It moves away from boring spreadsheets and into a high-fidelity, interactive "Bento-style" dashboard experience.

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-black?style=for-the-badge&logo=framer&logoColor=blue)

---

## ✨ Features

- **Bento Dashboard:** A beautiful, grid-based layout that organizes your financial life into clean, interactive modules.
- **Interactive Glass Wallet:** A physics-enabled, draggable wallet card that feels tactile and alive.
- **Animated Budget Ring:** A GSAP-driven visual gauge that tracks your monthly limit with real-time color shifts.
- **Market News Engine:** Stay informed with a live feed of the latest business, crypto, and fintech news.
- **Premium Cinematic UI:** Dark glassmorphism aesthetics, dynamic "Align" inspired typography, and smooth micro-animations.
- **Optimistic CRUD:** Instant UI updates for adding/deleting expenses while the MongoDB backend syncs in the background.

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB Atlas connection string (or a local MongoDB instance)

### 1. Backend Setup
1. Open terminal and navigate to the `server` directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Setup environment variables:
   Copy `.env.example` to `.env` and fill in your connection string.
   ```bash
   cp .env.example .env
   ```
4. Start the server:
   ```bash
   node server.js
   ```

### 2. Frontend Setup
1. Open a new terminal and navigate to the `client` directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Setup environment variables:
   Copy `.env.example` to `.env` and configure your API URL.
   ```bash
   cp .env.example .env
   ```
4. Start the Vite development server:
   ```bash
   npm run dev
   ```

---

## 🔌 API Endpoints

All endpoints are prefixed with `/api/expenses`.

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | Fetch all expenses (sorted by date desc). |
| `POST` | `/` | Create a new expense. Expects `{ title, amount, category, date }`. |
| `DELETE` | `/:id` | Delete expense by its MongoDB `_id`. |

---

## 🌐 Deployment Notes

### Backend (Render)
- **Build command:** `npm install`
- **Start command:** `node server.js`
- **Environment Variables:** Add `MONGO_URI` to connect to MongoDB Atlas.

### Frontend (Vercel)
- **Root dir:** `client/`
- **Build command:** `npm run build`
- **Output dir:** `dist/`
- **Environment Variables:** Add `VITE_API_URL` pointing to your deployed Render backend.

### Database (MongoDB Atlas)
- Use a Free M0 cluster.
- Under **Network Access**, ensure you allow connections from anywhere (`0.0.0.0/0`) if using serverless deployment or configure it for your Render IP.

---

## 📸 Screenshots

*(Replace with actual screenshots of your deployed app)*
- **Dashboard:** Showcasing the 3D tilted expense cards and animated summary.
- **Adding an Expense:** Showcasing the glassmorphism bottom-sheet form.

---

## 🔗 Live Demo

*(Placeholder for Vercel/Render deployed link)*

---

## 📜 License
MIT

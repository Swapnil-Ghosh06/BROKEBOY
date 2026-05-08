# 🛠️ BrokeBoy Tech Stack & Architecture

This document outlines the technologies, frameworks, and services used to build the **BrokeBoy** student fintech dashboard.

---

## 🎨 Frontend (Client)
A premium, dark-mode-first interface built for performance and aesthetics.

- **Framework**: [React 19](https://react.dev/) (Functional Components, Hooks)
- **Build Tool**: [Vite](https://vitejs.dev/) (Lightning-fast HMR and bundling)
- **Styling**: 
  - **Tailwind CSS v4**: Modern utility-first styling.
  - **Glassmorphism**: Custom CSS for frosted-glass effects.
- **Animations**:
  - **Framer Motion**: Smooth entry/exit transitions and layout animations.
  - **GSAP**: High-performance scroll-triggered and SVG animations.
- **Icons**: [Lucide React](https://lucide.dev/) (Clean, consistent icon set)
- **State Management**: React `useState` & `useEffect` (Lightweight local state).
- **HTTP Client**: [Axios](https://axios-http.com/) (API communication).

---

## ⚙️ Backend (Server)
A robust RESTful API built to handle student expense logging.

- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js v5](https://expressjs.com/) (Minimalist web framework)
- **Database Wrapper**: [Mongoose](https://mongoosejs.com/) (Object Modeling for MongoDB)
- **Middleware**:
    - `cors`: For Cross-Origin Resource Sharing.
    - `express.json()`: For parsing incoming JSON payloads.
    - `dotenv`: For secure environment variable management.

---

## 🗄️ Database
- **Primary DB**: [MongoDB Atlas](https://www.mongodb.com/atlas/database) (Cloud NoSQL database).
- **Fallback**: **In-Memory Mock Mode** (Ensures the app remains functional even if DB connection fails).

---

## 🌐 External APIs & Services
- **News Engine**: [RSS2JSON](https://rss2json.com/) (Used to fetch and parse MoneyControl business RSS feeds).
- **Images**: [Unsplash](https://unsplash.com/) (Dynamic financial imagery for news articles).
- **Fonts**: [Google Fonts](https://fonts.google.com/) (Inter, Outfit, or similar high-fidelity typography).

---

## 🚀 Deployment & DevOps
- **Hosting**: [Vercel](https://vercel.com/) (Frontend & Backend Serverless Functions).
- **CI/CD**: Integrated with GitHub for automatic deployments on push.
- **Serverless**: Backend is configured to run as Vercel Serverless Functions (via `vercel.json`).

---

## 🛠️ Tooling & DX
- **Concurrent Execution**: `concurrently` (Runs both client and server during development).
- **Linting**: [ESLint](https://eslint.org/) (Code quality and consistency).
- **Environment Variables**: Managed via `.env` files (locally) and Vercel dashboard (production).

---

## ✨ Design Philosophy
- **Bento Box Layout**: Modular dashboard sections for better information hierarchy.
- **Dark Glassmorphism**: High contrast with subtle transparency and blur.
- **Interactive UI**: Micro-animations on hover, focus, and state changes to elevate the "premium" feel.

---
*"Code is craft. Ship with intention."* ⚡

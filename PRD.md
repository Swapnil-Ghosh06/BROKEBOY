# 🍱 BrokeBoy. — Product Requirements Document (PRD) v2.0
**The Cinematic Personal Finance Experience for Gen-Z**

---

## 1. Executive Summary
**BrokeBoy.** is a high-fidelity, full-stack personal finance application designed to disrupt the clinical and boring nature of traditional expense trackers. Built for students and design-conscious young professionals, it combines premium "Align"-inspired aesthetics with a friction-free "Bento" dashboard. The goal is to make managing a "zero balance" feel like a luxury experience through motion design, glassmorphism, and brutalist typography.

---

## 2. Problem Statement
Existing personal finance tools are built with a "utility-first" mindset, resulting in:
- **Low Engagement**: Users find tracking expenses a chore due to spreadsheet-like interfaces.
- **Visual Fatigue**: Information overload and lack of personality lead to "app abandonment."
- **Lack of Context**: Apps track numbers but don't provide market context or educational value.

---

## 3. Product Vision & Goals
### Vision
To create a financial tool so beautiful and tactile that users *want* to log their expenses just to interact with the UI.

### Key Goals
- **Frictionless Logging**: Add an expense in under 3 seconds.
- **Cinematic Experience**: Every interaction (hover, click, scroll) must trigger a high-quality micro-animation.
- **Financial Literacy**: Bridge the gap between daily spending and global market awareness.
- **Aesthetic Authority**: Establish a unique monochrome, glassmorphism design language that feels "expensive."

---

## 4. Functional Requirements

### 4.1 Bento Dashboard (Core UI)
- **Module Grid**: A responsive grid system (Bento style) that organizes stats into high-contrast blocks.
- **Budget Progress Ring**: A GSAP-animated gauge that visually represents spending vs. limit.
- **Dynamic Color States**: The UI should shift subtle tones (from white to muted red) based on spending intensity.

### 4.2 Interactive Glass Wallet
- **Physics-Based Interaction**: A draggable, floating wallet card powered by Framer Motion.
- **Real-Time Balance**: Instant reflection of current funds based on initial balance minus total expenses.
- **Global Actions**: Quick-access buttons for setting monthly limits and adding funds.

### 4.3 Market News Engine
- **RSS Integration**: Fetches real-time headlines from top financial sources (MoneyControl, etc.).
- **Fallback Content**: Curated, high-value fallback articles to ensure zero "empty states."
- **Category Awareness**: News focused on Fintech, Crypto, Tech Stocks, and Global Markets.

### 4.4 Expense Management (CRUD)
- **Optimistic UI**: List updates instantly before the database confirms the transaction.
- **Categorization**: Auto-tagging or easy selection of categories (Food, Travel, Tech, etc.).
- **Delete with Motion**: Cards should animate out of existence (shrink + fade) using Framer Motion layout transitions.

---

## 5. Non-Functional Requirements

### 5.1 Performance
- **Zero Latency UI**: Animations must run at 60fps even on mobile devices.
- **Vite-Powered**: Fast HMR and optimized build chunks for quick initial load.

### 5.2 Scalability
- **Monorepo Architecture**: Clean separation between Client (Vite/React) and Server (Node/Express).
- **Mongoose Schema**: Flexible enough to add user accounts and multi-currency support in the future.

---

## 6. Design & Aesthetic Specification

### 6.1 Typography
- **Headings**: *Plus Jakarta Sans* (Extra Bold, Tracking-Tight).
- **Body/UI**: *Inter* (Medium, consistent with modern tech standards).

### 6.2 Color Palette
- **Primary**: `#0a0a0a` (Deep Charcoal/Black)
- **Accents**: Pure White (`#ffffff`), Muted Gray (`#ffffff/40`)
- **Glows**: Subtle neon glows (Blue, Orange, Purple) for category identification.

### 6.3 Materials
- **Glassmorphism**: `backdrop-filter: blur(20px)` for all card elements.
- **Monochrome Brutalism**: High contrast, sharp edges, and bold weights.

---

## 7. Future Roadmap (The "Vision 3.0")
- **AI Insights**: Use local LLMs to suggest where a student can save money based on spending patterns.
- **Gamification**: Badges for "Savings Streaks" and "Market Guru" status.
- **Multi-User Hubs**: Shared "House/Flat" budgets for roommates.
- **Crypto Wallet Integration**: Real-time tracking of on-chain assets alongside fiat.

---

## 8. Success Metrics
- **Retention**: Daily active users (DAU) checking the dashboard.
- **Input Frequency**: Number of expenses logged per user per week.
- **Viral Factor**: Social shares of the "Cinematic UI" recording.

---

*PRD Created by Swapnil Ghosh | BrokeBoy. Cinematic Fintech*

Build me a full-stack **Student Expense Tracker** web application. This is a college final assessment project — it needs to look like a premium, hand-crafted app, not a tutorial CRUD demo. I want it to feel like a real fintech product built specifically for broke students.

---

## 🧱 STACK

**Frontend:** React (Vite) + Tailwind CSS + Framer Motion + GSAP
**Backend:** Node.js + Express.js
**Database:** MongoDB (Mongoose)
**HTTP:** Axios
**Icons:** Lucide React
**Deployment-ready for:** Vercel (frontend) + Render (backend) + MongoDB Atlas

---

## ✅ CORE FEATURES

The app must support exactly these three operations:

1. **Add Expense** — form with fields: Title, Amount (₹), Category, Date
2. **View Expenses** — list all expenses, newest first, with total at top
3. **Delete Expense** — delete by ID, with card exit animation

Categories (use these exact values as the enum in MongoDB):
`Food`, `Travel`, `Coffee`, `Shopping`, `Entertainment`, `Other`

Each category gets its own emoji and color accent:
- Food 🍕 → orange
- Travel 🚗 → sky blue
- Coffee ☕ → amber
- Shopping 🛍️ → pink
- Entertainment 🎮 → purple
- Other 📦 → slate

---

## 🗂️ PROJECT STRUCTURE

```
student-expense-tracker/
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ExpenseForm.jsx       ← slide-up add form
│   │   │   ├── ExpenseList.jsx       ← animated list container
│   │   │   ├── ExpenseCard.jsx       ← individual card with 3D hover tilt
│   │   │   └── SummaryBar.jsx        ← total + category breakdown
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── vite.config.js
│   └── package.json
│
├── server/
│   ├── models/Expense.js
│   ├── routes/expenses.js
│   ├── server.js
│   ├── .env.example
│   └── package.json
│
└── README.md
```

---

## 🔌 API SPECIFICATION

All routes under `/api/expenses`

```
GET    /api/expenses          → return all expenses (sorted by date desc)
POST   /api/expenses          → create expense { title, amount, category, date }
DELETE /api/expenses/:id      → delete by MongoDB _id
```

**Mongoose Schema:**
```js
{
  title:    { type: String, required: true },
  amount:   { type: Number, required: true, min: 0 },
  category: { type: String, enum: ['Food','Travel','Coffee','Shopping','Entertainment','Other'], required: true },
  date:     { type: Date, default: Date.now },
  createdAt:{ type: Date, default: Date.now }
}
```

**Response envelope:**
```json
{ "success": true, "data": { ... } }
```

**CORS:** Allow all origins in dev. In prod, allow only the Vercel frontend URL.

**server.js must:**
- Load dotenv
- Connect to MongoDB via `process.env.MONGO_URI`
- Serve on `process.env.PORT || 5000`
- Include `/api/expenses` router
- Export nothing (standalone server)

---

## 🎨 VISUAL DESIGN — THIS IS THE MOST IMPORTANT PART

> Design direction: **Dark Glassmorphism Fintech**. Like a premium crypto wallet crossed with a student planner. Hand-crafted, not Bootstrap.

### Color Palette (CSS variables)
```css
--bg:        #080c14;
--surface:   rgba(255,255,255,0.04);
--border:    rgba(255,255,255,0.08);
--accent:    #3b8ef3;
--yellow:    #f5c842;
--text:      #f0f4ff;
--muted:     rgba(255,255,255,0.45);
```

### Background
- Base: `#080c14`
- Layered on top: an SVG dot grid or subtle noise texture at 4% opacity
- Two large radial glow orbs (blue + slightly cyan), fixed position, blur 120px — adds depth like light sources behind the UI

### Typography
- Headings: `Syne` (Google Fonts) — bold, geometric, distinctive
- Body / data: `DM Sans` — clean and friendly
- Numbers / amounts: `JetBrains Mono` — monospace, gives a financial data feel

### Layout
- Single-page app, no routing needed
- Max width: 480px, centered (mobile-first card feel)
- Or full-width with a centered content column — your call, make it look good

### Components

**SummaryBar:**
- Shows "Total Spent: ₹X,XXX" in large Syne font
- The ₹ amount animates up with GSAP `countTo` on load and every new addition
- Below it: mini pills for each category showing spend

**ExpenseForm:**
- Floating "+ Add Expense" button fixed to the bottom right (FAB)
- Click it → glassmorphism panel slides up from bottom (Framer Motion `y: 100 → 0`, opacity 0→1)
- Fields: Title input, Amount input (₹ prefix), Category selector (styled chips, NOT a default select), Date picker
- Submit button: full-width, glowing on hover, gradient `#3b8ef3 → #1a63c4`
- On submit: optimistic UI update, form slides back down

**ExpenseCard:**
- Glassmorphism card: `background: rgba(255,255,255,0.04)`, `backdrop-filter: blur(16px)`, `border: 1px solid rgba(255,255,255,0.08)`, `border-radius: 16px`
- Left accent bar (4px wide, full height) in category color
- 3D tilt on hover using CSS `perspective` + JS `mousemove` listener (or VanillaTilt if you want to npm install it)
- Shows: category emoji + category name, title, date (formatted nicely), amount in JetBrains Mono
- Delete button: top-right corner, appears on hover as a subtle ✕ icon, red on hover
- On delete: Framer Motion `AnimatePresence` — card scales to 0.8 and fades out

**ExpenseList:**
- `AnimatePresence` wraps all cards
- On page load: cards stagger in using GSAP `stagger` (0.08s between each), sliding up from y:20 with opacity 0→1
- Empty state: centered illustration (SVG or emoji-based) + "No expenses yet. Start adding! ☕"

---

## ⚡ ANIMATIONS — BE SPECIFIC

Use **GSAP** for:
- Initial page load animation: logo/title drops in, summary bar counts up, expense list staggers in
- The ₹ total counter (tweening a number)

Use **Framer Motion** for:
- Form panel slide up/down
- Card enter: `initial={{ opacity: 0, y: 20 }}` → `animate={{ opacity: 1, y: 0 }}`
- Card exit via `AnimatePresence`: `exit={{ opacity: 0, scale: 0.85, x: 40 }}`
- Delete button appear: `whileHover` scale

Use **CSS transitions** for:
- Card tilt (transform with perspective)
- Button hover glows (`box-shadow` transition)
- Category chip selection state

---

## 🌐 ENVIRONMENT & CONFIG

**server/.env.example**
```
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/expensetracker?retryWrites=true&w=majority
```

**client/.env.example**
```
VITE_API_URL=http://localhost:5000
```

In Axios calls use: `import.meta.env.VITE_API_URL` as the base URL.

---

## 📦 PACKAGE REQUIREMENTS

**server/package.json dependencies:**
```json
"express", "mongoose", "cors", "dotenv"
```

**client/package.json dependencies:**
```json
"react", "react-dom", "axios", "framer-motion", "gsap", "lucide-react", "tailwindcss"
```

Add `"type": "module"` to server package.json OR use CommonJS — just be consistent.

---

## 📋 README.md

Write a solid README with:
- Project description (1 para)
- Tech stack badges (shields.io)
- Features list
- Setup instructions (clone → install → add .env → run)
- API endpoints table
- Screenshots placeholder section
- Live demo link placeholder
- License: MIT

---

## 🚀 DEPLOYMENT NOTES (include as comments or README section)

**Backend (Render):**
- Build command: `npm install`
- Start command: `node server.js`
- Add env var `MONGO_URI` in Render dashboard

**Frontend (Vercel):**
- Root dir: `client/`
- Build: `npm run build`
- Output: `dist/`
- Add env var `VITE_API_URL` = your Render backend URL

**MongoDB Atlas:**
- Free M0 tier
- Network Access → Allow from anywhere `0.0.0.0/0`
- Get connection string for `MONGO_URI`

---

## ❌ DO NOT

- Do not use Create React App — use Vite
- Do not use plain CSS classes without intention — use Tailwind utilities + custom CSS variables
- Do not use default browser UI for the category selector — make styled chips/pills
- Do not skip animations — they are 30% of the grade
- Do not use `alert()` for anything — use inline error/success messages in the UI
- Do not hardcode the API URL — use env vars

---

## 🎯 FINAL QUALITY BAR

When you're done, this app should look like something a senior frontend engineer would post on Twitter and get 2000 likes. The animations should feel smooth and purposeful. The glassmorphism cards should have real depth. The typography should feel considered. It should be obvious that a human who cared about design built this — not an AI that typed `className="bg-gray-800 rounded-lg p-4"`.

Make it unforgettable. This is a final assessment. Ship it.

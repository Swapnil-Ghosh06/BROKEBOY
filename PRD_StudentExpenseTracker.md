# 📄 Product Requirements Document
## Student Expense Tracker — Full Stack Assessment
**FOSS Club · JAIN Deemed-to-be University · Final Week Assessment**

---

## 1. Overview

| Field | Detail |
|---|---|
| **Project Name** | Student Expense Tracker |
| **Type** | Full Stack Web Application |
| **Stack** | React · Node.js/Express · MongoDB |
| **Assessment** | Final Week — Full Stack Development Workshop |
| **Submission** | GitHub Repo + Live Link + Screen Recording |

---

## 2. Problem Statement

Students struggle to track their daily micro-expenses (coffee, travel, food, subscriptions). There's no focused, frictionless tool built *for students* — most budget apps are bloated. This app solves that with a clean, fast, and satisfying expense logging experience.

---

## 3. Goals & Success Criteria

- ✅ Student can add an expense in under 5 seconds
- ✅ All expenses visible at a glance with category, amount, and date
- ✅ Individual entries can be deleted instantly
- ✅ Data persists across browser sessions via MongoDB backend
- ✅ App is responsive and works on mobile
- ✅ Deployed and publicly accessible

---

## 4. Tech Stack

### Frontend
- **Framework:** React (Vite)
- **Styling:** Tailwind CSS + custom CSS
- **Animations:** GSAP + Framer Motion
- **HTTP Client:** Axios
- **Icons:** Lucide React

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (via Mongoose)
- **Environment:** dotenv
- **CORS:** cors middleware

### Deployment
- **Frontend:** Vercel
- **Backend:** Render
- **Database:** MongoDB Atlas (free tier)

---

## 5. Core Features

### 5.1 Add Expense
- **Fields:** Title, Amount (₹), Category, Date
- **Categories:** Food 🍕 · Travel 🚗 · Coffee ☕ · Shopping 🛍️ · Entertainment 🎮 · Other
- **Validation:** All fields required, amount must be positive
- **UX:** Form submits on Enter, clears after submission, shows success feedback

### 5.2 View Expenses
- Reverse-chronological list (newest first)
- Each card shows: title, category icon, amount, date
- Total spend shown prominently at top
- Category-wise color coding

### 5.3 Delete Expense
- Delete button on each expense card
- Confirmation not required (fast UX)
- Card animates out on deletion

### 5.4 Summary / Stats (Bonus)
- Total expenses this month
- Highest spend category
- Count of entries

---

## 6. API Specification

### Base URL
```
/api/expenses
```

### Endpoints

| Method | Route | Description |
|---|---|---|
| `GET` | `/api/expenses` | Fetch all expenses |
| `POST` | `/api/expenses` | Create a new expense |
| `DELETE` | `/api/expenses/:id` | Delete expense by ID |

### Expense Schema (MongoDB)
```json
{
  "_id": "ObjectId",
  "title": "String (required)",
  "amount": "Number (required, > 0)",
  "category": "String (enum)",
  "date": "Date (default: now)",
  "createdAt": "Date"
}
```

### POST Body Example
```json
{
  "title": "Chai at canteen",
  "amount": 20,
  "category": "Coffee",
  "date": "2026-05-06"
}
```

### Response Example
```json
{
  "success": true,
  "data": {
    "_id": "abc123",
    "title": "Chai at canteen",
    "amount": 20,
    "category": "Coffee",
    "date": "2026-05-06T00:00:00.000Z"
  }
}
```

---

## 7. Visual Design Direction

> **Aesthetic:** Dark glassmorphism with neon accent pops. Feels like a premium fintech app but built for broke students.

- **Background:** Near-black (`#080c14`) with subtle grid or noise texture
- **Cards:** Frosted glass — `backdrop-filter: blur(16px)` with low-opacity white border
- **Accent:** Electric blue `#3b8ef3` and warm yellow `#f5c842`
- **Typography:** `Syne` or `DM Sans` for headings · `Inter` for data
- **Animations:**
  - Page load: staggered card entrance with GSAP
  - Add expense: form slides in from bottom
  - Delete: card shrinks + fades out (Framer Motion)
  - Amount counter: animated number increment on total
- **3D effect:** Subtle card tilt on hover using `perspective` CSS or VanillaTilt.js

---

## 8. Project Structure

```
student-expense-tracker/
├── client/                   # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── ExpenseForm.jsx
│   │   │   ├── ExpenseList.jsx
│   │   │   ├── ExpenseCard.jsx
│   │   │   └── SummaryBar.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   └── vite.config.js
│
├── server/                   # Node.js backend
│   ├── models/
│   │   └── Expense.js
│   ├── routes/
│   │   └── expenses.js
│   ├── server.js
│   ├── .env
│   └── package.json
│
└── README.md
```

---

## 9. Environment Variables

### Server `.env`
```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/expensetracker
```

### Client `.env`
```env
VITE_API_URL=https://your-render-backend.onrender.com
```

---

## 10. Deployment Checklist

- [ ] MongoDB Atlas cluster created, IP whitelist set to `0.0.0.0/0`
- [ ] Backend deployed on Render with env vars set
- [ ] Frontend deployed on Vercel with `VITE_API_URL` pointing to Render
- [ ] CORS configured to allow Vercel domain
- [ ] Test all 3 API endpoints on live URL
- [ ] Screen recording done (1-2 min demo)
- [ ] GitHub repo is **public**
- [ ] Form submitted: https://docs.google.com/forms/d/e/1FAIpQLScBkYOy8MTWSq82ILXkKmI_PgSBVoz44WrzZ8AG-guKsK3sFA/viewform

---

## 11. Judging Criteria (per assessment brief)

| Criterion | Weight | Notes |
|---|---|---|
| **Functionality** | Core | All 3 CRUD ops work, no crashes |
| **Code Quality** | High | Clean folder structure, no spaghetti |
| **UI/UX** | High | Polished, responsive, thoughtful design |
| **Creativity** | Bonus | Animations, stats, extra features |

---

## 12. Out of Scope (for this submission)

- User authentication / login
- Edit/update expense
- Charts or data visualization (nice to have, not required)
- PWA / offline support
- Multi-user / shared budgets

---

*PRD Version 1.0 · Final Week Assessment · FOSS Club, JAIN University*

const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');
const mongoose = require('mongoose');

// Middleware to check DB connection status
const checkConnection = (req, res, next) => {
  // We no longer wait/block. We just check the state.
  // This prevents UI timeouts on refresh.
  next();
};

router.use(checkConnection);

// GET /api/expenses - Fetch all expenses (sorted by date desc)
router.get('/', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const expenses = [...global.mockExpenses].sort((a, b) => new Date(b.date) - new Date(a.date));
      return res.json({ 
        success: true, 
        data: expenses, 
        isMock: true,
        dbError: global.lastDbError || "Database is disconnected or still connecting."
      });
    }
    const expenses = await Expense.find().sort({ date: -1 });
    res.json({ 
      success: true, 
      data: expenses, 
      isMock: false,
      dbError: null
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
});

// POST /api/expenses - Create a new expense
router.post('/', async (req, res) => {
  try {
    const { title, amount, category, date } = req.body;
    
    // Validation
    if (!title || amount === undefined || !category) {
      return res.status(400).json({ success: false, error: 'Please provide all required fields' });
    }

    if (mongoose.connection.readyState !== 1) {
      const newExpense = {
        _id: Math.random().toString(36).substr(2, 9),
        title,
        amount,
        category,
        date: date || new Date().toISOString(),
        createdAt: new Date().toISOString()
      };
      global.mockExpenses.push(newExpense);
      return res.status(201).json({ success: true, data: newExpense, isMock: true });
    }

    const expense = await Expense.create({
      title,
      amount,
      category,
      date: date || Date.now()
    });

    res.status(201).json({ success: true, data: expense, isMock: false });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
});

// DELETE /api/expenses/:id - Delete expense by ID
router.delete('/:id', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const index = global.mockExpenses.findIndex(e => e._id === req.params.id);
      if (index === -1) {
        return res.status(404).json({ success: false, error: 'Expense not found' });
      }
      global.mockExpenses.splice(index, 1);
      return res.json({ success: true, data: {} });
    }

    const expense = await Expense.findById(req.params.id);
    
    if (!expense) {
      return res.status(404).json({ success: false, error: 'Expense not found' });
    }

    await expense.deleteOne();
    res.json({ success: true, data: {} });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
});

module.exports = router;

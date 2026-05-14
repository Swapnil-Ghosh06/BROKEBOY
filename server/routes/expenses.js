const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');
const mongoose = require('mongoose');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

// GET /api/expenses — fetch user's expenses
router.get('/', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const expenses = (global.mockExpenses || [])
        .filter(e => e.userId === req.user.id)
        .sort((a, b) => new Date(b.date) - new Date(a.date));
      return res.json({ success: true, data: expenses });
    }
    const expenses = await Expense.find({ userId: req.user.id }).sort({ date: -1 });
    res.json({ success: true, data: expenses });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
});

// POST /api/expenses — create expense for user
router.post('/', async (req, res) => {
  try {
    const { title, amount, category, date } = req.body;

    if (!title || amount === undefined || !category) {
      return res.status(400).json({ success: false, error: 'Please provide all required fields' });
    }

    if (mongoose.connection.readyState !== 1) {
      const newExpense = {
        _id: Math.random().toString(36).substr(2, 9),
        userId: req.user.id,
        title,
        amount,
        category,
        date: date || new Date().toISOString(),
        createdAt: new Date().toISOString()
      };
      global.mockExpenses = global.mockExpenses || [];
      global.mockExpenses.push(newExpense);
      return res.status(201).json({ success: true, data: newExpense });
    }

    const expense = await Expense.create({
      userId: req.user.id,
      title,
      amount,
      category,
      date: date || Date.now()
    });

    res.status(201).json({ success: true, data: expense });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
});

// DELETE /api/expenses/reset/all — delete all user's expenses
router.delete('/reset/all', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      global.mockExpenses = (global.mockExpenses || []).filter(e => e.userId !== req.user.id);
      return res.json({ success: true, message: 'All expenses deleted' });
    }

    await Expense.deleteMany({ userId: req.user.id });
    res.json({ success: true, message: 'All expenses deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
});

// DELETE /api/expenses/:id — delete single expense (only if owned by user)
router.delete('/:id', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const index = (global.mockExpenses || []).findIndex(
        e => e._id === req.params.id && e.userId === req.user.id
      );
      if (index === -1) {
        return res.status(404).json({ success: false, error: 'Expense not found' });
      }
      global.mockExpenses.splice(index, 1);
      return res.json({ success: true, data: {} });
    }

    const expense = await Expense.findOne({ _id: req.params.id, userId: req.user.id });

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

const express = require('express');
const router = express.Router();
const { getBudgets, createBudget } = require('../controllers/budgetController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, getBudgets);
router.post('/', authMiddleware, createBudget);

module.exports = router;

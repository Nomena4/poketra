const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getBudgets = async (req, res) => {
  try {
    const userId = req.user.userId;
    const budgets = await prisma.budget.findMany({ 
      where: { userId },
      include: { category: true }
    });
    res.json(budgets);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch budgets' });
  }
};

exports.createBudget = async (req, res) => {
  try {
    const { amount, period, categoryId } = req.body;
    const userId = req.user.userId;
    const newBudget = await prisma.budget.create({
      data: { amount, period, categoryId, userId }
    });
    res.status(201).json(newBudget);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create budget' });
  }
};

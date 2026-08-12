const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const chatWithAI = async (req, res) => {
  try {
    const { message } = req.body;
    const userId = req.user.userId;

    // Fetch user's summary data to give AI context
    const expenses = await prisma.expense.aggregate({
      where: { userId },
      _sum: { amount: true }
    });
    const incomes = await prisma.income.aggregate({
      where: { userId },
      _sum: { amount: true }
    });
    
    const totalExpenses = expenses._sum.amount || 0;
    const totalIncomes = incomes._sum.amount || 0;

    // Mock AI Response logic
    let aiResponse = "I'm your Piff AI assistant. How can I help you manage your budget today?";
    
    if (message.toLowerCase().includes('spend') || message.toLowerCase().includes('dépensé') || message.toLowerCase().includes('depense')) {
      aiResponse = `You have spent a total of ${totalExpenses} so far. Keep an eye on your budgets!`;
    } else if (message.toLowerCase().includes('income') || message.toLowerCase().includes('revenu')) {
      aiResponse = `Your total recorded income is ${totalIncomes}. Great job!`;
    } else if (message.toLowerCase().includes('budget')) {
      aiResponse = `It looks like you want to know about your budgets. You can check the dashboard for a detailed breakdown.`;
    }

    res.json({ reply: aiResponse });
  } catch (error) {
    console.error('Error in AI Chat:', error);
    res.status(500).json({ error: 'Internal Server Error in AI service' });
  }
};

module.exports = {
  chatWithAI,
};

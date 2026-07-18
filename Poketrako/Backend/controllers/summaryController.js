const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getMonthlySummary = async (req, res) => {
    try {
        const { month } = req.query;
        const targetDate = month ? new Date(month) : new Date();
        const year = targetDate.getFullYear();
        const monthIndex = targetDate.getMonth();
        const startDate = new Date(year, monthIndex, 1);
        const endDate = new Date(year, monthIndex + 1, 0);

        const result = await prisma.$transaction([
            prisma.income.aggregate({
                _sum: { amount: true },
                where: { userId: req.user.id, date: { gte: startDate, lte: endDate } },
            }),
            prisma.expense.aggregate({
                _sum: { amount: true },
                where: { userId: req.user.id, date: { gte: startDate, lte: endDate } },
            }),
            prisma.user.findUnique({
                where: { id: req.user.id },
                select: { budget: true }
            })
        ]);

        const income = parseFloat(result[0]._sum.amount || 0);
        const expenses = parseFloat(result[1]._sum.amount || 0);
        const budget = result[2]?.budget ? parseFloat(result[2].budget) : 0;

        res.json({
            month: `${year}-${String(monthIndex + 1).padStart(2, '0')}`,
            income,
            expenses,
            balance: income - expenses,
            budget,
            remainingBudget: budget + income - expenses,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getSummary = async (req, res) => {
    try {
        const { start, end } = req.query;
        if (!start || !end) return res.status(400).json({ error: "Les paramètres 'start' et 'end' sont requis" });

        const startDate = new Date(start);
        const endDate = new Date(end);

        const result = await prisma.$transaction([
            prisma.income.aggregate({
                _sum: { amount: true },
                where: { userId: req.user.id, date: { gte: startDate, lte: endDate } },
            }),
            prisma.expense.aggregate({
                _sum: { amount: true },
                where: { userId: req.user.id, date: { gte: startDate, lte: endDate } },
            }),
        ]);

        const income = result[0]._sum.amount || 0;
        const expenses = result[1]._sum.amount || 0;

        res.json({
            startDate: start,
            endDate: end,
            income,
            expenses,
            balance: income - expenses,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAlerts = async (req, res) => {
    try {
        const now = new Date();
        const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);

        const result = await prisma.$transaction([
            prisma.income.aggregate({
                _sum: { amount: true },
                where: { userId: req.user.id, date: { gte: startDate, lte: endDate } },
            }),
            prisma.expense.aggregate({
                _sum: { amount: true },
                where: { userId: req.user.id, date: { gte: startDate, lte: endDate } },
            }),
            prisma.user.findUnique({
                where: { id: req.user.id },
                select: { budget: true }
            })
        ]);

        const income = parseFloat(result[0]._sum.amount || 0);
        const expenses = parseFloat(result[1]._sum.amount || 0);
        const budget = result[2]?.budget ? parseFloat(result[2].budget) : 0;

        const adjustedBudget = budget + income;
        let alerts = [];
        if (expenses > income && income > 0) {
            alerts.push(`Vous avez dépassé vos revenus de ce mois de ${(expenses - income).toFixed(2)}€`);
        }
        if (budget > 0 && expenses > adjustedBudget) {
            alerts.push(`Vous avez dépassé votre budget mensuel ajusté de ${(expenses - adjustedBudget).toFixed(2)}€ (Budget configuré: ${budget.toFixed(2)}€)`);
        }

        if (alerts.length > 0) {
            res.json({
                alert: true,
                message: alerts.join(" | ")
            });
        } else {
            res.json({ alert: false, message: 'Vos finances sont équilibrées ce mois-ci.' });
        }
    } catch (error) {
        console.error("getAlerts error:", error);
        res.status(500).json({ error: error.message });
    }
};

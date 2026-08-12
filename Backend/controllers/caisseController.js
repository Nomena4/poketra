const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getTransactions = async (req, res) => {
    try {
        const transactions = await prisma.caisseTransaction.findMany({
            where: { userId: req.userId },
            orderBy: { date: 'desc' }
        });
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createTransaction = async (req, res) => {
    try {
        const { type, amount, operator, commission, reference, description, date } = req.body;
        
        const transaction = await prisma.caisseTransaction.create({
            data: {
                type,
                amount: parseFloat(amount),
                operator,
                commission: commission ? parseFloat(commission) : 0,
                reference,
                description,
                date: date ? new Date(date) : undefined,
                userId: req.userId
            }
        });
        res.status(201).json(transaction);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.deleteTransaction = async (req, res) => {
    try {
        const transactionId = parseInt(req.params.id);
        const transaction = await prisma.caisseTransaction.deleteMany({
            where: { id: transactionId, userId: req.userId }
        });
        if (transaction.count === 0) return res.status(404).json({ error: 'Transaction non trouvée' });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

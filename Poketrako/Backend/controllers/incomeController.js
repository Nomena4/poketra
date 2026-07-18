const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getIncomes = async (req, res) => {
    try {
        const { start, end, _sort, _limit } = req.query;
        const where = { userId: req.user.id };
        if (start) where.date = { gte: new Date(start) };
        if (end) where.date = { ...where.date, lte: new Date(end) };

        const options = { where };
        if (_limit) options.take = parseInt(_limit, 10);
        if (_sort) {
            const [field, order] = _sort.split(':');
            options.orderBy = { [field]: order.toLowerCase() };
        }

        const incomes = await prisma.income.findMany(options);
        res.json(incomes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getIncome = async (req, res) => {
    try {
        const income = await prisma.income.findFirst({
            where: { id: parseInt(req.params.id), userId: req.user.id }
        });
        if (!income) return res.status(404).json({ error: 'Revenu non trouvé' });
        res.json(income);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createIncome = async (req, res) => {
    try {
        const { amount, date, source, description } = req.body;
        const income = await prisma.income.create({
            data: { amount, date: new Date(date), source, description, userId: req.user.id }
        });
        res.status(201).json(income);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.updateIncome = async (req, res) => {
    try {
        const { amount, date, source, description } = req.body;
        const income = await prisma.income.updateMany({
            where: { id: parseInt(req.params.id), userId: req.user.id },
            data: { amount, date: date ? new Date(date) : undefined, source, description }
        });
        if (income.count === 0) return res.status(404).json({ error: 'Revenu non trouvé' });
        res.status(200).json({ message: 'Revenu mis à jour' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.deleteIncome = async (req, res) => {
    try {
        const income = await prisma.income.deleteMany({
            where: { id: parseInt(req.params.id), userId: req.user.id }
        });
        if (income.count === 0) return res.status(404).json({ error: 'Revenu non trouvé' });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

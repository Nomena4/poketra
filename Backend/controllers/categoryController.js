const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getCategories = async (req, res) => {
    try {
        const categories = await prisma.category.findMany({
            where: { userId: req.userId }
        });
        res.json(categories);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createCategory = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ error: "Nom de catégorie requis" });
        }
        
        // Find or create category for this user
        const existing = await prisma.category.findFirst({
            where: { name, userId: req.userId }
        });
        if (existing) {
            return res.status(400).json({ error: "Catégorie déjà existante" });
        }

        const category = await prisma.category.create({
            data: { name, userId: req.userId }
        });
        res.status(201).json(category);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.updateCategory = async (req, res) => {
    try {
        const { name } = req.body;
        const category = await prisma.category.updateMany({
            where: { id: parseInt(req.params.id), userId: req.userId },
            data: { name }
        });
        if (category.count === 0) return res.status(404).json({ error: 'Catégorie non trouvée' });
        res.status(200).json({ message: 'Catégorie mise à jour' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.deleteCategory = async (req, res) => {
    try {
        const categoryId = parseInt(req.params.id);
        const expenseCount = await prisma.expense.count({
            where: { categoryId }
        });
        if (expenseCount > 0) {
            return res.status(400).json({ error: 'Impossible de supprimer une catégorie utilisée' });
        }

        const category = await prisma.category.deleteMany({
            where: { id: categoryId, userId: req.userId }
        });
        if (category.count === 0) return res.status(404).json({ error: 'Catégorie non trouvée' });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

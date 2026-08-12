const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.createExpense = async (req, res) => {
  try {
    const { amount, categoryId, description, type, startDate, endDate, date } = req.body;
    
    if (!amount || !categoryId) {
      return res.status(400).json({ error: "Montant et catégorie requis" });
    }

    const parsedCategoryId = parseInt(categoryId, 10);
    if (isNaN(parsedCategoryId)) {
      return res.status(400).json({ error: "ID de catégorie invalide" });
    }

    const category = await prisma.category.findUnique({
      where: { id: parsedCategoryId }
    });
    if (!category) {
      return res.status(404).json({ error: "Catégorie non trouvée" });
    }

    let expenseType = 'ONE_TIME';
    if (type) {
      const formattedType = type.toUpperCase().replace('-', '_');
      if (formattedType === 'RECURRING' || formattedType === 'ONE_TIME') {
        expenseType = formattedType;
      }
    }

    let receiptUploadId = null;
    if (req.file) {
      const receipt = await prisma.receiptUpload.create({
        data: {
          filename: req.file.path, // Cloudinary URL
          url: req.file.path, // Cloudinary URL
          contentType: req.file.mimetype,
          size: req.file.size || 0,
          userId: req.userId
        }
      });
      receiptUploadId = receipt.id;
    }

    const expense = await prisma.expense.create({
      data: {
        amount: parseFloat(amount),
        date: date ? new Date(date) : new Date(),
        categoryId: parsedCategoryId,
        description: description || null,
        type: expenseType,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        userId: req.userId,
        receiptUploadId: receiptUploadId
      },
      include: {
        category: true,
        receiptUpload: true
      }
    });

    res.status(201).json(expense);
  } catch (err) {
    console.error("Erreur createExpense:", err);
    res.status(400).json({ error: err.message });
  }
};

exports.getExpenses = async (req, res) => {
  try {
    const { start, end, _sort, _limit } = req.query;
    const where = { userId: req.userId };
    
    if (start) {
      where.date = { gte: new Date(start) };
    }
    if (end) {
      where.date = { ...where.date, lte: new Date(end) };
    }

    const options = { 
      where,
      include: {
        category: true,
        receiptUpload: true
      }
    };
    
    if (_limit) {
      options.take = parseInt(_limit, 10);
    }
    
    if (_sort) {
      const [field, order] = _sort.split(':');
      options.orderBy = { [field]: order.toLowerCase() };
    } else {
      options.orderBy = { date: 'desc' };
    }

    const expenses = await prisma.expense.findMany(options);
    res.json(expenses);
  } catch (err) {
    console.error("Erreur getExpenses:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.deleteExpense = async (req, res) => {
  try {
    const expenseId = parseInt(req.params.id, 10);
    const expense = await prisma.expense.findFirst({
      where: { id: expenseId, userId: req.userId }
    });
    if (!expense) {
      return res.status(404).json({ error: "Dépense non trouvée" });
    }

    await prisma.expense.delete({
      where: { id: expenseId }
    });

    if (expense.receiptUploadId) {
      await prisma.receiptUpload.delete({
        where: { id: expense.receiptUploadId }
      }).catch(err => console.error("Could not delete receiptUpload:", err));
    }

    res.status(204).send();
  } catch (err) {
    console.error("Erreur deleteExpense:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.getReceiptForExpense = async (req, res) => {
  try {
    const expenseId = parseInt(req.params.idExpense, 10);
    const expense = await prisma.expense.findFirst({
      where: { id: expenseId, userId: req.userId },
      include: { receiptUpload: true }
    });
    if (!expense || !expense.receiptUpload) {
      return res.status(404).json({ error: "Justificatif non trouvé" });
    }
    res.json(expense.receiptUpload);
  } catch (err) {
    console.error("Erreur getReceiptForExpense:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.deleteReceipt = async (req, res) => {
  try {
    const receiptId = parseInt(req.params.id, 10);
    const receipt = await prisma.receiptUpload.findFirst({
      where: { id: receiptId, userId: req.userId }
    });
    if (!receipt) {
      return res.status(404).json({ error: "Justificatif non trouvé" });
    }

    await prisma.expense.updateMany({
      where: { receiptUploadId: receiptId },
      data: { receiptUploadId: null }
    });

    await prisma.receiptUpload.delete({
      where: { id: receiptId }
    });

    res.status(204).send();
  } catch (err) {
    console.error("Erreur deleteReceipt:", err);
    res.status(500).json({ error: err.message });
  }
};

// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const app = express();

app.use(express.json());
app.use(cors());

// Ensure uploads directory exists
const fs = require('fs');
const path = require('path');
const uploadsDir = process.env.USER_DATA_PATH 
  ? path.join(process.env.USER_DATA_PATH, 'uploads')
  : path.join(__dirname, 'uploads');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/expenses', require('./routes/expenseRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/incomes', require('./routes/incomeRoutes'));
app.use('/api/summary', require('./routes/summaryRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));
app.use('/api/budgets', require('./routes/budgetRoutes'));

// Enterprise Routes
app.use('/api/company', require('./routes/companyRoutes'));
app.use('/api/enterprise', require('./routes/invoiceRoutes'));

async function startServer() {
  try {
    await prisma.$connect();
    console.log('✅ Connexion Prisma à Neon (PostgreSQL) réussie !');

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`🚀 Serveur lancé sur le port ${PORT}`));
  } catch (err) {
    console.error('❌ Erreur connexion Prisma:', err);
    process.exit(1);
  }
}

startServer();


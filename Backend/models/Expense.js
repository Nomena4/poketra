// models/Expense.js
const { DataTypes } = require('prisma');
const prisma = require('../config/database');
const User = require('./User');

const Expense = prisma.define('Expense', {
  title:      { type: DataTypes.STRING, allowNull: false },
  amount:     { type: DataTypes.FLOAT, allowNull: false },
  category:   { type: DataTypes.STRING },
  receiptUrl: { type: DataTypes.STRING }
});

Expense.belongsTo(User, { foreignKey: 'userId' });

module.exports = Expense;

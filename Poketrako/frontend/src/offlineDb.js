const getStorageItem = (key, defaultVal = []) => {
  try {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : defaultVal;
  } catch (e) {
    console.error("Failed to parse localStorage item: " + key, e);
    return defaultVal;
  }
};

const setStorageItem = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const DEFAULT_CATEGORIES = [
  "Alimentation",
  "Transport",
  "Logement",
  "Loisirs",
  "Santé",
  "Éducation",
  "Abonnements",
  "Cadeaux",
  "Factures",
  "Vêtements",
  "Voyages",
  "Autre"
];

function initDefaultData(userId) {
  const categories = getStorageItem("poketrako_categories");
  const userCats = categories.filter(c => c.userId === userId);
  if (userCats.length === 0) {
    let nextId = categories.reduce((max, c) => Math.max(max, c.id || 0), 0) + 1;
    const newCats = DEFAULT_CATEGORIES.map(name => ({
      id: nextId++,
      name,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userId: userId
    }));
    setStorageItem("poketrako_categories", [...categories, ...newCats]);
  }
}

export function getActiveUserId() {
  const token = localStorage.getItem("token");
  if (!token || !token.startsWith("local_token_")) {
    throw new Error("Utilisateur non connecté");
  }
  return parseInt(token.replace("local_token_", ""), 10);
}

// AUTH
export function signup(email, password, fullName) {
  const users = getStorageItem("poketrako_users");
  const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    throw new Error("Cet email est déjà utilisé");
  }

  const nextId = users.reduce((max, u) => Math.max(max, u.id), 0) + 1;
  const newUser = {
    id: nextId,
    email,
    password, // simple plain text password for mock/local DB
    fullName,
    budget: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  users.push(newUser);
  setStorageItem("poketrako_users", users);
  
  // Initialize default categories for this user
  initDefaultData(newUser.id);
  
  return true;
}

export function login(email, password) {
  const users = getStorageItem("poketrako_users");
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (!user || user.password !== password) {
    throw new Error("Identifiants incorrects ❌");
  }

  const token = `local_token_${user.id}`;
  localStorage.setItem("token", token);
  return { token, user };
}

export function getProfile() {
  const userId = getActiveUserId();
  const users = getStorageItem("poketrako_users");
  const user = users.find(u => u.id === userId);
  if (!user) {
    throw new Error("Profil introuvable");
  }
  return {
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    budget: user.budget || 0,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  };
}

export function updateBudget(budgetVal) {
  const userId = getActiveUserId();
  const users = getStorageItem("poketrako_users");
  const index = users.findIndex(u => u.id === userId);
  if (index === -1) {
    throw new Error("Profil introuvable");
  }

  const updatedBudget = parseFloat(budgetVal) || 0;
  users[index].budget = updatedBudget;
  users[index].updatedAt = new Date().toISOString();
  setStorageItem("poketrako_users", users);

  return { budget: updatedBudget };
}

// CATEGORIES
export function getCategories() {
  const userId = getActiveUserId();
  const categories = getStorageItem("poketrako_categories");
  return categories.filter(c => c.userId === userId);
}

export function createCategory(name) {
  const userId = getActiveUserId();
  const categories = getStorageItem("poketrako_categories");
  const cleaned = name.trim();
  const existing = categories.find(c => c.userId === userId && c.name.toLowerCase() === cleaned.toLowerCase());
  if (existing) {
    throw new Error("Cette catégorie existe déjà");
  }

  const nextId = categories.reduce((max, c) => Math.max(max, c.id || 0), 0) + 1;
  const newCat = {
    id: nextId,
    name: cleaned,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    userId
  };

  categories.push(newCat);
  setStorageItem("poketrako_categories", categories);
  return newCat;
}

export function updateCategory(id, name) {
  const userId = getActiveUserId();
  const categories = getStorageItem("poketrako_categories");
  const index = categories.findIndex(c => c.id === id && c.userId === userId);
  if (index === -1) throw new Error("Catégorie introuvable");

  const cleaned = name.trim();
  categories[index].name = cleaned;
  categories[index].updatedAt = new Date().toISOString();
  setStorageItem("poketrako_categories", categories);
  return categories[index];
}

export function deleteCategory(id) {
  const userId = getActiveUserId();
  const categories = getStorageItem("poketrako_categories");
  const filtered = categories.filter(c => !(c.id === id && c.userId === userId));
  setStorageItem("poketrako_categories", filtered);
  return true;
}

// EXPENSES
export function getExpenses(params = {}) {
  const userId = getActiveUserId();
  let expenses = getStorageItem("poketrako_expenses").filter(e => e.userId === userId);

  if (params.start) {
    const startDate = new Date(params.start);
    expenses = expenses.filter(e => e.date && new Date(e.date) >= startDate);
  }

  // Sorting
  if (params._sort) {
    const [field, order] = params._sort.split(':');
    expenses.sort((a, b) => {
      let valA = a[field];
      let valB = b[field];
      if (field === 'date') {
        valA = new Date(valA || 0);
        valB = new Date(valB || 0);
      }
      if (order === 'DESC') {
        return valB - valA;
      } else {
        return valA - valB;
      }
    });
  } else {
    expenses.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
  }

  if (params._limit) {
    const limit = parseInt(params._limit, 10);
    expenses = expenses.slice(0, limit);
  }

  return expenses;
}

export function createExpense(expenseData) {
  const userId = getActiveUserId();
  const expenses = getStorageItem("poketrako_expenses");
  const nextId = expenses.reduce((max, e) => Math.max(max, e.id || 0), 0) + 1;
  let receiptUploadId = null;

  if (expenseData.receiptBase64) {
    const receipts = getStorageItem("poketrako_receipts");
    const nextReceiptId = receipts.reduce((max, r) => Math.max(max, r.id || 0), 0) + 1;
    const newReceipt = {
      id: nextReceiptId,
      filename: expenseData.receiptName || "receipt.png",
      url: expenseData.receiptBase64,
      contentType: expenseData.receiptType || "image/png",
      size: expenseData.receiptSize || 0,
      uploadedAt: new Date().toISOString(),
      userId
    };
    receipts.push(newReceipt);
    setStorageItem("poketrako_receipts", receipts);
    receiptUploadId = nextReceiptId;
  }

  const newExpense = {
    id: nextId,
    amount: parseFloat(expenseData.amount),
    date: expenseData.date,
    categoryId: parseInt(expenseData.categoryId, 10),
    description: expenseData.description || "",
    type: (expenseData.type || "ONE_TIME").toUpperCase(),
    creationDate: new Date().toISOString(),
    startDate: expenseData.startDate || null,
    endDate: expenseData.endDate || null,
    userId,
    receiptUploadId
  };

  expenses.push(newExpense);
  setStorageItem("poketrako_expenses", expenses);
  return newExpense;
}

export function deleteExpense(id) {
  const userId = getActiveUserId();
  const expenses = getStorageItem("poketrako_expenses");
  const index = expenses.findIndex(e => e.id === id && e.userId === userId);
  if (index !== -1) {
    const exp = expenses[index];
    if (exp.receiptUploadId) {
      deleteReceipt(exp.receiptUploadId);
    }
    expenses.splice(index, 1);
    setStorageItem("poketrako_expenses", expenses);
  }
  return true;
}

// INCOMES
export function getIncomes(params = {}) {
  const userId = getActiveUserId();
  let incomes = getStorageItem("poketrako_incomes").filter(i => i.userId === userId);

  if (params.start) {
    const startDate = new Date(params.start);
    incomes = incomes.filter(i => i.date && new Date(i.date) >= startDate);
  }

  if (params._sort) {
    const [field, order] = params._sort.split(':');
    incomes.sort((a, b) => {
      let valA = a[field];
      let valB = b[field];
      if (field === 'date') {
        valA = new Date(valA || 0);
        valB = new Date(valB || 0);
      }
      if (order === 'DESC') {
        return valB - valA;
      } else {
        return valA - valB;
      }
    });
  } else {
    incomes.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
  }

  if (params._limit) {
    const limit = parseInt(params._limit, 10);
    incomes = incomes.slice(0, limit);
  }

  return incomes;
}

export function createIncome(incomeData) {
  const userId = getActiveUserId();
  const incomes = getStorageItem("poketrako_incomes");
  const nextId = incomes.reduce((max, i) => Math.max(max, i.id || 0), 0) + 1;

  const newIncome = {
    id: nextId,
    amount: parseFloat(incomeData.amount),
    date: incomeData.date,
    source: incomeData.source,
    description: incomeData.description || "",
    creationDate: new Date().toISOString(),
    userId
  };

  incomes.push(newIncome);
  setStorageItem("poketrako_incomes", incomes);
  return newIncome;
}

export function deleteIncome(id) {
  const userId = getActiveUserId();
  const incomes = getStorageItem("poketrako_incomes");
  const filtered = incomes.filter(i => !(i.id === id && i.userId === userId));
  setStorageItem("poketrako_incomes", filtered);
  return true;
}

// RECEIPTS
export function getReceiptForExpense(idExpense) {
  const userId = getActiveUserId();
  const expenses = getStorageItem("poketrako_expenses");
  const exp = expenses.find(e => e.id === idExpense && e.userId === userId);
  if (!exp || !exp.receiptUploadId) return null;

  const receipts = getStorageItem("poketrako_receipts");
  const receipt = receipts.find(r => r.id === exp.receiptUploadId && r.userId === userId);
  return receipt || null;
}

export function deleteReceipt(receiptId) {
  const userId = getActiveUserId();
  const receipts = getStorageItem("poketrako_receipts");
  const filtered = receipts.filter(r => !(r.id === receiptId && r.userId === userId));
  setStorageItem("poketrako_receipts", filtered);

  // Clear reference in expenses too
  const expenses = getStorageItem("poketrako_expenses");
  expenses.forEach(e => {
    if (e.receiptUploadId === receiptId && e.userId === userId) {
      e.receiptUploadId = null;
    }
  });
  setStorageItem("poketrako_expenses", expenses);

  return true;
}

// MONTHLY SUMMARY
export function getMonthlySummary(month) {
  const userId = getActiveUserId();
  const targetDate = month ? new Date(month) : new Date();
  const year = targetDate.getFullYear();
  const monthIndex = targetDate.getMonth();
  const startDate = new Date(year, monthIndex, 1);
  const endDate = new Date(year, monthIndex + 1, 0);

  const expenses = getStorageItem("poketrako_expenses").filter(e => {
    if (e.userId !== userId || !e.date) return false;
    const d = new Date(e.date);
    return d >= startDate && d <= endDate;
  });

  const incomes = getStorageItem("poketrako_incomes").filter(i => {
    if (i.userId !== userId || !i.date) return false;
    const d = new Date(i.date);
    return d >= startDate && d <= endDate;
  });

  const totalExpenses = expenses.reduce((sum, e) => sum + parseFloat(e.amount || 0), 0);
  const totalIncomes = incomes.reduce((sum, i) => sum + parseFloat(i.amount || 0), 0);

  const users = getStorageItem("poketrako_users");
  const user = users.find(u => u.id === userId);
  const budget = user?.budget ? parseFloat(user.budget) : 0;

  return {
    month: `${year}-${String(monthIndex + 1).padStart(2, '0')}`,
    income: totalIncomes,
    expenses: totalExpenses,
    balance: totalIncomes - totalExpenses,
    budget,
    remainingBudget: budget + totalIncomes - totalExpenses
  };
}

// ALERTS
export function getBudgetAlert() {
  const userId = getActiveUserId();
  const summary = getMonthlySummary();
  const income = summary.income;
  const expenses = summary.expenses;
  const budget = summary.budget;

  const adjustedBudget = budget + income;
  let alerts = [];
  if (expenses > income && income > 0) {
    alerts.push(`Vous avez dépassé vos revenus de ce mois de ${(expenses - income).toFixed(2)} Ar`);
  }
  if (budget > 0 && expenses > adjustedBudget) {
    alerts.push(`Vous avez dépassé votre budget mensuel ajusté de ${(expenses - adjustedBudget).toFixed(2)} Ar (Budget configuré: ${budget.toFixed(2)} Ar)`);
  }

  if (alerts.length > 0) {
    return {
      alert: true,
      message: alerts.join(" | ")
    };
  } else {
    return { alert: false, message: 'Vos finances sont équilibrées ce mois-ci.' };
  }
}

// ==========================================
// CASHPOINT MODULES (Offline)
// ==========================================

// CAISSE
export function getCaisseTransactions() {
  const userId = getActiveUserId();
  const transactions = getStorageItem("poketrako_caisse_transactions").filter(t => t.userId === userId);
  transactions.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
  return transactions;
}

export function createCaisseTransaction(data) {
  const userId = getActiveUserId();
  const transactions = getStorageItem("poketrako_caisse_transactions");
  const nextId = transactions.reduce((max, t) => Math.max(max, t.id || 0), 0) + 1;
  
  const newTransaction = {
    id: nextId,
    type: data.type,
    amount: parseFloat(data.amount),
    operator: data.operator,
    commission: parseFloat(data.commission || 0),
    reference: data.reference || null,
    description: data.description || null,
    date: data.date ? new Date(data.date).toISOString() : new Date().toISOString(),
    userId
  };
  
  transactions.push(newTransaction);
  setStorageItem("poketrako_caisse_transactions", transactions);
  return newTransaction;
}

export function deleteCaisseTransaction(id) {
  const userId = getActiveUserId();
  const transactions = getStorageItem("poketrako_caisse_transactions");
  const filtered = transactions.filter(t => !(t.id === id && t.userId === userId));
  setStorageItem("poketrako_caisse_transactions", filtered);
  return true;
}

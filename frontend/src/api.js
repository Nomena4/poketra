import * as offlineDb from './offlineDb';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";


function getHeaders() {
  const token = localStorage.getItem("token");
  const headers = { "Content-Type": "application/json" };
  if (token && !token.startsWith("local_token_")) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

export function isOfflineMode() {
  const isCapacitor = !!window.Capacitor;
  const localSetting = localStorage.getItem("offline_mode");
  
  if (localSetting !== null) {
    return localSetting === "true";
  }
  return isCapacitor;
}

export function setOfflineMode(value) {
  localStorage.setItem("offline_mode", value ? "true" : "false");
}

// AUTH
export async function signup(email, password, fullName) {
  if (isOfflineMode()) {
    return offlineDb.signup(email, password, fullName);
  }

  const res = await fetch(`${API_URL}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, fullName })
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("Erreur signup:", text);
    throw new Error("Erreur d'inscription");
  }

  return true;
}

export async function login(email, password) {
  if (isOfflineMode()) {
    return offlineDb.login(email, password);
  }

  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  const text = await res.text();
  console.log("Réponse login:", res.status, text);

  if (!res.ok) throw new Error("Identifiants incorrects ❌");

  const data = JSON.parse(text);
  localStorage.setItem("token", data.token);
  return data;
}

export async function loginWithGoogle(credential) {
  const res = await fetch(`${API_URL}/auth/google`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ credential })
  });

  const text = await res.text();
  console.log("Réponse Google Login:", res.status, text);

  if (!res.ok) throw new Error("Erreur lors de la connexion avec Google ❌");

  const data = JSON.parse(text);
  localStorage.setItem("token", data.token);
  // Disable offline mode when the user logs in via Google
  localStorage.setItem("offline_mode", "false");
  return data;
}

export async function getProfile() {
  if (isOfflineMode()) {
    return offlineDb.getProfile();
  }

  const token = localStorage.getItem("token");
  if (!token) throw new Error("Utilisateur non connecté");

  const res = await fetch(`${API_URL}/auth/me`, {
    headers: getHeaders()
  });

  const text = await res.text();
  if (!res.ok) {
    console.error("Erreur getProfile:", text);
    throw new Error("Impossible de récupérer le profil");
  }

  return JSON.parse(text);
}

export function logout() {
  localStorage.removeItem("token");
}

// BUDGET
export async function updateBudget(budget) {
  if (isOfflineMode()) {
    return offlineDb.updateBudget(budget);
  }

  const res = await fetch(`${API_URL}/auth/budget`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify({ budget })
  });
  if (!res.ok) throw new Error("Erreur de mise à jour du budget");
  return res.json();
}

// CATEGORIES
export async function getCategories() {
  if (isOfflineMode()) {
    return offlineDb.getCategories();
  }

  const res = await fetch(`${API_URL}/categories`, {
    headers: getHeaders()
  });
  if (!res.ok) throw new Error("Erreur de récupération des catégories");
  return res.json();
}

export async function createCategory(name) {
  if (isOfflineMode()) {
    return offlineDb.createCategory(name);
  }

  const res = await fetch(`${API_URL}/categories`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ name })
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || "Erreur de création de la catégorie");
  }
  return res.json();
}

export async function updateCategory(id, name) {
  if (isOfflineMode()) {
    return offlineDb.updateCategory(id, name);
  }

  const res = await fetch(`${API_URL}/categories/${id}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify({ name })
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || "Erreur de mise à jour");
  }
  return res.json();
}

export async function deleteCategory(id) {
  if (isOfflineMode()) {
    return offlineDb.deleteCategory(id);
  }

  const res = await fetch(`${API_URL}/categories/${id}`, {
    method: "DELETE",
    headers: getHeaders()
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || "Erreur de suppression");
  }
  return true;
}

// EXPENSES
export async function getExpenses(params = {}) {
  if (isOfflineMode()) {
    return offlineDb.getExpenses(params);
  }

  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${API_URL}/expenses?${query}`, {
    headers: getHeaders()
  });
  if (!res.ok) throw new Error("Erreur de récupération des dépenses");
  return res.json();
}

export async function createExpense(expenseData) {
  if (isOfflineMode()) {
    if (expenseData instanceof FormData) {
      const amount = expenseData.get("amount");
      const date = expenseData.get("date");
      const categoryId = expenseData.get("categoryId");
      const description = expenseData.get("description");
      const type = expenseData.get("type");
      const startDate = expenseData.get("startDate");
      const endDate = expenseData.get("endDate");
      const receiptFile = expenseData.get("receipt");

      let receiptBase64 = null;
      let receiptName = "";
      let receiptType = "";
      let receiptSize = 0;

      if (receiptFile && receiptFile instanceof File && receiptFile.size > 0) {
        receiptBase64 = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(receiptFile);
        });
        receiptName = receiptFile.name;
        receiptType = receiptFile.type;
        receiptSize = receiptFile.size;
      }

      return offlineDb.createExpense({
        amount,
        date,
        categoryId,
        description,
        type,
        startDate,
        endDate,
        receiptBase64,
        receiptName,
        receiptType,
        receiptSize
      });
    } else {
      return offlineDb.createExpense(expenseData);
    }
  }

  const res = await fetch(`${API_URL}/expenses`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    },
    body: expenseData
  });
  if (!res.ok) throw new Error("Erreur de création de la dépense");
  return res.json();
}

export async function deleteExpense(id) {
  if (isOfflineMode()) {
    return offlineDb.deleteExpense(id);
  }

  const res = await fetch(`${API_URL}/expenses/${id}`, {
    method: "DELETE",
    headers: getHeaders()
  });
  if (!res.ok) throw new Error("Erreur de suppression de la dépense");
  return true;
}

// INCOMES
export async function getIncomes(params = {}) {
  if (isOfflineMode()) {
    return offlineDb.getIncomes(params);
  }

  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${API_URL}/incomes?${query}`, {
    headers: getHeaders()
  });
  if (!res.ok) throw new Error("Erreur de récupération des revenus");
  return res.json();
}

export async function createIncome(incomeData) {
  if (isOfflineMode()) {
    return offlineDb.createIncome(incomeData);
  }

  const res = await fetch(`${API_URL}/incomes`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(incomeData)
  });
  if (!res.ok) throw new Error("Erreur de création du revenu");
  return res.json();
}

export async function deleteIncome(id) {
  if (isOfflineMode()) {
    return offlineDb.deleteIncome(id);
  }

  const res = await fetch(`${API_URL}/incomes/${id}`, {
    method: "DELETE",
    headers: getHeaders()
  });
  if (!res.ok) throw new Error("Erreur de suppression du revenu");
  return true;
}

// SUMMARY & ALERTS
export async function getMonthlySummary() {
  if (isOfflineMode()) {
    return offlineDb.getMonthlySummary();
  }

  const res = await fetch(`${API_URL}/summary/monthly`, {
    headers: getHeaders()
  });
  if (!res.ok) throw new Error("Erreur du résumé mensuel");
  return res.json();
}

export async function getBudgetAlert() {
  if (isOfflineMode()) {
    return offlineDb.getBudgetAlert();
  }

  const res = await fetch(`${API_URL}/summary/alerts`, {
    headers: getHeaders()
  });
  if (!res.ok) throw new Error("Erreur d'alerte budget");
  return res.json();
}

// RECEIPTS
export async function getReceiptForExpense(idExpense) {
  if (isOfflineMode()) {
    return offlineDb.getReceiptForExpense(idExpense);
  }

  const res = await fetch(`${API_URL}/expenses/receipt/${idExpense}`, {
    headers: getHeaders()
  });
  if (!res.ok) return null;
  return res.json();
}

export async function deleteReceipt(receiptId) {
  if (isOfflineMode()) {
    return offlineDb.deleteReceipt(receiptId);
  }

  const res = await fetch(`${API_URL}/expenses/receipts/${receiptId}`, {
    method: "DELETE",
    headers: getHeaders()
  });
  if (!res.ok) throw new Error("Erreur de suppression du justificatif");
  return true;
}

export function getReceiptFileUrl(receipt) {
  if (isOfflineMode()) {
    return receipt.url;
  }
  if (receipt.url && receipt.url.startsWith('http')) return receipt.url;
  return `http://localhost:5000/uploads/${receipt.url}`;
}

// AVATAR
export async function updateAvatar(file) {
  const formData = new FormData();
  formData.append('avatar', file);
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_URL}/auth/avatar`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
    body: formData
  });
  if (!res.ok) throw new Error('Erreur lors du téléversement de la photo');
  return res.json();
}

export function getAvatarUrl(avatarFilename) {
  if (!avatarFilename) return null;
  // If it's already a full HTTP URL (Cloudinary), return it directly
  if (avatarFilename.startsWith('http')) return avatarFilename;
  // Fallback for old local files
  return `http://localhost:5000/uploads/${avatarFilename}`;
}

// PASSWORD RESET
export async function forgotPassword(email) {
  const res = await fetch(`${API_URL}/auth/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || 'Erreur lors de la demande de réinitialisation');
  return data;
}

export async function resetPassword(token, password) {
  const res = await fetch(`${API_URL}/auth/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, password }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || 'Erreur lors de la réinitialisation');
  return data;
}

// ==========================================
// ENTERPRISE API ENDPOINTS
// ==========================================

// COMPANY PROFILE
export async function getCompanyProfile() {
  if (isOfflineMode()) return offlineDb.getCompanyProfile();
  const res = await fetch(`${API_URL}/company`, { headers: getHeaders() });
  if (!res.ok) throw new Error("Erreur lors de la récupération du profil d'entreprise");
  return res.json();
}

export async function upsertCompanyProfile(profileData) {
  if (isOfflineMode()) return offlineDb.upsertCompanyProfile(profileData);
  const res = await fetch(`${API_URL}/company`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(profileData)
  });
  if (!res.ok) throw new Error("Erreur lors de la mise à jour du profil d'entreprise");
  return res.json();
}

// INVOICES
export async function getInvoices() {
  if (isOfflineMode()) return offlineDb.getInvoices();
  const res = await fetch(`${API_URL}/enterprise/invoices`, { headers: getHeaders() });
  if (!res.ok) throw new Error("Erreur lors de la récupération des factures");
  return res.json();
}

export async function createInvoice(invoiceData) {
  if (isOfflineMode()) return offlineDb.createInvoice(invoiceData);

  let body;
  let headers = getHeaders();

  if (invoiceData.file) {
    const formData = new FormData();
    formData.append('attachment', invoiceData.file);
    formData.append('invoiceNumber', invoiceData.invoiceNumber || '');
    if (invoiceData.clientId) formData.append('clientId', invoiceData.clientId);
    if (invoiceData.issueDate) formData.append('issueDate', invoiceData.issueDate);
    if (invoiceData.dueDate) formData.append('dueDate', invoiceData.dueDate);
    formData.append('taxRate', invoiceData.taxRate || 0);
    formData.append('notes', invoiceData.notes || '');
    formData.append('items', JSON.stringify(invoiceData.items || []));

    // Do NOT set Content-Type header when sending FormData (browser sets boundary)
    delete headers['Content-Type'];
    body = formData;
  } else {
    body = JSON.stringify(invoiceData);
  }

  const res = await fetch(`${API_URL}/enterprise/invoices`, {
    method: "POST",
    headers,
    body
  });
  if (!res.ok) throw new Error("Erreur lors de la création de la facture");
  return res.json();
}


export async function updateInvoiceStatus(id, status) {
  if (isOfflineMode()) return offlineDb.updateInvoiceStatus(id, status);
  const res = await fetch(`${API_URL}/enterprise/invoices/${id}/status`, {
    method: "PATCH",
    headers: getHeaders(),
    body: JSON.stringify({ status })
  });
  if (!res.ok) throw new Error("Erreur lors du changement de statut de la facture");
  return res.json();
}

export async function deleteInvoice(id) {
  if (isOfflineMode()) return offlineDb.deleteInvoice(id);
  const res = await fetch(`${API_URL}/enterprise/invoices/${id}`, {
    method: "DELETE",
    headers: getHeaders()
  });
  if (!res.ok) throw new Error("Erreur lors de la suppression de la facture");
  return true;
}

// CLIENTS
export async function getClients() {
  if (isOfflineMode()) return offlineDb.getClients();
  const res = await fetch(`${API_URL}/enterprise/clients`, { headers: getHeaders() });
  if (!res.ok) throw new Error("Erreur lors de la récupération des clients");
  return res.json();
}

export async function createClient(clientData) {
  if (isOfflineMode()) return offlineDb.createClient(clientData);
  const res = await fetch(`${API_URL}/enterprise/clients`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(clientData)
  });
  if (!res.ok) throw new Error("Erreur lors de la création du client");
  return res.json();
}

export async function deleteClient(id) {
  if (isOfflineMode()) return offlineDb.deleteClient(id);
  const res = await fetch(`${API_URL}/enterprise/clients/${id}`, {
    method: "DELETE",
    headers: getHeaders()
  });
  if (!res.ok) throw new Error("Erreur lors de la suppression du client");
  return true;
}


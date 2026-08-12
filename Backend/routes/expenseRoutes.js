const express = require("express");
const router = express.Router();
const { getExpenses, createExpense, deleteExpense, getReceiptForExpense, deleteReceipt } = require("../controllers/expenseController");
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

// All routes are protected by authMiddleware
router.use(authMiddleware);

router.get("/", getExpenses);
router.post("/", upload, createExpense);
router.delete("/:id", deleteExpense);
router.get("/receipt/:idExpense", getReceiptForExpense);
router.delete("/receipts/:id", deleteReceipt);

module.exports = router;

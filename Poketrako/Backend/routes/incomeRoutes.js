const express = require("express");
const router = express.Router();
const { getIncomes, getIncome, createIncome, updateIncome, deleteIncome } = require("../controllers/incomeController");
const authMiddleware = require("../middleware/authMiddleware");

// All routes are protected by authMiddleware
router.use(authMiddleware);

router.get("/", getIncomes);
router.get("/:id", getIncome);
router.post("/", createIncome);
router.put("/:id", updateIncome);
router.delete("/:id", deleteIncome);

module.exports = router;

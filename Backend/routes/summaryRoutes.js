const express = require("express");
const router = express.Router();
const { getMonthlySummary, getSummary, getAlerts } = require("../controllers/summaryController");
const authMiddleware = require("../middleware/authMiddleware");

// All routes are protected by authMiddleware
router.use(authMiddleware);

router.get("/monthly", getMonthlySummary);
router.get("/range", getSummary);
router.get("/alerts", getAlerts);

module.exports = router;

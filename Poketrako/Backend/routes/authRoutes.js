const express = require("express");
const router = express.Router();
const { signup, login, getMe, updateBudget, updateAvatar, googleLogin, forgotPassword, resetPassword } = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");
const uploadAvatar = require("../middleware/uploadAvatar");

router.post("/signup", signup);
router.post("/login", login);
router.post("/google", googleLogin);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.get("/me", authMiddleware, getMe);
router.put("/budget", authMiddleware, updateBudget);
router.put("/avatar", authMiddleware, uploadAvatar, updateAvatar);

module.exports = router;

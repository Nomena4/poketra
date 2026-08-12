const express = require('express');
const router = express.Router();
const companyController = require('../controllers/companyController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/', companyController.getCompanyProfile);
router.post('/', companyController.upsertCompanyProfile);

module.exports = router;

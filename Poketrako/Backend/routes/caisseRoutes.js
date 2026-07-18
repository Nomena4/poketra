const express = require('express');
const router = express.Router();
const caisseController = require('../controllers/caisseController');
const auth = require('../middleware/authMiddleware');

router.use(auth);

router.get('/', caisseController.getTransactions);
router.post('/', caisseController.createTransaction);
router.delete('/:id', caisseController.deleteTransaction);

module.exports = router;

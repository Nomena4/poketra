const express = require('express');
const router = express.Router();
const invoiceController = require('../controllers/invoiceController');
const authMiddleware = require('../middleware/authMiddleware');

const uploadInvoice = require('../middleware/uploadInvoice');

router.use(authMiddleware);

// Factures
router.get('/invoices', invoiceController.getInvoices);
router.post('/invoices', uploadInvoice, invoiceController.createInvoice);

router.patch('/invoices/:id/status', invoiceController.updateInvoiceStatus);
router.delete('/invoices/:id', invoiceController.deleteInvoice);

// Clients
router.get('/clients', invoiceController.getClients);
router.post('/clients', invoiceController.createClient);
router.delete('/clients/:id', invoiceController.deleteClient);

module.exports = router;

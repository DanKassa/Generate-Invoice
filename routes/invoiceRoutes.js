const express = require('express');
// const authMiddleware = require('../middleware/authMiddleware');
const InvoiceController = require('../controllers/invoiceController');
const CustomerController = require('../controllers/customerController');

const router = express.Router();

// Customer
router.post('/customers/customer', CustomerController.createCustomer);
// router.put('/customers/customer/:email', CustomerController.updateCustomer);
// router.get('/customers/customer/:email', CustomerController.getCustomer);
// router.get('/customers/customer/', CustomerController.getAllCustomers);
// router.delete('/customers/customer/:email', CustomerController.deleteCustomer);

// Invoice
router.post('/invoices/invoice', InvoiceController.createInvoice);
router.put('/invoices/invoice/:invoiceNumber', InvoiceController.updateInvoice);
router.get('/invoices/invoice/:invoiceNumber', InvoiceController.getInvoice);
router.get('/invoices/invoice/', InvoiceController.getAllInvoices);
router.delete('/invoices/invoice/:invoiceNumber', InvoiceController.deleteInvoice);

module.exports = router;

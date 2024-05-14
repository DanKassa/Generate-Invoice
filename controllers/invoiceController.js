const Invoice = require('../models/invoice');
const Customer = require('../models/customer');
const generateInvoicePDFAndSendEmail = require('./generateInvoiceAndSend');

const generateInvoiceNumber = () => {
  return `INV-${Date.now()}`;
};

class InvoiceController {
  static async createInvoice(req, res) {
    const customerEmail = req.body.invoiceFor.customerEmail;

    const customer = await Customer.findOne({ customerEmail });
    if (!customer) {
      return res.status(404).json({ error: 'Customer do not exist' });
    }

    try {
      const newInvoice = await Invoice.create({
        invoiceFor: {
          name: customer.name,
          customerEmail: customerEmail,
          companyName: customer.companyName,
          streetAddress: customer.streetAddress,
          city: customer.city,
          region: customer.region,
          postcode: customer.postcode,
        },
        billingTo: req.body.billingTo,
        productName: req.body.productName,
        invoiceNumber: generateInvoiceNumber(),
        invoiceDate: req.body.invoiceDate,
        dueDate: req.body.dueDate,
        items: req.body.billingItems,
        vat: req.body.vat,
        discount: req.body.discount,
        paymentStatus: req.body.paymentStatus,
      });

      if (newInvoice) {
        generateInvoicePDFAndSendEmail(newInvoice);

        return res.status(201).json(newInvoice);
      }
    } catch (error) {
      console.error(`Error occured while creating an invoice: ${error.message}`);
      return res
        .status(500)
        .json({ error: 'An error occured while creating an invoice' });
    }
  }

  // Update invoice
  static async updateInvoice(req, res) {
    const { invoiceNumber } = req.params;
    const customerEmail = req.body.invoiceFor.customerEmail;

    const invoice = await Invoice.findOne({ invoiceNumber });
    if (!invoice) {
      return res.status(404).json({ error: 'Invoice do not exist' });
    }

    const customer = await Customer.findOne({ customerEmail });
    if (!customer) {
      return res.status(404).json({ error: 'Customer do not exist' });
    }

    try {
      const updatedInvoice = await Invoice.findOneAndUpdate(
        { invoiceNumber: invoiceNumber },
        {
          billingTo: req.body.billingTo,
          productName: req.body.productName,
          dueDate: req.body.dueDate,
          items: req.body.billingItems,
          vat: req.body.vat,
          discount: req.body.discount,
          paymentStatus: req.body.paymentStatus,
        },
        { new: true }
      );

      return res.status(200).json(updatedInvoice);
    } catch (error) {
      console.error(`Error occured while updating an invoice: ${error.message}`);
      return res
        .status(500)
        .json({ error: 'An error occured while updating an invoice' });
    }
  }

  // Get a single invoice
  static async getInvoice(req, res) {
    const { invoiceNumber } = req.params;

    try {
      const invoice = await Invoice.findOne({ invoiceNumber });
      if (!invoice) {
        return res.status(404).json({ error: 'No invoice found' });
      }

      return res.status(200).json(invoice);
    } catch (error) {
      console.error(`Error occured while getting an invoice: ${error.message}`);
      return res.status(500).json({ error: 'An error occured while getting an invoice' });
    }
  }

  // Get all invoices
  static async getAllInvoices(req, res) {
    try {
      const invoice = await Invoice.find({});

      if (!invoice) {
        res.status(404).json({ error: 'No invoices found!' });
      }

      return res.status(200).json(invoice);
    } catch (error) {
      console.error(`Error occured while getting all invoice: ${error.message}`);
      return res
        .status(500)
        .json({ error: 'An error occured while getting all invoice' });
    }
  }

  // Delete invoice
  static async deleteInvoice(req, res) {
    const { invoiceNumber } = req.params;

    try {
      const deletedInvoice = await Invoice.findOneAndDelete({
        invoiceNumber: invoiceNumber,
      });

      if (!deletedInvoice) {
        return res.status(404).json({ error: 'Invoice not found' });
      }

      return res.status(200).json({ message: 'Invoice deleted successfully' });
    } catch (error) {
      console.error(`Error occured while deleting an invoice: ${error.message}`);
      return res
        .status(500)
        .json({ error: 'An error occured while deleting an invoice' });
    }
  }
}

module.exports = InvoiceController;

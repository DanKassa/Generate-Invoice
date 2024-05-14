const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
  invoiceFor: {
    name: {
      type: String,
      required: [true, 'Customer name is required'],
    },
    customerEmail: {
      type: String,
      required: [true, 'Customer email is required'],
    },
    companyName: {
      type: String,
    },
    streetAddress: { type: String },
    city: { type: String },
    region: { type: String },
    postcode: { type: String },
  },

  billingTo: {
    type: String,
    required: [true, 'BillingTo is required'],
  },
  productName: {
    type: String,
    required: [true, 'productName is required'],
  },
  invoiceNumber: {
    type: String,
    required: [true, 'invoiceNumber is required'],
  },
  invoiceDate: {
    type: String,
    required: [true, 'invoiceDate is required'],
  },
  dueDate: {
    type: String,
    required: [true, 'invoice dueDate is required'],
  },
  items: [
    {
      itemName: {
        type: String,
        required: [true, 'itemName is required'],
      },
      quantity: {
        type: Number,
        required: [true, 'quantity of item is required'],
      },
      unitPrice: {
        type: Number,
        required: [true, 'unitPrice of the item is required'],
      },
    },
  ],
  vat: {
    type: Number,
    required: [true, 'VAT is required'],
  },
  discount: {
    type: Number,
    required: [true, 'discount is required'],
  },
  paymentStatus: {
    type: String,
    required: [true, 'paymentStatus is required'],
  },
  // totalAmount: {
  //   type: Number,
  // },
});

const Invoice = mongoose.model('invoices', invoiceSchema);

module.exports = Invoice;

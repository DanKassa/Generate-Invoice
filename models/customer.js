const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  name: { type: String, Required: [true, 'Full name is required'] },
  customerEmail: {
    type: String,
    required: [true, 'Customer email is required'],
  },
  companyName: {
    type: String,
  },
  streetAddress: {
    type: String,
  },
  city: {
    type: String,
  },
  region: {
    type: String,
  },
  postcode: {
    type: String,
  },
  customerPhone: {
    type: String,
    required: [true, 'Customer phone number is required'],
  },
});

const Customer = mongoose.model('Customer', customerSchema);

module.exports = Customer;

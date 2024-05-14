const Customer = require('../models/customer');

class CustomerController {
  static async createCustomer(req, res) {
    const customer = await Customer.create({
      customerType: req.body.customerType,
      name: req.body.name,
      customerEmail: req.body.customerEmail,
      companyName: req.body.companyName,
      streetAddress: req.body.streetAddress,
      city: req.body.city,
      region: req.body.region,
      postcode: req.body.postcode,
      customerPhone: req.body.customerPhone,
    });

    return res.status(200).json(customer);
  }
}

module.exports = CustomerController;

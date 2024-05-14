const PDFDocument = require('pdfkit');
const nodemailer = require('nodemailer');
// const fs = require('fs');

require('dotenv').config();

const calculateDate = (timestamp) => {
  const date = new Date(timestamp);
  const formatedDate = `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`;

  return formatedDate;
};

let totalPrice = 0;

const calcItemPrice = (qty, price) => {
  itemPrice = Number(qty) * Number(price);
  totalPrice += itemPrice;
  return itemPrice;
};

const calcTotalPrice = (totalPrice, vat, discount) => {
  const VAT = totalPrice * (vat / 100);
  const discnt = totalPrice * (discount / 100);
  let totalItemsPrice = totalPrice + VAT - discnt;

  if (totalItemsPrice < 0) totalItemsPrice = 0;

  return totalItemsPrice;
};

const generateInvoicePDFAndSendEmail = async (invoiceData) => {
  // Create a new document
  const doc = new PDFDocument();

  // Pipe its output to file
  //   doc.pipe(fs.createWriteStream('output.pdf'));
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASS,
    },
  });

  // Email option
  const mailOptions = {
    from: process.env.EMAIL,
    to: invoiceData.invoiceFor.customerEmail,
    subject: process.env.SUBJECT,
    text: process.env.EMAIL_TEXT,
    attachments: [{ filename: 'invoice.pdf', content: doc }],
  };

  // Send email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(`Error occured while sending the email: ${error}`);
    } else {
      console.log(`Email sent: ${info.response}`);
    }
  });

  /*****************************/
  doc.rect(0, 0, doc.page.width, 40).fill('#f68934');
  /*****************************/

  /*****************************/

  doc.fontSize(14).fill('#283592').text(`${process.env.COMPANY_NAME}`);
  doc.fontSize(10).text(`${process.env.ADDRESS}`);
  doc.text(`${process.env.COUNTRY}`);
  doc.text(`${process.env.CONTACT}`);
  doc.text('\n\n');
  /*****************************/

  /*****************************/
  doc.fontSize(32).text('INVOICE', { align: 'left' });
  doc.fontSize(12).fill('#e01b84').text(`Submitted on ${invoiceData.invoiceDate}`);
  doc.underline(72, 180, doc.page.width - 148, 27, { color: '#f68934' });
  doc.text('\n\n');
  /*****************************/

  /*****************************/
  const columns = [
    { x: 72, width: 200 },
    { x: 250, width: 200 },
    { x: 400, width: 200 },
  ];

  const company =
    invoiceData.invoiceFor.companyName === null
      ? '-'
      : invoiceData.invoiceFor.companyName;

  //   Column 1
  doc.fontSize(14).fill('#000').text('Invoice for', columns[0].x, 230);
  doc.fontSize(10).fill('#444').text(`${invoiceData.invoiceFor.name}`, columns[0].x, 250);
  doc.fontSize(10).text(`${invoiceData.invoiceFor.streetAddress}`, columns[0].x, 265);
  doc.fontSize(10).text(`${company}`, columns[0].x, 280);
  doc
    .fontSize(10)
    .text(
      `${invoiceData.invoiceFor.city}, ${invoiceData.invoiceFor.region}, ${invoiceData.invoiceFor.postcode}`,
      columns[0].x,
      295
    );

  //   Column 2
  doc.fontSize(14).fill('#000').text('Billing to', columns[1].x, 230);
  doc.fontSize(10).fill('#444').text(`${invoiceData.billingTo}`, columns[1].x, 250);

  doc.fontSize(14).fill('#000').text('Product', columns[1].x, 280);
  doc.fontSize(10).fill('#444').text(`${invoiceData.productName}`, columns[1].x, 295);

  //   Column 3
  doc.fontSize(14).fill('#000').text('Invoice #', columns[2].x, 230);
  doc.fontSize(10).fill('#444').text(`${invoiceData.invoiceNumber}`, columns[2].x, 250);

  doc.fontSize(14).fill('#000').text('Due date', columns[2].x, 280);
  doc.fontSize(10).fill('#444').text(`${invoiceData.dueDate}`, columns[2].x, 295);
  /*****************************/

  /*****************************/
  doc.underline(72, 300, doc.page.width - 148, 27, { color: '#f68934' });

  const cols = [
    { x: 72, width: 200 },
    { x: 270, width: 200 },
    { x: 330, width: 200 },
    { x: 430, width: 200 },
  ];

  doc.fontSize(14).fill('#283592').text('Description', cols[0].x, 340);
  doc.fontSize(14).fill('#283592').text('Qty', cols[1].x, 340);
  doc.fontSize(14).fill('#283592').text('Unit Price', cols[2].x, 340);
  doc.fontSize(14).fill('#283592').text('Total price', cols[3].x, 340);

  let startY = 360;
  const increment = 15;

  invoiceData.items.forEach((item, idx) => {
    //   Column 1
    doc.fontSize(10).fill('#000').text(`${item.itemName}`, cols[0].x, startY);

    //   Column 2
    doc.fontSize(10).fill('#000').text(`${item.quantity}`, cols[1].x, startY);

    //   Column 3
    doc.fontSize(10).fill('#000').text(`${item.unitPrice} Birr`, cols[2].x, startY);

    //   Column 4
    doc
      .fontSize(10)
      .fill('#000')
      .text(`${calcItemPrice(item.quantity, item.unitPrice)} Birr`, cols[3].x, startY);

    // Increament startY
    startY = startY + increment;
  });
  /*****************************/

  /*****************************/
  // Column 3
  doc.underline(72, startY - 20, doc.page.width - 148, 27, { color: '#f68934' });

  doc
    .fontSize(10)
    .fill('#444')
    .text('Subtotal', cols[2].x, startY + 20);
  doc.fontSize(10).text('VAT/TAX', cols[2].x, startY + 35);
  doc.fontSize(10).text('Discount', cols[2].x, startY + 50);
  doc.fontSize(10).text('Total', cols[2].x, startY + 65);

  // Column 4
  doc.fontSize(10).text(`${totalPrice} Birr`, cols[3].x, startY + 20);
  doc.fontSize(10).text(`${invoiceData.vat}%`, cols[3].x, startY + 35);
  doc.fontSize(10).text(`${invoiceData.discount}%`, cols[3].x, startY + 50);
  doc
    .fontSize(14)
    .fill('#e01b84')
    .text(
      `${calcTotalPrice(totalPrice, invoiceData.vat, invoiceData.discount)} Birr`,
      cols[3].x,
      startY + 65
    );
  /*****************************/

  /*****************************/
  const stampX = cols[0].x + 100;
  const stampY = 400;

  doc.rotate(-45, { origin: [stampX, stampY] });
  doc.fontSize(14).fill('red').text(`${invoiceData.paymentStatus}`, stampX, stampY);
  /*****************************/

  doc.end();
};

module.exports = generateInvoicePDFAndSendEmail;

const fs = require('fs');
const credentials = JSON.parse(fs.readFileSync('./emailCredentials.json', 'utf8'));
const rp = require('request-promise');
const nodemailer = require('nodemailer');
// create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com', // server para enviar mail desde gmail
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: credentials
});


class MailerClient {
  sendEmail(mailOptions){
    return transporter.sendMail(mailOptions);

  }

}


module.exports = {
  MailerClient
};
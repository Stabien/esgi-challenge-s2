const { createTransport } = require('nodemailer');
const { config } = require('dotenv')

config()

const transporter = createTransport({
  host: 'smtp-relay.brevo.com',
  port: 587,
  auth: {
    user: process.env.SENDINBLUE_USER,
    pass: process.env.SENDINBLUE_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false
  }
});

module.exports = transporter
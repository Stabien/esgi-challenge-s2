const nodemailer = require('nodemailer')
const { config } = require('dotenv')

config()

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.GMAIL_USERNAME,
    pass: process.env.GMAIL_PASSWORD
  },
  tls: {
    rejectUnauthorized: false
  }
})

module.exports = transporter
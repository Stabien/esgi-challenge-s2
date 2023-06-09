const nodemailer = require('nodemailer')
const { config } = require('dotenv')

config()

const transporter = nodemailer.createTransport({
  service: 'maildev',
  port: 1025,
  ignoreTLS: true
})

module.exports = transporter

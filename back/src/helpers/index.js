const transporter = require('../config/mail')

exports.generateAppId = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let appId = ''

  for (let i = 0; i < 10; i++) {
    const position = Math.floor(Math.random() * (characters.length - 1))
    appId += characters[position]
  }

  return appId
}

exports.sendEmail = async (mailOptions) => {
  try {
    await transporter.sendMail(mailOptions)
  } catch (e) {
    console.log('error', e)
  }
}
const transporter = require('../config/mail')
const fs = require('fs')

exports.generateAppId = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let appId = ''

  for (let i = 0; i < 10; i++) {
    const position = Math.floor(Math.random() * (characters.length - 1))
    appId += characters[position]
  }

  return appId
}

exports.sendEmail = (mailOptions) => {
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error)
    } else {
      console.log('Email sent: ' + info.response)
    }
  })
}

exports.getIsoDateFromTimestamp = (graphPeriod) => {
  const currentTime = Date.now()
  let start = 0
  let end = 0
  switch (graphPeriod) {
    case 'D':
      start = currentTime - 86400000
      break
    case 'W':
      start = currentTime - 86400000 * 7
      break
    case 'M':
      start = currentTime - 86400000 * 30
      break
    case 'Y':
      start = currentTime - 86400000 * 365
      break

    default:
      start = currentTime - 86400000 * 30 // 1 month by default
      break
  }
  end = currentTime
  return { end, start }
}

exports.getBase64FileFromPath = (path) => {
  if (!path) {
    return null
  }

  const file = fs.readFileSync(path)
  const fileBase64 = file.toString('base64')

  return fileBase64
}
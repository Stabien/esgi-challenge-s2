const transporter = require('../config/mail')
const fetch = require('node-fetch')

exports.sendEmail = async (mailOptions) => {
  return await new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (err, info) => {
      if (err !== null) {
        console.log(err)
        reject(err)
      } else {
        resolve()
      }
    })
  })
}

exports.sendHttpRequest = async (uri, body) => {
  const options = {
    mode: 'cors',
    body: 'Vous avez reçu une alerte',
    headers: {
      'Content-Type': 'application/json',
    },
  }

  const response = await fetch(uri, options)
  const data = await response.json()

  return data
}

exports.sendAlert = async (alert) => {
  try {
    if (alert.uri) {
      await sendHttpRequest(alert.uri)
    } else {
      await sendEmail({
        from: "no-reply@esgi-challenge-s2.fr", 
        to: alert.email, 
        subject: "Nouvelle alerte sur votre dashboard", 
        text: "Vous avez reçu une nouvelle alerte"
      })
    }
  } catch {
    console.log("error sending alerts")
  }
}

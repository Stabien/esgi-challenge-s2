const transporter = require('../config/mail')
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
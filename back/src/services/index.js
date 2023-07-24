const transporter = require('../config/mail')
const s3 = require('../config/aws')

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

exports.uploadFileToS3 = async (filename, blob) =>
  await s3
    .upload({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: filename,
      Body: blob,
    })
    .promise()

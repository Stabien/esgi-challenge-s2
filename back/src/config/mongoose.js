const { config } = require('dotenv')
const mongoose = require('mongoose')

config()

const getDbConfig = () => {
  if (process.env.ENV === "prod") {
    return {
      host: process.env.PROD_MONGO_HOST,
      port: process.env.PROD_MONGO_PORT,
      database: process.env.PROD_MONGO_NAME,
      user: process.env.PROD_MONGO_USER,
      password: process.env.PROD_MONGO_PASSWORD,
    }
  } else {
    return {
      host: process.env.DEV_MONGO_HOST,
      port: process.env.DEV_MONGO_PORT,
      database: process.env.DEV_MONGO_NAME,
    }
  }
}

const { host, port, database } = getDbConfig()

const mongoConnection = mongoose.createConnection(`mongodb://${host}:${port}/${database}`)

mongoConnection.asPromise()
  .then(() => console.log('Connection established with MongoDB'))
  .catch((e) => console.log(e))

module.exports = mongoConnection
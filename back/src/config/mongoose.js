const { config } = require('dotenv')
const mongoose = require('mongoose')

config()

const getDbConfig = () => {
  if (process.env.ENV === "prod") {
    return {
      host: process.env.PROD_MONGO_HOST || 'localhost',
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
      user: process.env.DEV_MONGO_USER,
      password: process.env.DEV_MONGO_PASSWORD,
    }
  }
}

const { host, port, database, user, password } = getDbConfig()

console.log(`mongodb://${user}:${password}@${host}:${port}/${database}`)

const mongoConnection = mongoose.createConnection(`mongodb://${host}:${port}/${database}`, {
  authSource: "admin",
  user: user,
  pass: password,
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

mongoConnection.asPromise()
  .then()
  .catch((e) => console.log(e))

module.exports = mongoConnection
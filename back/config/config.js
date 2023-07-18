const { config } = require('dotenv')

config()

module.exports = {
  development: {
    username: process.env.DEV_PG_USER,
    password: process.env.DEV_PG_PASSWORD,
    database: process.env.DEV_PG_NAME,
    host: process.env.DEV_PG_HOST,
    dialect: "postgres"
  },
  production: {
    username: process.env.PROD_PG_USER,
    password: process.env.PROD_PG_PASSWORD,
    database: process.env.PROD_PG_NAME,
    host: process.env.PROD_PG_HOST,
    dialect: "postgres"
  }
}

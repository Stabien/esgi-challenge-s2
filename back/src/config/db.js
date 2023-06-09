const { config } = require('dotenv')
const { Sequelize } = require('sequelize')

config()

const dbConfig = {
  host: process.env.DEV_PG_HOST,
  port: process.env.DEV_PG_PORT,
  database: process.env.DEV_PG_NAME,
  user: process.env.DEV_PG_USER,
  password: process.env.DEV_PG_PASSWORD,
}

const { user, password, host, port, database } = dbConfig

const sequelize = new Sequelize(`postgres://${user}:${password}@${host}:${port}/${database}`)

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.')
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err)
  })


module.exports = sequelize
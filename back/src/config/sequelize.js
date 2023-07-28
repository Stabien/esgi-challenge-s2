const { config } = require('dotenv')
const { Sequelize } = require('sequelize')

config()

const getDbConfig = () => {
  if (process.env.ENV === "prod") {
    return {
      host: process.env.PROD_PG_HOST,
      port: process.env.PROD_PG_PORT,
      database: process.env.PROD_PG_NAME,
      user: process.env.PROD_PG_USER,
      password: process.env.PROD_PG_PASSWORD,
    }
  } else {
    return {
      host: process.env.DEV_PG_HOST || 'localhost',
      port: process.env.DEV_PG_PORT || 5432,
      database: process.env.DEV_PG_NAME || 'esgi_challenge_s2',
      user: process.env.DEV_PG_USER || 'postgres',
      password: process.env.DEV_PG_PASSWORD || 'postgres',
    }
  }
}
const { user, password, host, port, database } = getDbConfig()

const sequelize = new Sequelize(`postgres://${user}:${password}@${host}:${port}/${database}`, {
  define: {
    underscored: true, 
    underscoredAll: true, 
  }
})

sequelize
  .authenticate()
  .then(() => {
    // console.log('Connection has been established successfully with PostgreSQL')
  })
  .catch((err) => {
    // console.error('Unable to connect to the database:', err)
  })

module.exports = sequelize
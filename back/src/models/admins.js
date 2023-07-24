const sequelize = require('../config/sequelize')
const Sequelize = require('sequelize')

module.exports = sequelize.define(
  'admins',
  {
    uuid: {
      type: Sequelize.DataTypes.UUID,
      primaryKey: true,
      defaultValue: Sequelize.DataTypes.UUIDV4,
    },
    email: {
      type: Sequelize.STRING,
    },
    password: {
      type: Sequelize.STRING,
    },
  },
  {
    underscored: true,
    timestamps: false,
  },
)

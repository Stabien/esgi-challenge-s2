const sequelize = require('../config/sequelize')
const Sequelize = require('sequelize')
const Kbis = require('./kbis')

const Users = sequelize.define(
  'users',
  {
    uuid: {
      type: Sequelize.DataTypes.UUID,
      primaryKey: true,
      defaultValue: Sequelize.DataTypes.UUIDV4,
    },
    email: {
      type: Sequelize.DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: Sequelize.DataTypes.STRING,
      allowNull: false,
    },
    firstname: {
      type: Sequelize.DataTypes.STRING,
      allowNull: false,
    },
    lastname: {
      type: Sequelize.DataTypes.STRING,
      allowNull: false,
    },
    societyName: {
      type: Sequelize.DataTypes.STRING,
      allowNull: false,
    },
    url: {
      type: Sequelize.DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: Sequelize.DataTypes.ENUM('REJECTED', 'PENDING', 'VALIDATED'),
      allowNull: false,
    },
    kbisUuid: {
      type: Sequelize.DataTypes.UUID,
      defaultValue: Sequelize.DataTypes.UUIDV4,
      allowNull: false,
      references: 'kbis',
      referencesKey: 'uuid',
    },
    appId: {
      type: Sequelize.DataTypes.STRING,
      allowNull: false,
    }
  },
  {
    underscored: true,
    timestamps: false,
  },
)

Users.hasOne(Kbis, { as: 'kbis', foreignKey: 'userUuid' })

module.exports = Users

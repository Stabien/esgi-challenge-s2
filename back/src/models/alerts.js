const sequelize = require('../config/sequelize')
const Sequelize = require('sequelize')

module.exports = sequelize.define(
  'alerts',
  {
    uuid: {
      type: Sequelize.DataTypes.UUID,
      primaryKey: true,
      defaultValue: Sequelize.DataTypes.UUIDV4,
    },
    user_uuid: {
      type: Sequelize.DataTypes.UUID,
      references: 'user',
      referencesKey: 'uuid',
    },
    tag_uuid: {
      type: Sequelize.DataTypes.UUID,
      references: 'tags',
      referencesKey: 'uuid',
      allowNull: true,
    },
    type: {
      type: Sequelize.STRING,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    uri: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    timeBeforeNewAlert: {
      type: Sequelize.STRING,
    },
    valueToTrigger: {
      type: Sequelize.STRING,
    },
    dataType: {
      type: Sequelize.STRING,
    },
    timeScale: {
      type: Sequelize.STRING,
    },
    event: {
      type: Sequelize.STRING,
    },
    name: {
      type: Sequelize.STRING,
    },
    appId: {
      type: Sequelize.STRING,
    },
  },
  {
    underscored: true,
    timestamps: false,
  },
)

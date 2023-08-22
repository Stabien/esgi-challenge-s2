const sequelize = require('../config/sequelize')
const Sequelize = require('sequelize')

const Kbis = sequelize.define(
  'kbis',
  {
    uuid: {
      type: Sequelize.DataTypes.UUID,
      primaryKey: true,
      defaultValue: Sequelize.DataTypes.UUIDV4,
    },
    type: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    path: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    createdAt: {
      type: Sequelize.DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.DataTypes.NOW,
    },
    updatedAt: {
      type: Sequelize.DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.DataTypes.NOW,
    },
    userUuid: {
      type: Sequelize.DataTypes.UUID,
      allowNull: false,
      references: 'user',
      referencesKey: 'uuid',
    },
  },
  {
    underscored: true,
    timestamps: true,
  },
)
module.exports = Kbis

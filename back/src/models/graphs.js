const sequelize = require('../config/sequelize')
const Sequelize = require('sequelize')

module.exports = sequelize.define(
  'graphs',
  {
    uuid: {
      type: Sequelize.DataTypes.UUID,
      primaryKey: true,
      defaultValue: Sequelize.DataTypes.UUIDV4,
    },
    userUuid: {
      required: true,
      type: Sequelize.DataTypes.UUID,
      references: 'user',
      referencesKey: 'uuid',
    },
    event: {
      required: true,
      type: String,
    },
    timeScale: {
      required: true,
      type: String,
    },
    tagUuid: Sequelize.DataTypes.UUID,
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    data_type: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    graph_type: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  }, 
  {
    underscored: true,
    timestamps: true,
  },
)

const mongoose = require('mongoose')
const mongoConnection = require('../config/mongoose')

const graphsSchema = new mongoose.Schema({
  uuid: {
    type: Sequelize.DataTypes.UUID,
    primaryKey: true,
    defaultValue: Sequelize.DataTypes.UUIDV4,
  },
  userUuid: {
    required: true,
    type: Sequelize.DataTypes.UUID,
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
  timestamp: {
    required: true,
    type: Date,
  },
})

const Graphs = mongoConnection.model('graphs', graphsSchema)

module.exports = Graphs

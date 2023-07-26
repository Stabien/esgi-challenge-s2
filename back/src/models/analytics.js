const mongoose = require('mongoose')
const mongoConnection = require('../config/mongoose')

const analyticsSchema = new mongoose.Schema({ 
  appId: {
    required: true,
    type: String, 
  },
  event: {
    required: true,
    type: String, 
  },
  url: {
    required: true,
    type: String, 
  },
  sessionId: {
    required: true,
    type: String, 
  },
  htmlElement: String, 
  tagId: String, 
});

const Analytics = mongoConnection.model('analytics', analyticsSchema);

module.exports = Analytics
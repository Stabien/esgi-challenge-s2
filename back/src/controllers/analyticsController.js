const Analytics = require('../models/analytics')

exports.addAnalytics = async (req, res) => {
  const { body } = req
  const analytics = new Analytics(body)

  try {
    await analytics.save()
    return res.status(201).json(analytics)
  } catch (e) {
    throw res.status(500).json({ error: e })
  }
}

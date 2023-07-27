const Analytics = require('../models/analytics')

exports.addAnalytics = async (req, res) => {
  const { body } = req
  const analytics = new Analytics(body)

  try {
    await analytics.save()
    return res.status(201).json(analytics)
  } catch (e) {
    console.log(e)
    return res.status(500).json({ error: e })
  }
}

exports.getAnalyticsByAppId = async (req, res) => {
  try {
    const analytics = await Analytics.find({ appId: req.params.appId })
    return res.status(200).json(analytics)
  } catch (e) {
    console.log(e)
    return res.status(500).json({ error: e })
  }
}

exports.getEventByPages = async (req, res) => {
  try {
    const { appId } = req.params
    const analytics = await Analytics.aggregate([
      { $match: { appId } },
      { $group: {
          _id: { event: '$event', page: '$url' },
          count: { $sum: 1 }
        }
      }
    ])
    return res.status(200).json(analytics)
  } catch (e) {
    console.log(e)
    return res.status(500).json({ error: e })
  }
}

// exports.getVisitorsByPage = async (req, res) => {
//   try {
//     const analytics = await Analytics.find({ appId: req.params.appId })
//     return res.status(200).json(analytics)
//   } catch (e) {
//     console.log(e)
//     return res.status(500).json({ error: e })
//   }
// }

// exports.getClicksByTag = async (req, res) => {
//   try {
//     const analytics = await Analytics.find({ appId: req.params.appId })
//     return res.status(200).json(analytics)
//   } catch (e) {
//     console.log(e)
//     return res.status(500).json({ error: e })
//   }
// }

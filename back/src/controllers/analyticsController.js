const Analytics = require('../models/analytics')

exports.addAnalytics = async (req, res) => {
  const { body } = req
  const analytics = new Analytics(body)

  try {
    await analytics.save()
    return res.status(201).json(analytics)
  } catch (e) {
    console.log(e)
    return res.status(500).json({ error: 'Internal error' })
  }
}

exports.getAnalyticsByAppId = async (req, res) => {
  try {
    // const analytics = await Analytics.find({ appId: req.params.appId })
    const { appId } = req.params

    const analytics = await Analytics.aggregate([
      { $match: { appId } },
      // {
      //   $group: {},
      // },
      // {
      //   $sort: { $timestamp: -1 },
      // },
    ])
    return res.status(200).json(analytics)
  } catch (e) {
    console.log(e)
    return res.status(500).json({ error: 'Internal error' })
  }
}

exports.getEventByPages = async (req, res) => {
  try {
    const { appId } = req.params
    const analytics = await Analytics.aggregate([
      { $match: { appId } },
      {
        $group: {
          _id: { event: '$event', page: '$url' },
          count: { $sum: 1 },
        },
      },
    ])
    return res.status(200).json(analytics)
  } catch (e) {
    console.log(e)
    return res.status(500).json({ error: 'Internal error' })
  }
}

exports.getSessionByPages = async (req, res) => {
  try {
    const { appId } = req.params
    const analytics = await Analytics.aggregate([
      { $match: { appId } },
      {
        $group: {
          _id: { page: '$url', sessionId: '$sessionId' },
          count: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: '$_id.page',
          uniqueVisitors: { $sum: 1 },
        },
      },
      {
        $sort: { uniqueVisitors: -1 },
      },
    ])
    return res.status(200).json(analytics)
  } catch (e) {
    console.log(e)
    return res.status(500).json({ error: 'Internal error' })
  }
}

exports.getSessionByTags = async (req, res) => {
  try {
    const { appId } = req.params
    const analytics = await Analytics.aggregate([
      { $match: { appId } },
      {
        $group: {
          _id: { tag: '$directiveTag', sessionId: '$sessionId' },
          count: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: '$_id.tag',
          uniqueVisitors: { $sum: 1 },
        },
      },
      {
        $sort: { uniqueVisitors: -1 },
      },
    ])
    return res.status(200).json(analytics)
  } catch (e) {
    console.log(e)
    return res.status(500).json({ error: 'Internal error' })
  }
}

const Analytics = require('../models/analytics')
const Graphs = require('../models/graphs')
const { getIsoDateFromTimestamp } = require('../helpers')

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
exports.postGraphSettings =async(req,res)=>{
  try {
    const {userUuid,event,graphPeriod,graphValue,selectedTagUuid} = req.body
    const newGraphUser = await Graphs.create({
      userUuid: userUuid,
      event: event,
      timeScale:graphPeriod,
      tagUuid:selectedTagUuid ,
      timestamp:Date.now() ,
    })
    return res.status(200).json()
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: 'Internal error' })
  }
}
exports.getAnalyticsByAppId = async (req, res) => {
  try {
    const graphSettings = JSON.parse(req.params.graphSettings)
    const { appId, graphValue, graphSize, graphPeriod, selectedTags, event } = graphSettings

    const { start, end } = getIsoDateFromTimestamp(graphPeriod)

    const aggregateTunnel = [
      { $match: { appId } },
      {
        $match: {
          timestamp: {
            $gte: new Date(start),
            $lt: new Date(end),
          },
        },
      },
      { $match: { event } },
    ]

    if (!!selectedTags) aggregateTunnel.push({ $match: { directiveTag: selectedTags } })

    const analytics = await Analytics.aggregate(aggregateTunnel)
    return res.status(200).json({analytics,start, end})
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

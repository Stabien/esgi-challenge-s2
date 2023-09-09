const Analytics = require('../models/analytics')
const Tags = require('../models/tags')
const Graphs = require('../models/graphs')
const Alerts = require('../models/alerts')
const { sendAlert } = require('../services')
const { getIsoDateFromTimestamp } = require('../helpers')

exports.postGraphSettings = async (req, res) => {
  try {
    const { userUuid, event, graphPeriod, selectedTagUuid, name, dataType, graphType, graphSize } =
      req.body
    const graph = {
      userUuid,
      event,
      name,
      timeScale: graphPeriod,
      tagUuid: selectedTagUuid,
      data_type: dataType,
      graph_type: graphType,
      graph_size: graphSize,
    }
    const newGraphUser = await Graphs.create(graph)
    await newGraphUser.save()
    return res.status(200).json({ newGraphUser })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: 'Internal error' })
  }
}
exports.getGraphSettings = async (req, res) => {
  try {
    const { params } = req

    const graphs = await Graphs.findAll({ where: { userUuid: params.uuid } })
    return res.status(200).json(graphs)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: 'Internal error' })
  }
}
exports.putGraphSettings = async (req, res) => {
  try {
    const { uuid } = req.params

    await Graphs.update(req.body, { where: { uuid } })
    return res.send(200)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: 'Internal error' })
  }
}
exports.deleteGraphSettings = async (req, res) => {
  try {
    const { uuid } = req.params
    const tag = await Graphs.destroy({
      where: {
        uuid: uuid,
      },
    })
    Alerts.destroy({
      where: {
        graphUuid: uuid,
      },
    })

    return res.status(201).json(tag)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: 'Internal error' })
  }
}

exports.addAnalytics = async (req, res) => {
  try {
    const { body } = req
    const analytics = new Analytics(body)
    await analytics.save()
    handleAlerts(body)
    return res.status(201).json(analytics)
  } catch (e) {
    console.log(e)
    return res.status(500).json({ error: 'Internal error' })
  }
}
exports.getAnalyticsByAppId = async (req, res) => {
  try {
    const graphSettings = JSON.parse(req.params.graphSettings)
    const { appId, timeScale, tagUuid, event } = graphSettings

    const { start, end } = getIsoDateFromTimestamp(timeScale)

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
    ]
    if (event === 'CTR') {
      aggregateTunnel.push({
        $match: {
          $or: [{ event: 'click' }, { event: 'print' }],
        },
      })
    } else if (event === 'funnel') {
    } else {
      aggregateTunnel.push({ $match: { event } })
    }
    if (tagUuid > 0) {
      const tagList = []
      for (const tagUuidItem of tagUuid) {
        const tags = await Tags.findOne({ where: { uuid: tagUuidItem } })
        tagList.push(tags.dataValues)
      }

      aggregateTunnel.push({
        $match: {
          $or: tagList.map((t) => ({
            directiveTag: t.name,
          })),
        },
      })

      // aggregateTunnel.push({ $match: { directiveTag: tags.dataValues.name } })
    }

    const analytics = await Analytics.aggregate(aggregateTunnel)
    // console.log(analytics)
    return res.status(200).json({ analytics, start, end })
  } catch (e) {
    console.log(e)
    return res.status(500).json({ error: 'Internal error' })
  }
}

exports.getHeatmapPossibility = async (req, res) => {
  try {
    const graphSettings = JSON.parse(req.params.graphSettings)
    const { appId, graphPeriod, selectedTags, event } = graphSettings
    const { start, end } = getIsoDateFromTimestamp(graphPeriod)
    console.log('start', start)
    console.log('end', end)
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
      { $match: { event: 'click' } },
      {
        $match: {
          x: { $exists: true },
          y: { $exists: true },
        },
      },
      {
        $group: {
          _id: null,
          uniqueUrls: { $addToSet: '$url' },
        },
      },
      {
        $project: {
          _id: 0,
          uniqueUrls: 1,
        },
      },
    ]
    const analytics = await Analytics.aggregate(aggregateTunnel)
    console.log('analytics', analytics)
    return res.status(200).json(analytics)
  } catch (e) {
    console.log(e)
    return res.status(500).json({ error: 'Internal error' })
  }
}
exports.getHeatmapData = async (req, res) => {
  try {
    const graphSettings = JSON.parse(req.params.graphSettings)
    const { appId, graphPeriod, selectedTags, event, url } = graphSettings
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
      { $match: { event: 'click' } },
      { $match: { url: url } },
      {
        $match: {
          x: { $exists: true },
          y: { $exists: true },
        },
      },
    ]
    const analytics = await Analytics.aggregate(aggregateTunnel)
    return res.status(200).json(analytics)
  } catch (e) {
    console.log(e)
    return res.status(500).json({ error: 'Internal error' })
  }
}

const handleAlerts = async (body) => {
  try {
    //1-Fetch alerts by appId
    const alertsList = await Alerts.findAll({ where: { appId: body.appId } })

    //2-Fetch graphs that are associated to the alerts
    let associedGraph = new Array(alertsList.length).fill(undefined)
    for (const [index, alertsDoc] of alertsList.entries()) {
      const graphUuid = alertsDoc.dataValues.graphUuid
      const graph = await Graphs.findOne({ where: { uuid: graphUuid } })
      associedGraph[index] = graph.dataValues
    }
    if (associedGraph.length <= 0) return

    //3-For each associed Graph, get the data
    let associedData = new Array(associedGraph.length).fill(undefined)
    for (const [index, graphSettings] of associedGraph.entries()) {
      const { timeScale, tagUuid, event } = graphSettings
      const { appId } = body
      const { start, end } = getIsoDateFromTimestamp(timeScale)
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
      ]
      if (event === 'CTR') {
        aggregateTunnel.push({
          $match: {
            $or: [{ event: 'click' }, { event: 'print' }],
          },
        })
      } else if (event === 'funnel') {
      } else {
        aggregateTunnel.push({ $match: { event } })
      }
      if (tagUuid.length > 0) {
        const tagList = []
        for (const tagUuidItem of tagUuid) {
          const tags = await Tags.findOne({ where: { uuid: tagUuidItem } })
          tagList.push(tags.dataValues)
        }
        aggregateTunnel.push({
          $match: {
            $or: tagList.map((t) => ({
              directiveTag: t.name,
            })),
          },
        })

        // aggregateTunnel.push({ $match: { directiveTag: tags.dataValues.name } })
      }
      const analytics = await Analytics.aggregate(aggregateTunnel)
      associedData[index] = analytics
    }

    //4-check if need to send alerts
    for (const [index, graph] of associedGraph.entries()) {
      //X-Check if need to send alerts (too soon)
      let value = null
      switch (graph.event) {
        case 'click':
          console.log('click')
          value = getLength(graph, associedData[index])

        case 'newSession':
          console.log('newMission')
          value = getLength(graph, associedData[index])

        case 'print':
          console.log('print')
          value = getLength(graph, associedData[index])
        case 'CTR':
          console.log('CTR')
          value = getCTRBy(graph, associedData[index])
        case 'funnel':
          console.log('funnel')
          value = await getFunnel(graph, associedData[index])

        default:
          value = getLength(graph, associedData[index])
      }

      const valueToTrigger = parseInt(alertsList[index].dataValues.valueToTrigger)
      if (value >= valueToTrigger) {
        console.log('GONNA SEND ALERTS')
        //X-Send the alerts
        sendAlert(alertsList[index].dataValues)
      }
    }
  } catch (error) {
    console.log(error)
  }
}

//need to make the count for every function, but not by day
const getLength = (graphSettings, data) => {
  // console.log('length', data.length)
  return data.length
}
const getCTRBy = (graphSettings, data) => {
  const c = data.filter((d) => d.event === 'click').length
  const p = data.filter((d) => d.event === 'print').length

  //return ratios CTR
  // console.log('c', c)
  // console.log('p', p)
  // console.log('ctr', (c * 100 + 1) / (p + 1))
  return (c * 100 + 1) / (p + 1)
}
const getFunnel = async (graphSettings, data) => {
  try {
    let associedTags = new Array(graphSettings.tagUuid.length).fill(undefined)
    let associedValues = new Array(graphSettings.tagUuid.length).fill(undefined)

    for (const [index, tagUuid] of graphSettings.tagUuid.entries()) {
      const graph = await Tags.findOne({ where: { uuid: tagUuid } })
      associedTags[index] = graph.dataValues
      associedValues[index] = data.filter((d) => d.directiveTag === graph.dataValues.name).length
    }

    const firstValue = associedValues[0]
    const last = associedValues[associedValues.length - 1]
    // console.log(firstValue)
    // console.log('funnel', (last * 100 + 1) / (firstValue + 1))
    return (last + 1) / (firstValue + 1)
  } catch (error) {
    console.log(error)
  }
}

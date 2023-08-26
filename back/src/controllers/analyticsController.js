const Analytics = require('../models/analytics')
const Tags = require('../models/tags')
const Graphs = require('../models/graphs')
const { getIsoDateFromTimestamp } = require('../helpers')



exports.postGraphSettings =async(req,res)=>{
  try {
    const {userUuid , event, graphPeriod, selectedTagUuid, name, dataType, graphType,graphSize} = req.body
    const graph={
      userUuid,
      event,
      name,
      timeScale: graphPeriod,
      tagUuid: !!selectedTagUuid?selectedTagUuid:null,
      data_type: dataType,
      graph_type: graphType,
      graph_size:graphSize

    }
    console.log(graph);
    const newGraphUser = await Graphs.create(graph)
    await newGraphUser.save()
    return res.status(200).json({ newGraphUser })
    
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: 'Internal error' })
  }
}
exports.getGraphSettings=async(req,res)=>{
  try {
    const { params } = req

    const graphs = await Graphs.findAll({ where: { userUuid:params.uuid } })
    return res.status(200).json(graphs)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: 'Internal error' })
  }
}
exports.putGraphSettings=async(req,res)=>{
  try {
    const { uuid } = req.params

    await Graphs.update(req.body, { where: { uuid } })
    return res.send(200)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: 'Internal error' })
  }
}
exports.deleteGraphSettings=async(req,res)=>{
  try {

    const { uuid } = req.params
    const tag = await Graphs.destroy({
      where: {
        uuid: uuid,
      },
    })
    return res.status(201).json(tag)

  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: 'Internal error' })
  }
}

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
    if(event==="CTR"){
      
      aggregateTunnel.push({
        $match: {
          $or: [
            { event: 'click' },
            { event: 'print' }
          ]
        }
      })
    }else{
      aggregateTunnel.push({ $match: { event } })
      
    }
    if (!!tagUuid) {
      const tags = await Tags.findOne({ where: { uuid:tagUuid } })
      aggregateTunnel.push({ $match: { directiveTag: tags.dataValues.name } })
    }

    const analytics = await Analytics.aggregate(aggregateTunnel)
    console.log(analytics);
    return res.status(200).json({analytics,start, end})
  } catch (e) {
    console.log(e)
    return res.status(500).json({ error: 'Internal error' })
  }
}

exports.getHeatmapPossibility=async(req,res)=>{
  try {
    const graphSettings = JSON.parse(req.params.graphSettings)
    const { appId,  graphPeriod, selectedTags, event } = graphSettings
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
      { $match: { event:'click' } }, 
      {
        $match: {
          x: { $exists: true },
          y: { $exists: true }
        }
      },{
        $group: {
          _id: null,
          uniqueUrls: { $addToSet: "$url" }
        }
      },
      {
        $project: {
          _id: 0,
          uniqueUrls: 1
        }
      },
    ]
    const analytics = await Analytics.aggregate(aggregateTunnel)
    return res.status(200).json(analytics)

  } catch (e) {
    console.log(e)
    return res.status(500).json({ error: 'Internal error' })
  }
}
exports.getHeatmapData = async(req,res)=>{
  try {
    const graphSettings = JSON.parse(req.params.graphSettings)
    const { appId,  graphPeriod, selectedTags, event,url } = graphSettings
    const { start, end } = getIsoDateFromTimestamp(graphPeriod)
    console.log(url);

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
      { $match: { event:'click' } }, 
      { $match: { url:url } }, 
      {
        $match: {
          x: { $exists: true },
          y: { $exists: true }
        }
      },
    ]
    const analytics = await Analytics.aggregate(aggregateTunnel)
    return res.status(200).json(analytics)

  } catch (e) {
    console.log(e)
    return res.status(500).json({ error: 'Internal error' })
  }
}



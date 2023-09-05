const { randomUUID } = require('crypto')
const Alerts = require('../models/alerts')

exports.getAlertsByUserUuid = async (req, res) => {
  const { appId } = req.params
  console.log(appId);
  try {
    const alert = await Alerts.findAll({ where: { app_id:appId } })
    return res.status(200).json(alert)
  } catch (e) {
    console.log(e)
    return res.status(500).json({ error: 'Internal error' })
  }
}

exports.addAlert = async (req, res) => {
  const { body } = req
  const uuid = randomUUID()
  const dataAlert = {
    uuid,
    appId:body.app_id,
    graphUuid: body.graphUuid,
    type:body.type,
    email:body.email,
    uri:body.uri,
    name: body.name,
    timeBeforeNewAlert: body.time_before_new_alert,
    timeScale: body.time_scale,
    valueToTrigger:body.valueToTrigger
  }
  console.log(dataAlert);
  try {
    const alert = await Alerts.create(dataAlert)
    alert.save()
    return res.status(201).json(alert)
  } catch (e) {
    console.log(e)
    return res.status(500).json({ error: 'Internal error' })
  }
}

exports.putAlerts = async (req, res) => {
  try {
    const { uuid } = req.params
console.log(req.body);
    await Alerts.update({...req.body,timeScale:req.body.time_scale,timeBeforeNewAlert:req.body.time_before_new_alert }, { where: { uuid } })
    return res.send(200)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: 'Internal error' })
  }
}

exports.deleteAlerts = async (req, res) => {
  try {
    const { uuid } = req.params

    const tag = await Alerts.destroy({
      where: {
        uuid,
      },
    })
    return res.status(201).json(tag)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: 'Internal error' })
  }
}

const { randomUUID } = require('crypto')
const Alerts = require('../models/alerts')

exports.getAlertsByUserUuid = async (req, res) => {
  const { userUuid } = req.params
  try {
    const alert = await Alerts.findAll({ where: { userUuid } })
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
    ...body,
    name: body.name,
    event: body.event,
    dataType: body.data_type,
    timeScale: body.time_scale,
    timeBeforeNewAlert: body.time_before_new_alert,
    user_uuid: body.userUuid,
    tag_uuid: body.tagUuid,
    value_to_trigger: body.valueToTrigger,
  }
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
    const { userUuid } = req.params

    await Alerts.update(req.body, { where: { uuid: userUuid } })
    return res.send(200)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: 'Internal error' })
  }
}

exports.deleteAlerts = async (req, res) => {
  try {
    const { userUuid } = req.params

    const tag = await Alerts.destroy({
      where: {
        uuid: userUuid,
      },
    })
    return res.status(201).json(tag)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: 'Internal error' })
  }
}

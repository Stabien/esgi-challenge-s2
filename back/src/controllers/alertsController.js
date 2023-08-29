const { randomUUID } = require('crypto')
const Alerts = require('../models/alerts')

exports.getAlertsByUserUuid = async (req, res) => {
  const { userUuid } = req.params
  try {
    const alert = await Alerts.findAll({ where: { userUuid }})
    return res.status(200).json(alert)
  } catch (e) {
    console.log(e)
    return res.status(500).json({ error: 'Internal error' })
  }
}

exports.addAlert = async (req, res) => {
  const { body } = req
  const uuid = randomUUID()
  const dataAlert = { uuid, ...body, user_uuid: body.userUuid, tag_uuid: body.tagUuid }

  try {
    const alert = await Alerts.create(dataAlert)
    alert.save()
    return res.status(201).json(alert)
  } catch (e) {
    console.log(e)
    return res.status(500).json({ error: 'Internal error' })
  }
}
const { randomUUID } = require('crypto')
const Tags = require('../models/tags')

exports.getTagsByUserUuid = async (req, res) => {
  const { uuid: userUuid } = req.params
  try {
    const tags = await Tags.findAll({ where: { userUuid } })
    return res.status(200).json(tags)
  } catch (e) {
    return res.status(500).json({ error: e })
  }
}

exports.addTag = async (req, res) => {
  const { body } = req
  const { uuid: userUuid } = req.params
  const uuid = randomUUID()
  const dataTag = { ...body, uuid, userUuid }
  try {
    const tag = await Tags.create(dataTag)
    tag.save()
    return res.status(201).json(tag)
  } catch (e) {
    return res.status(500).json({ error: e })
  }
}

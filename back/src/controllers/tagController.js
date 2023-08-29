const { randomUUID } = require('crypto')
const Tags = require('../models/tags')

exports.getTagsByUserUuid = async (req, res) => {
  const { uuid: userUuid } = req.params
  try {
    const tags = await Tags.findAll({ where: { userUuid } })
    return res.status(200).json(tags)
  } catch (e) {
    return res.status(500).json({ error: 'Internal error' })
  }
}
exports.getTagsByTagUuid = async (req, res) => {
  try {
    const { uuid: tagUuid } = req.params
    const tagList = tagUuid.split(',')
    const tagNameList = []
    for (const tag of tagList) {
      const tags = await Tags.findOne({ where: { uuid: tag } })
      tagNameList.push(tags.dataValues.name)
    }
    return res.status(200).json(tagNameList)
  } catch (e) {
    return res.status(500).json({ error: 'Internal error' })
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
    console.log(e)
    return res.status(500).json({ error: 'Internal error' })
  }
}
exports.deleteTag = async (req, res) => {
  try {
    const { uuid } = req.params
    console.log(uuid)
    const tag = await Tags.destroy({
      where: {
        uuid: uuid,
      },
    })
    console.log('destroyed')
    return res.status(201).json(tag)
  } catch (e) {
    console.log(e)
    return res.status(500).json({ error: 'Internal error' })
  }
}

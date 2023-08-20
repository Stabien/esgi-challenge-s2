const jwt = require('jsonwebtoken')
const { config } = require('dotenv')
const crypto = require('crypto')
const bcrypt = require('bcrypt')
const Users = require('../models/users')
const Kbis = require('../models/kbis')
const { sendEmail } = require('../services')
const { generateAppId } = require('../helpers')
const multer = require('multer')

config()

const checkIfUserAlreadyExists = async (email) => {
  const user = await Users.findOne({ where: { email } })

  return user !== null
}

exports.getUserByUuid = async (req, res) => {
  try {
    const user = await Users.findOne({ where: { uuid: req.params.uuid } })
    console.log(user.dataValues.kbisUuid)
    const kbis = await Kbis.findOne({ where: { uuid: user.dataValues.kbisUuid } })
    console.log(kbis)
    return res.status(200).json(user)
  } catch (e) {
    return res.status(500).json({ error: 'Internal error' })
  }
}
exports.getUserKbisByUuid = async (req, res) => {
  try {
    const user = await Kbis.findOne({ where: { uuid: req.params.uuid } })
    return res.status(200).json(user)
  } catch (e) {
    return res.status(500).json({ error: 'Internal error' })
  }
}

exports.authentication = async (req, res) => {
  const { email, password } = req.body
  try {
    const user = await Users.findOne({ where: { email } })
    if (user === null) {
      return res.status(404).json({ error: 'User not found' })
    }
    if (!bcrypt.compareSync(password, user.password)) {
      return res.status(404).json({ error: 'User not found' })
    }

    const { uuid, firstname, lastname, appId, societyName, url, status } = user
    const token = jwt.sign(
      { uuid, isAdmin: false, firstname, email, lastname, appId, societyName, url, status },
      process.env.JWT_KEY,
    )
    return res.status(200).json({ token })
  } catch (e) {
    console.log(e)
    return res.status(500).json({ error: 'Internal error' })
  }
}

exports.getUserToken = async (req, res) => {
  try {
    const user = await Users.findOne({ where: { uuid: req.params.uuid } })
    if (user === null) {
      return res.status(404).json({ error: 'User not found' })
    }

    const { uuid, email, firstname, lastname, appId, societyName, url, status } = user
    const token = jwt.sign(
      { uuid, isAdmin: false, firstname, email, lastname, appId, societyName, url, status },
      process.env.JWT_KEY,
    )
    return res.status(200).json({ token })
  } catch (e) {
    console.log(e)
    return res.status(500).json({ error: 'Internal error' })
  }
}

exports.registration = async (req, res, next) => {
  const { email, password, confirmPassword, firstname, lastname, societyName, url } = req.body
  const { file } = req

  if (password !== confirmPassword) {
    return res.status(422).json({ error: "Passwords don't match" })
  }

  try {
    const userUuid = crypto.randomUUID()
    const kbisUuid = crypto.randomUUID()
    const appId = generateAppId()
    const hashedPassword = bcrypt.hashSync(password, 10)
    const doesUserAlreadyExists = await checkIfUserAlreadyExists(email)

    if (doesUserAlreadyExists) {
      return res.status(422).json({ error: 'User already exists' })
    }

    console.log("**** user uuid:", userUuid, " ****")

    const newUser = await Users.create({
      uuid: userUuid,
      email,
      password: hashedPassword,
      societyName,
      url,
      firstname,
      lastname,
      status: 'PENDING',
      kbisUuid,
      appId,
    })

    const newKbis = await Kbis.create({
      uuid: kbisUuid,
      path: file.path,
      name: file.originalname,
      type: file.mimetype,
      userUuid
    })

    await newUser.save()
    await newKbis.save()

    sendEmail({
      to: email,
      from: 'noreply@esgi-tracking.fr',
      subject: 'Account activation',
      text: 'Votre compte est en attente de validation par un administrateur'
    })

    const response = { ...newUser.dataValues }
    delete response.password

    return next()
  } catch (e) {
    console.log(e)
    return res.status(500).json({ error: 'Internal error' })
  }
}

exports.updateUser = async (req, res) => {
  const { uuid } = req.params

  try {
    Users.update(
      {
        ...req.body,
      },
      { where: { uuid } },
    )

    return res.status(200).json({})
  } catch (e) {
    console.log(e)
    return res.status(500).json({ error: 'Internal error' })
  }
}

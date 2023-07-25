const jwt = require('jsonwebtoken')
const { config } = require('dotenv')
const crypto = require('crypto')
const bcrypt = require('bcrypt')
const Users = require('../models/users')
const Kbis = require('../models/kbis')
const { sendEmail } = require('../services')

config()

const checkIfUserAlreadyExists = async (email) => {
  const user = await Users.findOne({ where: { email } })

  return user !== null
}

exports.getUserByUuid = async (req, res) => {
  try {
    const user = await Users.findOne({ where: { uuid: req.params.uuid } })
    return res.status(200).json(user)
  } catch (e) {
    throw res.status(500).json({ error: e })
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

    const { uuid, firstname, lastname } = user
    const token = jwt.sign({ uuid, isAdmin: false }, process.env.JWT_KEY)

    return res.status(200).json({
      user: {
        uuid,
        email: user.email,
        firstname,
        lastname,
        token,
      },
    })
  } catch (e) {
    throw res.status(500).json({ error: e })
  }
}

exports.registration = async (req, res) => {
  const { email, password, confirmPassword, firstname, lastname, societyName, url } = req.body
  const { file } = req

  if (password !== confirmPassword) {
    return res.status(422).json({ error: "Passwords don't match" })
  }

  try {
    const userUuid = crypto.randomUUID()
    const kbisUuid = crypto.randomUUID()
    const hashedPassword = bcrypt.hashSync(password, 10)
    const doesUserAlreadyExists = await checkIfUserAlreadyExists(email)

    if (doesUserAlreadyExists) {
      return res.status(422).json({ error: 'User already exists' })
    }

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
    })

    const newKbis = await Kbis.create({
      uuid: kbisUuid,
      path: file.path,
      name: file.originalname,
      type: file.mimetype,
    })

    await newUser.save()
    await newKbis.save()

    // await sendEmail({
    //   to: email,
    //   from: 'noreply@esgi-ads.fr',
    //   subject: 'Account activation',
    //   text: 'Votre compte est en attente de validation par un administrateur'
    // })

    const response = { ...newUser.dataValues }
    delete response.password

    return res.status(201).json(response)
  } catch (e) {
    throw res.status(500).json({ error: e })
  }
}

exports.updateUser = async (req, res) => {
  const { uuid } = req.params

  try {
    const user = await Users.create({ uuid })

    user.update({
      ...req.body,
    })

    return res.status(200).json(user)
  } catch (e) {
    throw res.status(500).json({ error: e })
  }
}

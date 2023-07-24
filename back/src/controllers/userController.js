const jwt = require('jsonwebtoken')
const { config } = require('dotenv')
const crypto = require('crypto')
const bcrypt = require('bcrypt')
const User = require('../models/users')

config()

const checkIfUserAlreadyExists = async (email) => {
  const user = await User.findOne({ where: { email } })

  return user !== null
}

exports.getUserByUuid = async (req, res) => {
  try {
    const user = await User.findOne({ where: { uuid: req.params.uuid } })
    return res.status(200).json(user)
  } catch (e) {
    return res.status(500).json({ error: e })
  }
}

exports.authentication = async (req, res) => {
  const { email, password } = req.body

  try {
    const user = await User.findOne({ where: { email } })

    if (user !== null) {
      if (!bcrypt.compareSync(password, user.password)) {
        return res.status(404).json({ error: 'User not found' })
      }

      const { uuid, firstname, lastname } = user
      const token = jwt.sign({ uuid }, process.env.JWT_KEY)

      return res.status(200).json({
        user: {
          uuid,
          email: user.email,
          firstname,
          lastname,
          token,
        },
      })
    } else {
      return res.status(404).json({ error: 'User not found' })
    }
  } catch (e) {
    return res.status(500).json({ error: e })
  }
}

exports.registration = async (req, res) => {
  const { email, password, confirmPassword, firstname, lastname, societyName, url, kbis } = req.body

  if (password !== confirmPassword) {
    return res.status(422).json({ error: "Passwords don't match" })
  }

  try {
    const uuid = crypto.randomUUID()
    const hashedPassword = bcrypt.hashSync(password, 10)
    const doesUserAlreadyExists = await checkIfUserAlreadyExists(email)

    if (doesUserAlreadyExists) {
      return res.status(422).json({ error: 'User already exists' })
    }

    const newUser = await User.create({
      uuid,
      email,
      password: hashedPassword,
      societyName,
      url,
      kbis,
      firstname,
      lastname,
    })
    await newUser.save()

    return res.status(201).json(newUser)
  } catch (e) {
    return res.status(500).json({ error: e })
  }
}

exports.updateUser = async (req, res) => {
  const { uuid } = req.params

  try {
    const user = await User.create({ uuid })

    user.update({
      ...req.body,
    })

    return res.status(200).json(user)
  } catch (e) {
    return res.status(500).json({ error: e })
  }
}

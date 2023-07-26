const jwt = require('jsonwebtoken')
const { config } = require('dotenv')
const bcrypt = require('bcrypt')
const Admins = require('../models/admins')
const Users = require('../models/users')

config()

exports.adminAuthentication = async (req, res) => {
  const { email, password } = req.body

  try {
    const admin = await Admins.findOne({ where: { email } })

    if (admin === null) {
      return res.status(404).json({ error: 'Admin not found' })
    }

    if (!bcrypt.compareSync(password, admin.password)) {
      return res.status(404).json({ error: 'Admin not found' })
    }

    const { uuid } = admin
    const token = jwt.sign({ uuid, isAdmin: true }, process.env.JWT_KEY)

    return res.status(200).json({
      admin: {
        uuid,
        email: admin.email,
        token,
      },
    })
  } catch (e) {
    return res.status(500).json({ error: e })
  }
}

exports.getUserRegistrations = async (req, res) => {
  try {
    const userRegistrations = await Users.findAll()
    // const userRegistrations = await Users.findAll({ where: { status: 'PENDING' } })
    return res.status(200).json(userRegistrations)
  } catch (e) {
    return res.status(500).json({ error: e })
  }
}

exports.validateUser = async (req, res) => {
  const { uuid } = req.params
  console.log(uuid)
  try {
    await Users.update({ status: 'VALIDATED' }, { where: { uuid } })
    return res.send(200)
  } catch (e) {
    return res.status(500).json({ error: e })
  }
}
exports.pendingUser = async (req, res) => {
  const { uuid } = req.params
  try {
    await Users.update({ status: 'PENDING' }, { where: { uuid } })
    return res.send(200)
  } catch (e) {
    return res.status(500).json({ error: e })
  }
}

exports.rejectUser = async (req, res) => {
  const { uuid } = req.params
  try {
    const user = await Users.update({ status: 'REJECTED' }, { where: { uuid } })

    return res.status(200).json(user)
  } catch (e) {
    return res.status(500).json({ error: e })
  }
}

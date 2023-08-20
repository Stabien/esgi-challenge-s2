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
    const token = jwt.sign({ uuid, isAdmin: true, email: admin.email }, process.env.JWT_KEY)

    return res.status(200).json({ token })
  } catch (e) {
    return res.status(500).json({ error: 'Internal error' })
  }
}

exports.getUserRegistrations = async (req, res) => {
  try {
    const userRegistrations = await Users.findAll({ attributes: { exclude: ['password'] }})
    return res.status(200).json(userRegistrations)
  } catch (e) {
    return res.status(500).json({ error: 'Internal error' })
  }
}

exports.handleUserStatus = async (req, res) => {
  const { uuid } = req.params
  const { status } = req.body
  try {
    await Users.update({ status: status }, { where: { uuid } })
    return res.send(200)
  } catch (e) {
    return res.status(500).json({ error: 'Internal error' })
  }
}

// exports.validateUser = async (req, res) => {
//   const { uuid } = req.params
//   try {
//     await Users.update({ status: 'VALIDATED' }, { where: { uuid } })
//     return res.send(200)
//   } catch (e) {
//     return res.status(500).json({ error: 'Internal error' })
//   }
// }

// exports.pendingUser = async (req, res) => {
//   const { uuid } = req.params
//   try {
//     await Users.update({ status: 'PENDING' }, { where: { uuid } })
//     return res.send(200)
//   } catch (e) {
//     return res.status(500).json({ error: 'Internal error' })
//   }
// }

// exports.rejectUser = async (req, res) => {
//   const { uuid } = req.params
//   try {
//     await Users.update({ status: 'REJECTED' }, { where: { uuid } })
//     return res.send(200)
//   } catch (e) {
//     return res.status(500).json({ error: 'Internal error' })
//   }
// }

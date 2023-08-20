const jwt = require('jsonwebtoken')
const { config } = require('dotenv')
const bcrypt = require('bcrypt')
const Admins = require('../models/admins')
const Users = require('../models/users')
const Kbis = require('../models/kbis')
const { getBase64FileFromPath } = require('../helpers')

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
    const userRegistrations = await Users.findAll({ 
      include: { 
        model: Kbis, 
        as: "kbis" 
      }, 
      attributes: { 
        exclude: ['password'] 
      }
    })
    const response = userRegistrations.map(el => el.get({ plain: true }))
    const data = response.map(user => {
      if (!user.kbis) {
        return user
      }
      user.kbis.file = getBase64FileFromPath(user?.kbis?.path)
      return user
    })

    return res.status(200).json(data)
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

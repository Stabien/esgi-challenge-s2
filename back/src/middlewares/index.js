const jwt = require('jsonwebtoken')
const { config } = require('dotenv')
const { regexUuid, userRules } = require('../models/users')
const Admins = require('../models/admins')

config()

const verifyUserToken = (req) => {
  const token = req.get('Authorization')
  const SECRET_KEY = process.env.JWT_KEY

  if (token === undefined) {
    return null
  }

  return jwt.verify(token.split(' ')[1], SECRET_KEY, { algorithms: ['HS256'] })
}

exports.checkUserModel = (req, res, next) => {
  const { email: emailRule, password: passwordRule } = userRules
  const { email, password } = req.body

  if (!emailRule.test(email) || !passwordRule.test(password)) {
    return res.status(422).json({ error: 'Invalid field value' })
  }
  return next()
}

/**
 * Verify if request param is uuid type.
 */
exports.isParamUuid = (req, res, next) => {
  if (!regexUuid.test(req.params.uuid)) {
    return res.status(422).json({ error: 'Invalid parameter' })
  }
  return next()
}

/**
 * Verify only token format.
 */
exports.checkUserTokenFormat = (req, res, next) => {
  const token = verifyUserToken(req)

  if (token !== null) {
    res.locals.userUuid = token.uuid
    return next()
  } else {
    return res.status(401).json({ error: 'Invalid token' })
  }
}

/**
 * Verify token format and user uuid.
 */
exports.checkUserTokenUuid = (req, res, next) => {
  const token = verifyUserToken(req)

  if (token === undefined || token === null) {
    return res.status(401).json({ error: 'Invalid token' })
  }

  if (!token.hasOwnProperty('uuid')) {
    return res.status(401).json({ error: 'Invalid token' })
  }

  if (token.uuid !== req.params.uuid) {
    return res.status(401).json({ error: 'Not authorized' })
  }

  return next()
}

exports.isAdmin = async (req, res, next) => {
  const token = verifyUserToken(req)

  if (token === undefined || token === null) {
    return res.status(401).json({ error: 'Invalid token' })
  }

  if (!token.hasOwnProperty('uuid')) {
    return res.status(401).json({ error: 'Invalid token' })
  }
  try {
    const admin = await Admins.findOne({ where: { uuid: token.uuid } })
    if (!admin) {
      return res.status(404).json({ error: 'Admin not found' })
    }
    return next()
  } catch (e) {
    return res.status(500).json({ error: e })
  }
}

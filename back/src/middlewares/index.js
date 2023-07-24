const jwt = require('jsonwebtoken')
const { config } = require('dotenv')
const { regexUuid, userRules } = require('../models/users')

config()

/**
 * Check token format.
 * If format is correct, returns token data.
 * Otherwise returns undefined.
 */
const verifyUserToken = (req) => {
  const token = req.get('Authorization')
  const SECRET_KEY = process.env.JWT_KEY
  let response

  if (token !== undefined) {
    jwt.verify(token.split(' ')[1], SECRET_KEY, { algorithms: ['HS256'] }, (error, decoded) => {
      if (error === null) {
        response = decoded
      }
    })
  }
  return response
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
  const paramName = Object.keys(req.params)[0]

  if (token === undefined) {
    return res.status(401).json({ error: 'Invalid token' })
  }

  if (!token.hasOwnProperty('uuid')) {
    return res.status(401).json({ error: 'Invalid token' })
  }

  if (token.uuid === req.params[paramName]) {
    return next()
  } else {
    return res.status(401).json({ error: 'Not authorized' })
  }
}

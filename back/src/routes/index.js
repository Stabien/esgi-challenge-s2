/** Controllers */
const {
  getUserByUuid,
  authentication,
  registration,
  updateUser,
} = require('../controllers/userController')
const { checkUserTokenUuid, isAdmin } = require('../middlewares')
const upload = require('../config/multer')
const { getUserRegistrations, validateUser, rejectUser } = require('../controllers/adminController')
const { adminAuthentication } = require('../controllers/adminController')
const { addAnalytics } = require('../controllers/analyticsController')

/** Router */
const routes = (app) => {
  app.route('/api/user/authentication').post(authentication)
  app.route('/api/user/registration').post(upload.single('kbis'), registration)
  app
    .route('/api/user/:uuid')
    .get(checkUserTokenUuid, getUserByUuid)
    .put(checkUserTokenUuid, updateUser)

  app.route('/api/admin/userRegistrations').get(isAdmin, getUserRegistrations)

  app.route('/api/admin/validateUser/:uuid').post(validateUser)
  app.route('/api/admin/rejectUser/:uuid').post(rejectUser)
  app.route('/api/admin/authentication').post(adminAuthentication)

  app.route('/api/analytics').post(addAnalytics)
}

module.exports = routes

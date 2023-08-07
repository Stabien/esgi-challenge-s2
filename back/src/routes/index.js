/** Controllers */
const {
  getUserByUuid,
  authentication,
  getUserToken,
  registration,
  updateUser,
} = require('../controllers/userController')
const { checkUserTokenUuid, isAdmin } = require('../middlewares')
const upload = require('../config/multer')
const {
  getUserRegistrations,
  validateUser,
  rejectUser,
  pendingUser,
} = require('../controllers/adminController')
const { adminAuthentication } = require('../controllers/adminController')
const {
  addAnalytics,
  getAnalyticsByAppId,
  getEventByPages,
  getSessionByPages,
  getSessionByTags,
} = require('../controllers/analyticsController')
const { addTag, deleteTag, getTagsByUserUuid } = require('../controllers/tagController')

/** Router */
const routes = (app) => {
  app.route('/api/user/authentication').post(authentication)
  app.route('/api/user/getUserToken/:uuid').get(checkUserTokenUuid, getUserToken)
  app.route('/api/user/registration').post(upload.single('kbis'), registration, authentication)
  app
    .route('/api/user/:uuid')
    .get(checkUserTokenUuid, getUserByUuid)
    .put(checkUserTokenUuid, updateUser)

  app.route('/api/admin/userRegistrations').get(isAdmin, getUserRegistrations)

  app.route('/api/admin/validateUser/:uuid').put(isAdmin, validateUser)
  app.route('/api/admin/rejectUser/:uuid').put(isAdmin, rejectUser)
  app.route('/api/admin/pendingUser/:uuid').put(isAdmin, pendingUser)
  app.route('/api/admin/authentication').post(adminAuthentication)

  app.route('/api/analytics/add').post(addAnalytics)
  app.route('/api/analytics/:appId').get(getAnalyticsByAppId)
  app.route('/api/analytics/eventByPages/:appId').get(getEventByPages)
  app.route('/api/analytics/sessionByPages/:appId').get(getSessionByPages)
  app.route('/api/analytics/sessionByTags/:appId').get(getSessionByTags)

  app.route('/api/tag/all/:uuid').get(getTagsByUserUuid)
  app.route('/api/tag/add/:uuid').post(addTag)
  app.route('/api/tag/delete/:uuid').delete(deleteTag)
}

module.exports = routes

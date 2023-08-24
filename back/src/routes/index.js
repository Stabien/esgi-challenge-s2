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
const { getUserRegistrations, handleUserStatus } = require('../controllers/adminController')
const { adminAuthentication } = require('../controllers/adminController')
const {
  addAnalytics,
  getAnalyticsByAppId,
  getHeatmapPossibility,
  getHeatmapData,
  postGraphSettings,
  getGraphSettings,
  getEventByPages,
  getSessionByPages,
  getSessionByTags,
} = require('../controllers/analyticsController')
const { addTag, deleteTag, getTagsByUserUuid } = require('../controllers/tagController')

/** Router */
const routes = (app) => {
  app.route('/api/user/registration').post(upload.single('kbis'), registration, authentication)
  app.route('/api/user/authentication').post(authentication)

  app.route('/api/user/getUserToken/:uuid').get(checkUserTokenUuid, getUserToken)
  app
    .route('/api/user/:uuid')
    .get(checkUserTokenUuid, getUserByUuid)
    .put(checkUserTokenUuid, updateUser)

  app.route('/api/admin/userRegistrations').get(isAdmin, getUserRegistrations)
  app.route('/api/admin/handleUserStatus/:uuid').put(isAdmin, handleUserStatus)
  app.route('/api/admin/authentication').post(adminAuthentication)

  //add analytics for tracker
  app.route('/api/analytics/add').post(addAnalytics)

  //handle graph settings
  app.route('/api/analytics/GraphSettings').post(postGraphSettings)
  app.route('/api/analytics/GraphSettings/:uuid').get(getGraphSettings)

  //get analitycs
  app.route('/api/analytics/:graphSettings').get(getAnalyticsByAppId)
  app.route('/api/analytics/heatmap/:graphSettings').get(getHeatmapPossibility)
  app.route('/api/analytics/heatmapUrl/:graphSettings').get(getHeatmapData)
  // app.route('/api/analytics/:appId').get(getAnalyticsByAppId)
  
  app.route('/api/analytics/eventByPages/:appId').get(getEventByPages)
  app.route('/api/analytics/sessionByPages/:appId').get(getSessionByPages)
  app.route('/api/analytics/sessionByTags/:appId').get(getSessionByTags)

  app.route('/api/tag/:uuid').get(getTagsByUserUuid).post(addTag).delete(deleteTag)
}

module.exports = routes

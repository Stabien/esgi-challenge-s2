/** Controllers */
const {
  getUserByUuid,
  authentication,
  registration,
  updateUser,
} = require('../controllers/userController')
const { checkUserTokenUuid } = require('../middlewares')
const upload = require('../config/multer')

/** Router */
const routes = (app) => {
  app.route('/api/user/authentication').post(authentication)
  app.route('/api/user/registration').post(upload.single('kbis'), registration)
  app
    .route('/api/user/:uuid')
    .get(checkUserTokenUuid, getUserByUuid)
    .put(checkUserTokenUuid, updateUser)
}

module.exports = routes

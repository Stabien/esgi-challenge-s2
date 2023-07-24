/** Controllers */
const {
  getUserByUuid,
  authentication,
  registration,
  updateUser,
} = require('../controllers/userController')
const { checkUserTokenUuid } = require('../middlewares')
const upload = multer({ dest: './public/upload/' })

/** Router */
const routes = (app) => {
  app.route('/api/user/authentication').post(authentication)
  app.route('/api/user/registration', upload.single('kbis')).post(registration)
  app
    .route('/api/user/:uuid')
    .get(checkUserTokenUuid, getUserByUuid)
    .put(checkUserTokenUuid, updateUser)
}

module.exports = routes

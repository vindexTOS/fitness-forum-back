import expres from 'express'
import {
  createNotification,
  getNotifications,
  readNotification,
} from '../controllers/notificationController.js'

const notificationRouter = expres.Router()

// notification/create
notificationRouter.route('/create').post(createNotification)
notificationRouter
  .route('/:notificationID')
  .get(getNotifications)
  .patch(readNotification)

export default notificationRouter

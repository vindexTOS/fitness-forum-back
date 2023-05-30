import Notification from '../models/notificationModel.js'

export const createNotification = async (req, res) => {
  const { receiverID, commentID, postID, isRead, reply, authorsID } = req.body

  if (!receiverID) {
    res.status(400).json({ msg: 'No User ID provided' })
  }
  const notee = await Notification.create({
    receiverID,
    commentID,
    postID,
    isRead,
    reply,
    authorsID,
  })
}

export const getNotifications = async (req, res) => {
  const { notificationID } = req.params

  try {
    const notifications = await Notification.find({
      receiverID: notificationID,
    })
    notifications.reverse()
    return res.status(200).json(notifications)
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Failed to retrieve notifications' })
  }
}

export const readNotification = async (req, res) => {
  const { notificationID } = req.params
  console.log(notificationID)
  try {
    const notificationCheck = await Notification.findById({
      _id: notificationID,
    })
    if (!notificationCheck) {
      return res.status(400).json({ msg: 'No notification with that ID' })
    }
    const isRead = req.body.isRead
    const notification = await Notification.findByIdAndUpdate(
      { _id: notificationID },
      { isRead: isRead },
      { new: true },
    )
    res.status(200).json({ msg: notification })
  } catch (error) {
    return res.status(404).json({ msg: 'Notification server Error' })
  }
}

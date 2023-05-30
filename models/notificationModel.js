import mongoose from 'mongoose'

const notificationSchema = new mongoose.Schema({
  receiverID: {
    type: String,
  },
  authorsID: {
    type: String,
  },
  commentID: {
    type: String,
  },
  postID: {
    type: String,
  },
  isRead: {
    type: Boolean,
  },
  reply: {
    type: String,
  },
})

export default mongoose.model('notification', notificationSchema)

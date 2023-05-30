import mongoose from 'mongoose'

const forumSchema = new mongoose.Schema({
  name: {
    type: String,
    require: [true, 'Forum should have name'],
    trim: true,
    maxLength: [50, 'Forum name cant be more than 50 letters'],
  },
  avatar: {
    type: String,
    default: `https://cdn1.iconfinder.com/data/icons/social-messaging-ui-color-shapes/128/exercise-circle-orange-512.png`,
  },
  description: {
    type: String,
    require: [true, 'forum should have description'],
    trim: true,
    maxLength: [5000, "Description can't be more then 5000 letters"],
  },
  forumID: {
    type: String,
    require: [true, 'froum must have id'],
    trim: true,
    default: function () {
      return this.name
    },
  },
  adminID: {
    type: String,
    require: true,
  },
  color1: {
    type: String,
  },
  color2: {
    type: String,
  },
})

const Forum = mongoose.model('Forum', forumSchema)

export default Forum

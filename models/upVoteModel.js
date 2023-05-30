import mongoose from 'mongoose'

const upVoteSchema = new mongoose.Schema({
  postID: {
    type: String,
  },

  Votes: [
    {
      voteType: {
        type: Boolean,
        default: true,
      },
      userID: {
        type: String,
      },
    },
  ],
})

export default mongoose.model('post-votes', upVoteSchema)

import Comment from '../models/commentModel.js'
import User from '../models/userModel.js'

export const makeComment = async (req, res) => {
  const { comment, postID, userID } = req.body

  //   console.log(comment)
  //   console.log(req.body)
  try {
    if (!comment) {
      return res.status(400).json({ msg: 'Comment fealed is empity' })
    }

    const commentObj = { comment, postID, userID }
    const postComment = await Comment.create(commentObj)
    return res.status(201).json(postComment)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ msg: error })
  }
}

export const getComments = async (req, res) => {
  let { id } = req.params
  id = id.replace('\n', '')

  const postComment = await Comment.find({})
  let postCommentsArray = postComment.filter((val) => val.postID === id)
  const users = await User.find({}, 'name avatar ')
  postCommentsArray = postCommentsArray.map((comment) => {
    const user = users.find((u) => String(u._id) === String(comment.userID))
    return { ...comment._doc, user }
  })

  if (!postCommentsArray) {
    return res.status(404).json({ msg: 'comment dont exist' })
  }
  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 5
  const startIndex = (page - 1) * limit
  const endIndex = page * limit
  const totalComments = postCommentsArray.length
  const totalPages = Math.ceil(totalComments / limit)
  postCommentsArray = postCommentsArray.reverse()

  postCommentsArray = postCommentsArray.slice(startIndex, endIndex)
  return res
    .status(200)
    .json({ comments: postCommentsArray, totalComments, totalPages })
}

export const deleteComment = async (req, res) => {
  let { commentID } = req.params

  commentID = commentID.replace('\n', '')

  const comment = await Comment.findById(commentID)

  if (!comment) {
    return res.status(404).json({ msg: `No Comment With ID ${commentID}` })
  }

  if (String(req.user._id) !== String(comment.userID)) {
    return res
      .status(403)
      .json({ msg: 'You are not allowed to do this action' })
  }

  await Comment.findByIdAndDelete({ _id: commentID })

  return res.status(200).json({ comment })
}

export const updateComment = async (req, res) => {
  let { commentID } = req.params

  commentID = commentID.replace('\n', '')

  const comment = await Comment.findById(commentID)

  if (!comment) {
    return res.status(404).json({ msg: `No Comment With ID ${commentID}` })
  }

  if (String(req.user._id) !== String(comment.userID)) {
    return res
      .status(403)
      .json({ msg: 'You are not allowed to do this action' })
  }

  await Comment.findByIdAndUpdate(commentID, req.body, {
    new: true,
    runValidators: true,
  })
  return res.status(200).json({ comment })
}

export const addReply = async (req, res) => {
  let { replyID } = req.params
  replyID = replyID.replace('\n', '')

  console.log(req.body)
  try {
    const comment = await Comment.findById(replyID)

    if (!comment) {
      return res.status(404).json({ msg: `No Comment with ID ${replyID}` })
    }

    comment.reply.push(...req.body.reply)

    await comment.save()

    return res.status(200).json(comment)
  } catch (error) {
    return res.status(500).json({ msg: 'Server Error' })
  }
}

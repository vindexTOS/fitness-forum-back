import Post from '../models/postModel.js'
import User from '../models/userModel.js'
import Forum from '../models/forumModel.js'
import Comments from '../models/commentModel.js'
import Vote from '../models/upVoteModel.js'
import jwt from 'jsonwebtoken'
import { checkUserPost } from '../middleware/auth.js'
const getAllPosts = async (req, res) => {
  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 10
  const searchQuery = req.query.search

  const startIndex = (page - 1) * limit
  const endIndex = page * limit

  let query = {}

  if (searchQuery) {
    query = {
      $or: [
        { title: { $regex: searchQuery, $options: 'i' } },
        { post: { $regex: searchQuery, $options: 'i' } },
      ],
    }
  }

  const totalPosts = await Post.countDocuments(query)
  const totalPages = Math.ceil(totalPosts / limit)

  try {
    const AllData = await Post.find({})

    let posts = await Post.find(query)

    const vote = await Vote.find({})

    posts.filter((val) => {
      const findVote = vote.find((vote) => vote.postID === String(val._id))
      if (findVote) {
        let votes = 0
        let Arr = findVote.Votes
        for (let i = 0; i < Arr.length; i++) {
          if (Arr[i].voteType) {
            votes++
          }
        }
        val.upvote = votes
      }
    })

    posts = posts.reverse() // Reverse the order of the posts

    posts = posts.slice(startIndex, endIndex)

    return res.status(200).json({
      posts,
      currentPage: page,
      totalPages,
      totalPosts,
      AllData,
    })
  } catch (error) {
    return res.status(400).json({ msg: 'server error' })
  }
}
const postData = async (req, res) => {
  const { title, post, photo, forumID, userID } = req.body
  const forum = await Forum.find({ forumID })

  try {
    const obj = { title, post, photo, forumID, userID }
    const postObj = await Post.create(obj)

    const voteObj = {
      postID: postObj._id,
      Votes: [{ voteType: true, userID: userID }],
    } // Access the newly created post's _id
    const vote = await Vote.create(voteObj)

    console.log(vote)
    return res.status(201).json({ postObj, vote }) // Return both postObj and vote as JSON response
  } catch (error) {
    console.log(error)
    return res.status(500).json({ msg: error })
  }
}
const deleteData = async (req, res) => {
  let { id } = req.params

  id = id.replace('\n', '')
  const post = await Post.findById(id)
  if (!post) {
    return res.status(404).json({ msg: `No task with ID ${id}` })
  }
  if (String(req.user._id) !== String(post.userID)) {
    console.log('not success')
    return res
      .status(403)
      .json({ msg: 'You are not allowed to do this action' })
  }
  await Post.findOneAndDelete({ _id: id })

  return res.status(200).json({ post })
}

const updateData = async (req, res) => {
  try {
    let { id } = req.params
    id = id.replace('\n', '')

    const post = await Post.findById(id)

    if (!post) {
      return res.status(404).json({ msg: `No Post With This ID ${id}` })
    }

    if (String(req.user._id) !== String(post.userID)) {
      console.log('not success')
      return res
        .status(403)
        .json({ msg: 'You are not allowed to do this action' })
    }

    const updatedPost = await Post.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    })

    return res.status(200).json({ post: updatedPost })
  } catch (error) {
    return res.status(500).json({ msg: 'Internal Server Error' })
  }
}

const getUserData = async (req, res) => {
  try {
    const user = await User.find({}, 'name avatar description')

    return res.status(200).json(user)
  } catch (error) {
    return res.status(400).json({ msg: 'server error' })
  }
}
const updateUser = async (req, res) => {
  let { userId } = req.params
  userId = userId.replace('\n', '')
  const user = await User.findOneAndUpdate({ _id: userId }, req.body, {
    new: true,
    runValidators: true,
  })
  const token = jwt.sign({ user }, process.env.JWT_STRING, {
    expiresIn: '1h',
  })
  res.set('Authorization', `Bearer ${token}`)

  user.password = null
  if (!user) {
    return res.status(404).json({ msg: `No Post With This ID ${userId}` })
  }
  return res.status(200).json({ user, token })
}
export {
  postData,
  getAllPosts,
  getUserData,
  deleteData,
  updateUser,
  updateData,
}

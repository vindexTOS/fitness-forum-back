import bcrypt from 'bcrypt'
import Post from '../models/postModel.js'
import Votes from '../models/upVoteModel.js'

import jwt from 'jsonwebtoken'
import userSchema from '../models/userModel.js'

const register = async (req, res) => {
  const { password, email, name, avatar, description } = req.body
  let user = {}

  try {
    const userExist = await userSchema.findOne({ email: email })
    if (userExist) {
      return res.status(422).json({ error: 'Email Already exists ' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    user = { password: hashedPassword, email, name, avatar, description }
    if (password && email && name) {
      await userSchema.create(user)
    } else {
      return res.status(201).send({ message: 'Enter all the values' })
    }
    const userFromDb = await userSchema.findOne({ email: email })
    userFromDb.password = null

    const token = jwt.sign({ user: userFromDb }, process.env.JWT_STRING, {
      expiresIn: '1h',
    })
    if (userFromDb) {
      return res.status(201).json({ token, user: userFromDb })
    } else if (!userFromDb) {
      return res.status(201).send({ message: 'Try to sign in' })
    }
  } catch (error) {
    console.log(error)
    res.status(500).send({ message: 'Internal server error' })
  }
}

const login = async (req, res) => {
  const { email, password } = req.body

  try {
    const user = await userSchema.findOne({ email: email })

    if (!user) {
      return res.status(404).json({ msg: 'User not found' })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      return res.status(401).json({ msg: 'Invalid password' })
    }

    const userPosts = await Post.find({})

    const userPostLength = userPosts.filter(
      (val) => val.userID === String(user._id),
    )

    user.password = null
    user.postLength = userPostLength.length
    const token = jwt.sign({ user }, process.env.JWT_STRING, {
      expiresIn: '1h',
    })

    res.set('Authorization', `Bearer ${token}`)

    return res.status(200).json({ token, user })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ msg: 'Internal server error' })
  }
}

export { register, login }

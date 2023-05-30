import User from '../models/userModel.js'
import jwt from 'jsonwebtoken'
import { config } from 'dotenv'
config()

export const checkUserPost = (user, post) => {
  console.log(user)
  console.log(post)
}

const verifyToken = async (token, res) => {
  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_STRING)

    // Extract the user ID from the decoded token
    const userId = decoded.user

    // Find the user in the database
    const user = await User.findById(userId)

    // Check if the user exists
    if (!user) {
      return res.status(401).json({ msg: 'Invalid token' })
    }

    return user
  } catch (error) {
    return res.status(401).json({ msg: 'Token is not valid' })
  }
}

export const authMiddleware = async (req, res, next) => {
  // Get the token from the request headers
  const token = req?.header('Authorization')?.replace('Bearer ', '')
  console.log(token)
  // Check if the token exists
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' })
  }

  const user = await verifyToken(token, res)
  if (!user) {
    return res.status(401).json({ msg: 'Invalid token' })
  }

  // Attach the user object to the request for further use in routes
  req.user = user

  // Proceed to the next middleware or route handler
  next()
}

export const authRole = (role) => {
  return async (req, res, next) => {
    const token = req?.header('Authorization')?.replace('Bearer ', '')

    // Check if the token exists
    if (!token) {
      return res.status(401).json({ msg: 'No token, authorization denied' })
    }

    const user = await verifyToken(token, res)
    if (!user) {
      return res.status(401).json({ msg: 'Invalid token' })
    }

    if (role !== user.role) {
      return res.status(403).json({ msg: 'You are not authorized' })
    }

    // Attach the user object to the request for further use in routes
    req.user = user

    // Proceed to the next middleware or route handler
    next()
  }
}

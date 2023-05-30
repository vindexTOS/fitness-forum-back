import express from 'express'
import { register, login } from '../controllers/authControllers.js'

import { createThread } from '../controllers/forumController.js'
const userRouter = express.Router()

userRouter.route('/register').post(register)
userRouter.route('/login').post(login)

userRouter.route('/create-thread').post(createThread)
export default userRouter

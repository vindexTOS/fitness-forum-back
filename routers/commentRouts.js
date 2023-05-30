import express from 'express'
import {
  makeComment,
  getComments,
  deleteComment,
  updateComment,
  addReply,
} from '../controllers/commentControllers.js'

import { authMiddleware } from '../middleware/auth.js'
const commentRouter = express.Router()

commentRouter.route('/comment').post(authMiddleware, makeComment)
commentRouter.route('/comment/:id').get(getComments)
commentRouter
  .route('/comment/:commentID')
  .delete(authMiddleware, deleteComment)
  .patch(authMiddleware, updateComment)

commentRouter.route('/comment/reply/:replyID').patch(authMiddleware, addReply)
export default commentRouter

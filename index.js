import express from 'express'
import connectDB from './db/connect.js'
import { config } from 'dotenv'
import router from './routers/routers.js'
import commentRouter from './routers/commentRouts.js'
import userRouter from './routers/userRouter.js'
import notificationRouter from './routers/notificationRouts.js'
import { notFound } from './middleware/not-found.js'
import { errorHandler } from './middleware/error-handler.js'
import cookieParser from 'cookie-parser'
import cors from 'cors'
const app = express()
app.use(cookieParser())
config()
app.use(express.json())

app.use(cors())

app.use('/', router)
app.use('/post', commentRouter)
app.use('/notification', notificationRouter)
app.use(notFound)
app.use(errorHandler)

const port = 3000

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL)
    app.listen(port, () => console.log(`server is listing to port ${port}`))
  } catch (error) {
    console.log(error)
  }
}

start()

import { config } from 'dotenv'
import connectDB from './db/connect.js'
import Wrestlers from './models/model.js'
import dataJson from './dataJson.json' assert {type:"json"}
config()

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL)
    await Wrestlers.deleteMany()
    await Wrestlers.create(dataJson)
    process.exit(0)
  } catch (error) {
    console.log(error)
    proccess.exit(1)
  }
}

start()

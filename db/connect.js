import mongoose from 'mongoose'

const connectDB = (mongoUrl) => {
  return new Promise((resolve, reject) => {
    mongoose.connect(mongoUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })

    const db = mongoose.connection
    db.on('error', (error) => {
      console.error('MongoDB connection error:', error)
      reject(error)
    })

    db.once('open', () => {
      console.log('MongoDB connected successfully!')
      resolve(mongoose)
    })
  })
}

export default connectDB

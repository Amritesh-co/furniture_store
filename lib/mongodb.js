import mongoose from 'mongoose'

let cached = global.mongoose

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }
}

async function connectDB() {
  const mongoUri = process.env.MONGODB_URI
  if (!mongoUri) {
    throw new Error('Please define the MONGODB_URI environment variable inside .env.local')
  }

  if (cached.conn) return cached.conn

  if (!cached.promise) {
    cached.promise = mongoose.connect(mongoUri, {
      bufferCommands: false,
    }).then((mongoose) => mongoose)
  }

  try {
    cached.conn = await cached.promise
  } catch (e) {
    cached.promise = null
    throw e
  }

  return cached.conn
}

export default connectDB

import mongoose from "mongoose"

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/room-allocation-system"

console.log(`MONGODB_URI: ${MONGODB_URI}`)

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable inside .env")
}

const dbConnect = async () => {
  if (mongoose.connection.readyState >= 1) return

  try {
    await mongoose.connect(MONGODB_URI)
    console.log("MongoDB connected successfully")
  } catch (error: any) {
    console.error("MongoDB connection error:", error.message)
    throw error
  }
}

console.log("dbConnect ran successfully")

export default dbConnect





// import mongoose from "mongoose"

// const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/room-allocation-system"

// if (!MONGODB_URI) {
//   throw new Error("Please define the MONGODB_URI environment variable inside .env.local")
// }

// interface GlobalMongoose {
//   conn: typeof mongoose | null
//   promise: Promise<typeof mongoose> | null
// }

// declare global {
//   var myMongoose: GlobalMongoose | undefined
// }

// let cached = global.myMongoose

// if (!cached) {
//   cached = global.myMongoose = { conn: null, promise: null }
// }

// async function connectDB() {
//   if (cached!.conn) {
//     return cached!.conn
//   }

//   if (!cached!.promise) {
//     const opts = {
//       bufferCommands: false,
//     }

//     cached!.promise = mongoose.connect(MONGODB_URI, opts)
//   }

//   try {
//     cached!.conn = await cached!.promise
//   } catch (e) {
//     cached!.promise = null
//     throw e
//   }

//   return cached!.conn
// }

// export default connectDB

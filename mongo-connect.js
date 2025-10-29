import mongoose from 'mongoose'

export const connectDB = (app) => {
  mongoose
    .connect(process.env.MONGO_CONNECTION_URI)
    .then(() => {
      console.log('✅ Connection to Database: Successful')
      app.listen(process.env.PORT, () => {
        console.log(`🚀 Server is running on port ${process.env.PORT}`)
      })
    })
    .catch((error) => {
      console.error(`❌ Error connecting to the database: ${error.message}`)
    })
}

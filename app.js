import fs from 'fs'
import path from 'path'
import express from 'express'
import HttpError from './models/http-error.js'
import { configDotenv } from 'dotenv'

// Route Imports
import placesRoutes from './routes/places-routes.js'
import usersRoutes from './routes/user-routes.js'
import { connectDB } from './mongo-connect.js'

const app = express()

configDotenv()

connectDB(app)

const api = process.env.API_URL

////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
////////////////       Middleware Section             //////////////////

// Express Middleware to parse/handle incoming and outgoing requests
app.use(express.json())

app.use('/uploads/images', express.static(path.join('uploads', 'images')))

// Handling CORS Errors
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'https://share-my-places-app.web.app/')
    res.setHeader('Access-Control-Allow-Headers', 'Origin , X-Requested-With, Content-Type, Accept, Authorization' )
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, PUT' )
    return next()
})


// Registering the imported routes as a middleware
app.use(`${api}/places`, placesRoutes)

// Registering the imported routes as a middleware
app.use(`${api}/users`, usersRoutes)

// Handling errors for unsupported routes
app.use((req, res, next) => {
    const error = new HttpError('Could not find this route', 404)
    throw error
})

// error handling middleware
app.use((error, req, res, next) => {

    if(req.file) {
        fs.unlink(req.file.path, (err) => {console.log(err)})
    }

    if(res.headerSent) {
        return next(error)
    }
    res.status(error.code || 500)
    res.json({ message: error.message || 'An unknown error occurred'})
})

////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////

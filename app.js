import express from 'express'
import bodyParser from 'body-parser'
import placesRoutes from './routes/places-routes.js'
import usersRoutes from './routes/user-routes.js'
import HttpError from './models/http-error.js'
import mongoose from 'mongoose'

const app = express()

app.use(bodyParser.json())

app.use('/api/places', placesRoutes)
app.use('/api/users', usersRoutes)

// Handling errors for unsupported routes
app.use((req, res, next) => {
    const error = new HttpError('Could not find this route', 404)
    throw error
})

// error handling middleware
app.use((error, req, res, next) => {
    if(res.headerSent) {
        return next(error)
    }
    res.status(error.code || 500)
    res.json({ message: error.message || 'An unknown error occurred'})
})

mongoose.connect('mongodb+srv://eshwagadkar:1Zmcafwvy123@cluster0.zn1ive7.mongodb.net/?appName=Cluster0').then(
    app.listen(5004)
).catch(err => console.log(err))

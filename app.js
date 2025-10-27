import express from 'express'
import bodyParser from 'body-parser'
import placesRoutes from './routes/places-routes.js'
import HttpError from './models/http-error.js'

const app = express()

app.use(bodyParser.json())

app.use('/api/places', placesRoutes)

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


app.listen(5000)
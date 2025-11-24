import fs from 'fs'
import path from 'path'
import express from 'express'
import cors from 'cors'
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

app.use(cors({
  origin: 'https://share-my-places-app-c02a1.web.app',
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT']
}))

// ➤ Root "/" route — Send description when API loads
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Share My Places API</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background: #f7f7f7;
                margin: 0;
                padding: 40px;
                color: #333;
            }
            .container {
                max-width: 700px;
                margin: auto;
                background: #fff;
                padding: 30px;
                border-radius: 12px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            }
            h1 {
                margin-top: 0;
                color: #2c3e50;
            }
            p {
                line-height: 1.6;
            }
            .endpoints {
                margin-top: 20px;
                padding: 15px;
                background: #f0f0f0;
                border-radius: 8px;
            }
            code {
                background: #e8e8e8;
                padding: 4px 8px;
                border-radius: 4px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🌍 Share My Places API</h1>
            <p>Welcome to the backend API for the <strong>Share My Places</strong> application!</p>
            <p>
                This server allows users to register, authenticate, upload images, and share their favorite places with others.
            </p>

            <div class="endpoints">
                <h3>Available Endpoints</h3>
                <p><code>${process.env.API_URL}/places</code> — Place-related API routes</p>
                <p><code>${process.env.API_URL}/users</code> — User authentication</p>
            </div>

            <p style="margin-top: 25px; font-size: 14px; color: #777;">
                Created with ❤️ using Node.js, Express & MongoDB
            </p>
        </div>
    </body>
    </html>
  `)
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

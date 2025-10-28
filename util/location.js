import { configDotenv } from 'dotenv'
import axios from 'axios'
import HttpError from '../models/http-error.js'

configDotenv()
const apikey = process.env.API_KEY

export async function getCoordsForAddress(address) {
    
    const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apikey}`)
    
    const data = response.data

    if(!data || data.status === 'ZERO_RESULTS') {
        throw new HttpError('Could not find location for the specified address', 422)
    }

    return data.results[0].geometry.location
}
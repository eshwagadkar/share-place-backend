import { v4 as uuidv4 } from 'uuid'
import HttpError from '../models/http-error.js'
import { validationResult } from 'express-validator'
import { getCoordsForAddress } from '../util/location.js'
import Place from '../models/place.js'

let DUMMY_PLACES = [
    {
        id: 'p1',
        title: 'Empire State Building',
        description: 'Famous Sky Scrappers',
        location: {
            lat: 40.23423,
            long: -231334
        },
        address: 'NewYork, NY 10001',
        creator: 'u1'
    }
]

// Controller to fetch a place given its ID
export const getPlaceById = async (req, res, next) => {
    const pid = req.params.pid

    let place
    try{
      // findById is a static method and can be invoked directly and not over instance of Place  -
      place = await Place.findById(pid) // - but directly on the Place constructor function
    }catch(err){
        const error = new HttpError('Something went wrong, could not find a place.', 500)
        return next(error)
    }
    
    if(!place) {
        const error = new HttpError('Could not find a place with the provided ID', 404)
        return next(error)
    }

    res.json({ place: place.toObject({ getters: true }) })
}

// Controller to fetch all the places given its user ID or creator 
export const getPlacesByUserId = async(req, res, next) => {
    const uid = req.params.uid

    let places
    try{
      places = await Place.find({ creator: uid })
    } catch(err) {
      const error = new HttpError('Fetching places failed, please try again later', 500)
      return next(error)
    }
    
    if(!places || places.length === 0) {
        throw new HttpError('Could not find places for the provided user ID', 404)
    }

    res.json({ places: places.map(p => p.toObject({ getters: true })) })
}

// Controller to create a place
export const createPlace = async (req, res, next) => {
    const errors = validationResult(req)

    if(!errors.isEmpty()){
       return next(new HttpError('Invalid inputs passed, please check your data', 422))
    }

    const { title, description, address, creator } = req.body

    let coordinates
    try{
      coordinates = await getCoordsForAddress(address)
    } catch (error) {
      return next(error)
    }

    const createdPlace = new Place({
        title,
        description,
        address,
        location: coordinates,
        image: 'place-holder-image.png',
        creator
    })

    try{
        await createdPlace.save()
    } catch(err){
        const error = new HttpError('Creating place failed, please try again.', 500)
        return next(error)
    }

    res.status(201).json({ place: createdPlace })
}

// Controller to update a place
export const updatePlace = async (req, res, next) => {
    const errors = validationResult(req)

    if(!errors.isEmpty()){
        throw new HttpError('Invalid inputs passed, please check your data', 422)
    }

    const { title, description } = req.body
    const placeId = req.params.pid

    let place
    try{
      place = await Place.findById(placeId)
    } catch(err) {
        const error = new HttpError('Something went wrong, could not update place', 500)
        return next(error)
    }

    place.title = title
    place.description = description

    try{
        await place.save()
    }catch(err) {
        const error = new HttpError('Something went wrong, could not update place', 500)
        return next(error)
    }

    res.status(200).json({ place: place.toObject({ getters: true }) })

}

export const deletePlace = (req, res, next) => {
    const placeId = req.params.pid

    if(!DUMMY_PLACES.find(p => p.id === placeId)){
        throw new HttpError('Couldnot find a place for that id.', 404)
    }

    DUMMY_PLACES = DUMMY_PLACES.filter(p => p.id !== placeId)
    res.status(200).json({ message: 'Deleted Place'})
}

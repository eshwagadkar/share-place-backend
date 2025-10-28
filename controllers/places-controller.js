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

export const getPlaceById = async (req, res, next) => {
    const pid = req.params.pid

    let place
    try{
      // findById is a static method and can be invoked directly and not over instance of Place  -
      place = await Place.findById(pid) // - but directly on the Place constructor function
    }catch(err){
        const error = new HttpError(
            err || 'Something went wrong, could not find a place.',
            500
        )
        return next(error)
    }
    
    if(!place) {
        const error = new HttpError('Could not find a place with the provided ID', 404)
        return next(error)
    }

    res.json({ place: place.toObject({ getters: true }) })
}

export const getPlacesByUserId = (req, res, next) => {
    const uid = req.params.uid
    const places = DUMMY_PLACES.filter(p => { return p.creator === uid})
    
    if(!places || places.length === 0) {
        throw new HttpError('Could not find places for the provided user ID', 404)
    }

    res.json({ places })
}


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
        image: 'dummy.png',
        creator
    })

    try{
        await createdPlace.save()
    } catch(err){
        const error = new HttpError(
            err || 'Creating place failed, please try again.',
            500
        )
        return next(error)
    }

    res.status(201).json({ place: createdPlace })
}

export const updatePlace = (req, res, next) => {
    const errors = validationResult(req)

    if(!errors.isEmpty()){
        throw new HttpError('Invalid inputs passed, please check your data', 422)
    }

    const { title, description } = req.body
    const placeId = req.params.pid

    const updatePlace = {...DUMMY_PLACES.find(p => p.id === placeId)}
    const index = DUMMY_PLACES.findIndex(p => p.id === placeId)
    updatePlace.title = title
    updatePlace.description = description

    DUMMY_PLACES[index] = updatePlace

    res.status(200).json({ place: updatePlace })

}

export const deletePlace = (req, res, next) => {
    const placeId = req.params.pid

    if(!DUMMY_PLACES.find(p => p.id === placeId)){
        throw new HttpError('Couldnot find a place for that id.', 404)
    }

    DUMMY_PLACES = DUMMY_PLACES.filter(p => p.id !== placeId)
    res.status(200).json({ message: 'Deleted Place'})
}

import fs from 'fs'
import HttpError from '../models/http-error.js'
import { validationResult } from 'express-validator'
import { getCoordsForAddress } from '../util/location.js'
import Place from '../models/place.js'
import User from '../models/user.js'
import mongoose from 'mongoose'

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

    // let places
    let usersWithPlaces
    try{
        // places = await Place.find({ creator: uid }) // Previous approach using Place model
         usersWithPlaces = await User.findById(uid).populate('places') // alternate approach using populate
    } catch(err) {
      const error = new HttpError('Fetching places failed, please try again later', 500)
      return next(error)
    }

    // if(!places || places.length === 0) - Previous approach check
    if(!usersWithPlaces || usersWithPlaces.places.length === 0) {
        return next( new HttpError('Could not find places for the provided user ID', 404))
    }

    res.json({ places: usersWithPlaces.places.map(p => p.toObject({ getters: true })) })
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
      image: req.file.path,
      creator
    })

    // Check id of logged in user whether it exists in db
    let user 
    try{ 
        user = await User.findById(creator)
    } catch(err){
        const error = new HttpError('Creating place failed, please try again.', 500)
        return next(error)
    }

    if(!user){
        const error = new HttpError('Could not find a user for the provided id', 404)
        return next(error)
    }

    let sess
    try {
        // Handling (2) mutiple async tasks concurrently. 
        sess = await mongoose.startSession()
        sess.startTransaction() // Start the transaction
        // Task 1: Save the created user
        await createdPlace.save({ session : sess })
        // and push the created place id in the places array of the logged in user 
        user.places.push(createdPlace)
        // Task 2: save the updated user
        await user.save({ session : sess })
        await sess.commitTransaction() // Commit the transaction
        sess.endSession()
    } catch(err) {
        if (sess) {
            await sess.abortTransaction()
            sess.endSession()
        }

        console.error('Transaction error:', err)
        const error = new HttpError('Creating place failed, please try again', 500)
        return next(error) 
    }

    // Send a response to end the request
    res.status(201).json({ place: createdPlace })
}

// Controller to update a place
export const updatePlace = async (req, res, next) => {
    const errors = validationResult(req)

    if(!errors.isEmpty()){
        return next( new HttpError('Invalid inputs passed, please check your data', 422)) 
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

    if(place.creator.toString() !== req.userData.userId){
        const error = new HttpError('You are not allowed to edit this place', 401)
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

// Controller to update a place
export const deletePlace = async (req, res, next) => {
    const placeId = req.params.pid
    
    let place
    try{
        place = await Place.findById(placeId).populate('creator')
    } catch(err){
        const error = new HttpError('Something went wrong, could not delete place', 500)
        return next(error)
    }

    if(!place){
      const error = new HttpError('Could not find place for this id', 404)
      return next(error)  
    }

    if(place.creator.id !== req.userData.userId){
        const error = new HttpError('You are not allowed to delete this place', 401)
        return next(error)
    }

    const imagePath = place.image

    let sess
    try{
        sess = await mongoose.startSession()
        sess.startTransaction()
        place.deleteOne({session: sess}) // Delete the selected place 
        place.creator.places.pull(place) // Remove the associated id links from the user document 
        await place.creator.save({ session: sess}) // Save the creator
        await sess.commitTransaction() // Commit the transaction
        sess.endSession()
    }catch(err) {
        if (sess) {
            await sess.abortTransaction()
            sess.endSession()
        }

        console.error('Transaction error:', err)
        const error = new HttpError('Deleting a place failed, something went wrong!', 500)
        return next(error) 
    }

    fs.unlink(imagePath, err => { console.log(err) })
    
    res.status(200).json({ message: 'Deleted Place'})
}

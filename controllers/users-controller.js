import HttpError from '../models/http-error.js'
import { validationResult } from 'express-validator'
import User from '../models/user.js'

export const getUsers = (req, res, next) => {
    res.json({ users: DUMMY_USERS})
}

export const signUp = async (req, res, next) => {
    const errors = validationResult(req)
    
    if(!errors.isEmpty()){
        const error = new HttpError('Invalid inputs passed, please check your data', 422)
        return next(error) 
    }
    
    const { name, email, password, places } = req.body

    let existingUser

    try{
      existingUser = await User.findOne({ email }) 
    }catch(err) {
      const error = new HttpError('Signup failed, please try again later', 500)
      return next(error)
    }
    
    if(existingUser) {
        const error =  new HttpError('User already exists, please login instead', 422)
        return next(error)
    }

    const createdUser = new User({
        name, 
        email,
        password,
        image: 'dummy-image.png',
        places
    })

    try{
        await createdUser.save()
    } catch(err){
        const error = new HttpError('Signup failed, please try again.', 500)
        return next(error)
    }

    res.status(201).json({ user: createdUser.toObject({ getters: true }) })
}

export const signIn = (req, res, next) => {
    const { email, password } = req.body

    const identifiedUser = DUMMY_USERS.find(u => u.email === email) 

    if(!identifiedUser || identifiedUser.password !== password) {
        return next( new HttpError('Could not identify user, credentials seem to be wrong', 401))
    }

    res.json({ message: 'Logged In' })
}


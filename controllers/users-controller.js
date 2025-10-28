import { v4 as uuidv4 } from 'uuid'
import HttpError from '../models/http-error.js'
import { validationResult } from 'express-validator'

const DUMMY_USERS = [
    {
        id: 'u1',
        name: 'EShwa',
        email: 'eshwagadkar007@gmail.com',
        password: 'pass@123'
    }
]

export const getUsers = (req, res, next) => {
    res.json({ users: DUMMY_USERS})
}

export const signUp = (req, res, next) => {
    const errors = validationResult(req)
    
    if(!errors.isEmpty()){
        throw new HttpError('Invalid inputs passed, please check your data', 422)
    }
    
    const { name, email, password } = req.body
    
    const existingEmail = DUMMY_USERS.find(u => u.email === email)

    if(existingEmail) {
        throw new HttpError('Email already exists, could not create user', 422)
    }

    const createdUser = {
        name, 
        email,
        password,
        id: uuidv4()
    } 

    DUMMY_USERS.push(createdUser)
    res.status(201).json({ user: createdUser })
}

export const signIn = (req, res, next) => {
    const { email, password } = req.body

    const identifiedUser = DUMMY_USERS.find(u => u.email === email) 

    if(!identifiedUser || identifiedUser.password !== password) {
        throw new HttpError('Could not identify user, credentials seem to be wrong', 401)
    }

    res.json({ message: 'Logged In' })
}


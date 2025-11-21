import HttpError from '../models/http-error.js'
import jwt from 'jsonwebtoken'

export function checkAuth(req, res, next) {
    try{
        if(req.method === 'OPTIONS') { return next() }

        // Authorization header check
        if (!req.headers.authorization) { throw new Error('Authentication Failed!') }

        const token = req.headers.authorization.split(' ')[1] // Authorization: 'Bearer token'

        // Verify token
        if(!token){ throw new Error('Authentication Failed') }

       const decodedToken = jwt.verify(token, 'my-super-secret-key')
       // attach the decoded value from the token to the request and continue
       req.userData = {userId: decodedToken.userId} 
       next() // continue with the request
    } catch(err) {
        const error = new HttpError('Authentication Failed!!', 403)
        return next(error)
    }
    
}

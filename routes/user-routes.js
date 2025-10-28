import express from 'express'
import { getUsers, 
         signUp, 
         signIn 
} from '../controllers/users-controller.js'

const router = express.Router()

router.get('/', getUsers)

router.post('/signup', signUp)

router.post('/signin', signIn)

export default router
import { Router } from 'express'
import { getUsers, 
         signUp, 
         signIn 
} from '../controllers/users-controller.js'
 import { check } from 'express-validator'

const router = Router()

router.get('/', getUsers)

router.post('/signup', [
    check('name')
    .not().isEmpty(),
    check('email')
    .normalizeEmail()
    .isEmail(),
    check('password')
    .isLength({ min: 6 })

], signUp)

router.post('/signin', signIn)

export default router
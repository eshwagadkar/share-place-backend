import { Router } from 'express'
import { getUsers, 
         signUp, 
         signIn 
} from '../controllers/users-controller.js'
import { fileUpload } from '../middleware/file-upload.js'
 import { check } from 'express-validator'

const router = Router()

router.get('/', getUsers)

router.post('/signup',
    fileUpload.single('image'),
    [
     check('name')
     .not().isEmpty(),
     check('email')
     .normalizeEmail()
     .isEmail(),
     check('password')
     .isLength({ min: 6 })
    ], signUp)

router.post('/signin', [
     check('email')
    .normalizeEmail()
    .isEmail(),
    check('password')
    .isLength({ min: 6 })
],signIn)

export default router
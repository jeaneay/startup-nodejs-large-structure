import validateRequest from '@/middlewares/validationRequest.middleware'
import { UserValidator } from '@/validators'
import express from 'express'
import UserController from '../controllers/user.controller'
const router = express.Router()

const { signin, getUserById } = UserController

router.get('/signin', validateRequest(UserValidator.signinSchema), signin.bind(UserController))
router.get('/users/userId', getUserById.bind(UserController))


export default router

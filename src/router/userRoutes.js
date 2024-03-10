import express from 'express'
import {
  currentUser,
  login,
  register,
  update,
} from '../controller/userController.js'
import { authMiddleware } from '../middleware/authMiddleware.js'

export const userRouter = express.Router()
userRouter.post('/register', register)
userRouter.post('/login', login)
userRouter.put('/update', authMiddleware, update)
userRouter.get('/profile', authMiddleware, currentUser)

import express, { Request, Response } from 'express'
import { v4 as uuidv4 } from 'uuid'
import jwt from 'jsonwebtoken'

import { body } from 'express-validator'
import { User } from '../models/User'
import { loadUsers, saveUsers } from '../data'
import { Password } from '../utils/password';
import { validateRequest } from '../middlewares/validate-request';


const router = express.Router()

router.post('/auth/signup', [
    body('email')
      .isEmail()
      .withMessage('Email must be valid'),
    body('password')
      .trim()
      .isLength({ min: 4 })
      .withMessage('Password must be at least 4 characters')
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const users: User[] = loadUsers()

    const { email, password } = req.body

    const exists = users.find((item: { email: any }) => item.email === email)

    if (exists) {
      return res.status(400).send({
        message: 'User already exists'
      })
    }

    const user: User = {
      id: uuidv4(),
      email,
      password: await Password.toHash(password)
    }

    saveUsers([...users, user])

    const userJwt = jwt.sign({
      id: user.id, email: user.email
    }, process.env.JWT_KEY!)

    req.session = {
      jwt: userJwt,
    };

    res.status(201).send({ data: {...user, token: userJwt}})
})

export { router as signUpRouter }
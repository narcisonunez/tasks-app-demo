import express, { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { body } from 'express-validator'

import { BadRequestError } from 'common'
import { Password } from '../utils/password'
import { loadUsers } from '../data'
import { validateRequest } from 'common';

const router = express.Router()

router.post('/auth/signin', [
    body('email')
      .isEmail()
      .withMessage('Email must be valid'),
    body('password')
      .trim()
      .isLength({ min: 4 })
      .withMessage('Password must be at least 4 characters')
  ],
  validateRequest
  , async (req: Request, res: Response) => {
    const users = loadUsers()

    const { email, password } = req.body

    const user = users.find(item => item.email === email)
    
    if (!user) {
      throw new BadRequestError('Invalid Credentials')
    }

    const passwordMatch = await Password.compare(user.password, password)
    
    if (!passwordMatch) {
      throw new BadRequestError('Invalid Credentials')
    }

    const userJwt = jwt.sign({
      id: user.id, email: user.email
    }, process.env.JWT_KEY!)

    req.session = {
      jwt: userJwt,
    };

    res.send({ data: {...user, token: userJwt}})
})

export { router as signInRouter }
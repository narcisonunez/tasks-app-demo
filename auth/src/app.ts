import express from 'express'
import 'express-async-errors';
import { json } from 'body-parser'
import cookieSession from 'cookie-session'

import { signInRouter } from './routes/signin'
import { signUpRouter } from './routes/signup'
import { signoutRouter } from './routes/signout';

import { errorHandler } from 'common'
import { NotFoundError } from 'common';


const app = express()
app.use(json())
app.use(cookieSession({
  signed: false
}))

app.use(signInRouter)
app.use(signUpRouter)
app.use(signoutRouter)

app.all('*', async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler)

export { app }
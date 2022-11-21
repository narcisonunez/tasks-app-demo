import express from 'express'
import 'express-async-errors';
import { json } from 'body-parser'
import cookieSession from 'cookie-session'

import { errorHandler } from 'common'
import { NotFoundError } from 'common';
import { addTaskRouter } from './router/add-task';
import { getTasksRouter } from './router/get-tasks';
import { updateTaskRouter } from './router/update-task';

const app = express()

app.use(json())
app.use(cookieSession({
  signed: false
}))

app.use(addTaskRouter)
app.use(getTasksRouter)
app.use(updateTaskRouter)

app.all('*', async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler)

export { app }
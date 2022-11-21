import express, { Request, Response } from 'express'
import { loadUserTasks } from '../data'
import { loggedUser } from '../middlewares/logged-user';
import { requireAuth } from '../middlewares/require-auth';

const router = express.Router()

router.get('/tasks', loggedUser, requireAuth, (req: Request, res: Response) => {
  const tasks = loadUserTasks(req.loggedUser!.id)
  res.send({
    data: tasks
  })
})

export { router as getTasksRouter }
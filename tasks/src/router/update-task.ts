import express, { Request, Response } from 'express'
import { body } from 'express-validator'
import { Task, TaskStatus } from '../models/Task'
import { loadTasks, saveTasks } from '../data';
import { NotFoundError } from '../errors/not-found-error';
import { validateRequest } from '../middlewares/validate-request';
import { loggedUser } from '../middlewares/logged-user';
import { requireAuth } from '../middlewares/require-auth';

const router = express.Router()

router.put('/tasks/:id',
  loggedUser,
  requireAuth,
  [
    body('title')
      .isLength({ min: 4, max: 250 })
      .withMessage('title must be at least 4 to 250 characters'),
    body('description')
      .trim()
      .isLength({ min: 4 })
      .withMessage('Description must be at least 5 characters'),
    body('status')
      .trim()
      .isIn(Object.values(TaskStatus))
      .withMessage(`Status must be a valid status. Possible values are ${Object.values(TaskStatus)}`)
  ],
  validateRequest,
  (req: Request, res: Response) => {
    const tasks: any = loadTasks()

    const userId = req.loggedUser!.id
    const { id } = req.params
    const { title, description, status } = req.body

    let existingTasks: Task[] = tasks[userId]

    let task: Task | undefined = existingTasks.find(item => item.id === id)
    let taskIndex: number = existingTasks.findIndex(item => item.id === id)

    if (!task) {
      throw new NotFoundError()
    }

    task = {
      ...task,
      title,
      description,
      status
    }

    existingTasks[taskIndex] = task
    tasks[userId] = existingTasks

    saveTasks(tasks)

    res.send({
      data: task
    })
})

export { router as updateTaskRouter }
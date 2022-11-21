import express, { Request, Response } from 'express'
import { body, validationResult } from 'express-validator'
import { Task, TaskStatus } from '../models/Task'
import { RequestValidationError } from '../errors/request-validation-error';
import { loadTasks, saveTasks } from '../data';
import { v4 as uuidv4 } from 'uuid';
import { loggedUser } from '../middlewares/logged-user';
import { requireAuth } from '../middlewares/require-auth';
import { validateRequest } from '../middlewares/validate-request';

const router = express.Router()

router.post('/tasks', [
    body('title')
      .isLength({ min: 4, max: 250 })
      .withMessage('title must be at least 4 to 250 characters'),
    body('description')
      .trim()
      .isLength({ min: 4 })
      .withMessage('Description must be at least 5 characters')
  ],
  validateRequest,
  loggedUser,
  requireAuth,
  (req: Request, res: Response) => {
    const tasks: any = loadTasks()

    const id = uuidv4()
    const userId = req.loggedUser!.id
    const { title, description } = req.body
    const task: Task = {
      user_id: userId, id, title, description, status: TaskStatus.TODO
    }

    let existingTasks: Task[] = tasks[userId]

    if (existingTasks) {
      existingTasks.push(task)
      tasks[userId] = existingTasks
    } else {
      existingTasks = [task]
      tasks[userId] = existingTasks
    }

    saveTasks(tasks)

    res.send({
      data: existingTasks
    })
})

export { router as addTaskRouter }
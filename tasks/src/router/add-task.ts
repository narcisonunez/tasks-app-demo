import express, { Request, Response } from 'express'
import { body } from 'express-validator'
import { Task, TaskStatus } from '../models/Task'
import { loadTasks, saveTasks } from '../data';
import { v4 as uuidv4 } from 'uuid';
import { loggedUser } from 'common';
import { requireAuth } from 'common';
import { validateRequest } from 'common';

const router = express.Router()

router.post('/tasks',
  loggedUser,
  requireAuth,
  [
    body('title')
      .isLength({ min: 4, max: 250 })
      .withMessage('title must be at least 4 to 250 characters'),
    body('description')
      .trim()
      .isLength({ min: 4 })
      .withMessage('Description must be at least 5 characters')
  ],
  validateRequest,
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

    res.status(201).send({
      data: existingTasks
    })
})

export { router as addTaskRouter }
import fs from 'fs'
import path from 'path'
import { Task } from '../models/Task'


function loadTasks(): Task[] {
  const rawData = fs.readFileSync(path.join(__dirname, './tasks.json'), 'utf-8')
  return JSON.parse(rawData)
}

function loadUserTasks(userId: string): Task[] {
  const rawData = fs.readFileSync(path.join(__dirname, './tasks.json'))
  const tasks = JSON.parse(rawData.toString())
  return tasks[userId] || []
}

function saveTasks(tasks: Task[]) {
  fs.writeFileSync(
    path.join(__dirname, './tasks.json'),
    JSON.stringify(tasks),
    { flag: 'w'}
  )
}

export { loadTasks, loadUserTasks, saveTasks }
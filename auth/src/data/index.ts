import fs from 'fs'
import path from 'path'
import { User } from '../models/User'

function loadUsers(): User[] {
  const rawData = fs.readFileSync(path.join(__dirname, './users.json'), 'utf-8')
  return JSON.parse(rawData)
}

function saveUsers(users: User[]) {
  fs.writeFileSync(
    path.join(__dirname, './users.json'),
    JSON.stringify(users),
    { flag: 'w'}
  )
}

export { loadUsers, saveUsers }
const express = require('express')
const bodyParser = require('body-parser')
const { v4: uuidv4 }= require('uuid')

const app = express()

const tasks = {}

const statuses = {
  TODO: 'todo',
  IN_PROGRESS: 'in_progress',
  DONE: 'done',
  ARCHIVED: 'archived'
}

app.use(bodyParser.json())

app.get('/tasks', (req, res) => {
  return res.send({
    data: tasks
  })
})

app.post('/tasks', (req, res) => {
  const id = uuidv4()
  const { title, description } = req.body

  tasks[id] = {
    id,
    title,
    description,
    status: statuses.TODO
  }

  return res.status(201).send({
    data: tasks[id]
  })
})

app.put('/tasks/:id', (req, res) => {
  const id = req.params.id
  const { title, description, status } = req.body

  tasks[id] = {
    title,
    description,
    status
  }

  return res.send({
    data: tasks[id]
  })
})

app.listen(4000, () => {
  console.log('Listening on port 4000')
})
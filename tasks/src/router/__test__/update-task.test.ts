import request from 'supertest'
import { app } from '../../app'

const tasksDataSource = {
  '0522573a-5de7-4b96-a63b-83fbc6c746e7': [
    {
      user_id: '0522573a-5de7-4b96-a63b-83fbc6c746e7',
      id: '3445573a-5de7-4b96-a63b-83fbc6c746e7',
      title: 'Test Task',
      description: 'Creating a new task',
      status: 'todo'
    }
  ]
}

jest.mock('fs', () => {
  return {
    readFileSync: () => JSON.stringify(tasksDataSource),
    writeFileSync: jest.fn()
  }
})

const cookie = [
  'session=eyJqd3QiOiJleUpoYkdjaU9pSklVekkxTmlJc0luUjVjQ0k2SWtwWFZDSjkuZXlKcFpDSTZJakExTWpJMU56TmhMVFZrWlRjdE5HSTVOaTFoTmpOaUxUZ3pabUpqTm1NM05EWmxOeUlzSW1WdFlXbHNJam9pYW1odmJsOWtiMlZBZVc5d2JXRnBiQzVqYjIwaUxDSnBZWFFpT2pFMk5qa3dORFl5TkRWOS44R1p5MmZHSlBDelRWRlRQbmFnSl96UmdYUzZMSWhvM1pUWWcyRUtkdW5zIn0=; path=/; httponly'
]

describe('update-task.ts', () => {
  beforeEach(() => {
    process.env.JWT_KEY = 'JWT_KEY'
  })

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should returns a 200 with the updated task', async () => {
    const expected = {
      data: {
        user_id: '0522573a-5de7-4b96-a63b-83fbc6c746e7',
        id: '3445573a-5de7-4b96-a63b-83fbc6c746e7',
        title: 'Test Task UPDATED',
        description: 'Creating a new task UPDATED',
        status: 'todo'
      }
    }

    const res = await request(app)
      .put('/tasks/3445573a-5de7-4b96-a63b-83fbc6c746e7')
      .set('Cookie', cookie)
      .send({
        title: 'Test Task UPDATED',
        description: 'Creating a new task UPDATED',
        status: 'todo'
      })
    
    expect(res.status).toEqual(200)
    expect(res.body).toEqual(expect.objectContaining(expected))
  })

  it('should returns a 400 when an invalid status is sent', async () => {
    const expected = {
      errors: [
        {
          message: 'Status must be a valid status. Possible values are todo,in_progress,done,archived',
          field: 'status'
        }
      ]
    }

    const res = await request(app)
      .put('/tasks/3445573a-5de7-4b96-a63b-83fbc6c746e7')
      .set('Cookie', cookie)
      .send({
        title: 'Test Task UPDATED',
        description: 'Creating a new task UPDATED',
        status: 'progress'
      })
    
    expect(res.status).toEqual(400)
    expect(res.body).toEqual(expect.objectContaining(expected))
  })

  it('should fails with 401 for Unauthorized user', async () => {

    const expected = { message: 'Unauthorized' }

    const res = await request(app)
      .get('/tasks')
      .send()
      
    expect(res.status).toEqual(401)
    expect(res.body).toEqual(expect.objectContaining(expected))
  })

  it('should fails with validation errors when title is not valid', async () => {

    const expected = { errors: [ { message: 'title must be at least 4 to 250 characters', field: 'title' } ] }

    const res = await request(app)
      .post('/tasks')
      .set('Cookie', cookie)
      .send({
        title: 'ABC',
        description: 'Creating a task',
        status: 'todo'
      })
    
    expect(res.status).toEqual(400)
    expect(res.body).toEqual(expect.objectContaining(expected))
  })

  it('should fails with validation errors when description is not valid', async () => {

    const expected = { errors: [ { message: 'Description must be at least 5 characters', field: 'description' } ] }

    const res = await request(app)
      .post('/tasks')
      .set('Cookie', cookie)
      .send({
        title: 'Test task',
        description: '',
        status: 'todo'
      })
      
    expect(res.status).toEqual(400)
    expect(res.body).toEqual(expect.objectContaining(expected))
  })
})


import request from 'supertest'
import { app } from '../../app'

jest.mock('fs', () => {
  return {
    readFileSync: () => '[]',
    writeFileSync: jest.fn()
  }
})

const cookie = [
  'session=eyJqd3QiOiJleUpoYkdjaU9pSklVekkxTmlJc0luUjVjQ0k2SWtwWFZDSjkuZXlKcFpDSTZJakExTWpJMU56TmhMVFZrWlRjdE5HSTVOaTFoTmpOaUxUZ3pabUpqTm1NM05EWmxOeUlzSW1WdFlXbHNJam9pYW1odmJsOWtiMlZBZVc5d2JXRnBiQzVqYjIwaUxDSnBZWFFpT2pFMk5qa3dORFl5TkRWOS44R1p5MmZHSlBDelRWRlRQbmFnSl96UmdYUzZMSWhvM1pUWWcyRUtkdW5zIn0=; path=/; httponly'
]

describe('add-task.ts', () => {
  beforeEach(() => {
    process.env.JWT_KEY = 'JWT_KEY'
  })

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should returns a 201 for successful creating a task', async () => {

    const expected = {
      data: [
        {
          user_id: expect.any(String),
          id: expect.any(String),
          title: 'Test Task',
          description: 'Creating a new task',
          status: 'todo'
        }
      ]
    }

    const res = await request(app)
      .post('/tasks')
      .set('Cookie', cookie)
      .send({
        title: 'Test Task',
        description: 'Creating a new task'
      })
      
    expect(res.status).toEqual(201)
    expect(res.body).toEqual(expect.objectContaining(expected))
  })

  it('should fails with 401 for Unauthorized user', async () => {

    const expected = { message: 'Unauthorized' }

    const res = await request(app)
      .post('/tasks')
      .send({
        title: 'Test Task',
        description: 'Creating a new task'
      })
      
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
        description: 'Creating a task'
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
        description: ''
      })
      
    expect(res.status).toEqual(400)
    expect(res.body).toEqual(expect.objectContaining(expected))
  })
})


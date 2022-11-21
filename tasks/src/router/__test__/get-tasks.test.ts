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

describe('get-task.ts', () => {
  beforeEach(() => {
    process.env.JWT_KEY = 'JWT_KEY'
  })

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should returns a 200 with all the tasks belongs to the user', async () => {

    const expected = {
      data: [
        {
          user_id: '0522573a-5de7-4b96-a63b-83fbc6c746e7',
          id: expect.any(String),
          title: 'Test Task',
          description: 'Creating a new task',
          status: 'todo'
        }
      ]
    }

    const res = await request(app)
      .get('/tasks')
      .set('Cookie', cookie)
      .send()
    
    expect(res.status).toEqual(200)
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
})


import request from 'supertest'
import { app } from '../../app'

const usersDataSource = [
  {
    "id": "76sdf78sd6g76gd76gsfdsfg",
    "email": "jhon_doe@yopmail.com",
    "password": "531a34409df4ff9394fd5cdcb383e2b0b74b81349009851572d6a3ea205d34796a3e6274284a60a4f05a6dc8b687a96c87be733f02be64e288f2a9544d4f0ee8.a6f551a06df86978"
  }
]

jest.mock('fs', () => {
  return {
    readFileSync: () => JSON.stringify(usersDataSource),
    writeFileSync: jest.fn()
  }
})

describe('Signin.ts', () => {
  beforeEach(() => {
    process.env.JWT_KEY = 'JWT_KEY'
  })

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should returns a 200 for successful signin', async () => {

    const expected = {
      data: {
        id: expect.any(String),
        email: 'jhon_doe@yopmail.com',
        password: expect.any(String),
        token: expect.any(String)
      }
    }

    const res = await request(app)
      .post('/auth/signin')
      .send({
        email: 'jhon_doe@yopmail.com',
        password: '123456'
      })

    const session: string = res.get('Set-Cookie')[0].split(';')[0]

    expect(res.status).toEqual(200)
    expect(res.body).toEqual(expect.objectContaining(expected))
    expect(session).not.toEqual('session=')
  })

  it('should returns a 400 when invalid credentials are provided', async () => {

    const expected = { errors: [{ message: 'Invalid Credentials'}] }

    const res = await request(app)
      .post('/auth/signin')
      .send({
        email: 'jhon_doe@yopmail.com',
        password: '12345'
      })

    expect(res.status).toEqual(400)
    expect(res.body).toEqual(expect.objectContaining(expected))
  })

  it('should fails with validation errors when email is not valid', async () => {

    const expected = { errors: [ { message: 'Email must be valid', field: 'email' } ] }

    const res = await request(app)
      .post('/auth/signup')
      .send({
        email: 'jhon_doe@yopmailcom',
        password: '123456'
      })

    expect(res.status).toEqual(400)
    expect(res.body).toEqual(expect.objectContaining(expected))
  })

  it('should fails with validation errors when password is not valid', async () => {

    const expected = { errors: [ { message: 'Password must be at least 4 characters', field: 'password' } ] }

    const res = await request(app)
      .post('/auth/signup')
      .send({
        email: 'jhon_doe@yopmail.com',
        password: '123'
      })
      
    expect(res.status).toEqual(400)
    expect(res.body).toEqual(expect.objectContaining(expected))
  })
})


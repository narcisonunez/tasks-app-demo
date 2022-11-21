import request from 'supertest'
import { app } from '../../app'

jest.mock('fs', () => {
  return {
    readFileSync: () => '[]',
    writeFileSync: jest.fn()
  }
})

describe('Signup.ts', () => {
  beforeEach(() => {
    process.env.JWT_KEY = 'JWT_KEY'
  })

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should returns a 201 for successful signup', async () => {

    const expected = {
      data: {
        id: expect.any(String),
        email: 'jhon_doe@yopmail.com',
        password: expect.any(String),
        token: expect.any(String)
      }
    }

    const res = await request(app)
      .post('/auth/signup')
      .send({
        email: 'jhon_doe@yopmail.com',
        password: '123456'
      })
    
    const session: string = res.get('Set-Cookie')[0].split(';')[0]
    expect(res.status).toEqual(201)
    expect(res.body).toEqual(expect.objectContaining(expected))
    expect(session).not.toEqual('session=')
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


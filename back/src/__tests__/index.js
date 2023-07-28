const request = require('supertest')
const app = require('../server')()
const bcrypt = require('bcrypt')
const Users = require('../models/users')
const Admins = require('../models/admins') // Assuming you have an Admins model

jest.mock('bcrypt', () => ({
  hashSync: jest.fn(password => `hashed_${password}`),
}))

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(),
}))

describe('registration', () => {
  it('should return 422 if passwords do not match', async () => {
    const response = await request(app)
      .post('/api/user/registration')
      .send({
        email: 'test@example.com',
        password: 'password1',
        confirmPassword: 'password2',
        firstname: 'John',
        lastname: 'Doe',
        societyName: 'Test Corp',
        url: 'http://example.com',
      })

    expect(response.status).toBe(422)
    expect(response.body).toEqual({ error: "Passwords don't match" })
  })
})

describe('authentication user', () => {
  it('should return 404 if user is not found', async () => {
    
    Users.findOne = jest.fn().mockResolvedValueOnce(null)

    const response = await request(app)
      .post('/api/user/authentication')
      .send({ email: 'nonexistent@example.com', password: 'password123' })

    expect(response.status).toBe(404)
  })

  it('should return 404 if password does not match', async () => {
    Users.findOne = jest.fn().mockResolvedValueOnce({
      email: 'test@example.com',
      password: bcrypt.hashSync('different_password', 10),
    })

    const response = await request(app)
      .post('/api/user/authentication')
      .send({ email: 'test@example.com', password: 'password123' })

    expect(response.status).toBe(404)
  })
})

describe('adminAuthentication admin', () => {
  it('should return 404 if admin is not found', async () => {
    Admins.findOne = jest.fn().mockResolvedValueOnce(null)

    const response = await request(app)
      .post('/api/admin/authentication')
      .send({ email: 'nonexistent@example.com', password: 'password123' })

    expect(response.status).toBe(404)
    expect(response.body).toEqual({ error: 'Admin not found' })
  })

  it('should handle internal server error', async () => {
    Admins.findOne = jest.fn().mockRejectedValueOnce(new Error('Database error'));

    const response = await request(app)
      .post('/api/admin/authentication')
      .send({ email: 'admin@example.com', password: 'adminpassword' });

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: 'Internal error' });
  });
})
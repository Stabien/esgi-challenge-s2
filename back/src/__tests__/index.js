const supertest = require('supertest');
const createServer = require('../server');
const jwt = require('jsonwebtoken');
const database = require('../config/db');
const fs = require('fs')

const app = createServer();

const randomWord = (length) => {
  let alphabet = 'abcdefghijklmnopqrstuvwxyz';
  let word = '';

  for (let i = 0; i < length; i++)
    word += alphabet[Math.floor(Math.random() * 26)]

  return word;
}

let token = null;
const userUuid = "56a65432-2b74-4efa-92e8-e62c862c0d3a"
const kbisUuid = "0640be07-d243-4aec-ad34-c0e408f600ec"

const testUser = {
  uuid: userUuid,
  email: "azerty@azerty.unittest",
  password: "test",
  societyName: "society test",
  url: "http://url-test.fr",
  firstname: "test",
  lastname: "test",
  status: 'PENDING',
  kbisUuid,
  appId: "cD8zu3uthA",
}

const testKbis = {
  uuid: kbisUuid,
  path: "public/uploads/test.pdf",
  name: "test.pdf",
  type: "application/pdf",
}


/** Create fake user and generate token */
// beforeAll(async done => {
//   const newUser = await Users.create({
//     uuid: userUuid,
//     email: "azerty@azerty.unittest",
//     password: "test",
//     societyName: "society test",
//     url: "http://url-test.fr",
//     firstname: "test",
//     lastname: "test",
//     status: 'PENDING',
//     kbisUuid,
//     appId: "cD8zu3uthA",
//   })

//   const newKbis = await Kbis.create({
//     uuid: kbisUuid,
//     path: "public/uploads/test.pdf",
//     name: "test.pdf",
//     type: "application/pdf",
//   })

//   await newUser.save()
//   await newKbis.save()
// })

afterAll(async done => {
  await Users.delete({ uuid: userUuid })
  await Kbis.delete({ uuid: kbisUuid })
})

describe('User authentication tests', () => {
  /** Testing user authentication success */
  it('should return 200 status with jwt token', async () => {
    await supertest(app)
      .post('/api/user/authentication')
      .send({ email: testUser.email, password: testUser.password })
      .then(response => {
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({ token: expect.any(String) })
      });
  });

  /** Testing user authentication fail */
  it('should return 404 status with an error message', async () => {
    await supertest(app)
      .post('/api/user/authentication')
      .send({ email: email, password: '' })
      .then(response => {
        expect(response.statusCode).toBe(404);
        expect(response.body).toEqual(expect.any(Object));
      });
  });
});

// describe('Update user test', () => {
//   /** Testing user update success */
//   it('should return 200 with a success message', async () => {
//     await supertest(app)
//       .put('/api/user/999')
//       .set('Authorization', `bearer ${token}`)
//       .send({
//         firstname: 'teste',
//         lastname: 'test',
//         email: email,
//         password: 'azertest7',
//       })
//       .then(response => {
//         expect(response.statusCode).toBe(200);
//         expect(response.body).toEqual(expect.any(Object));
//       });
//   });

//   /** Testing user udpate with incorrect fields value */
//   it('should return 422 with an error message', async () => {
//     await supertest(app)
//       .put('/api/user/999')
//       .set('Authorization', `bearer ${token}`)
//       .send({
//         firstname: '',
//         lastname: '',
//         email: '',
//         password: ''
//       })
//       .then(response => {
//         expect(response.statusCode).toBe(422);
//         expect(response.body).toEqual(expect.any(Object));
//       });
//   });

//   /** Testing user update with incorrect id */
//   it('should return 401 with an error message', async () => {
//     await supertest(app)
//       .put('/api/user/1000')
//       .set('Authorization', `bearer ${token}`)
//       .send({
//         firstname: 'teste',
//         lastname: 'test',
//         email: email,
//         password: 'azertest',
//       })
//       .then(response => {
//         expect(response.statusCode).toBe(401);
//         expect(response.body).toEqual(expect.any(Object));
//       });
//   });
// });
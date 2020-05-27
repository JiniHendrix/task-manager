const request = require('supertest');
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const app = require('../src/app');
const User = require('../src/models/user');

const userOneId = new mongoose.Types.ObjectId();
const userOne = {
  _id: userOneId,
  name: 'Jorge',
  email: 'jorge@gmail.com',
  password: '1234abcd',
  tokens: [{
    token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET)
  }]
}

beforeEach(async () => {
  await User.deleteMany();
  await new User(userOne).save();
});

afterEach(() => {

});

test('Should signup a new user', async () => {
  await request(app).post('/users').send({
    name: 'Andrew',
    email: 'andrew@gmail.com',
    password: 'MyPass777!'
  }).expect(201);
});

test('Should login existing user', async () => {
  const response = await request(app).post('/users/login').send({
    email: 'jorge@gmail.com',
    password: '1234abcd',
    name: 'Jorge'
  })
  const user = await User.findById(userOneId);
  expect(response.body.token).toBe(user.tokens[1].token)  
})

test('Should not login nonexisting user', async () => {
  await request(app).post('/users/login').send({
    email: 'jack@gmail.com',
    password: '14232421nb'
  }).expect(400)
})

test('Should get profile for authenticated user', async () => {
  await request(app)
    .get('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)
})

test('Should error getting profile for unauthenticated user', async () => {
  await request(app)
    .get('/users/me')
    .send()
    .expect(401)
})

test('Should delete account for user', async () => {
  const response = await request(app)
    .delete('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
  
  const user = await User.findById(userOneId)
  expect(user).toBeNull()
})

test('Should not delete account for unauthenticated user', async () => {
  await request(app)
    .delete('/users/me')
    .send()
    .expect(401)
});


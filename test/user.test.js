const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/user');

const userOne = {
  name: 'Jorge',
  email: 'jorge@gmail.com',
  password: '1234abcd',
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
  await request(app).post('/users/login').send({
    email: 'jorge@gmail.com',
    password: '1234abcd',
    name: 'Jorge'
  }).expect(200)
})

test('Should not login nonexisting user', async () => {
  await request(app).post('/users/login').send({
    email: 'jack@gmail.com',
    password: '14232421nb'
  }).expect(400)
})

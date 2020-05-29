const request = require('supertest')
const app = require('../src/app')
const Task = require('../src/models/task')
const {
  userOne,
  userOneId,
  userTwo,
  taskOneId,
  setupDatabase
} = require('./fixtures/db')

beforeEach(setupDatabase);

test('Should create task for user', async () => {
  const response = await request(app)
    .post('/tasks')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
      description: 'From my test'
    })
    .expect(201)

  const task = await Task.findById(response.body._id)
  expect(task).not.toBeNull()
  expect(task.completed).toEqual(false)
})

test('Should read tasks for user', async () => {
  const response = await request(app)
    .get('/tasks')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .expect(200)

  const userOneTasks = await Task.find({ owner: userOneId })
  expect(userOneTasks.length).toEqual(response.body.length)
  expect(userOneTasks[0].name).toEqual(response.body[0].name)
})

test('Should not be able to delete other users\' tasks', async () => {
  const response = await request(app)
    .delete(`/tasks/${taskOneId}`)
    .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
    .expect(404);

  const userOneTasks = await Task.find({ owner: userOneId })
  expect(userOneTasks.length).toEqual(2)
})
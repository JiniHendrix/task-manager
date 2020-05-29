const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const { Task, User } = require('../../src/models')

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

const userTwoId = new mongoose.Types.ObjectId();
const userTwo = {
  _id: userTwoId,
  name: 'Borge',
  email: 'borge@gmail.com',
  password: '1234abcd',
  tokens: [{
    token: jwt.sign({ _id: userTwoId }, process.env.JWT_SECRET)
  }]
}

const taskOneId = new mongoose.Types.ObjectId();
const taskOne = {
  _id: taskOneId,
  description: 'First task',
  completed: false,
  owner: userOne._id
}

const taskTwo = {
  _id: new mongoose.Types.ObjectId(),
  description: 'Second task',
  completed: false,
  owner: userOne._id
}

const taskThree = {
  _id: new mongoose.Types.ObjectId(),
  description: 'Third task',
  completed: false,
  owner: userTwo._id
}

const setupDatabase = async () => {
  await User.deleteMany();
  await Task.deleteMany()
  await new User(userOne).save();
  await new User(userTwo).save()
  await new Task(taskOne).save()
  await new Task(taskTwo).save()
  await new Task(taskThree).save()
}

module.exports = {
  userOne,
  userOneId,
  userTwo,
  userTwoId,
  setupDatabase,
  taskOneId
}
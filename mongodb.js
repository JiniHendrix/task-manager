const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

const connectionURL = 'mongodb://127.0.0.1:27017';
const databaseName = 'task-manager';

MongoClient.connect(connectionURL, { useNewUrlParser: true, useUnifiedTopology: true }, (error, client) => {
  if (error) {
    console.log('Unable to connect to database');
  }

  const db = client.db(databaseName);

  // db.collection('users').insertOne({
  //   name: 'Andres',
  //   age: 27
  // }, (error, result) => {
  //   if (error) {
  //     return console.log('Unable to insert user');
  //   }

  //   console.log(result.ops);
  // });

  db.collection('users').insertMany([
    {
      name: 'Jin',
      age: 29,
    },
    {
      name: 'Kevin',
      age: 28,
    }
  ], (error, result) => {
    if (error) {
      console.log('Failed to insert users');
    }
    
    console.log(result.ops)
  });

  db.collection('tasks').insertMany([
    {
      description: 'Watch porn',
      completed: true,
    },
    {
      description: 'Make food',
      completed: true,
    },
    {
      description: 'Dig hole for basil plant',
      completed: true,
    },
  ], (error, result) => {
    if (error) {
      console.log('Failed to insert tasks')
    }

    console.log(result.ops);
  })
});
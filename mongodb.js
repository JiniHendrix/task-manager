const {
  MongoClient,
  ObjectID,
} = require('mongodb');

const connectionURL = 'mongodb://127.0.0.1:27017';
const databaseName = 'task-manager';

const id = new ObjectID();
console.log(id)
console.log(id.toHexString().length)

MongoClient.connect(connectionURL, { useNewUrlParser: true, useUnifiedTopology: true }, (error, client) => {
  if (error) {
    console.log('Unable to connect to database');
  }

  const db = client.db(databaseName);

  db.collection('tasks').insertOne({ description: 'suck tits', completed: false })

  db.collection('tasks').findOne({ _id: new ObjectID('5ec2cd1057eacf01be6d2cbf') }, (error, user) => {
    if (error) {
      return console.log('Unable to find task');
    }

    console.log(user);
  });

  db.collection('tasks').find({ completed: false }).toArray((error, tasks) => {
    if (error) {
      return console.log('Unable to find tasks');
    }

    console.log(tasks)
  });
});
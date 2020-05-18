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

  db.collection('tasks').deleteOne({
    description: 'Dig hole for basil plant'
  })
    .then(result => console.log(result.result))
    .catch(err => console.log(err))
});
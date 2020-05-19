const express = require('express');
const { User, Task } = require('./models');
require('./db/mongoose');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.post('/users', (req, res) => {
  const newUser = new User(req.body);

  newUser.save()
    .then(() => {
      res.status(201).send(newUser);
    })
    .catch(err => {
      res.status(400).send(err);
    })
});

app.get('/users', (req, res) => {
  User.find({})
    .then(users => {
      res.send(users);
    })
    .catch(err => {
      res.status(500).send();
    });
});

app.get('/users/:id', (req, res) => {
  User.findById(req.params.id)
    .then(user => {
      if (!user) {
        return res.send(404);
      }

      res.send(user);
    })
    .catch(e => {
      res.status(500).send(e);
    });
});

app.post('/tasks', (req, res) => {
  const newTask = new Task(req.body);

  newTask.save()
    .then(() => {
      res.status(201).send(newTask);
    })
    .catch(err => {
      res.status(400).send(err);
    })
})

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

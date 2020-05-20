const express = require('express');
const { User, Task } = require('./models');
const { userRouter } = require('./routers');
require('./db/mongoose');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(userRouter);

app.post('/tasks', (req, res) => {
  const newTask = new Task(req.body);

  newTask.save()
    .then(() => {
      res.status(201).send(newTask);
    })
    .catch(err => {
      res.status(400).send(err);
    })
});

app.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find({});

    res.send(tasks);
  } catch (e) {
    res.send(500);
  }
});

app.get('/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findById({ _id: req.params.id });
    if (!task) {
      return res.send(404);
    }
  
    res.send(task);
  } catch (e) {
    res.send(500);
  }
});

app.patch('/tasks/:id', async (req, res) => {
  const allowedUpdates = ['description', 'completed'];
  const proposedUpdates = Object.keys(req.body);
  const isValid = proposedUpdates.every(proposedUpdate => allowedUpdates.includes(proposedUpdate));

  if (!isValid) {
    return res.status(404).send('Invalid fields present');
  }

  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

    if (!task) {
      return res.send(404);
    }

    res.send(task);
  } catch (e) {
    res.status(400).send(e);
  }
});

app.delete('/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      return res.send(404);
    }

    res.send(task)
  } catch (e) {
    res.status(400).send(e);
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

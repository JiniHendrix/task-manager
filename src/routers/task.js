const express = require('express');
const { Task } = require('../models');

const router = new express.Router();

router.post('/tasks', (req, res) => {
  const newTask = new Task(req.body);

  newTask.save()
    .then(() => {
      res.status(201).send(newTask);
    })
    .catch(err => {
      res.status(400).send(err);
    })
});

router.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find({});

    res.send(tasks);
  } catch (e) {
    res.send(500);
  }
});

router.get('/tasks/:id', async (req, res) => {
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

router.patch('/tasks/:id', async (req, res) => {
  const allowedUpdates = ['description', 'completed'];
  const proposedUpdates = Object.keys(req.body);
  const isValid = proposedUpdates.every(proposedUpdate => allowedUpdates.includes(proposedUpdate));

  if (!isValid) {
    return res.status(404).send('Invalid fields present');
  }

  try {
    const task = await Task.findById(req.params.id);
    proposedUpdates.forEach(key => task[key] = req.body[key]);

    await task.save();
    
    if (!task) {
      return res.send(404);
    }

    res.send(task);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.delete('/tasks/:id', async (req, res) => {
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

module.exports = router;

const express = require('express');
const { Task } = require('../models');
const auth = require('../middleware/auth');

const router = new express.Router();

router.post('/tasks', auth, async (req, res) => {
  const task = new Task({
    ...req.body,
    owner: req.user._id,
  });

  try {
    await task.save()

    res.status(201).send(task);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find({});

    res.send(tasks);
  } catch (e) {
    res.send(500);
  }
});

router.get('/tasks/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, owner: req.user._id });
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

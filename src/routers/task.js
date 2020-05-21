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

// GET /tasks?limit=10&skip20

router.get('/tasks', auth, async (req, res) => {
  const match = {};

  if (req.query.completed) {
    match.completed = req.query.completed === 'true';
  }

  try {
    await req.user.populate({
      path: 'tasks',
      match,
      options: {
        limit: parseInt(req.query.limit),
        skip: parseInt(req.query.skip),
      }
    }).execPopulate();

    res.send(req.user.tasks);
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

router.patch('/tasks/:id', auth, async (req, res) => {
  const allowedUpdates = ['description', 'completed'];
  const proposedUpdates = Object.keys(req.body);
  const isValid = proposedUpdates.every(proposedUpdate => allowedUpdates.includes(proposedUpdate));

  if (!isValid) {
    return res.status(404).send('Invalid fields present');
  }

  try {
    const task = await Task.findOne({ _id: req.params.id, owner: req.user._id });
    
    if (!task) {
      return res.send(404);
    }

    proposedUpdates.forEach(key => task[key] = req.body[key]);
    await task.save();
    res.send(task);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.delete('/tasks/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id });

    if (!task) {
      return res.send(404);
    }

    res.send(task)
  } catch (e) {
    res.status(400).send(e);
  }
});

module.exports = router;

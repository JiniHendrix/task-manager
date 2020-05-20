const express = require('express');
const { User } = require('../models');

const router = new express.Router();

router.post('/users', (req, res) => {
  const newUser = new User(req.body);

  newUser.save()
    .then(() => {
      res.status(201).send(newUser);
    })
    .catch(err => {
      res.status(400).send(err);
    })
});

router.get('/users', (req, res) => {
  User.find({})
    .then(users => {
      res.send(users);
    })
    .catch(err => {
      res.status(500).send();
    });
});

router.get('/users/:id', (req, res) => {
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

router.patch('/users/:id', async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['name', 'email', 'password', 'age'];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

  if (isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates!' });
  }

  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

    if (!user) {
      return res.send(404);
    }

    res.send(user);
  } catch (e) {
    res.status(400).send(e)
  }
});

router.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.send(404);
    }

    res.send(user);
  } catch (e) {
    res.status(400).send(e);
  }
});

module.exports = router;
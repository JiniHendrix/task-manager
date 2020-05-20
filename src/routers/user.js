const express = require('express');
const { User } = require('../models');
const auth = require('../middleware/auth');

const router = new express.Router();

router.post('/users', async (req, res) => {
  try {
    const newUser = new User(req.body);
    const token = await newUser.generateAuthToken();

    res.status(201).send({ user: newUser, token })
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get('/users/me', auth, (req, res) => {
  res.send(req.user);
});

router.get('/users', auth, (req, res) => {
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

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates!' });
  }

  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.send(404);
    }
    updates.forEach(update => user[update] = req.body[update]);

    await user.save()

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

router.post('/users/login', async (req, res) => {
  try {
    const user = await User.findByCredentials(req.body.email, req.body.password);
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (e) {
    res.status(400).send();
  }
});

module.exports = router;
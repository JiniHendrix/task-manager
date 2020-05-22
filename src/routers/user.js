const express = require('express');
const multer = require('multer');
const { User } = require('../models');
const auth = require('../middleware/auth');

const router = new express.Router();
const avatarUpload = multer({
  dest: 'avatars',
  fileFilter: (req, file, cb) => {
    if (file.originalname.match(/.(jpg|jpeg|png)$/)) {
      return cb(undefined, true);
    }

    cb(new Error('Image type must be jpg, jpeg, or png'))
  },
  limits: {
    fileSize: 1000000
  },
});

router.post('/users', async (req, res) => {
  try {
    const newUser = new User(req.body);
    const token = await newUser.generateAuthToken();

    res.status(201).send({ user: newUser, token })
  } catch (e) {
    res.status(400).send(e);
  }
});

router.post('/users/logout', auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(token => token.token !== req.token);
    await req.user.save();

    res.send();
  } catch (e) {
    res.status(500).send();
  }
});

router.post('/users/logoutAll', auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();

    res.send();
  } catch (e) {
    res.status(500).send();
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

router.patch('/users/me', auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['name', 'email', 'password', 'age'];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates!' });
  }

  try {
    updates.forEach(update => req.user[update] = req.body[update]);

    await req.user.save()

    res.send(req.user);
  } catch (e) {
    res.status(400).send(e)
  }
});

router.delete('/users/me', auth, async (req, res) => {
  try {
    await req.user.remove();
    res.send(req.user);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.post('/users/me/avatar', avatarUpload.single('avatar'), (req, res) => {
  res.send();
}, (error, req, res, next) => {console.log('ERROR: ', error)
  res.status(400).send({ error: error.message });
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
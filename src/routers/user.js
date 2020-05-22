const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const { User } = require('../models');
const auth = require('../middleware/auth');
const { sendWelcomeEmail, sendGoodbyeEmail } = require('../emails');

const router = new express.Router();
const avatarUpload = multer({
  storage: multer.memoryStorage(),
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

    sendWelcomeEmail(newUser.email, newUser.name);
    res.status(201).send({ user: newUser, token });
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
    sendGoodbyeEmail(req.user.email, req.user.name);
    res.send(req.user);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.post('/users/me/avatar', auth, avatarUpload.single('avatar'), async (req, res) => {
  const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer();
  req.user.avatar = buffer;
  await req.user.save();
  res.send();
}, (error, req, res, next) => {
  res.status(400).send({ error: error.message });
});

router.delete('/users/me/avatar', auth, async (req, res) => {
  try {
    req.user.avatar = undefined;
    await req.user.save();
    res.send();
  } catch (e) {
    res.status(400).send();
  }
});

router.get('/users/:id/avatar', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user || !user.avatar) {
      throw new Error()
    }

    res.set('Content-Type', 'image/jpg').send(user.avatar);
  } catch (e) {
    res.status(404).send();
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
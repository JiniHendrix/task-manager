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
      res.send(newUser);
    })
    .catch(err => {
      res.status(400).send(err);
    })
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

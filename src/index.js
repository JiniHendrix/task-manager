const express = require('express');
const { userRouter, taskRouter } = require('./routers');
require('./db/mongoose');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

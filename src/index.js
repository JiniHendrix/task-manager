const express = require('express');
const { userRouter, taskRouter } = require('./routers');
const sgMail = require('@sendgrid/mail');
require('./db/mongoose');

const sendgridApiKey = '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';

sgMail.setApiKey(sendgridApiKey);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

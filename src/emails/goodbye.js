const sgMail = require('@sendgrid/mail');

const sendGoodbyeEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: 'jinchoi3521@gmail.com',
    subject: 'So long, motha fucka',
    text: `Peace out ${name}.`
  });
}

module.exports = sendGoodbyeEmail;
const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const path = require('path');
const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');

const app = express();

// View Engine setup
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

// Static folder
app.use('/public', express.static(path.join(__dirname, 'public')));

// Body parser Middlware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.render('contact', {layout: false});
});

app.post('/send', (req, res) => {
  const output = `
    <p> You have a new contact request</p>
    <h3>Contact Details</h3>
    <ul>
        <li> Name: ${req.body.name}</li>
        <li> Company: ${req.body.company}</li>
        <li> Email: ${req.body.email}</li>
        <li> Phone: ${req.body.phone}</li>
    </ul>
    <h3>Message:</h3>
    <p>${req.body.message}</p>
    `;

  let transporter = nodemailer.createTransport({
    host: 'smtp.googlemail.com', // Gmail Host
    port: 465, // Port
    secure: true, // this is true as port is 465
    auth: {
      user: 'GMAIL_USERNAME', // generated ethereal user
      pass: 'GMAIL_PASSWORD', // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = transporter.sendMail({
    from: '"FROM_NAME" <FROM_EMAIL_ADDRESS>', // sender address
    to: 'RECEPIENT_EMAIL_ADDRESS', // list of receivers
    subject: 'Welcome Email', // Subject line
    //text: "Hello world?", // plain text body
    html: 'This email is sent through <b>GMAIL SMTP SERVER</b>', // html body
  });

  console.log('Message sent: %s', info.messageId);
  res.render('contact', {layout: false, msg: 'Message has been sent'});
});
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server Started at ${PORT}`);
});

const dotenv = require('dotenv');

dotenv.config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const client = require('twilio')(accountSid, authToken);

// CODE TO CREATE A TWILIO SERVICE
// client.verify.services.create({friendlyName: 'SMS Verification Service'})
//                       .then(service => console.log(service.sid));

const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/sendSMS', (req, res) => {
    const phone_number = req.body.phone_number;
    client.verify.services(process.env.TWILIO_SERVICE_ID)
                 .verifications
                 .create({to: phone_number, channel: 'sms'})
                 .then(verification => res.send(verification.status));
});

app.post('/verifySMS', (req, res) => {
    const phone_number = req.body.phone_number;
    const code = req.body.code;

    client.verify.services(process.env.TWILIO_SERVICE_ID)
                 .verificationChecks
                 .create({to: phone_number, code: code})
                 .then(verification_check => res.send(verification_check.status));

});

app.listen(port, () => {
  console.log(`listening at http://localhost:${port}`);
});
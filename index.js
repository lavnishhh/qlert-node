const express = require('express');
const bodyParser = require('body-parser');
const twilio = require('twilio');

const app = express();

// Twilio configuration (replace these values with your Twilio credentials)
const accountSid = 'ACb26f702fa84982f34ad2a4ee60c1f543';
const authToken = '11d4d75cdd17094fb9eba03c7b361bf3';
const twilioPhoneNumber = '+12058805242';
const client = twilio(accountSid, authToken);

// Middleware to parse JSON requests
app.use(bodyParser.json());

// POST route to receive text and send it to a phone number
app.post('/api/notifications', async (req, res) => {
  const { text, phoneNumber, id } = req.body;

  if(id!=1024){
    return res.status(400).json({ error: 'Invalid authentication token.' });
  }

  if (!text || !phoneNumber) {
    return res.status(400).json({ error: 'Text and phone number are required.' });
  }

  try {
    // Send SMS using Twilio
    await client.messages.create({
      body: text,
      from: twilioPhoneNumber,
      to: phoneNumber,
    });

    return res.status(200).json({ message: 'Text message sent successfully!' });
  } catch (error) {
    console.error('Error sending message:', error);
    return res.status(500).json({ error: 'Failed to send text message.' });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

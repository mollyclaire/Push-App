const express = require('express');
const webpush = require('web-push');
const bodyParser = require('body-parser');
const path = require('path');
var cron = require('node-cron');

const app = express();

// Set static path
app.use(express.static(path.join(__dirname, 'client')));

// We need this, because we are sending the body of the request from the client. body-parser will expose the incoming request on req.body
app.use(bodyParser.json());

// TODO: Add env variables 
const publicVapidKey = "BFRS-nY2Szr5q3CoT5fQjU1jpPhsG-m8-Z9kQqAtvJTdRzZTPy3fik8jKb6j15-b6QjlP8t2s_lKauICAHkh-as"
const privateVapidKey = "-T3U9CRimpsPm_qOkpQk8Oq7GgO-dQWiXut-hw3WQCc"

// These keys verify who is sending the push notification
webpush.setVapidDetails(
  'mailto: molly.graham@praxent.com',
  publicVapidKey,
  privateVapidKey
);

// Subscribe route from the client that will send the notification to the service worker
app.post('/subscribe', (req, res) => {
  // Get pushSubscription object (from the client)
  const subscription = req.body;

  // Send 201 - resource created
  res.status(201).json({});

  // Create payload (this is optional)
  const mondayPayload = JSON.stringify({title: "Remember this...", body: "Colossians 3:23-24"});
  const tuesdayPayload = JSON.stringify({title: "Remember this...", body: "Deuteronomy 31:8"});
  const wednesdayPayload = JSON.stringify({title: "Remember this...", body: "Matthew 11:28-30"});
  const thursdayPayload = JSON.stringify({title: "Remember this...", body: "Psalm 46:10"});
  const fridayPayload = JSON.stringify({title: "Remember this...", body: "1 Corinthians 15:58"});

  // Pass object into sendNotification function
  cron.schedule('0 10 * * MON', () => {
    console.log('running a task on Monday');
    webpush.sendNotification(subscription, mondayPayload).catch(error => console.error(error));
  });

  cron.schedule('0 10 * * TUES', () => {
    console.log('running a task on Tuesday');
    webpush.sendNotification(subscription, tuesdayPayload).catch(error => console.error(error));
  });

  cron.schedule('0 10 * * WED', () => {
    console.log('running a task on Wednesday');
    webpush.sendNotification(subscription, wednesdayPayload).catch(error => console.error(error));
  });

  cron.schedule('0 10 * * THU', () => {
    console.log('running a task on Thursday');
    webpush.sendNotification(subscription, thursdayPayload).catch(error => console.error(error));
  });

  cron.schedule('0 10 * * FRI', () => {
    console.log('running a task on Friday');
    webpush.sendNotification(subscription, fridayPayload).catch(error => console.error(error));
  });
});

// app.get('/monday', (req, res) => {
//   res.send('Whatever you do, work at it with all your heart, as working for the Lord, not for huan masters, since you know that you will receive an inheritance from the Lord as a reward. It is the Lord Christ you are serving.')
// })

let port = process.env.PORT;
if (port == null || port == "") {
  port = 5000;
}
app.listen(port, () => console.log(`server started on port: ${port}`))
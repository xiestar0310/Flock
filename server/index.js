const config = require("./config");
const express = require("express");
const bodyParser = require("body-parser");
const pino = require("express-pino-logger")();
const { videoToken } = require("./tokens");
const axios = require("axios");

require("dotenv").config();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const twilioClient = require("twilio")(accountSid, authToken);

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(pino);

const firebase = require("firebase/app");
require("firebase/database");

const firebaseConfig = {
  apiKey: process.env.FB_apiKey,
  authDomain: process.env.FB_authDomain,
  databaseURL: process.env.FB_databaseURL,
  projectId: process.env.FB_projectId,
  storageBucket: process.env.FB_storageBucket,
  messagingSenderId: process.env.FB_messagingSenderId,
  appId: process.env.FB_appId,
  measurementId: process.env.FB_measurementId,
};
//console.log(firebaseConfig);
firebase.initializeApp(firebaseConfig);

const database = firebase.database();

const sendTokenResponse = (token, res) => {
  res.set("Content-Type", "application/json");
  res.send(
    JSON.stringify({
      token: token.toJwt(),
    })
  );
};

app.get("/api/greeting", (req, res) => {
  const name = req.query.name || "World";
  res.setHeader("Content-Type", "application/json");
  res.send(JSON.stringify({ greeting: `Hello ${name}!` }));
});

app.get("/video/token", (req, res) => {
  const identity = req.query.identity;
  const room = req.query.room;
  const token = videoToken(identity, room, config);
  sendTokenResponse(token, res);
});
app.post("/video/token", (req, res) => {
  const identity = req.body.identity;
  const room = req.body.room;
  const token = videoToken(identity, room, config);
  sendTokenResponse(token, res);
});

app.post("/video/roomInfo", (req, res) => {
  try {
    //    console.log(req.body.sid);
    twilioClient.video
      .rooms(req.body.sid)
      .fetch()
      .then((rm) => res.status(200).json(rm));
  } catch (err) {
    console.log(err);
    res.status(500).json("Cannot fetch roominfo");
  }
});

app.post("/video/setFireRoom", (req, res) => {
    try{
        database.ref("rooms/" + req.body.sid).set({
            workTime: req.body.workTime,
            restTime: req.body.breakTime,
			startTime: req.body.startTime,
        });
        res.status(200).json("cool");
    }catch(err){
        console.log(err);
        res.status(500).json(err);
    }
});

app.post("/video/getFireTime", (req, res) => {
  try {
    const ref = database.ref("rooms/" + req.body.sid);
    console.log(req.body.sid);
    ref.once("value", (values) => {
      console.log(req.body.sid);
      res.status(200).json(values);
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

app.post("/video/setFireParticipants", (req, res) => {
  try {
    database.ref("participants/" + req.body.pid).set({
      statusMessage: req.body.statusMessage,
      emote: req.body.emote,
    });
    res.status(200).json(values);
  } catch (err) {
    console.log(err);
    console.log("Participant ID post failed");
    res.status(500).json(err);
  }
});

app.post("/video/getFireParticipants", (req, res) => {
  try {
    const ref = database.red("participants/" + req.body.pid);
    ref.once("value", (values) => {
      res.status(200).json(values);
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

app.listen(3001, () =>
  console.log("Express server is running on localhost:3001")
);

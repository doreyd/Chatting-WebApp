const express = require("express");
const mongoose = require("mongoose");
const UserRecord = require("./models");
const bodyParser = require("body-parser");
const session = require("express-session");

const app = express();

app.use(
  session({
    secret: "dfgAGBSdfgdf-98986dfgdg/*fdg",
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false,
      maxAge: 1000 * 60 * 60 * 24
    }
  })
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let conversationZero = {
  init: []
};

// Signing up a new user and adding it to the database
app.post("/signup", (req, res, next) => {
  UserRecord.find({ email: req.body.email }, (err, data) => {
    if (data.length !== 0)
      res.status(500).json({ message: "email already in use" });
    else {
      let newUser = new UserRecord({
        email: req.body.email,
        password: req.body.password,
        userName: req.body.userName,
        allMessage: conversationZero,
        login: true
      });
      newUser
        .save()
        .then(data =>
          res.status(201).json({ message: "user added", data: data })
        )
        .catch(err => res.status(500).json({ error: err }));
    }
  });
});

app.post("/removeuser", (req, res, next) => {
  UserRecord.findOne(
    { email: req.body.email, password: req.body.password },
    (err, data) => {
      if (data === null)
        res
          .status(500)
          .json({ message: "email/password combination not in database" });
      else {
        UserRecord.remove({
          email: req.body.email,
          password: req.body.password
        })
          .then(() =>
            res
              .status(201)
              .json({ message: "User has been Successfully deleted" })
          )
          .catch(err => {
            res.status(500).json({ error: err });
          });
      }
    }
  );
});

// Route for signing in
app.post("/signin", (req, res, next) => {
  UserRecord.findOne(
    { email: req.body.email, password: req.body.password },
    (err, data) => {
      if (data === null)
        res
          .status(500)
          .json({ message: "email/password combination not in database" });
      else {
        req.session.user = data.userName;
        res.status(200).json(data);
      }
    }
  );
});

const ff = (req, res) => {
  let check = 0;
  UserRecord.findOne({ email: req.body.receiver }, (err, data) => {
    let newArray = ["sender", req.body.message, Date.now(), false];
    if (!data.allMessage[req.body.sender]) {
      data.allMessage[req.body.sender] = [];
    }
    data.allMessage[req.body.sender].push(newArray);
    data.markModified("allMessage");
    data
      .save()
      .then()
      .catch(err => {
        check++;
        res.status(500).json({ error: err });
      });
  });

  UserRecord.findOne({ email: req.body.sender }, (err, data2) => {
    let newArray2 = ["receiver", req.body.message, Date.now(), false];
    if (!data2.allMessage[req.body.receiver]) {
      data2.allMessage[req.body.receiver] = [];
    }
    data2.allMessage[req.body.receiver].push(newArray2);
    data2.markModified("allMessage");
    data2
      .save()
      .then()
      .catch(err => {
        check++;
        res.status(500).json({ error: err });
      });
  });
  if (check === 0)
    res.status(200).json({ message: "Your message was successfully sent" });
};
// Route for sending messages
app.post("/sendmessage", (req, res) => {
  ff(req, res);
});

// Route for home page
app.get("/", (req, res, next) => {
  res.status(200).send("Welcome to this new chatting Web-App. Enjoy!");
});

// Connecting to database
mongoose.connect("mongodb://localhost/chatdb", { useNewUrlParser: true });
mongoose.connection
  .once("open", () => console.log(`Connection to database established`))
  .on("error", err => console.log(`Connection error : ${err}`));

// Start the server
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server is now running at port ${port}...`));

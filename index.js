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
        allMessage: {},
        login: true
      });
      newUser
        .save()
        .then(() => res.status(201).json({ message: "user added" }))
        .catch(err => res.status(500).json({ error: err }));
    }
  });
});

// Route for signing in
app.post("/signin", (req, res, next) => {
  UserRecord.findOne(
    { email: req.body.email, password: req.body.password },
    (err, data) => {
      if (data.length === 0)
        res
          .status(500)
          .json({ message: "email/password combination not in database" });
      else {
        req.session.user = data.userName;
        console.log(req.session.user);
        res.status(200).json(data);
      }
    }
  );
});

app.post("/sendmessage", (req, res, next) => {
  UserRecord.findOne({ userName: req.body.dest }, data => {
    if (!data.allMessage[req.session.user])
      data.allMessage[req.session.user] = [];
    data.allMessage[req.session.user].push(["sender", req.body.message]);
  })
    .exec()
    .then(() => {
      res.status(200).json({ message: "Your message was successfully sent !" });
    })
    .catch(err => {
      res.status(500).json({ error: err });
    });
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

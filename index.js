const express = require("express");
const mongoose = require("mongoose");
const UserRecord = require("./models");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Signing up a new user and adding it to the database
app.post("/signUp", (req, res, next) => {
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

// Singin In as a user
app.post("/signIn", (req, res, next) => {
  UserRecord.find(
    { email: req.body.email, password: req.body.password },
    (err, data) => {
      if (data.length === 0)
        res
          .status(500)
          .json({ message: "email/password combination not in database" });
      else {
        res
          .status(200)
          .json({ allMessage: data[0].allMessage, login: data[0].login });
      }
    }
  );
});

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

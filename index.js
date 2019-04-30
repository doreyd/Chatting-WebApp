const express = require("express");
const mongoose = require("mongoose");
const UserRecord = require("./models");
const bodyParser = require("body-parser");
const session = require("express-session");
const { updateMessages, signin } = require("./controller/updateMessages");
const socket = require("socket.io");

let sess_sock = {};

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

let userName;
// Route for signing in
app.post("/signin", (req, res, next) => {
  // signin(req, res);
  UserRecord.findOne(
    { email: req.body.email, password: req.body.password },
    (err, data) => {
      if (data === null)
        res
          .status(500)
          .json({ message: "email/password combination not in database" });
      else {
        req.session.user = data.userName;
        userName = data.userName;
        res.status(200).json(data);
      }
    }
  );
});

// Route for sending messages
app.post("/sendmessage", (req, res) => {
  updateMessages(req, res);
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
const server = app.listen(port, () => {
  console.log(`Listening on port ${port} .....`);
});

// recording messages into the database
function updateOne(sender, receiver, message, type) {
  UserRecord.findOne({ userName: receiver }, (err, d) => {
    let newArray = [type, message];
    if (typeof d.allMessage[sender] === "undefined") {
      d.allMessage[sender] = [];
    }
    d.allMessage[sender].push(newArray);
    d.markModified("allMessage");
    d.save();
  });
}

// recording messages into the database
function updateDB(obj) {
  let receiver = obj["messageDestination"];
  let message = obj["message"];
  let sender = obj["messageOrigin"];
  updateOne(sender, receiver, message, "sender"); // save to the sender
  updateOne(receiver, sender, message, "receiver"); // save to the receiver
}

// Start the WebSocket on this server
const io = socket(server);
io.on("connection", socket => {
  sess_sock[userName] = socket.id;
  if (typeof userName !== "undefined") {
    sess_sock[userName] = socket.id;
  }

  // Realtime updating by looping through the connected sockets
  // & checking if the receiver of the message is currently connected
  const realtimeUpdate = (eventEmitted, obj) => {
    Object.keys(io.sockets.sockets).forEach(id => {
      if (id === sessionSocket[obj["receiver"]]) {
        io.sockets.sockets[id].emit(eventEmitted, obj);
      }
    });
  };

  // Managing realtime communication through socket events handling
  socket.on("sendMessage", objBeingSent => {
    updateDB(objBeingSent); // will update the mongodb
    realtimeUpdate("msgBack", objBeingSent);
  });

  socket.on("nowTyping", objBeingSent => {
    realtimeUpdate("otherNowTyping", objBeingSent);
  });

  socket.on("stopTyping", objBeingSent => {
    realtimeUpdate("otherStoppedTyping", objBeingSent);
  });
});

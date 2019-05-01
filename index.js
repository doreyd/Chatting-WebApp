const express = require("express");
const mongoose = require("mongoose");
const UserRecord = require("./models");
const bodyParser = require("body-parser");
const session = require("express-session");
const { updateMessages, signin } = require("./controller/updateMessages");
const socket = require("socket.io");

let conversationZero = {
  kayla: [
    ["receiver", "this is a response to the test"],
    ["sender", "this is a test"],
    ["sender", "this"],
    ["sender", "hi"],
    ["sender", "how are you"],
    ["sender", "howdddddddddddddddddddddddddddddddddddddddd"],
    ["sender", "You wanna grab a coffee sometime next week "]
  ],
  dawn: [
    ["sender", "how was the book i gave you"],
    ["receiver", "I really liked it !! "],
    ["sender", "I think i will be buying that car we saw last time. "]
  ]
};
// initializing variables that will be used to pair session with sockets
let sess_sock = {};
let userName;

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

app.use("/files", express.static(__dirname + "/public"));

// let conversationZero = {
//   init: []
// };

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
  console.log(`email: ${req.body.email}, password: ${req.body.password} `);
  // signin(req, res);
  UserRecord.findOne(
    { email: req.body.email, password: req.body.password },
    (err, data) => {
      if (data === null) {
        res
          .status(500)
          .json({ message: "email/password combination not in database" });
      } else {
        req.session.user = data;
        userName = data.userName;
        res.status(200).sendFile(__dirname + "/chatPage.html");
      }
    }
  );
});

app.get("/getMessages", (req, res) => {
  UserRecord.findOne({ email: req.session.user.email }, function(
    err,
    dataRetrieved
  ) {
    res.status(200).json(dataRetrieved.allMessage);
  });
});

// Get the user name in chat page
app.get("/getUserName", (req, res) => {
  UserRecord.findOne({ email: req.session.user.email }, (err, data) => {
    res.send(data.userName);
  });
});

// Route for sending messages
app.post("/sendmessage", (req, res) => {
  updateMessages(req, res);
});

// Route for home page
app.get("/", (req, res, next) => {
  res.status(200).sendFile(__dirname + "/loginPage.html");
  // res.status(200).sendFile(__dirname + "/signintest.html");
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

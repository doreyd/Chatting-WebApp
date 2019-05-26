const express = require("express");
const mongoose = require("mongoose");
const UserRecord = require("./models");
const bodyParser = require("body-parser");
const session = require("express-session");
const { updateMessages, signin } = require("./controller/updateMessages");
const socket = require("socket.io");

let conversationZero = {
  kayla: [
    ["receiver", "this is a response to the test", true],
    ["sender", "this is a test", true],
    ["sender", "this", true],
    ["receiver", "hi", true],
    ["receiver", "how are you", true],
    ["sender", "howdddddddddddddddddddddddddddddddddddddddd", true],
    ["sender", "You wanna grab a coffee sometime next week ", true]
  ],
  dawn: [
    ["sender", "how was the book i gave you", true],
    ["receiver", "I really liked it !! ", true],
    ["sender", "I think i will be buying that car we saw last time. ", true]
  ],
  jolie: [
    ["receiver", "this is a response to the test", true],
    ["sender", "this is a test", true],
    ["sender", "this", true],
    ["receiver", "hi", true],
    ["receiver", "how are you", true],
    ["sender", "howdddddddddddddddddddddddddddddddddddddddd", true],
    ["sender", "You wanna grab a coffee sometime next week ", true]
  ],
  john: [
    ["sender", "how was the book i gave you", true],
    ["receiver", "I really liked it !! ", true],
    ["sender", "I think i will be buying that car we saw last time. ", true]
  ],
  // susan: [
  //   ["receiver", "this is a response to the test", true],
  //   ["sender", "this is a test", true],
  //   ["sender", "this", true],
  //   ["receiver", "hi", true],
  //   ["receiver", "how are you", true],
  //   ["sender", "howdddddddddddddddddddddddddddddddddddddddd", true],
  //   ["sender", "You wanna grab a coffee sometime next week ", true]
  // ],
  mark: [
    ["sender", "how was the book i gave you", true],
    ["receiver", "I really liked it !! ", true],
    ["sender", "I think i will be buying that car we saw last time. ", true]
  ],
  steve: [
    ["receiver", "this is a response to the test", true],
    ["sender", "this is a test", true],
    ["sender", "this", true],
    ["receiver", "hi", true],
    ["receiver", "how are you", true],
    ["sender", "howdddddddddddddddddddddddddddddddddddddddd", true],
    ["sender", "You wanna grab a coffee sometime next week ", true]
  ],
  frank: [
    ["sender", "how was the book i gave you", true],
    ["receiver", "I really liked it !! ", true],
    ["sender", "I think i will be buying that car we saw last time. ", false]
  ],
  jessica: [
    ["receiver", "this is a response to the test", true],
    ["sender", "this is a test", true],
    ["sender", "this", true],
    ["receiver", "hi", true],
    ["receiver", "how are you", true],
    ["sender", "howdddddddddddddddddddddddddddddddddddddddd", false],
    ["sender", "You wanna grab a coffee sometime next week ", false]
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

app.use("/images", express.static(__dirname + "/public/images"));
app.use("/files", express.static(__dirname + "/public"));

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
        // res.status(200).sendFile(__dirname + "/chatPage.html");
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
// app.post("/sendmessage", (req, res) => {
//   updateMessages(req, res);
// });

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
    let newArray = [type, message, false];
    if (typeof d.allMessage[sender] === "undefined") {
      d.allMessage[sender] = [];
    }
    d.allMessage[sender].push(newArray);
    d.markModified("allMessage");
    d.save().then((err, d) => {
      if (err) console.log(err);
      else console.log(d);
    });
  });
}
// recording messages into the database
function updateDB(obj) {
  let receiver = obj["receiver"];
  let message = obj["message"];
  let sender = obj["sender"];
  updateOne(sender, receiver, message, "sender"); // save to the sender
  updateOne(receiver, sender, message, "receiver"); // save to the receiver
}
// *********************************************************************
//======================================================================
const stateChange = (messages, type, state) => {
  return messages.map(x => (x = x[0] === type ? [x[0], x[1], state] : x));
};

// recording messages into the database
function nowReadOne(sender, receiver, type) {
  UserRecord.findOne({ userName: receiver }, (err, d) => {
    // let newArray = [type, message, false];
    // if (typeof d.allMessage[sender] === "undefined") {
    //   d.allMessage[sender] = [];
    // }
    if (typeof d.allMessage[sender] !== "undefined") {
      d.allMessage[sender] = stateChange(d.allMessage[sender], type, true);
      d.markModified("allMessage");
      d.save().then((err, d) => {
        if (err) console.log(err);
        else console.log(d);
      });
    }
  });
}

// // recording messages into the database
// function updateRead(obj) {
//   let receiver = obj["receiver"];
//   // let message = obj["message"];
//   let sender = obj["sender"];
//   nowReadOne(sender, receiver, "sender"); // save to the sender
//   nowReadOne(receiver, sender, "receiver"); // save to the receiver
//   realtimeUpdate("messageRead", obj);
// }

//======================================================================
// *********************************************************************

// Start the WebSocket on this server
const io = socket(server);
io.on("connection", socket => {
  sess_sock[userName] = socket.id;
  if (typeof userName !== "undefined") {
    sess_sock[userName] = socket.id;
  }

  // Realtime updating by looping through the connected sockets
  // & checking if the receiver of the message is currently connected
  const realtimeUpdate = (newEvent, obj) => {
    Object.keys(io.sockets.sockets).forEach(id => {
      if (id === sess_sock[obj["receiver"]]) {
        io.sockets.sockets[id].emit(newEvent, obj);
      }
    });
  };

  // recording messages into the database
  function updateRead(obj) {
    let receiver = obj["receiver"];
    // let message = obj["message"];
    let sender = obj["sender"];
    nowReadOne(sender, receiver, "sender"); // save to the sender
    nowReadOne(receiver, sender, "receiver"); // save to the receiver
    realtimeUpdate("messageRead", {
      receiver: obj["sender"],
      sender: obj["receiver"]
    });
  }

  // Message just got Read now
  socket.on("nowRead", objBeingSent => {
    updateRead(objBeingSent); // will update the mongodb
  });

  // Managing realtime communication through socket events handling
  socket.on("sendMessage", objBeingSent => {
    updateDB(objBeingSent); // will update the mongodb
    realtimeUpdate("newMessage", objBeingSent);
  });

  socket.on("nowTyping", objBeingSent => {
    realtimeUpdate("otherNowTyping", objBeingSent);
  });

  socket.on("stopTyping", objBeingSent => {
    realtimeUpdate("otherStoppedTyping", objBeingSent);
  });
});

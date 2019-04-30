const UserRecord = require("../models");

const updateMessages = (req, res) => {
  UserRecord.findOne({ email: req.body.receiver }, (err, data) => {
    console.log(data === null);
    if (data === null)
      res.status(500).json({ message: "the destination given is inexistant" });
    else {
      let newArray = ["sender", req.body.message, Date.now(), false];
      if (!data.allMessage[req.body.sender]) {
        data.allMessage[req.body.sender] = [];
      }
      data.allMessage[req.body.sender].push(newArray);
      data.markModified("allMessage");
      data
        .save()
        .then(
          UserRecord.findOne({ email: req.body.sender }, (err, data2) => {
            let newArray2 = ["receiver", req.body.message, Date.now(), false];
            if (!data2.allMessage[req.body.receiver]) {
              data2.allMessage[req.body.receiver] = [];
            }
            data2.allMessage[req.body.receiver].push(newArray2);
            data2.markModified("allMessage");
            data2
              .save()
              .then(() =>
                res
                  .status(200)
                  .json({ message: "Your message was successfully sent" })
              )
              .catch(err => {
                check++;
                res.status(500).json({ error: err });
              });
          })
        )
        .catch(err => {
          check++;
          res.status(500).json({ error: err });
        });
    }
  });
};

const signin = (req, res) => {
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
};

module.exports = { updateMessages, signin };

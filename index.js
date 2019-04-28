const express = require("express");
const mongoose = require("mongoose");

const app = express();

app.get("/", (req, res, next) => {
  res.status(200).send("Welcome to this new chatting Web-App. Enjoy!");
});

const port = process.env.PORT || 5000;

mongoose.connect("mongodb://localhost/database", { useNewUrlParser: true });
mongoose.connection
  .once("open", () => console.log(`Connection to database established`))
  .on("error", err => console.log(`Connection error : ${err}`));

app.listen(port, () => console.log(`Server is now running at port ${port}...`));

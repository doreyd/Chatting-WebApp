const express = require("express");

const app = express();

app.get("/", (req, res, next) => {
  res.status(200).send("Welcome to this new chatting Web-App. Enjoy!");
});

const port = process.env.PORT || 5000;
app.listen(port, () =>
  console.log(`Conection is now established at port ${port}`)
);

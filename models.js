const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userRecordSchema = new Schema({
  email: String,
  password: String,
  userName: String,
  allMessage: Object,
  login: String
});

const UserRecord = mongoose.model("UserRecord", userRecordSchema);

module.exports = UserRecord;

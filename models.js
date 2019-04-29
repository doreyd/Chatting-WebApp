const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userRecordSchema = new Schema({
  email: String,
  password: String,
  userName: String,
  allMessage: Object,
  login: Boolean
});

const UserRecord = mongoose.model("UserRecord", userRecordSchema);

module.exports = UserRecord;

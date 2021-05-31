const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Admin = mongoose.model(
  "Admin",
  new Schema({
    Adminname: { type: String, required: true },
    password: { type: String, required: true },
  })
);

module.exports = Admin;
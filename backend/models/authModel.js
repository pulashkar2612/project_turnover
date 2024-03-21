const mongoose = require("mongoose");
const schema = mongoose.Schema;

const userModelSchema = new schema({
  username: {
    type: String,
    required: true,
    minlength: 8,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
  },
  id: {
    type: String,
  },
  otp: {
    type: String,
  },
  checkedProducts: {
    type: [String], 
    default: []
  }
});

const usersModel = mongoose.model("usersModel", userModelSchema);
module.exports = usersModel;

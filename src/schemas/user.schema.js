import mongoose from "mongoose";
import uuid from "uuid";
import validator from "validator";

const User = new mongoose.Schema({
  _id: { type: String, default: uuid.v1 },
  email: {
    type: String,
    validate: {
      validator: v => validator.isEmail(v)
    },
    message: "{VALUE} is not a valid email",
    required: true
  },
  firstName: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String
  },
  statusFlag: {
    type: Boolean,
    default: true
  }
});

export default User;

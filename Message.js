const { Schema, model } = require("mongoose");

const MessageSchema = new Schema({
  message: {
    type: String
  },
  mode: {
    type: String
  },
}, {
  timestamps: true
});

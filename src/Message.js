const { Schema, model } = require("mongoose");

const MessageSchema = new Schema({
    sender: { required: true, type: String },
    recipient: { required: true, type: String },
    text: { required: true, type: String },
    timestamp: { required: true, type: Number },
});

const Message = model('Message', MessageSchema);

module.exports = Message;
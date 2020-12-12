const mongoose = require("mongoose");
const MessageSchema = new mongoose.Schema({
  room: {
    type: String,
    required: true,
  },
  Message: [
    {
      user: {
        type: String,
        required: true,
      },
      text: {
        type: String,
      },
      path: {
        type: String,
      },
      name: {
        type: String,
      },
      timeStamp: { type: String },
    },
  ],

});

module.exports = Message = mongoose.model("Message", MessageSchema);

const mongoose = require("mongoose");
const NotificationSchema = new mongoose.Schema({
  room: {
    type: String,
    required: true,
  },
  Message: [
    {
      text: {
        type: String,
      },
      
      timeStamp: { type: String },
    },
  ],

});

module.exports = Notification = mongoose.model("Notification", NotificationSchema);

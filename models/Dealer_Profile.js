const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const ProfileSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  img: { path: String, contentType: String},
 
  bio: {
    type: String,
    required: true,
  },
  id:{
    type:String
  }

  });

module.exports = mongoose.model('dealer_profile', ProfileSchema);

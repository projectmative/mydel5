const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const ProductSchema25 = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  rider:{
    type:String,
    required: true 
  },
  isAccepted: { 
    type: Boolean,
     default: false }

  });

module.exports = mongoose.model('added_rider', ProductSchema25);

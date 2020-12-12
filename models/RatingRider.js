const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const ProductSchema80 = new Schema({
  
  rider: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  
  count:{
    type: Number,
    required: true,
  },
  rating:{
    type: Number,
    required: true,
  },
  total:{
    default:0,
    type: Number,
    required: true,
  },
 
  });

module.exports = mongoose.model('Rating', ProductSchema80);

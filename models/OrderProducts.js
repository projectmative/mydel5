const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const ProductSchema50 = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  order:[{

  price: {
    type: String,
    required: true,
  },
  name:{
    type:String,
    required: true
  },
  quantity:{
    type:String,
    required: true
  }
}]

  });

module.exports = mongoose.model('order_products', ProductSchema50);

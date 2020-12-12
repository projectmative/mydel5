const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const ProductSchema70 = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  rating:{
    type:Boolean,
    default:false
  },
  drating:{
    type:Boolean,
    default:false
  },
  customer: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  riders: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  status:{
    type: String,
    required: true,
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

module.exports = mongoose.model('order_products2', ProductSchema70);

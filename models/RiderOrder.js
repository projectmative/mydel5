const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const ProductSchema60 = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  customer: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  dealer: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  orderid:{
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

module.exports = mongoose.model('Rider_orders', ProductSchema60);

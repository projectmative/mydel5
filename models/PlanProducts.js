const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const ProductSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
 
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
  },
  id:{
    type:String,
    required: true 
  }

  });

module.exports = mongoose.model('plan_products', ProductSchema);

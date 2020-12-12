const mongoose = require('mongoose'), mongoosastic = require('mongoosastic');
const Schema = mongoose.Schema;

// Create Schema
const BellmanSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  crating:{
    type:Number,
    default: 0
  },
  drating:{
    type:Number,
    default: 0
  },
  img: { path: String, contentType: String},
  img1: { path: String, contentType: String},
  img2: { path: String, contentType: String},
 
  bio: {
    type: String,
    required: true,
  },
  address:{
    street:String,
    city:String,
    state:String,
    postalcode:String,
  },
  fulladdress:{
    type:String
  },
  subcategory:{
    type:String
  },
  category:{
    type:String
  },
  price:{
    type:String
  }

  });
  BellmanSchema.index({fulladdress: 'text'});
module.exports = mongoose.model('bellman_profile', BellmanSchema);

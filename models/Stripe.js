const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const StripeSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
 
  subid: {
    type: String,
    
  },
  start:{
    type:Date,
     
  },
  end:{
    type:Date,
     
  },
  sub:{},
  plan:''
   

  });

module.exports = mongoose.model('stripe', StripeSchema);

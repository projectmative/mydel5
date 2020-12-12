const mongoose=require('mongoose');
const Schema=mongoose.Schema;
timestamps = require('mongoose-timestamp')

const UserSchema= new Schema({
name:{
  type:String,
  required:true
},
email:{
  type:String,
  required:true
},
password:{
  type:String,
  required:true
},
isUsed: {
  type: Boolean,
  default: true,
},
block: {
  type: Boolean,
  default: false
},
role: {
  type: String,
  required: true
},
address: {
  type: String,

},
zip: {
  type: Number,

},
category:{
  type: String
},
subcategory:{
  type: String
},
isVerified: { 
  type: Boolean,
   default: false },
isSubscribed: { 
  type: Boolean,
    default: false },
  
resetPasswordToken :{
  type:String
},
resetPasswordExpires:{
  type:Date
}



},

{
  timestamps: true
}

);

module.exports=mongoose.model('users',UserSchema);
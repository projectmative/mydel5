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

block: {
  type: Boolean,
  default: false
},
role: {
  type: String,
  required: true
},

  
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

module.exports=mongoose.model('addadmin',UserSchema);
const { Router } = require('express');
const express = require('express');
const router=express.Router();
const jwt=require('jsonwebtoken');
const keys=require('../../Config/keys');
// Load User model
const User = require('../../models/User');
const bcrypt = require('bcryptjs');
const passport = require('passport');
// Load Input Validation
const validateRegisterInput = require('../../Config/validation/register');
const validateCustomerInput = require('../../Config/validation/customer');
const validateLoginInput = require('../../Config/validation/login');
const validateDealerInput = require('../../Config/validation/login');
var async = require("async");
var nodemailer = require("nodemailer");
var crypto = require("crypto");
var FlashMessages = require('flash-messages');
var { flash } = require('express-flash-message');



router.get('/test',(req,res)=>res.json({msg:"users known"}));


//User Registration
router.post('/register',(req,res,next)=>{
  var valid=true;
  console.log("Request came")
  console.log("ROle :"+req.body.zip)
  const { errors, isValid } = validateRegisterInput(req.body);

  // Check Validation
  if (!isValid) {
    
    return res.json(errors);
  }
     

 
  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      errors.email = 'Email already exists';
      return res.json(errors);
    } else {

      async.waterfall([
        function(done) {
          crypto.randomBytes(20, function(err, buf) {
            var token = buf.toString('hex');
            done(err, token);
          });
        },
        function(token, done) {
              
            
              console.log("Save tokens"+token)
         
            newUser.resetPasswordToken = token;
            newUser.resetPasswordExpires = Date.now() + 3600000;
         
               // 1 hour
    
            // user.save(function(err) {
            //   done(err, token, user);
            // });
            console.log("here");
          var smtpTransport = nodemailer.createTransport({
            service: 'Gmail', 
            auth: {
              user: 'projectmative@gmail.com',
              pass: 'projectmative@1'
            }
          });
          
          var mailOptions = {
            to: req.body.email,
            
            from: 'projectmative@gmail.com',
            subject: 'Confirmation of email',
            text: 'You are receiving this because you (or someone else) have requested the create account.\n\n' +
              'Please click on the following link, to complete the process:\n\n' +
              ' http://localhost:5000/api/users/confirmemail/' + token + '\n\n' +
              'If you did not create account then, please ignore this email and your account will not be completed.\n'
          };
          smtpTransport.sendMail(mailOptions, function(err) {
            console.log('mail sent');
            // req.flash('success', 'An e-mail has been sent to ' + req.body.email + ' with further instructions.');
            done(err, 'done');
          });
        
        },
        function(token, user, done) {
          
        }
      ], function(err) {
        if (err) return next(err);
        console.log("Error"+err)
  
      });
      var newUser={};

          if(req.body.role==='customer'){
            const { errors, isValid } = validateCustomerInput(req.body);

            // Check Validation
            if (!isValid) {
              
              return res.json(errors);
            }
             newUser = new User({
              name: req.body.name,
              email: req.body.email,
              password: req.body.password,
              role:req.body.role,
              address:req.body.address.toLowerCase(),
              isUsed:true,
              isVerified:true

            });
          }
          else if(req.body.role==='dealer'){
            const { errors, isValid } = validateDealerInput(req.body);
                if(req.body.category===''){
                    errors.cato='category required'
                    return res.json(errors);
                }
                
                if(req.body.address===''){
                  errors.address='Address field is required'
                  return res.json(errors);
                }
                if(req.body.zip===''){
                  errors.zip='Zip field is required'
                  return res.json(errors);
                }
            // Check Validation
            if (!isValid) {
              
              return res.json(errors);
            }
             newUser = new User({
              name: req.body.name,
              email: req.body.email,
              password: req.body.password,
              role:req.body.role,
              category:req.body.category,
              subcategory:req.body.subcategory,
              address:req.body.address,
              zip:req.body.zip

            });
          }
      
            else{
              newUser = new User({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
                role:req.body.role
              });
            }
       

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(valid))
            .catch(err => console.log(err));
        });
      });
      
    }
  });
});
router.get('/confirmemail/:token', function(req, res) {
  User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
    if (user) {
      user.isVerified= true; 
        console.log("Verified")
      
      user.save();
      res.json("Account Verified")
    }
    
  });
});



//login
router.post('/login', (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);

  // Check Validation
  if (!isValid) {
    return res.json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;

  // Find user by email
  User.findOne({ email }).then(user => {
    // Check for user
    console.log("status: "+user)
    
 
    if (!user) {
      errors.email = 'User not found';
      return res.json(errors);
    }
     if(user.isUsed===false){
      console.log("status:2 "+user.isUsed)
        errors.role='Request Is Pending'  
      return res.json(errors)
    }
    if(user.isVerified===false){
      console.log("status:3 "+user.isVerified)
        errors.email_v='Email is not verified'  
      return res.json(errors)
    }
    if(user.block===true){
      console.log("Bock")
      errors.email_v='Blocked by Admin'   
      return res.json(errors)
    }
 

      bcrypt.compare(password,user.password).then(isMatch=>{


        if(isMatch){
          const payload={id:user.id,name:user.name}
          
          jwt.sign(
            payload,
            keys.secretOrKey,
            { expiresIn: 3600 },
            (err, token) => {
              res.json({
                success: true,
                token: 'Bearer ' + token,
                role_man:user.role,
                name:user.name,
                zip:user.zip
              });
            }
          );
        }
        else{
          errors.password = 'Password incorrect';
          return res.json(errors);
        }
      })

    });

    
  });
  router.get(
    '/current',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
      res.json({
        id: req.user.id,
        name: req.user.name,
        email: req.user.email
      });
    }
  );


 




module.exports=router;
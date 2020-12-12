const User = require('../../models/User');
const AddAdmin = require('../../models/AddedAdmin');
const Product = require('../../models/Products');
const PlanProduct = require('../../models/PlanProducts');
const AddedRider = require('../../models/AddedRider');
const OrderProduct = require('../../models/OrderProducts');
const OrderProduct2 = require('../../models/OrderProducts2');
const RiderOrder = require('../../models/RiderOrder');
const Bellman = require('../../models/Bellman_Profile');
const Profile = require('../../models/Dealer_Profile');
const Catogry = require('../../models/Catogry');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const validateAdminInput = require('../../Config/validation/AdminValidation');
const validateLoginInput = require('../../Config/validation/login');
const validatePasswordInput = require('../../Config/validation/password');
const jwt=require('jsonwebtoken');
const keys=require('../../Config/keys')
const { Router } = require('express');
const express = require('express');
const router=express.Router();



router.get('/getusers',function(req,res){ 
     
  const user=User.find()
  .then(user=>{res.json(user)})
  .catch(err=>console.log(err));
  


return ;


});
router.get('/getid',function(req,res){ 
     
  console.log("ID received :"+req.query.id)
  
  User.findOne({ _id:req.query.id }).then(user => {
    // Check for user
    if (user) {
     
      
        //this will give you the document what you want to update.. then 
       user.isUsed = true; //so on and so forth
       
       // then save that document
       user.save();
       
     

    }
  });

return  ;


});

router.get('/deleteid',function(req,res){ 
     
  console.log("ID received :"+req.query.id)
  
  User.findOne({ _id:req.query.id }).then(user => {
    // Check for user
    if (user) {
     
      
        //this will give you the document what you want to update.. then 
       //so on and so forth
       
       // then save that document
       user.remove();
       
     

    }
  });

return  ;


});

router.get('/getdealers',function(req,res){ 
     
  User.find({ $and:[{role:'dealer'},{isVerified:true}] })
  .then(user=>{res.json(user)})
  .catch(err=>console.log(err));
  


return ;


});
router.get('/getriders',function(req,res){ 
     
  User.find({ $and:[{role:'rider'},{isVerified:true}] })
  .then(user=>{res.json(user)})
  .catch(err=>console.log(err));
  


return ;


});
router.get('/getcustomers',function(req,res){ 
     
  User.find({ $and:[{role:'customer'},{isVerified:true}] })
  .then(user=>{res.json(user)})
  .catch(err=>console.log(err));
  


return ;


});

router.get('/getproducts',function(req,res){ 
     
  console.log("ID received :"+req.query.id)
  
  Product.find({ user: req.query.id }).then(product => {
    
    res.json(product)
    // console.log(product);
  
  }).catch(err=>console.log(err))

return ;


});


router.get('/blockid',function(req,res){ 
     
  console.log("ID received :"+req.query.id)
  
  User.findOne({ _id:req.query.id }).then(user => {
    // Check for user
    if (user) {
    
      user.block=true;
      user.save()
      // console.log(user);
        //this will give you the document what you want to update.. then 
       //so on and so forth
       
       // then save that document

    }
  });

return  ;


});
router.get('/unblockid',function(req,res){ 
     
  console.log("ID received :"+req.query.id)
  
  User.findOne({ _id:req.query.id }).then(user => {
    // Check for user
    if (user) {
    
      user.block=false;
      user.save()
      // console.log(user);
        //this will give you the document what you want to update.. then 
       //so on and so forth
       
       // then save that document

    }
  });

return  ;


});


router.get('/getorders',function(req,res){ 
  console.log("Request");
OrderProduct2.find({ user: req.query.id }).populate('customer ','name email address').sort({'_id':-1}).then(product => {
    

          //  console.log(product);
      res.json(product)

  
  // console.log(product);
  

}).catch(err=>console.log(err))

///////
   


return ;


});

router.get('/getdriders',function(req,res){ 
  console.log("Request Rider"+req.query.id);
AddedRider.find({ user: req.query.id }).then(product => {
  
  // res.json(product)
  // console.log(product);
  if (product) {
    
    let arr2 =[];
    let arr =[];
    
    for (let i = 0; i < product.length; i++) {
        
      if(product[i].isAccepted===true){
      arr2.push(product[i].rider)
      // console.log(arr2);
     }
      
     }
     console.log("Nayce");
     //  console.log(arr);
      Bellman.find({user:arr2}).populate('user','name email').then(products=>{
              //  console.log(products)
         return   res.json(products);
  })
      

 }
  else{
    return   res.json('No Requests')
    
  }
  

}).catch(err=>console.log(err))

///////
   




return ;


});

router.get('/getbellmanorders',function(req,res){ 
  console.log("Request");
  Bellman.findOne({ user: req.query.id })
        .then(profile => {
          // console.log("Nayce"+profile);
          RiderOrder.find({ user: profile }).populate('customer dealer','name email address').then(product => {
  
            res.json(product)
            // console.log(product);
            
          
          }).catch(err=>console.log(err))
        })
        .catch(err => res.json(err));


///////
   


return ;;


});

router.get(
  '/current',
  (req, res) => {
    const errors = {};
    const id=req.query.id;
    // console.log(req.user);
console.log(req.query.id+"ID");
    User.findOne({ _id:id }).then(user => {
      // Check for user

        Bellman.findOne({ user: user._id }).populate('user','name email')
        .then(profile => {
          // console.log("Name"+req.user.name);
          if (!profile) {
            errors.noprofile = 'There is no profile for this user';
            return res.json(errors);
          }
          
          res.json(profile);
        })
        .catch(err => res.json(err));
      
      
      });
    
   
  }
);

router.get('/getrdealers',function(req,res){ 
  console.log("Request Rider"+req.query.id);
AddedRider.find({ rider: req.query.id }).then(product => {
  
  // res.json(product)
  // console.log(product);
  if (product) {
    
    let arr2 =[];
    let arr =[];
    
    for (let i = 0; i < product.length; i++) {
        
      if(product[i].isAccepted===true){
      arr2.push(product[i].user)
      // console.log(arr2);
     }
      
     }
     console.log("Nayce");
     //  console.log(arr);
      Profile.find({user:arr2}).populate('user','name email').then(products=>{
              //  console.log(products)
         return   res.json(products);
  })
      

 }
  else{
    return   res.json('No Requests')
    
  }
  

}).catch(err=>console.log(err))

///////
   




return ;


});

router.get('/getcustomerorders2',function(req,res){ 
  console.log("Request1");
OrderProduct2.find({ customer: req.query.id }).populate('user riders','name email').then(product => {


    
          // console.log(user);
      res.json(product)

  
  // console.log(product);
  

}).catch(err=>console.log(err))

///////
   


return ;


});

router.post('/addcatogry',function(req,res){ 
     
  console.log("ID received :"+req.body.catogry)
     
  Catogry.findOne({ catogry:req.body.catogry.toLowerCase() }).then(user => {
    // Check for user

    var valid=true;
    if (user) {
     console.log("Duplicate");
     valid=false;
     return res.json(valid)
    }
    else{
     

     const newUser = new Catogry({
        catogry: req.body.catogry.toLowerCase(),
        
      });
      newUser.save();
      return res.json(valid)
    }
        //this will give you the document what you want to update.. then 
       //so on and so forth
       
       // then save that document
       
    
  });

return  ;


});

router.post('/addsubcatogry',function(req,res){ 
     
  console.log("ID received :"+req.body.catogry)
  var sub =req.body.subcatogry.toLowerCase()
     
  Catogry.findOne({ subcatogry:req.body.subcatogry.toLowerCase() }).then(user => {
    // Check for user

    var valid=true;
    if (user) {
      valid=false;
     return res.json(valid)
    }
    else{
      Catogry.findOneAndUpdate({ catogry:req.body.catogry} ,{ $push: { subcatogry: sub } } ).then(user=>{


          user.save()
          return res.json(valid)
      })
      
    
    
    
    }
     
       
    
  });

return  ;


});

router.get('/getcato',function(req,res){ 
  console.log("Request");


  Catogry.find({  })
  .then(user=>{return res.json(user)})
  .catch(err=>console.log(err));
  
 




});
router.post('/addadmin',function(req,res){ 
  console.log("Request");


  var valid=true;
  console.log("Request came")
  
  const { errors, isValid } = validateAdminInput(req.body);

  // Check Validation
  if (!isValid) {
    
    return res.json(errors);
  }
     

 
  AddAdmin.findOne({ email: req.body.email }).then(user => {
    if (user) {
      errors.email = 'Email already exists';
      return res.json(errors);
    } else {

      
      var newUser={};
 
              newUser = new AddAdmin({
                name:req.body.name,
                email: req.body.email,
                password: req.body.npass,
                role:"admin"
              });
           
       

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


//login
router.post('/adminlogin', (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);

  // Check Validation
  if (!isValid) {
    return res.json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;

  // Find user by email
  AddAdmin.findOne({ email }).then(user => {
    // Check for user
    console.log("status: "+user)
    
     
    if (!user) {
      errors.email = 'User not found';
      return res.json(errors);
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

  router.post('/changepass',passport.authenticate(['jwt','admin'], { session: false }),function (req, res) {
    console.log("Query")
    const { errors, isValid } = validatePasswordInput(req.body);
    var valid=true;
    // Check Validation
    if (!isValid) {
      
      return res.json(errors);
    }
      const email=req.user.email
      AddAdmin.findOne({email}).then(user=>{
  
          // console.log(user);
          bcrypt.compare(req.body.opass, user.password, function(err, result) {
            // result == true
            console.log(result);
            errors.opass='Password Does not match with old password'
            if(result===false){
                return res.json(errors)
            }
            else{
              bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(req.body.npass, salt, (err, hash) => {
                  if (err) throw err;
                  user.password = hash;
                  user
                    .save()
                    .then(user => res.json(valid))
                    .catch(err => console.log(err));
                });
              });
            }
        });
  
      })
      
  
  
  });

  router.get('/deleteadmin',passport.authenticate(['jwt','admin'], { session: false }),function(req,res){ 
     
    console.log("ID received :"+req.query.id)
    
    AddAdmin.findOne({ _id:req.query.id }).then(user => {
      // Check for user
      if (user) {
       
         user.remove();
         
       
  
      }
    });
  
  return  ;
  
  
  });
  router.get('/getadmins',passport.authenticate(['jwt','admin'], { session: false }),function(req,res){ 
     
    const user=AddAdmin.find()
    .then(user=>{res.json(user)})
    .catch(err=>console.log(err));
    
  
  
  return ;
  
  
  });
  router.get('/deletecato',function(req,res){ 
     
    console.log("ID received :"+req.query.id)
    
    Catogry.findOne({ _id:req.query.id }).then(user => {
      // Check for user
      if (user) {
       
        console.log(user);
          //this will give you the document what you want to update.. then 
         //so on and so forth
         
         // then save that document
         user.remove();
         
       
  
      }
    });
  
  return  ;
  
  
  });
  router.post('/deletesubcato',function(req,res){ 
     
    console.log("ID received :"+req.body.txt+req.body.id)
    const t=req.body.txt;
    
    Catogry.update( { _id: req.body.id }, { $pull: { subcatogry: t } } ).then((user)=>{

      console.log(user);
    })  
     
  return  ;
  
  
  });
module.exports=router;
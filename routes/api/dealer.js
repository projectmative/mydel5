const { Router } = require('express');
const express = require('express');
const router=express.Router();
const mongoose = require('mongoose');
const passport = require('passport');
const bcrypt = require('bcryptjs');
// Load Profile Model
const Profile = require('../../models/Dealer_Profile');
const Bellman = require('../../models/Bellman_Profile');
// Load User Model
const User = require('../../models/User');
const StripeModel = require('../../models/Stripe');
// Load Product Model
const Product = require('../../models/Products');
const PlanProduct = require('../../models/PlanProducts');
const AddedRider = require('../../models/AddedRider');
const OrderProduct = require('../../models/OrderProducts');
const OrderProduct2 = require('../../models/OrderProducts2');
const RiderOrder = require('../../models/RiderOrder');
const { v4: uuidv4 } = require('uuid');
const validateProfileInput = require('../../Config/validation/profile');
const validateProfileInputUpdate = require('../../Config/validation/dealer');
const validateProductInput = require('../../Config/validation/product');
const validatePasswordInput = require('../../Config/validation/password');

const multer  = require('multer');
const formidable=require('formidable');
const product = require('../../Config/validation/product');
const RatingDRider = require('../../models/RatingDRider');
// const { default: Dealer } = require('../../delivery/src/components/Dealer');
const notifier = require('node-notifier');




/////////////////////////////
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null,'./uploads/');
  },
  filename: function(req, file, cb) {
    file.originalname = uuidv4()
    cb(null, file.originalname+".jpg");
  }
});

const upload = multer({
  storage: storage
  
});


////////////////////////////////
function notification(msg){
  notifier.notify(
    {
      title: 'MyDely Notification',
      message: msg,
      // icon: path.join(__dirname, 'coulson.jpg'), // Absolute path (doesn't work on balloons)
      sound: true, // Only Notification Center or Windows Toasters
      wait: true // Wait with callback, until user action is taken against notification, does not apply to Windows Toasters as they always wait or notify-send as it does not support the wait option
    },
    function (err, response) {
      // Response is response from notification
    }
  );
   
  notifier.on('click', function (notifierObject, options, event) {
    // Triggers if `wait: true` and user clicks notification
  });
   
  notifier.on('timeout', function (notifierObject, options) {
    // Triggers if `wait: true` and notification closes
  });
}

router.get('/test', function (req, res) {
  res.json('Hello World ji')
  notification("You received Order")

});
router.get(
  '/current',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const errors = {};
    const id=req.user._id;
    // console.log(req.user);

    User.findOne({ _id:id }).then(user => {
      // Check for user
     
       if(user.isSubscribed===false){
        console.log("status:2 "+user.isUsed)
          errors.sub='Not Subscribed'  
        return res.json(errors)
       }
       else{
        Profile.findOne({ user: req.user.id })
        .then(profile => {
          // console.log("Name"+req.user.name);
          if (!profile) {
            errors.noprofile = 'There is no profile for this user';
            return res.json(errors);
          }
          PlanProduct.find({user:user._id}).then(product=>{
            if(product){
              return res.json([profile,user.name,user.email,product])
            }
            else{
              return res.json([profile,user.name,user.email]);
            }
      })
          
          
        })
        .catch(err => res.json(err));
       }
      
      });
    
   
  }
);

/////////////Enable Subscription//////////////////
router.get('/subscribed',passport.authenticate('jwt', { session: false }), function (req, res) {
 console.log("Request")
 const id=req.user._id;
  User.findOneAndUpdate({_id:id},
    { isSubscribed: true,
  
  }).then(product_upadte=>{
  
      var valid=true;
      
      product_upadte.save().then(res.json(valid))
      .catch(err => console.log(err));
    
     
    
})



});


router.post(
  '/dealerprofile',upload.single('pathimg'),
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    
      console.log("Request")
    const { errors, isValid } = validateProfileInput(req.body);
    
    if(req.file==null){
        
      errors.pic="Picture required"
     return res.json(errors)
    }
    // console.log(req.body);
    // console.log(req.file);
    // Check Validation
    if (!isValid) {
      // Return any errors with 400 status
      return res.json(errors);
    }

    const id=req.user._id;

    User.findOne({ _id:id }).then(user => {

      if(user.isSubscribed===false){
        console.log("status:2 "+user.isUsed)
          errors.sub='Not Subscribed'  
        return res.json(errors)
       }
       
    Profile.findOne({ id: req.user.id }).then(profile => {
      // console.log("id"+profile)
      if (profile) {
        errors.profiles="Profile is already Created"
              res.json(errors)
      } else {
        console.log("Image"+req.file)
        var valid=true;
         const newUser = new Profile;
         newUser.user=req.user;
          newUser.bio=req.body.tag;
          newUser.img.path=req.file.path;
          newUser.img.contentType = 'image/jpeg';

          newUser
            .save()
            .then(user => res.json(valid))
            .catch(err => console.log(err));
         

      }
    });

    });

  }
);

///////////////////////////Update Profile//////////////////////
router.post('/updatedealerprofile',upload.single('pathimg'),
passport.authenticate('jwt', { session: false }) ,function (req, res) {
  const { errors, isValid } = validateProfileInputUpdate(req.body);
      console.log("User Came")
   
      if (!isValid) {
       
        return res.json(errors);
      }
  Profile.findOne({user:req.user}).then(product_upadte=>{
  if(product_upadte){
    console.log("Nace");
  }
      var valid=true;
      
      if(req.file){
        product_upadte.img.path=req.file.path;
      }
      else{
        product_upadte.img.path=req.body.pathimg;
      }
       product_upadte.bio=req.body.tag;
       
      
          const email=req.user.email

      User.findOne({email}).then(user3=>{
        // console.log("User"+req.user.email);
        // console.log(user3);
        console.log(req.body.name);
            user3.name=req.body.name;
            user3.save();
      });
       product_upadte.save().then(res.json(valid))
      .catch(err => console.log(err));

})

});

///////////////////////Add Product///////////////////

router.post('/addproduct',passport.authenticate('jwt', { session: false }),  function (req, res) {
    
    console.log("request")
  const { errors, isValid } = validateProductInput(req.body);
  var valid=true;
  // Check Validation
  if (!isValid) {
    
    return res.json(errors);
  }
  // console.log("User"+req.user)
  // res.json(req.user)
  // console.log("User"+req.user)
   User.findOne({ user: req.user }).then(user => {
    
      // console.log("Id:")
     
      
      const newUser = new Product({
                  name: req.body.name,
                  price: req.body.price,
                  quantity: req.body.quantity,
                  user:req.user
                });
                newUser.save().then(user => res.json(valid))
                .catch(err => console.log(err));
      
    
    
    
  
  });


});


///////////// GET Products ///////////////////
router.get('/getproducts',passport.authenticate('jwt', { session: false }),function(req,res){ 

  Product.find({ user: req.user }).then(product => {
    
    res.json(product)
    
  
  }).catch(err=>console.log(err))

///////
     
  
  


return ;


});
///////////// GET Products ///////////////////
router.get('/getplanproducts',passport.authenticate('jwt', { session: false }),function(req,res){ 

  PlanProduct.find({ user: req.user }).then(product => {
    
    res.json(product)
    
  
  }).catch(err=>console.log(err))

///////
     
  
  


return ;


});






router.get('/getadminproducts',function(req,res){

  Product.find({}).then(product=>{
    res.json(product);
  })

})

///////////update Product///////////////////////

router.put('/updateproduct',function (req, res) {
  console.log("Query"+req.body.id)
  const { errors, isValid } = validateProductInput(req.body);
  var valid=true;
  // Check Validation
  if (!isValid) {
    
    return res.json(errors);
  }
  if(!req.body.id){
    valid=false;
    return res.json(valid)
  }
  Product.findOneAndUpdate({_id:req.body.id},{ name: req.body.name,
    price: req.body.price,
    quantity: req.body.quantity
    // user:req.user
  }).then(product_upadte=>{


    PlanProduct.findOneAndUpdate({id:req.body.id},{ name: req.body.name,
      price: req.body.price,
      quantity: req.body.quantity
      // user:req.user
    }).then(product_upadte=>{
    
       
        
        product_upadte.save().then(res.json(valid))
        .catch(err => console.log(err));
  
      
  })
  
      var valid=true;
      
      product_upadte.save().then(res.json(valid))
      .catch(err => console.log(err));

    
})
});
///////////////////////////////////chnage password/////////////////////
router.post('/change',passport.authenticate('jwt', { session: false }) ,function (req, res) {
  console.log("Query")
  const { errors, isValid } = validatePasswordInput(req.body);
  var valid=true;
  // Check Validation
  if (!isValid) {
    
    return res.json(errors);
  }
    const email=req.user.email
    User.findOne({email}).then(user=>{

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

router.get('/deleteid',function(req,res){ 
Product.findOne({ _id:req.query.id }).then(user => {
  // Check for user
  if (user) {
   
     user.remove();
     

  }
});

return  ;


});
//////Plan ID//////
router.get('/deleteplanid',function(req,res){ 
  console.log("Request came");
  PlanProduct.findOne({ _id:req.query.id }).then(user => {
    // Check for user
    if (user) {
     
       user.remove();

    }
  });
  
  return  ;
  
  
  });

//////////////////////////////////////////addtoplan///////////////////////
router.post('/addid',passport.authenticate('jwt', { session: false }),function(req,res){ 
  var valid=true
  console.log("Request"+req.body.firstName);
  Product.findOne({ _id:req.body.firstName}).then(product => {
    // Check for user
    // console.log(product);
    let planuser,supercount=''
    if (product) {
      console.log(product._id);
      var idddd=product._id;
        const count=PlanProduct.find({user:req.user.id})
            count.count().then((count)=>{
              console.log(count);
             
              StripeModel.findOne({user:req.user.id}).limit(1).sort({$natural:-1}).then((plan)=>{
                  planuser=plan[0].plan  
                  console.log(planuser);
              })
              if(planuser==='price_1HsMScBMZbTVaUURRvjSuKWk'||planuser==='price_1HsMTFBMZbTVaUURE4VsqAzX'||planuser==='price_1HsMTcBMZbTVaUUR81Yl0rW3'){
                supercount=10
              }
              if(planuser==='price_1HsMYdBMZbTVaUURKINy60e9'||planuser==='price_1HsMYdBMZbTVaUURY5TtrApM'||planuser==='price_1HsMYdBMZbTVaUURnTq34l5L'){
                supercount=20
              }
              if(planuser==='price_1HsMYdBMZbTVaUURKINy60e9'||planuser==='price_1HsMYdBMZbTVaUURY5TtrApM'||planuser==='price_1HsMYdBMZbTVaUURnTq34l5L'){
                supercount=30
              }
                if(count>supercount){
                  return res.json("limit")
                }
                else{
                  PlanProduct.findOne({id:idddd}).then(wow=>{
                    console.log(wow);
            if(wow){
              valid=false;
             return res.json(valid)
            }
            else{
              const newUser = new PlanProduct({
                name: product.name,
                price: product.price,
                quantity: product.quantity,
                user:req.user,
                id:product._id
              });
              newUser.save().then(user =>  res.json(valid))
              .catch(err => console.log(err));
            }

          })
                }

            })
           
         
      
       
        
        
      
     
  
    }
  });
  
  return  ;
  
  
  });



//////////////////////////minisite///////////////////
router.get('/profile',function(req,res){
        console.log("Request came");
        const errors = {};
        console.log("Hello"+req.query.email);
         var email=req.query.email;
        //  console.log(email);
         var email54 = email.substring(1);
        //  console.log(email54)
        User.findOne({email:email}).then(user => {
          // Check for user
          // console.log(user)
           if(user){
             
            Profile.findOne({ user: user._id })
            .then(profile => {
              // console.log("Name"+req.user.name);
              if (!profile) {
                errors.noprofile = 'There is no profile for this user';
                return res.json(errors);
              }

              PlanProduct.find({user:user._id}).then(product=>{
                    if(product){
                      return res.json([profile,user.name,user.email,product])
                    }
                    else{
                      return res.json([profile,user.name,user.email]);
                    }
              })
             
              
            })
            .catch(err => res.json(err));
           }
           else{
            errors.noprofile = 'There is no profile for this user';
            return res.json(errors);
           }
          
          });
})

/////////////////Add Rider//////////////////////
router.post('/addrider',passport.authenticate('jwt', { session: false }),function(req,res){ 
  var valid=true
  console.log("Request"+req.body.firstName);
  var id5=req.body.firstName;
  console.log(id5)
  AddedRider.find({ $and:[{rider:req.body.firstName},{user:req.user}] }).then(product => {
    // console.log(product)

      if(product==''){
     
         console.log("Nayce"+product);
        const newUser = new AddedRider({
          rider:id5,
          user:req.user
        });
        newUser.save().then(user => res.json(valid))
                .catch(err => console.log(err));

      }
      else{
        valid=false;
        return  res.json(valid)

      }
          
   
    
  });
  
  return  ;
  
  
  });
  router.get('/getdealers',passport.authenticate('jwt', { session: false }), function(req,res){ 
    console.log("Request Accept")
   AddedRider.find({ rider:req.user._id}).then(product => {
       
       if (product) {
        
         let arr2 =[];
         
         for (let i = 0; i < product.length; i++) {
             
           if(product[i].isAccepted===false){
           arr2.push(product[i].user)}
           
           }
          //  console.log(arr2);
           Profile.find({user:arr2}).populate('user','name email').then(products=>{
                console.log(products);
              return   res.json(products);
       })
           
 
       }
       else{
         return   res.json('No Requests')
         
       }
     });
    });


   
    
    
    
    router.get('/getdealersaccept',passport.authenticate('jwt', { session: false }), function(req,res){ 
      console.log("Request")
     AddedRider.find({ rider:req.user._id}).then(product => {
       
       if (product) {
        
         let arr2 =[];
         let arr =[];
         
         for (let i = 0; i < product.length; i++) {
             
           if(product[i].isAccepted===true){
           arr2.push(product[i].user)
           console.log(arr2);
          }
           
          }
          //  console.log(arr);
           Profile.find({user:arr2}).populate('user','name email').then(products=>{
                    console.log(products)
              return   res.json(products);
       })
           
 
      }
       else{
         return   res.json('No Requests')
         
       }
     });
 
 
    
     });
     router.get('/getid',passport.authenticate('jwt', { session: false }),function(req,res){ 
     
      console.log("ID received :"+req.query.id)
      
      AddedRider.findOne({ $and:[{user:req.query.id} ,{rider:req.user._id}] }).then(user => {
        // Check for user
        // console.log(Nayce);
        const valid=true
        if (user) {
            console.log("Nayce"+user);

            //this will give you the document what you want to update.. then 
            user.isAccepted = true; //so on and so forth
           
          //  // then save that document
            user.save();
           
         return res.json(valid)
    
        }
      });
    
    return  ;
    
    
    });
    router.get('/deleterider',passport.authenticate('jwt', { session: false }),function(req,res){ 
      console.log("Delete");
      console.log("ID received :"+req.query.id)
      
      AddedRider.findOne({ user:req.query.id }).then(user => {
        // Check for user
        const valid=true
        if (user) {
         
          
            //this will give you the document what you want to update.. then 
           //so on and so forth
           
           // then save that document
           user.remove();
           return res.json(valid)
   
        }
      });
    
    return  ;
    
    
    });

    router.post('/orderproducts',passport.authenticate('jwt', { session: false }), function (req, res) {
      
        console.log("Request Came");
        // console.log(req.body.records);
        var records=req.body.records;
        var valid=true;
        var email=req.query.email;
        var customer=req.user;
        //  console.log("Customer:"+customer);
         var email_user = email.substring(1);
         console.log(email_user);

         User.findOne({email:email}).then(user => {
          if(user){
             
            Profile.findOne({ user: user._id })
            .then(profile => {
              // console.log("Name"+req.user.name);
              if(profile){       
                var arr=[];        
                 
                    // console.log("name"+records[i].name);
                    // arr.push('name',records[i].name)
                    // arr.push('price',records[i].price)
                    //     console.log(arr);
                    console.log("Nayce+1");
                    const newUser = new OrderProduct2();
                      newUser.order=records,
                      // newUser.order.price=records[0].price,
                      // newUser.order.quantity=records[0].quantity,
                      newUser.user=user;
                      newUser.status="pending";
                      // console.log(customer)
                      newUser.customer=customer;

                    
                    
                    newUser.save();
          
                    
                  
                 return res.json(valid)

               
              }
              

             
              
            })
            .catch(err => res.json(err));
           }

        });
    });

    router.get('/getorders',passport.authenticate('jwt', { session: false }),function(req,res){ 
        console.log("Request");
      OrderProduct2.find({ user: req.user }).populate('customer ','name email address').sort({'_id':-1}).then(product => {
          
          
                // console.log(user);
            res.json(product)

        
        // console.log(product);
        
      
      }).catch(err=>console.log(err))
    
    ///////
         
  
    
    return ;
    
    
    });
    router.get('/getriders',passport.authenticate('jwt', { session: false }),function(req,res){ 
      console.log("Request Rider");
    AddedRider.find({ user: req.user }).then(product => {
      
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

  router.post('/riderorder',passport.authenticate('jwt', { session: false }), function (req, res) {
      
    console.log("Request Came");
    // console.log(req.body.records);
    var records=req.body.records;
    var valid=true;
    var id=req.body.id;
     console.log("Order:"+req.body.orderid);
    
    //  console.log("id"+id);
    //  console.log("id"+records.length);
        
        Bellman.findOne({ user: id }).populate('user','name email')
        .then(profile => {
          
          if(profile){   
            console.log("Name");
            OrderProduct2.findOne({_id:req.body.orderid}).then(pro=>{

                if(pro){
                  const newUser = new RiderOrder ({order:pro.order,user:profile,customer:pro.customer,status:'Assigned',orderid:req.body.orderid,dealer:pro.user})
                  newUser.save();

                  pro.status="Assigned"
                  pro.riders=profile.user;
                  pro.save();
                  

                }
            })            
             
             return res.json(valid)

           
          }
          

          
        })
        .catch(err => res.json(err));
      

    
});

router.post('/deleteorder',passport.authenticate('jwt', { session: false }), function (req, res) {
      
  console.log("Request Came");
  var valid=true;

   console.log("User:"+req.user._id);
   console.log("Order:"+req.body.orderid);
  
      
      Bellman.findOne({ user: req.user._id })
      .then(profile => {
        
        if(profile){   
          console.log("Name");
          OrderProduct2.findOne({_id:req.body.orderid}).then(pro=>{
                
              if(pro){
                RiderOrder.findOne({orderid:req.body.orderid}).then(pro2=>{

                    pro2.status="Cancelled"
                    pro2.save();
                })
                

                pro.status="Cancelled"
                pro.save();
                

              }
          })            
           
           return res.json(valid)

         
        }
        

       
        
      })
      .catch(err => res.json(err));
    

  
});

router.post('/acceptorder',passport.authenticate('jwt', { session: false }), function (req, res) {
      
  console.log("Request Came");
  var valid=true;

   console.log("User:"+req.user._id);
   console.log("Order:"+req.body.orderid);
  
      
      Bellman.findOne({ user: req.user._id })
      .then(profile => {
        
        if(profile){   
          console.log("Name");
          OrderProduct2.findOne({_id:req.body.orderid}).then(pro=>{
                
              if(pro){
                RiderOrder.findOne({orderid:req.body.orderid}).then(pro2=>{

                    pro2.status="Completed"
                    pro2.save();
                })
                

                pro.status="Completed"
                pro.save();
                

              }
          })            
           
           return res.json(valid)

         
        }
        

       
        
      })
      .catch(err => res.json(err));
    

  
});



router.get('/getriderorders',passport.authenticate('jwt', { session: false }),function(req,res){ 
  console.log("Request");
  Bellman.findOne({ user: req.user })
        .then(profile => {
          // console.log("Nayce"+profile);
          RiderOrder.find({ user: profile }).populate('customer dealer','name email address').then(product => {
  
            res.json(product)
            // console.log(product);
            
          
          }).catch(err=>console.log(err))
        })
        .catch(err => res.json(err));


///////
   


return ;


});
/////////////////////////////showcustomerorder//////////////////
router.get('/getcustomerorders',passport.authenticate('jwt', { session: false }),function(req,res){ 
  console.log("Request1");
OrderProduct2.find({ customer: req.user }).populate('user riders','name email').then(product => {


    
          // console.log(user);
      res.json(product)

  
  // console.log(product);
  

}).catch(err=>console.log(err))

///////
   


return ;


});


router.post('/bellmanrating',passport.authenticate('jwt', { session: false }),(req,res)=>{
  var valid=true;
  console.log("Hi")
  console.log(req.body.rider);
  console.log(req.body.dealer);
  console.log(req.body.orderid);
RatingDRider.findOne({rider:req.body.rider}).then(user=>{
    if(user){
      // console.log(user);
      var count=user.count+1;
      var total=user.total+req.body.rating_rider
      var x=total/count;
    //  console.log(x)
     user.count=count;
     user.total=total;
      user.rating=x;
      user.save();
          Bellman.findOne({user:req.body.rider}).then(user2=>{
            console.log("ok");
            if(user2){
              // console.log(user2);
                user2.drating=x;
                user2.save();
            }
          })

    } 
    else{
      const newUser=new RatingDRider({
        count:1,
        rating:req.body.rating_rider,
        rider:req.body.rider,
        total:req.body.rating_rider

      })
      
      newUser.save();
      Bellman.findOne({user:req.body.rider}).then(user2=>{
        // console.log("ok");
        if(user2){
          // console.log(user2);
            user2.drating=req.body.rating_rider;
            user2.save();
        }
      })
    }

})




OrderProduct2.findOne({_id:req.body.orderid}).then(order=>{

if(order){
order.drating=true;
order.save();
}
})
res.json(valid)






})

router.get('/getdriders',passport.authenticate('jwt', { session: false }),function(req,res){ 
  console.log("Request Rider"+req.user.id);
AddedRider.find({ user: req.user.id }).then(product => {
  
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
router.get('/deleterider2',passport.authenticate('jwt', { session: false }),function(req,res){ 
     
  console.log("ID received :"+req.query.id)
  
  AddedRider.findOne({ $and:[{rider:req.query.id},{user:req.user}] }).then(user => {
    // Check for user
    console.log(user)
    if (user) {
     
      
        //this will give you the document what you want to update.. then 
       //so on and so forth
       
       // then save that document
       user.remove();
       
      return res.json(true)

    }
  });




});
router.get('/deletedealer2',passport.authenticate('jwt', { session: false }),function(req,res){ 
     
  console.log("ID received :"+req.query.id)
  
  AddedRider.findOne({ $and:[{rider:req.user.id},{user:req.query.id}] }).then(user => {
    // Check for user
    console.log(user)
    if (user) {
     
      
        //this will give you the document what you want to update.. then 
       //so on and so forth
       
       // then save that document
      //  user.remove();
       
      return res.json(true)

    }
  });




});
router.get('/getplan',passport.authenticate('jwt', { session: false }),function(req,res){ 
     
  console.log("ID received :")
  
  StripeModel.find({user:req.user}).then(user => {
    // Check for user
      
    if (user) {
     
      
        //this will give you the document what you want to update.. then 
       //so on and so forth
       
       // then save that document
      //  user.remove();
       
      return res.json(user)

    }
  });




});
router.get('/check',async function(req,res){ 
     
  console.log("ID received :"+req.query.email)
  const email=req.query.email;
   await  User.find({email}).then((user1)=>{
    let planuser,supercount=''
    StripeModel.find({user:user1}).limit(1).sort({$natural:-1}).then(user => {
      // Check for user
         
      if (user) {
        const count=PlanProduct.find({user:user1})
            count.count().then((count)=>{
              console.log(count);
          
            planuser=user[0].plan
            if(planuser==='price_1HsMScBMZbTVaUURRvjSuKWk'||planuser==='price_1HsMTFBMZbTVaUURE4VsqAzX'||planuser==='price_1HsMTcBMZbTVaUUR81Yl0rW3'){
              supercount=10
            }
            if(planuser==='price_1HsMYdBMZbTVaUURKINy60e9'||planuser==='price_1HsMYdBMZbTVaUURY5TtrApM'||planuser==='price_1HsMYdBMZbTVaUURnTq34l5L'){
              supercount=20
            }
            if(planuser==='price_1HsMYdBMZbTVaUURKINy60e9'||planuser==='price_1HsMYdBMZbTVaUURY5TtrApM'||planuser==='price_1HsMYdBMZbTVaUURnTq34l5L'){
              supercount=30
            }
            console.log(supercount)
            if(count>supercount){
              console.log(count+" "+supercount);
              return res.json(false)
            }

       var d1=new Date();
        console.log(user[0].end)
        console.log(d1)
        if(d1>user[0].end){
          return res.json(false)
        }
        else{
          return res.json(true)
        }


      })

      }
    });
    })
 




});


module.exports=router;
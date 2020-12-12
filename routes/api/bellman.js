const { Router } = require('express');
const express = require('express');
const router=express.Router();
const mongoose = require('mongoose');
const passport = require('passport');
// Load Profile Model
const Profile = require('../../models/Dealer_Profile');
const Bellman = require('../../models/Bellman_Profile');
const AddedRider = require('../../models/AddedRider');

// Load User Model
const User = require('../../models/User');
// Load Product Model
const Product = require('../../models/Products');
const { v4: uuidv4 } = require('uuid');
const validateProfileInput = require('../../Config/validation/BellmanProfile');
const validateProfileInputUpdate = require('../../Config/validation/BellmanProfileUpdate');
const validateProductInput = require('../../Config/validation/product');

const multer  = require('multer');
const formidable=require('formidable');
const product = require('../../Config/validation/product');
var parser = require('parse-address');
var parseAddress = require('parse-address-string');
const RatingRider = require('../../models/RatingRider');
const RatingDealer = require('../../models/RatingDealer');
const OrderProducts2 = require('../../models/OrderProducts2');

















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


router.get('/test', function (req, res) {
  res.send('Hello World ji')
});


router.post(
  '/bellmanprofile',upload.array('pathimgss'),
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { errors, isValid } = validateProfileInput(req.body);
    console.log("Request"+req.user._id+req.user.id)
    if(req.body.category===''){
      errors.cato='category required'
      return res.json(errors);
  }
    
    if (!isValid) {
      // Return any errors with 400 status
      return res.json(errors);
    }

    const id2=req.user._id;
    console.log(req.user._id)

    User.findOne({ _id:id2 }).then(user => {

     
       
    Bellman.findOne({ id: req.user.id }).then(profile => {
      // console.log("id"+profile)
      if (profile) {
        errors.profiles="Profile is already Created"
              res.json(errors)
      } else {
           
        parseAddress(req.body.address, function(err,addressObj){
          var street,city,state,zip;
          street=addressObj.street_address1;
          city=addressObj.city;
          state=addressObj.state;
          zip=addressObj.postal_code;
          console.log(zip);
         
                // var add=req.body.address;
                // var w=add.split(',');
          
       



        console.log("Image"+req.files[0].path)
        var valid=true;
         const newUser = new Bellman;
         newUser.user=req.user;
          newUser.bio=req.body.tag;
          newUser.price=req.body.price;
          newUser.category=req.body.category;
          newUser.subcategory=req.body.subcategory;
          newUser.img.path=req.files[0].path;
          newUser.img.contentType = 'image/jpeg';
          newUser.img1.path=req.files[1].path;
          newUser.img1.contentType = 'image/jpeg';
          newUser.img2.path=req.files[2].path;
          newUser.img2.contentType = 'image/jpeg';
          newUser.address.street=street;
          newUser.address.city=city;
          newUser.address.state=state;
          newUser.address.postalcode=zip;
          newUser.fulladdress=req.body.address.toLowerCase();
          

          newUser
            .save()
            .then(user => res.json(valid))
            .catch(err => console.log(err));
          })

      }
    });

    });

  }
);

//////////////////////////Update Profile//////////////////
router.post('/updatebellmanprofile',upload.array('pathimgss'),
passport.authenticate('jwt', { session: false }) ,function (req, res) {
      

const { errors, isValid } = validateProfileInputUpdate(req.body);
    console.log("Request")
    if(req.body.category===''){
      errors.cato='category required'
      return res.json(errors);
  }
    if (!isValid) {
      // Return any errors with 400 status
      return res.json(errors);
    }
    // console.log("images"+req.body.pathimgss[0]);
    console.log(req.user.id);
  Bellman.findOne({user:req.user},).then(product_upadte=>{
  if(product_upadte){
    console.log(product_upadte);
  }

  parseAddress(req.body.address, function(err,addressObj){
    var street,city,state,zip;
    street=addressObj.street_address1;
    city=addressObj.city;
    state=addressObj.state;
    zip=addressObj.postal_code;
    console.log(zip);
      var valid=true;
      console.log("images"+req.body.pathimgss);

      if(req.files[0]){
        product_upadte.img.path=req.files[0].path;
      }
      else{
        product_upadte.img.path=req.body.pathimgss[0];
        
      }
      
      if(req.files[1]){
        product_upadte.img1.path=req.files[1].path;
      }
      else{
        product_upadte.img1.path=req.body.pathimgss[1];
      }
      
      if(req.files[2]){
        product_upadte.img2.path=req.files[2].path;
      }
      else{
        product_upadte.img1.path=req.body.pathimgss[2];
      }
       
      
       product_upadte.bio=req.body.tag;
          
          product_upadte.img.contentType = 'image/jpeg';
          
          product_upadte.img1.contentType = 'image/jpeg';
          
          product_upadte.img2.contentType = 'image/jpeg';
          product_upadte.address.street=street;
          product_upadte.address.city=city;
          product_upadte.address.state=state;
          product_upadte.address.postalcode=zip;
          product_upadte.fulladdress=req.body.address.toLowerCase();
          product_upadte.category=req.body.category;
          product_upadte.subcategory=req.body.subcategory;
          product_upadte.price=req.body.price;
          product_upadte.user=req.user;



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
})

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
     
       
       
        Bellman.findOne({ user: req.user.id })
        .then(profile => {
          // console.log("Name"+req.user.name);
          if (!profile) {
            errors.noprofile = 'There is no profile for this user';
            return res.json(errors);
          }
          
          res.json([profile,req.user.name]);
        })
        .catch(err => res.json(err));
      
      
      });
    
   
  }
);
var run =async function(req,res){
    console.log("Request Came"+req.body.address);
  await Bellman.find({$text: {$search: req.body.address.toLowerCase()}}).populate('user').exec((err,address)=>{
    var s=0,p=0;
    var ad=[];
    console.log(address);
    console.log(req.body.address.toLowerCase());

    if(address.length===0){
     
      console.log("asdasd");
      res.json("Not Found")
    }
    else{
      res.json(address)
    }
     
     
  })


}
var run2 =async function(req,res){
  console.log("Request Came"+req.body.address);
await Bellman.find({$text: {$search: req.body.address}}).populate('user').limit(10).exec((err,address)=>{
  var s=0,p=0;
  var ad=[];
  console.log(address);
 

  if(address.length===0){
   
    console.log("asdasd");
    res.json("Not Found")
  }
  else{
    res.json(address)
  }
   
   
})


}
var run3 =async function(req,res){
  console.log("Request Came");
await Bellman.find({ $and: [ { crating: {$gte:2} }, { drating: {$gte:2} } ] }).populate('user').limit(5).exec((err,address)=>{
  var s=0,p=0;
  var ad=[];
  console.log(address);
 res.json(address)

  // if(address.length===0){
   
  //   console.log("asdasd");
  //   res.json("Not Found")
  // }
  // else{
  //   res.json(address)
  // }
   
   
})


}
router.post('/zip',passport.authenticate('jwt', { session: false }),run2);
router.post('/address',passport.authenticate('jwt', { session: false }),run);
router.post('/searchaddress',run);
router.get('/ratingsearch',run3);


router.post('/bellmanrating',passport.authenticate('jwt', { session: false }),(req,res)=>{
            var valid=true;
            console.log(req.body.rider);
            console.log(req.body.dealer);
            console.log(req.body.orderid);
        RatingRider.findOne({rider:req.body.rider}).then(user=>{
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
                      // console.log("ok");
                      if(user2){
                        // console.log(user2);
                          user2.crating=x;
                          user2.save();
                      }
                    })

              } 
              else{
                const newUser=new RatingRider({
                  count:1,
                  rating:req.body.rating_rider,
                  rider:req.body.rider,
                  total:req.body.rating_rider

                })
                
                newUser.save();
                
                Bellman.findOne({user:req.body.rider}).then(user2=>{
                  if(user2){
                      user2.crating=req.body.rating_rider;
                      user2.save();
                  }
                })
              }
    
        })


        RatingDealer.findOne({dealer:req.body.dealer}).then(user=>{
          if(user){
            // console.log(user);
            var count=user.count+1;
            var total=user.total+req.body.rating_dealer
            var x=total/count;
          //  console.log(x)
           user.count=count;
           user.total=total;
            user.rating=x;
            user.save();

          } 
          else{
            const newUser=new RatingDealer({
              count:1,
              rating:req.body.rating_dealer,
              dealer:req.body.dealer,
              total:req.body.rating_rider

            })
            
            newUser.save();
          }

         

    })

    OrderProducts2.findOne({_id:req.body.orderid}).then(order=>{

      if(order){
        order.rating=true;
        order.save();
      }
    })
    res.json(valid)






})
router.get('/getrdealers',passport.authenticate('jwt', { session: false }),function(req,res){ 
  console.log("Request Rider"+req.user.id);
AddedRider.find({ rider: req.user.id }).then(product => {
  
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

module.exports=router;
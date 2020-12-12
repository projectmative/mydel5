const express = require('express');
const router=express.Router();
const StripeModel = require('../../models/Stripe');
const passport = require('passport');
const Stripe = require('stripe')
const stripe=Stripe('sk_test_51HsM3hBMZbTVaUURfGrHSmDJZQMvUmbzeSA6c2x19DyWZ3J173C9NAfETgp88tKLcIhCkZ2k1pYWyryVmDr838nD00tlxzK7Ao');
const fetch = require("node-fetch");

router.get('/test',(req,res)=>res.json({msg:"users known"}));


router.post('/create',(req,res)=>{

createCustomer();

})
router.post('/cancel',passport.authenticate('jwt', { session: false }),async (req,res)=>{
console.log("Request");
console.log(req.body.id)
const deleted = await stripe.subscriptions.del(
  req.body.id
);

console.log(deleted);

StripeModel.find({user:req.user.id}).limit(1).sort({$natural:-1}).then(user => {
  // Check for user
   console.log(user[0].start);
  if (user) {
   
      user[0].sub=deleted
      //this will give you the document what you want to update.. then 
     //so on and so forth
     
     // then save that document
      user[0].save();
     
    return res.json(true)

  }
});


})
let user={}
let buy=''
//,passport.authenticate('jwt', { session: false })
router.post('/token',passport.authenticate('jwt', { session: false }),async (req,res)=>{

  // console.log(req.body.token);
  //         console.log(req.body.token.name);
  user=req.user
  buy=req.body.buy
         console.log(req.body.token);
         console.log(req.body.brand);
         console.log(req.body.amount);
         console.log(req.body.email);
         console.log(req.body.buy);
         console.log(req.body.card);
           

         const customer = await stripe.customers.create({
          email: req.body.email,
          source: req.body.card.id
          
        });
          //  const payment= await stripe.paymentMethods.create({
          //   card: {token: req.body.card},
          //   type:'card',
          //     billing_details: {
          //       name: "billingName",
          //     },
          //   })
           
              createSubscription({
                customerId: customer.id,
                 
                priceId: req.body.amount,
              });
           
        
         
        
          return res.json(true)
  })

  function createSubscription({ customerId,  priceId }) {
    return (
      fetch('http://localhost:5000/api/stripe/create-subscription', {
        method: 'post',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          customerId: customerId,
         
          priceId: priceId,
        }),
      })
        .then((response) => {
          return response.json();
        })
        // If the card is declined, display an error to the user.
        .then((result) => {
          if (result.error) {
            // The card had an error when trying to attach it to a customer.
            throw result;
          }
          return result;
        })
        // Normalize the result to contain the object returned by Stripe.
        // Add the additional details we need.
        .then((result) => {
          return {
             
            priceId: priceId,
            subscription: result,
          };
        })
        // Some payment methods require a customer to be on session
        // to complete the payment process. Check the status of the
        // payment intent to handle these actions.
        
        // If attaching this card to a Customer object succeeds,
        // but attempts to charge the customer fail, you
        // get a requires_payment_method error.
       
        // No more actions required. Provision your service for the user.
        .then(onSubscriptionComplete)
        .catch((error) => {
          // An error has happened. Display the failure to the user here.
          // We utilize the HTML element we created.
         console.log(error);
        })
    );
  }
  router.post('/create-subscription', async (req, res) => {
    // Attach the payment method to the customer
    // try {
    //   await stripe.paymentMethods.attach(req.body.paymentMethodId, {
    //     customer: req.body.customerId,
    //   });
    // } catch (error) {
    //   return res.status('402').send({ error: { message: error.message } });
    // }
  
    // Change the default invoice settings on the customer to the new payment method
    await stripe.customers.update(
      req.body.customerId,
      {
        invoice_settings: {
          default_payment_method: req.body.paymentMethodId,
        },
      }
    );
  
    // Create the subscription
    const subscription = await stripe.subscriptions.create({
      customer: req.body.customerId,
      items: [{ price: buy}],
      expand: ['latest_invoice.payment_intent'],
    });
  console.log("PLan to bui "+buy);
    res.send(subscription);
  });

  function onSubscriptionComplete(result) {
    // Payment was successful.
    if (result.subscription.status === 'active') {
      // Change your UI to show a success message to your customer.
      // Call your backend to grant access to your service based on
      // `result.subscription.items.data[0].price.product` the customer subscribed to.
      console.log("Active");
      console.log(result.subscription);
      console.log(result.subscription.id);
      console.log(result.subscription.current_period_start);
      console.log(result.subscription.current_period_end);
      let end=new Date(result.subscription.current_period_end*1000);
      let start=new Date(result.subscription.current_period_start*1000);
 

     const newUser = new StripeModel({
        subid: result.subscription.id,
        start: start,
        end: end,
        sub:result.subscription,
        user:user,
        plan:result.subscription.plan.id,
      });
      newUser.save();

    }
  }
 

module.exports=router;
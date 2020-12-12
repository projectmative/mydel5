const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const MessageProfile = require("../../models/Message");
const Notification = require("../../models/Notification");
const multer  = require('multer');
const path = require('path')
const { v4: uuidv4 } = require('uuid');
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null,'./uploads/');
  },
  filename: function(req, file, cb) {
    const uv = uuidv4()
    cb(null, uv+file.originalname);
   
  }
});

const upload = multer({
  storage: storage
  
});

router.post("/SendMessage", async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { room, Message } = req.body;
  console.log("Room of send"+room);
  const MessageFields = {};

  MessageFields.room = room;
  if (Message) MessageFields.Message = Message;
  try {
    let messageProfile = await MessageProfile.findOne({ room: room });

    if (messageProfile) {
      messageProfile = await MessageProfile.findOneAndUpdate(
        { room: room },
        { $push: { Message: Message } }
        // { new: true }
      );
      return res.json(messageProfile);
    }
    messageProfile = new MessageProfile(MessageFields);

    await messageProfile.save();
    res.json(messageProfile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});
router.post("/FindMessages", async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { room } = req.body;
  try {
    let messageProfile = await MessageProfile.findOne({ room: room });

    if (messageProfile) return res.json(messageProfile.Message);
    return res.json([]);
  } catch (err) {}
});

router.post("/FindMessagesrider", async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const email=req.body.room
  // console.log("EMial"+email);
  
  const { room } = req.body;
  try {
    let messageProfile = await MessageProfile.find({  });
    if(messageProfile){
      // console.log(messageProfile[0].room);
      var s=0,p=0;;
      var ad=[];
      for(i=0;i<messageProfile.length;i++){
        s=messageProfile[i].room.search(email)
          // console.log(s+"Cs")
       
        if(s!=-1){
              ad.push(messageProfile[i].room);
              // console.log(ad+"Nayce")
                  
          }
          s=0;
      }
      if(ad.length===0){
       return res.json([])
      }else{
  
       return res.json(ad)
        // console.log(address)
               
      }
    }

    // if (messageProfile) return res.json(messageProfile.Message);
    return res.json([]);
  } catch (err) {}
});

router.post("/FindMessagesdealer", async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const email=req.body.room
  // console.log("EMial"+email);
  
  const { room } = req.body;
  try {
    let messageProfile = await MessageProfile.find({  });
    if(messageProfile){
      // console.log(messageProfile[0].room);
      var s=0,p=0;;
      var ad=[];
      for(i=0;i<messageProfile.length;i++){
        s=messageProfile[i].room.search(email)
          // console.log(s+"Cs")
       
        if(s!=-1){
              ad.push(messageProfile[i].room);
              // console.log(ad+"Nayce")
                  
          }
          s=0;
      }
      if(ad.length===0){
       return res.json([])
      }else{
  
       return res.json(ad)
        // console.log(address)
               
      }
    }

    // if (messageProfile) return res.json(messageProfile.Message);
    return res.json([]);
  } catch (err) {}
});

router.post("/sendfile",upload.single('pathimgss'), async (req, res) => {

    const room=req.body.myroom;
    const timeStamp=req.body.timestamp;
    const path=req.file.path;
    const name=req.file.originalname;
    console.log("File"+req.file.originalname)
    console.log("Path"+req.file.path)
    const user=req.body.name;
    const Message = { user, path, name, timeStamp }


  
  console.log("Room of send"+room);
  const MessageFields = {};

  MessageFields.room = room;
  if (Message) MessageFields.Message = Message;
  try {
    let messageProfile = await MessageProfile.findOne({ room: room });

    if (messageProfile) {
      messageProfile = await MessageProfile.findOneAndUpdate(
        { room: room },
        { $push: { Message: Message } }
        // { new: true }
      );
      return res.json(messageProfile);
    }
    messageProfile = new MessageProfile(MessageFields);

    await messageProfile.save();
    res.json(messageProfile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }



});

router.post("/delete", async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { room } = req.body;

  try {
    let messageProfile = await MessageProfile.findOneAndRemove({ room: room });
    return res.json(messageProfile);
  } catch (err) {
    console.log(err);
  }
});


router.post("/send", async (req, res) => {
      console.log("WOW");
  const { room, Message } = req.body;
  console.log("Notification"+room);
  const MessageFields = {};

  MessageFields.room = room;
  if (Message) MessageFields.Message = Message;
  try {
    let messageProfile = await Notification.findOne({ room: room });

    if (messageProfile) {
      messageProfile = await Notification.findOneAndUpdate(
        { room: room },
        { $push: { Message: Message } }
        // { new: true }
      );
      return res.json(messageProfile);
    }
    messageProfile = new Notification(MessageFields);

    await messageProfile.save();
    res.json(messageProfile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

router.post("/FindNotification", async function (req, res) {
//  console.log("Find");
  const email=req.body.room
  // console.log("EMial"+email);
  
  
  
    let messageProfile = await Notification.find({room: email});
    
    if(messageProfile.length!==0){
      // console.log(messageProfile[0].room);
      // console.log(messageProfile);
      // console.log(messageProfile[0].Message+"mee");
      // console.log(messageProfile[0].Message.reverse()) 
   
      
      if(messageProfile){
        return res.json(messageProfile[0].Message.reverse())
      }
      
    }

    // if (messageProfile) return res.json(messageProfile.Message);
    return res.json([]);
  
});



module.exports = router;

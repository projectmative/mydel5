const express = require('express')
const app = express()
const mongoose=require('mongoose');
const users=require('./routes/api/users');
const admin=require('./routes/api/admin');
const dealer=require('./routes/api/dealer');
const bellman=require('./routes/api/bellman');
const message=require('./routes/api/Message');
const stripe1=require('./routes/api/stripe');


const bodyParser = require('body-parser');
const passport= require('passport');

var cors = require('cors');
const socketIO = require('socket.io');
var where = require('node-where');
const Message=require('./models/Message');
// var redis = require("redis");
// var client = redis.createClient();

const stripe = require('stripe')('sk_test_51HsM3hBMZbTVaUURfGrHSmDJZQMvUmbzeSA6c2x19DyWZ3J173C9NAfETgp88tKLcIhCkZ2k1pYWyryVmDr838nD00tlxzK7Ao');
//cors

const corsOptions = {
  Origin: "http://localhost:5000/",
  "Access-Control-Allow-Headers":
    "Origin, X-Requested-With, Content-Type, Accept"


};
app.use(cors(corsOptions))


/////////////////////////////////////Chats//////////////////////////
var http = require('http').createServer(app);
const {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom,
} = require('./routes/api/room');


const io = require('socket.io').listen(http);
io.origins('*:*')
const axios = require('axios');

// const client = redis.createClient();


  
io.on('connect', (socket) => {
  console.log("Connected");
  socket.on('join', ({ name, myroom, check, id }, callback) => {
    console.log("Join Room"+myroom);
    console.log("Room"+name);
    const { error, user } = addUser({ id: id, name, myroom, check });
    if (error) return callback(error);
    socket.join(myroom);
    // io.to(myroom).emit('roomData', {
    //   users: getUsersInRoom(myroom),
    // });

    callback();
  });
  socket.on('filemessage', (tuple, callback) => {
    const { room, msg  } = tuple
    console.log("File"+room)
    io.to(room).emit('showfile', {
      room: room,
   
      // {}
    });
    callback()
  })

  socket.on('sendMessage', (tuple, callback) => {
    const { myroom, msg, check, id, timeStamp,name } = tuple;
    let room = myroom;
    // if (!check) {
    //   room = myroom[0] + '' + myroom[1];
    // }

    try {
      let theUser = getUser(room, id);
      const text = msg;
      const user = name;
      const Message = { user, text, timeStamp };
      const config = { headers: { 'Content-Type': 'application/json' } };
      const body = JSON.stringify({ room, Message });
      axios.post(
        'http://localhost:5000/api/message/SendMessage',
        body,
        config
      );
      console.log(myroom+" sent")
      io.to(myroom).emit('showmessage', {
        room: room,
        user: name,
        text: msg,
        timeStamp: timeStamp,
        // {}
      });
      
    } catch (error) {}

    callback();
  });
  

  socket.on('disconnectuser', (tuple, callback) => {
    const { myroom, id, name } = tuple;
    removeUser(myroom, id);
    io.to(myroom).emit('roomData', {
      users: getUsersInRoom(myroom),
    });

    io.to(myroom).emit('message', {
      text: `${name} has left the Room.`,
    });
    callback();
  });
  socket.on('joinnot', ({ name }, callback) => {
   
    console.log("Room"+name);
    
 
    socket.join(name);
    // io.to(myroom).emit('roomData', {
    //   users: getUsersInRoom(myroom),
    // });

    callback();
  });

    socket.on('notify',(tuple,callback)=>{
        
       console.log("inroute")
        const { msg,timeStamp,email } = tuple;
        
        try {
         
          
          const text = msg;
          const room = email;
          const Message = { text, timeStamp };
          const config = { headers: { 'Content-Type': 'application/json' } };
          const body = JSON.stringify({ room, Message });
          console.log(body);
          axios.post(
            'http://localhost:5000/api/message/send',
            body,
            config
          );
          console.log(room+" sent")
        io.to(room).emit('shownot', {
          room: room,
           
          text: msg,
          timeStamp: timeStamp,
          // {}
        });
         
        } catch (error) { console.log(error)}
        

        callback();
    });
  

});





app.get('/getChannels',(req,res)=>res.json({channels: STATIC_CHANNELS}));






// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Passport middleware

app.use(passport.initialize());
const pass=require('./Config/passport')(passport);
// Passport Config
// require('./config/passport')(passport);
app.use('/uploads',express.static('./uploads'));

//db config
const db='mongodb+srv://mativeproject:mativeproject@cluster0.trszj.mongodb.net/test'
//connect mongodb
mongoose.connect(db).then(()=>console.log("Mongo db Connected"))
                    .catch(err=>console.log(err))
 
app.get('/', function (req, res) {
  res.send('Hello World ji')
})
 
http.listen(process.env.PORT ||5000,()=>console.log('Server Running'))

app.get('/data', function (req, res) {
  res.send('Hello World ji'+ req)
})
app.use('/api/users',users);
app.use('/api/admin',admin);
app.use('/api/dealer',dealer);
app.use('/api/bellman',bellman);
app.use('/api/message',message);
app.use('/api/stripe',stripe1);





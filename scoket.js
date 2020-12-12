const {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom,
} = require('./routes/api/room');
const { http } = require('./server');

const io = require('socket.io')(http);
io.set('origins', 'http://localhost:3000/');
const axios = require('axios');




  
io.on('connect', (socket) => {
  socket.on('join', ({ name, myroom, check, id }, callback) => {
    console.log("Room"+myroom);
    const { error, user } = addUser({ id: id, name, myroom, check });
    if (error) return callback(error);
    socket.join(user.room);
    io.to(myroom).emit('roomData', {
      users: getUsersInRoom(myroom),
    });

    callback();
  });

  socket.on('sendMessage', (tuple, callback) => {
    const { myroom, msg, check, id, timeStamp } = tuple;
    let room = myroom;
    // if (!check) {
    //   room = myroom[0] + '' + myroom[1];
    // }

    try {
      const theUser = getUser(room, id);
      const text = msg;
      const user = theUser.name;
      const Message = { user, text, timeStamp };
      const config = { headers: { 'Content-Type': 'application/json' } };
      const body = JSON.stringify({ room, Message });
      axios.post(
        'http://localhost:5000/api/message/SendMessage',
        body,
        config
      );
      io.to(theUser.room).emit('message', {
        room: theUser.room,
        user: theUser.name,
        text: msg,
        timeStamp: timeStamp,
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
});

module.exports = io;

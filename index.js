//setting up all the variables and dependencies

const express = require('express');
const app = express();
const path = require('path');
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const port = process.env.PORT || 3333;
const mathBot = require('./mathBot.js');
const listBot = require('./listBot.js');
let usersOnline = [];

//setting up the server
server.listen(port, () => {
  console.log('Server listening at port %d', port);
});
//pushing out the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));
//the message fucntion
let numUsers = 0;
io.on('connection', (socket) => {
  let addedUser = false;
  //when the client emits 'new message', this listens and executes
  socket.on('new message', (data) => {
    //low-effort spam filtering
    if(data === "" || data ===" " || data.toLowerCase() === 'a') return;
	  socket.broadcast.emit('new message', {
      username: socket.username,
      message: data
    });
    mathBot(data, socket); //function for the mathbot
    listBot(data, socket, usersOnline); //function for the listbot
  });
  //function when a new user joins
  socket.on('add user', (username) => {
    if (addedUser) return;
    //we store the username in the socket session for this client
    socket.username = username;
    usersOnline.push(username);
    console.log(usersOnline);
    ++numUsers;
    addedUser = true;
    socket.emit('login', {
      numUsers: numUsers
    });
    //broadcast that a person has connected
    socket.broadcast.emit('user joined', {
      username: socket.username,
      numUsers: numUsers
    });
  });
  //broadcast to people when someone is typing
    socket.on('typing', () => {
    socket.broadcast.emit('typing', {
      username: socket.username
    });
  });
  //when someone is no longer typing, we broadcast a 'stopped typing' that no longer shows the typing
  socket.on('stop typing', () => {
    socket.broadcast.emit('stop typing', {
      username: socket.username
    });
  });
  //function for when the user disconnects
  socket.on('disconnect', () => {
    if (addedUser) {
      --numUsers;
      for (let i = 0; i < usersOnline.length; i++) {
        if (usersOnline[i] == socket.username) {
          usersOnline.splice(i, 1);
          console.log(usersOnline);
        }
      }
      //broadcast that this client has left
      socket.broadcast.emit('user left', {
        username: socket.username,
        numUsers: numUsers
      });
    }
  });
});

/*
  hello there
  I see you are trying to view my code
  go ahead then, nothing's stopping you
*/
const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 4444;
let usersOnline = 0;
/*
const nicknamearray = ['nickname','user','fridge','stranger', 'home']
for later use, nick randomisation to avoid having to put in a prompt?
*/
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});
io.on('connection', function(socket){
  usersOnline++
  io.emit('chat message', 'Someone just entered the chat! Users online: ' + usersOnline)
  console.log(`a user connected, ${usersOnline} users online currently`);
  socket.on('disconnect', function(){
    usersOnline--
    io.emit('chat message', 'Someone has left the chat. Users online: ' + usersOnline)
    console.log(`a user disconnected, ${usersOnline} users online currently`);
  });
});
io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
});
http.listen(port, function(){
  console.log('listening on port ' + port);
});

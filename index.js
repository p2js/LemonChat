/*
  hello there
  I see you are trying to view my code
  go ahead then, nothing's stopping you
*/
//setup for all the dependencies  and constants
const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3333; //Change that number to change the port
const swearFilter = true; //Set this to false if you want swear filtering
let forbiddenWords;
if(swearFilter === true) {
forbiddenWords = require('./forbiddenWords.json') //credit to BasicCCP for his swear filter; https://github.com/basicCCP/swearFilter
}
let usersOnline = 0;
/*
const nicknamearray = ['nickname','user','fridge','stranger', 'home']
for later use, nick randomisation to avoid having to put in a prompt?
*/
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html'); //pushes out the index.html file to anyone that connects
});
io.on('connection', function(socket){ //when a user connects..
  usersOnline++;                      //add a user to the count
  if(usersOnline === 1) {
    io.emit('chat message', 'Welcome to lemonchat! You seem to be the only one here.') //special message if only one user is online
  } else io.emit('chat message', 'Someone just entered the chat! Users online: ' + usersOnline);
  console.log(`a user connected, ${usersOnline} users online currently`);
  socket.on('disconnect', function(){
    usersOnline--;
    if(usersOnline == 1) {
      io.emit('chat message', 'Someone has left the chat. You seem to be alone now.'); //special message if only one user is online
    } else {
      io.emit('chat message', 'Someone has left the chat. Users online: ' + usersOnline);
    };
    console.log(`a user disconnected, ${usersOnline} users online currently`);
  });
});
io.on('connection', function(socket){
  socket.on('chat message', function(msg){ //when the app detects a chat message from the html file...
  if(msg === "" || msg ===" " || msg.toLowerCase() === 'a') return; //A limiter to low-effort spam
    if(swearFilter === true) { //if the swear filter is enabled...
      let msgContent = msg.toLowerCase().split(" "); //split the message into an array (eg. "Hello world" into ["hello", "world"])
      let i; //make variable i
      for (i = 0; i < forbiddenWords.words.length; i++) { //repeat for each word in the file...
        if(msgContent.includes(forbiddenWords.words[i]) || msgContent.includes(forbiddenWords.words[i] + 's')) { //if the message contains any swear words...
          return; //don't send the message
        }}
        io.emit('chat message', msg); //push the message out to everyone
      }
      else {io.emit('chat message', msg);} //push the message out to everyone
  });
});
http.listen(port, function(){ //listen on the port defined at the top of the file
  console.log('listening on port ' + port);
});

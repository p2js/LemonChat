module.exports = function mathBot(data, socket, usersOnline) {
  if(data.startsWith('/list')) {
    socket.emit('new message', {
      username: 'listBot',
      message: usersOnline.join(", ")
    });
    socket.broadcast.emit('new message', {
      username: 'listBot',
      message: usersOnline.join(", ")
    })};
};

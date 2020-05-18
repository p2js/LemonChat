const math = require('mathjs')
module.exports = function mathBot(data, socket) {
  if(data.startsWith('/math')) {
    let mathOut = data.slice(6)
    if(!mathOut){
      mathOut = "There's supposed to be something after the /math command!"
    } else try {
      mathOut = math.evaluate(mathOut).toString()
      console.log("mathBot output: " + mathOut)
    } catch (error) {
      console.log("mathBot error: " + error)
      console.log("Attempted input: " + data)
      mathOut = error.toString()
    }
    socket.emit('new message', {
      username: 'mathBot',
      message: mathOut
    });
    socket.broadcast.emit('new message', {
      username: 'mathBot',
      message: mathOut
    })};
};

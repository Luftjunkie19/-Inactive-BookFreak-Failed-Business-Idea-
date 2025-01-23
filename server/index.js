const {Server} = require('socket.io');
const express = require('express');
const http = require('http');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  'cors': {
    'origin': '*', 'methods': ['GET', 'POST']
  },
  connectionStateRecovery: {
  }
});


io.on('connection', (socket) => {
  console.log('User connected', socket.id);

  socket.on('initiate-meeting', (data) => {
    console.log('Initiate meeting request received', data);
    
  });

  socket.on('message', (message) => { 
    console.log(message);
  })



});

server.listen(9000, () => { 
    console.log('listening on *:9000');
});
const { Server } = require('socket.io');
const express = require('express');
const http = require('http');
const { v4: uuidv4 } = require('uuid');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    'cors': {
        'origin': '*',
        'methods': ['GET', 'POST']
    },
    connectionStateRecovery: {}
});

const meetings = {}; // Store meeting participants


io.on('connection', (socket) => {
  console.log('User connected', socket.id);
  
  socket.on('initiate-meeting', (data) => {
    socket.to(data.peerId).emit('initiate-meeting', { peerId: socket.id });
 
  });

});


server.listen(9000, () => {
    console.log('listening on *:9000');
});

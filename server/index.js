const {Server} = require('socket.io');
const express = require('express');
const http = require('http');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { 'cors': { 'origin': '*', 'methods': ['GET', 'POST'] } });


io.on('connection', (socket) => {
  console.log('User connected', socket.id);

  // // Handle meeting creation
  // socket.on('create-meeting', (meetingId) => {
  //   socket.join(meetingId);
  //   io.to(meetingId).emit('meeting-created', { meetingId });
  // });

  // // Handle joining a meeting
  // socket.on('join-meeting', (meetingId) => {
  //   socket.join(meetingId);
  //   io.to(meetingId).emit('user-joined', { userId: socket.id });
  // });

  // // Handle calling a user
  // socket.on('call-user', ({ targetId, from }) => {
  //   io.to(targetId).emit('incoming-call', { from });
  // });


  socket.on('message', (message) => { 
    console.log(message);
  })



});

server.listen(9000, () => { 
    console.log('listening on *:9000');
});
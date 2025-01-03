const { Server } = require('socket.io');

const io = new Server(server); // Use your server instance

io.on('connection', (socket) => {
  console.log('User connected', socket.id);

  // Handle meeting creation
  socket.on('create-meeting', (meetingId) => {
    socket.join(meetingId);
    io.to(meetingId).emit('meeting-created', { meetingId });
  });

  // Handle joining a meeting
  socket.on('join-meeting', (meetingId) => {
    socket.join(meetingId);
    io.to(meetingId).emit('user-joined', { userId: socket.id });
  });

  // Handle calling a user
  socket.on('call-user', ({ targetId, from }) => {
    io.to(targetId).emit('incoming-call', { from });
  });
});

module.exports = io;
import { io, server } from './config/app';
import { NodeCache } from './config/cache';
import { config } from './config/env';
import { handleMessages } from './routes/socketio';

const cache = new NodeCache(3600);
const users = {};

const socketToRoom = {};

const maximum = process.env.MAXIMUM || 4;

io.on('connection', (socket) => {
  socket.on('message', async (message) => {
    await handleMessages(socket, message, cache);
  });

  socket.on('join_room', (data) => {
    if (users[data.room]) {
      const length = users[data.room].length;
      if (length === maximum) {
        socket.to(socket.id).emit('room_full');
        return;
      }
      users[data.room].push({ id: socket.id, email: data.email });
    } else {
      users[data.room] = [{ id: socket.id, email: data.email }];
    }
    socketToRoom[socket.id] = data.room;

    socket.join(data.room);
    console.log(`[${socketToRoom[socket.id]}]: ${socket.id} enter`);

    const usersInThisRoom = users[data.room].filter(
      (user) => user.id !== socket.id,
    );

    console.log(users[data.room], 'IN ROOM');

    io.sockets.to(socket.id).emit('all_users', usersInThisRoom);
  });

  socket.on('offer', (data) => {
    //console.log(data.sdp);
    socket.to(data.offerReceiveID).emit('getOffer', {
      sdp: data.sdp,
      offerSendID: data.offerSendID,
      offerSendEmail: data.offerSendEmail,
    });
  });

  socket.on('answer', (data) => {
    //console.log(data.sdp);
    socket
      .to(data.answerReceiveID)
      .emit('getAnswer', { sdp: data.sdp, answerSendID: data.answerSendID });
  });

  socket.on('candidate', (data) => {
    //console.log(data.candidate);
    socket.to(data.candidateReceiveID).emit('getCandidate', {
      candidate: data.candidate,
      candidateSendID: data.candidateSendID,
    });
  });

  socket.on('user_exit', () => {
    console.log(`[${socketToRoom[socket.id]}]: ${socket.id} exit`);
    const roomID = socketToRoom[socket.id];
    let room = users[roomID];
    if (room) {
      room = room.filter((user) => user.id !== socket.id);
      users[roomID] = room;
      if (room.length === 0) {
        delete users[roomID];
        return;
      }
    }
    socket.to(roomID).emit('user_exit', { id: socket.id });
    console.log(users);
  });

  socket.on('disconnect', () => {
    console.log(`[${socketToRoom[socket.id]}]: ${socket.id} exit`);
    const roomID = socketToRoom[socket.id];
    let room = users[roomID];
    if (room) {
      room = room.filter((user) => user.id !== socket.id);
      users[roomID] = room;
      if (room.length === 0) {
        delete users[roomID];
        return;
      }
    }
    socket.to(roomID).emit('user_exit', { id: socket.id });
    console.log(users);
  });

  // socket.on('disconnect', () => {
  //   socket.removeAllListeners();
  // });
});

server.listen(config.port || 8080, () => {
  console.log(`Server is running on port ${config.port || 8080}`);
});

// io.listen(4000);

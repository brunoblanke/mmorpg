import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';

const app = express();
const server = createServer(app);
const io = new Server(server);

app.use(express.static('public')); // HTML e engine ficam aqui

const players = {};

io.on('connection', socket => {
  players[socket.id] = { x: 5, y: 5 };
  socket.emit('init', players);
  socket.broadcast.emit('new-player', { id: socket.id, ...players[socket.id] });

  socket.on('move', data => {
    players[socket.id] = data;
    socket.broadcast.emit('player-moved', { id: socket.id, ...data });
  });

  socket.on('disconnect', () => {
    delete players[socket.id];
    socket.broadcast.emit('player-left', socket.id);
  });
});

server.listen(3000, () => {
  console.log('✅ Socket.IO rodando em http://localhost:3000');
});

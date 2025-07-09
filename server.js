const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public'));

let players = {};

io.on('connection', (socket) => {
  console.log(`Novo jogador: ${socket.id}`);
  players[socket.id] = { x: 25, y: 25 };

  socket.emit('init', { id: socket.id, players });

  socket.broadcast.emit('newPlayer', {
    id: socket.id,
    pos: players[socket.id]
  });

  socket.on('move', (pos) => {
    players[socket.id] = pos;
    socket.broadcast.emit('playerMoved', { id: socket.id, pos });
  });

  socket.on('disconnect', () => {
    delete players[socket.id];
    io.emit('playerLeft', socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

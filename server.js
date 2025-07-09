const express = require('express');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server); // cria instancia Socket.IO

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 🔌 Escuta conexões WebSocket
io.on('connection', (socket) => {
  console.log('Novo jogador conectado:', socket.id);

  socket.on('move', (pos) => {
    socket.broadcast.emit('playerMoved', { id: socket.id, pos });
  });

  socket.on('disconnect', () => {
    socket.broadcast.emit('playerDisconnected', socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});

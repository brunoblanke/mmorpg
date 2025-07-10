// server.js
const express = require('express');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve arquivos estáticos da raiz do projeto
app.use(express.static(__dirname));

// Rota principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Eventos do socket
io.on('connection', (socket) => {
  console.log(`Conectado: ${socket.id}`);

  socket.on('move', (pos) => {
    socket.broadcast.emit('playerMoved', { id: socket.id, pos });
  });

  socket.on('disconnect', () => {
    socket.broadcast.emit('playerDisconnected', socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

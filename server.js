const express = require('express');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve os arquivos estáticos da raiz do projeto (index.html, style.css, engine/)
app.use(express.static(__dirname));

// Rota principal (opcional, já é resolvida via arquivos estáticos)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Eventos do Socket.IO
io.on('connection', (socket) => {
  console.log(`🟢 Cliente conectado: ${socket.id}`);

  // Recebe posição do jogador e transmite para os outros
  socket.on('move', (pos) => {
    console.log(`📍 Movimento recebido de ${socket.id}:`, pos);
    socket.broadcast.emit('playerMoved', { id: socket.id, pos });
  });

  // Ao desconectar, informa aos outros
  socket.on('disconnect', () => {
    console.log(`🔴 Cliente desconectado: ${socket.id}`);
    socket.broadcast.emit('playerDisconnected', socket.id);
  });
});

// Inicializa o servidor na porta 3000 (ou porta definida via variável de ambiente)
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});

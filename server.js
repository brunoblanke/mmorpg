const express = require('express');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(__dirname));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// 💀 Estado global dos inimigos
let sharedEnemies = [
  {
    id: 'Ogro', x: 10, y: 8, health: 100, maxHealth: 100,
    level: 5, xp: 50, atk: 9, def: 6, spd: 3
  },
  {
    id: 'Goblin', x: 15, y: 12, health: 80, maxHealth: 80,
    level: 3, xp: 30, atk: 6, def: 4, spd: 4
  }
];

// ✅ Movimento simples dos inimigos (servidor centralizado)
function updateEnemies() {
  for (const e of sharedEnemies) {
    const dx = Math.floor(Math.random() * 3) - 1;
    const dy = Math.floor(Math.random() * 3) - 1;
    e.x = Math.max(0, Math.min(49, e.x + dx));
    e.y = Math.max(0, Math.min(49, e.y + dy));
  }
  io.emit('enemiesUpdated', sharedEnemies);
}

setInterval(updateEnemies, 800);

// 📡 Conexão com jogadores
io.on('connection', (socket) => {
  console.log(`🟢 ${socket.id} conectado`);

  // Envia estado inicial dos inimigos
  socket.emit('initState', {
    enemies: sharedEnemies
  });

  // Recebe movimentação do jogador
  socket.on('move', (pos) => {
    socket.broadcast.emit('playerMoved', { id: socket.id, pos });
  });

  // Desconexão
  socket.on('disconnect', () => {
    console.log(`🔴 ${socket.id} desconectado`);
    socket.broadcast.emit('playerDisconnected', socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});

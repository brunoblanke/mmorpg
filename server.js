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

// 💾 Estado dos jogadores e inimigos
let playerStates = {}; // { socket.id: { x, y } }
let sharedEnemies = [
  {
    id: 'Ogro', x: 10, y: 8,
    health: 100, maxHealth: 100,
    level: 5, xp: 50,
    atk: 9, def: 6, spd: 3
  },
  {
    id: 'Goblin', x: 15, y: 12,
    health: 80, maxHealth: 80,
    level: 3, xp: 30,
    atk: 6, def: 4, spd: 4
  }
];

// 👁️ Busca jogador mais próximo
function getClosestPlayer(enemy) {
  let closest = null;
  let minDist = Infinity;
  for (const pos of Object.values(playerStates)) {
    const dist = Math.abs(pos.x - enemy.x) + Math.abs(pos.y - enemy.y);
    if (dist < minDist) {
      minDist = dist;
      closest = pos;
    }
  }
  return (minDist <= 5) ? closest : null;
}

// 🧠 IA dos inimigos com respeito à colisão com jogadores
function updateEnemies() {
  for (const e of sharedEnemies) {
    const target = getClosestPlayer(e);

    if (target) {
      const dx = Math.sign(target.x - e.x);
      const dy = Math.sign(target.y - e.y);
      const nx = e.x + dx;
      const ny = e.y + dy;

      const occupied = Object.values(playerStates).some(p => p.x === nx && p.y === ny);

      if (!occupied) {
        e.x = Math.max(0, Math.min(49, nx));
        e.y = Math.max(0, Math.min(49, ny));
      }
    } else {
      const dx = Math.floor(Math.random() * 3) - 1;
      const dy = Math.floor(Math.random() * 3) - 1;
      e.x = Math.max(0, Math.min(49, e.x + dx));
      e.y = Math.max(0, Math.min(49, e.y + dy));
    }
  }

  io.emit('enemiesUpdated', sharedEnemies);
}

setInterval(updateEnemies, 800);

// 📡 Conexão via socket
io.on('connection', (socket) => {
  console.log(`🟢 ${socket.id} conectado`);

  // Envia estado inicial
  socket.emit('initState', { enemies: sharedEnemies });

  // Salva estado do jogador
  socket.on('move', (pos) => {
    playerStates[socket.id] = pos;
    socket.broadcast.emit('playerMoved', { id: socket.id, pos });
  });

  // Remoção ao desconectar
  socket.on('disconnect', () => {
    delete playerStates[socket.id];
    socket.broadcast.emit('playerDisconnected', socket.id);
    console.log(`🔴 ${socket.id} desconectado`);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});

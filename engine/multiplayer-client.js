import { io } from "https://cdn.socket.io/4.7.2/socket.io.esm.min.js";
import { player, enemies } from './canvas-config.js';

export const socket = io();
export const otherPlayers = {};

// 📌 Envia posição inicial ao conectar
socket.on('connect', () => {
  console.log('✅ Conectado como:', socket.id);
  socket.emit('move', { x: player.x, y: player.y });
});

socket.on('disconnect', () => {
  console.log('🚫 Desconectado.');
});

// 🎮 Atualiza jogadores remotos
socket.on('playerMoved', ({ id, pos }) => {
  if (id !== socket.id) {
    otherPlayers[id] = pos;
  }
});

socket.on('playerDisconnected', (id) => {
  delete otherPlayers[id];
});

// 💀 Recebe estado inicial dos inimigos
socket.on('initState', (data) => {
  enemies.length = 0;
  for (const enemy of data.enemies) {
    enemies.push({ ...enemy });
  }
});

// 🔄 Atualiza inimigos sincronizados
socket.on('enemiesUpdated', (updatedEnemies) => {
  enemies.length = 0;
  for (const e of updatedEnemies) {
    enemies.push({ ...e });
  }
});

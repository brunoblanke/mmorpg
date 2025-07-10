import { io } from "https://cdn.socket.io/4.7.2/socket.io.esm.min.js";
import { player, enemies } from './canvas-config.js';

export const socket = io();
export const otherPlayers = {};

// ✅ Informa ao servidor a posição inicial logo ao conectar
socket.on('connect', () => {
  console.log('✅ Conectado como', socket.id);
  socket.emit('move', { x: player.x, y: player.y }); // envia posição inicial
});

socket.on('disconnect', () => {
  console.log('🚫 Desconectado do servidor.');
});

// 🧍 Atualiza lista de jogadores remotos
socket.on('playerMoved', ({ id, pos }) => {
  if (id !== socket.id) {
    otherPlayers[id] = pos;
  }
});

socket.on('playerDisconnected', (id) => {
  delete otherPlayers[id];
});

// 💀 Estado inicial dos inimigos ao conectar
socket.on('initState', (data) => {
  enemies.length = 0;
  for (const enemy of data.enemies) {
    enemies.push({ ...enemy });
  }
});

// 🔁 Sincroniza inimigos periodicamente
socket.on('enemiesUpdated', (updatedEnemies) => {
  enemies.length = 0;
  for (const e of updatedEnemies) {
    enemies.push({ ...e });
  }
});

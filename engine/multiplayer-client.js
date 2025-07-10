import { io } from "https://cdn.socket.io/4.7.2/socket.io.esm.min.js";
import { player, enemies } from './canvas-config.js';

export const socket = io();
export const otherPlayers = {};

socket.on('connect', () => {
  console.log('✅ Conectado como:', socket.id);
  socket.emit('move', { x: player.x, y: player.y }); // envia posição inicial
});

socket.on('disconnect', () => {
  console.log('🚫 Desconectado.');
});

socket.on('playerMoved', ({ id, pos }) => {
  if (id !== socket.id) {
    otherPlayers[id] = pos;
  }
});

socket.on('playerDisconnected', (id) => {
  delete otherPlayers[id];
});

socket.on('initState', (data) => {
  enemies.length = 0;
  for (const enemy of data.enemies) {
    enemies.push({ ...enemy });
  }
});

socket.on('enemiesUpdated', (updatedEnemies) => {
  enemies.length = 0;
  for (const e of updatedEnemies) {
    enemies.push({ ...e });
  }
});

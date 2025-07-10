// engine/multiplayer-client.js
import { io } from "https://cdn.socket.io/4.7.2/socket.io.esm.min.js";
import { player } from './canvas-config.js';
import { enemies } from './canvas-config.js';

export const socket = io(); // conecta ao servidor
export const otherPlayers = {}; // lista de jogadores remotos

// Sincroniza inimigos recebidos do servidor
socket.on('enemiesUpdated', (updatedEnemies) => {
  for (let i = 0; i < enemies.length; i++) {
    enemies[i].x = updatedEnemies[i].x;
    enemies[i].y = updatedEnemies[i].y;
  }
});

// Recebe movimentação de outros jogadores
socket.on('playerMoved', ({ id, pos }) => {
  if (id !== socket.id) {
    otherPlayers[id] = pos;
  }
});

// Remove jogador remoto
socket.on('playerDisconnected', (id) => {
  delete otherPlayers[id];
});

// Recebe estado inicial ao conectar
socket.on('initState', (data) => {
  for (let i = 0; i < data.enemies.length; i++) {
    enemies[i].x = data.enemies[i].x;
    enemies[i].y = data.enemies[i].y;
  }
});

// Debug
socket.on('connect', () => {
  console.log('✅ Conectado como', socket.id);
});

socket.on('disconnect', () => {
  console.log('🚫 Desconectado do servidor');
});

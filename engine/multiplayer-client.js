import { io } from "https://cdn.socket.io/4.7.2/socket.io.esm.min.js";
import { player, enemies } from './canvas-config.js';

export const socket = io(); // conecta ao servidor
export const otherPlayers = {}; // jogadores remotos

// 🎮 Recebe o estado inicial do servidor
socket.on('initState', (data) => {
  enemies.length = 0; // limpa lista atual
  for (const enemy of data.enemies) {
    enemies.push({ ...enemy }); // recria os inimigos conforme dados recebidos
  }
});

// 🔄 Atualiza posição dos inimigos periodicamente
socket.on('enemiesUpdated', (updatedEnemies) => {
  enemies.length = 0; // sobrescreve lista local
  for (const data of updatedEnemies) {
    enemies.push({ ...data }); // preserva propriedades via clone
  }
});

// 🧍 Atualiza posição dos jogadores remotos
socket.on('playerMoved', ({ id, pos }) => {
  if (id !== socket.id) {
    otherPlayers[id] = pos;
  }
});

// ❌ Remove jogador desconectado da lista
socket.on('playerDisconnected', (id) => {
  delete otherPlayers[id];
});

// 📡 Logs para depuração
socket.on('connect', () => {
  console.log('✅ Conectado ao servidor como:', socket.id);
});

socket.on('disconnect', () => {
  console.log('🚫 Desconectado do servidor.');
});

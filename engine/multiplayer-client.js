// engine/multiplayer-client.js
import { io } from "https://cdn.socket.io/4.7.2/socket.io.esm.min.js";
import { player } from './canvas-config.js';

export const socket = io(); // conecta ao servidor
export const otherPlayers = {}; // jogadores remotos

// Evita sobrescrever a posição do próprio jogador
socket.on('playerMoved', ({ id, pos }) => {
  if (id !== socket.id) {
    otherPlayers[id] = pos;
  }
});

// Remove jogador remoto da lista quando desconectar
socket.on('playerDisconnected', (id) => {
  delete otherPlayers[id];
});

// Log útil para depuração
socket.on('connect', () => {
  console.log('✅ Conectado ao servidor como:', socket.id);
});

socket.on('disconnect', () => {
  console.log('🚫 Desconectado do servidor.');
});

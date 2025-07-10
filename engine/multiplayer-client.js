// engine/multiplayer-client.js
import { io } from "https://cdn.socket.io/4.7.2/socket.io.esm.min.js";
import { player } from './canvas-config.js';

export const socket = io();
export const otherPlayers = {};

socket.on('playerMoved', ({ id, pos }) => {
  otherPlayers[id] = pos;
});

socket.on('playerDisconnected', (id) => {
  delete otherPlayers[id];
});

export const socket = io();
console.log('Socket conectado!', socket.id);

socket.on('playerMoved', ({ id, pos }) => {
  console.log(`Jogador remoto ${id} se moveu para`, pos);
  otherPlayers[id] = pos;
});
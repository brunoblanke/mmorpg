// engine/multiplayer-client.js
import { io } from 'socket.io-client';
import { player } from './canvas-config.js';

export const socket = io();
export const otherPlayers = {};

socket.on('playerMoved', ({ id, pos }) => {
  otherPlayers[id] = pos;
});

socket.on('playerDisconnected', (id) => {
  delete otherPlayers[id];
});

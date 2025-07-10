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

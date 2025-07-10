import { player } from './canvas-config.js';

export const otherPlayers = {};

const socket = io();

socket.on('init', data => {
  for (const id in data) {
    if (id !== socket.id) {
      otherPlayers[id] = data[id];
    }
  }
});

socket.on('new-player', data => {
  otherPlayers[data.id] = { x: data.x, y: data.y };
});

socket.on('player-moved', data => {
  if (otherPlayers[data.id]) {
    otherPlayers[data.id].x = data.x;
    otherPlayers[data.id].y = data.y;
  }
});

socket.on('player-left', id => {
  delete otherPlayers[id];
});

export function emitPlayerPosition() {
  socket.emit('move', { x: player.x, y: player.y });
}

import { player, canvas, camera, tileSize, walls, enemies } from './canvas-config.js';
import { socket } from './multiplayer-client.js';

export function tryMove(entity, dx, dy) {
  const nx = entity.x + dx;
  const ny = entity.y + dy;

  const blocked =
    nx < 0 || ny < 0 || nx >= 50 || ny >= 50 ||
    walls.some(w => w.x === nx && w.y === ny) ||
    enemies.some(e => e.x === nx && e.y === ny) ||
    (entity !== player && player.x === nx && player.y === ny);

  if (blocked) return false;

  entity.x = nx;
  entity.y = ny;

  if (entity === player) {
    socket.emit('move', { x: player.x, y: player.y });
  }

  return true;
}

export function handleDirectionalInput(dx, dy) {
  tryMove(player, dx, dy);
}

export function updatePlayerMovement() {
  // sem lógica interpolada, apenas placeholder
}

export function updateCamera() {
  camera.x = player.x * tileSize - canvas.width / 2 + tileSize / 2;
  camera.y = player.y * tileSize - canvas.height / 2 + tileSize / 2;
}

import { player, canvas, camera, tileSize, walls, enemies, destination } from './canvas-config.js';
import { findPath } from './pathfinding.js';
import { socket } from './multiplayer-client.js';

export let activePath = [];

function isBlocked(x, y) {
  return walls.some(w => w.x === x && w.y === y) ||
         enemies.some(e => e.x === x && e.y === y);
}

export function tryMoveTo(tile) {
  if (isBlocked(tile.x, tile.y)) return;
  const path = findPath({ x: player.x, y: player.y }, tile);
  activePath = path.slice(1); // ignora posição atual
}

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

export function handleClickDestination(tx, ty) {
  destination = { x: tx, y: ty };
  tryMoveTo({ x: tx, y: ty });
}

export function handleDirectionalInput(dx, dy) {
  tryMove(player, dx, dy);
}

export function updatePlayerMovement() {
  for (let i = 0; i < (player.spd || 1); i++) {
    if (activePath.length > 0) {
      const next = activePath.shift();
      if (!isBlocked(next.x, next.y)) {
        player.x = next.x;
        player.y = next.y;
        socket.emit('move', { x: player.x, y: player.y });
      } else {
        activePath = [];
        break;
      }
    }
  }
}

export function updateCamera() {
  camera.x = player.x * tileSize - canvas.width / 2 + tileSize / 2;
  camera.y = player.y * tileSize - canvas.height / 2 + tileSize / 2;
}

import { canvas, player, tileSize, camera, enemies, walls } from './canvas-config.js';
import { findPath } from './pathfinding.js';

let movementQueue = [];
let movementCooldown = 0;

export function handleClickDestination(tx, ty) {
  // valida destino
  const blocked =
    walls.some(w => w.x === tx && w.y === ty) ||
    enemies.some(e => e.x === tx && e.y === ty);

  if (blocked) {
    movementQueue = [];
    return;
  }

  movementQueue = findPath({ x: player.x, y: player.y }, { x: tx, y: ty });
}

export function updatePlayerMovement() {
  if (movementCooldown > 0) {
    movementCooldown--;
    return;
  }

  if (movementQueue.length > 0) {
    const next = movementQueue.shift();
    const dx = next.x - player.x;
    const dy = next.y - player.y;

    if (tryMove(player, dx, dy)) {
      movementCooldown = 8; // frames entre passos
    } else {
      movementQueue = []; // bloqueado
    }
  }
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
  return true;
}

export function handleDirectionalInput(dx, dy) {
  movementQueue = [];
  tryMove(player, dx, dy);
}

export function updateCamera() {
  camera.x = player.x * tileSize - canvas.width / 2 + tileSize / 2;
  camera.y = player.y * tileSize - canvas.height / 2 + tileSize / 2;
}

export const __movementQueue__ = movementQueue;
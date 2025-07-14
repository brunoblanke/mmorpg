import { canvas, player, tileSize, camera, enemies, walls } from './canvas-config.js';
import { findPath } from './pathfinding.js';

let movementQueue = [];
let movementCooldown = 0;
let keyHeld = null;
let currentTarget = null;

export const __movementQueue__ = movementQueue;

export function handleClickDestination(tx, ty) {
  const blocked =
    walls.some(w => w.x === tx && w.y === ty) ||
    enemies.some(e => e.x === tx && e.y === ty);

  if (blocked) {
    movementQueue = [];
    return;
  }

  movementQueue = findPath({ x: player.x, y: player.y }, { x: tx, y: ty });
  currentTarget = { x: tx, y: ty };
  keyHeld = null;
}

export function handleDirectionalInput(dx, dy) {
  movementQueue = [];
  currentTarget = null;
  keyHeld = { dx, dy };
}

export function releaseInput() {
  keyHeld = null;
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
      movementCooldown = getEntityCooldown(player);
    } else if (currentTarget) {
      // recalcula rota se o tile estiver bloqueado
      movementQueue = findPath({ x: player.x, y: player.y }, currentTarget);
    }

    if (movementQueue.length === 0) {
      keyHeld = null;
    }

    return;
  }

  if (keyHeld) {
    const { dx, dy } = keyHeld;
    if (tryMove(player, dx, dy)) {
      movementCooldown = getEntityCooldown(player);
    } else {
      keyHeld = null;
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

export function getEntityCooldown(entity) {
  const base = 12;
  return Math.max(2, base - entity.spd);
}

export function updateCamera() {
  camera.x = player.x * tileSize - canvas.width / 2 + tileSize / 2;
  camera.y = player.y * tileSize - canvas.height / 2 + tileSize / 2;
}

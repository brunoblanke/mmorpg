import { canvas, player, tileSize, camera, enemies, walls } from './canvas-config.js';
import { findPath } from './pathfinding.js';

export function tryMoveTo(targetTile) {
  const path = findPath({ x: player.x, y: player.y }, targetTile);
  if (path.length > 1) {
    const final = path.at(-1);
    player.x = final.x;
    player.y = final.y;
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

export function handleClickDestination(tx, ty) {
  tryMoveTo({ x: tx, y: ty });
}

export function handleDirectionalInput(dx, dy) {
  tryMove(player, dx, dy);
}

export function updatePlayerMovement() {
  // movimento instantâneo
}

export function updateCamera() {
  camera.x = player.x * tileSize - canvas.width / 2 + tileSize / 2;
  camera.y = player.y * tileSize - canvas.height / 2 + tileSize / 2;
}

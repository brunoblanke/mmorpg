import { player, enemies, walls, lerp, canvas, camera, tileSize } from './canvas-config.js';

export function tryMove(entity, dx, dy) {
  const nx = entity.x + dx;
  const ny = entity.y + dy;

  const blocked =
    walls.some(w => w.x === nx && w.y === ny) ||
    enemies.some(e => e !== entity && e.x === nx && e.y === ny) ||
    (entity !== player && player.x === nx && player.y === ny);

  if (nx >= 0 && ny >= 0 && nx < 50 && ny < 50 && !blocked) {
    entity.x = nx;
    entity.y = ny;
    entity.animationProgress = 0;
    return true;
  }

  return false;
}

export function updatePlayerMovement() {
  if (!player.destination) return;

  const dx = player.destination.x - player.x;
  const dy = player.destination.y - player.y;

  const stepX = dx > 0 ? 1 : dx < 0 ? -1 : 0;
  const stepY = dy > 0 ? 1 : dy < 0 ? -1 : 0;

  let moved = false;

  if (Math.abs(dx) > Math.abs(dy)) {
    moved = tryMove(player, stepX, 0) || tryMove(player, 0, stepY);
  } else {
    moved = tryMove(player, 0, stepY) || tryMove(player, stepX, 0);
  }

  if (!moved && stepX !== 0 && stepY !== 0) {
    tryMove(player, stepX, stepY);
  }

  if (player.x === player.destination.x && player.y === player.destination.y) {
    player.destination = null;
  }
}

export function updateEntityAnimation(entity) {
  if (entity.animationProgress < 1) {
    const delta = 1 / (entity.speed / 16);
    entity.animationProgress += delta;
    entity.posX = lerp(entity.posX, entity.x, entity.animationProgress);
    entity.posY = lerp(entity.posY, entity.y, entity.animationProgress);
  } else {
    entity.posX = entity.x;
    entity.posY = entity.y;
  }
}

export function updateCamera() {
  camera.x = player.posX * tileSize - canvas.width / 2 + tileSize / 2;
  camera.y = player.posY * tileSize - canvas.height / 2 + tileSize / 2;
}

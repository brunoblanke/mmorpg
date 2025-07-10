import { player, enemies, walls, lerp, canvas, camera, tileSize } from './canvas-config.js';

let movementStartTime = 0;
let isMoving = false;
let currentStep = null;

export function tryMove(entity, dx, dy) {
  const nx = entity.x + dx;
  const ny = entity.y + dy;

  const blocked =
    walls.some(w => w.x === nx && w.y === ny) ||
    enemies.some(e => e.x === nx && e.y === ny) ||
    (entity === player && enemies.some(e => e.x === nx && e.y === ny)) ||
    (entity !== player && player.x === nx && player.y === ny);

  const dentroDosLimites = nx >= 0 && ny >= 0 && nx < 50 && ny < 50;

  if (!blocked && dentroDosLimites) {
    currentStep = { fromX: entity.x, fromY: entity.y, toX: nx, toY: ny };
    movementStartTime = performance.now();
    isMoving = true;
    entity.animationProgress = 0;
    return true;
  }

  return false;
}

export function updatePlayerMovement() {
  if (!isMoving || !currentStep) return;

  const elapsed = performance.now() - movementStartTime;
  const t = Math.min(elapsed / player.speed, 1);

  player.posX = lerp(currentStep.fromX, currentStep.toX, t);
  player.posY = lerp(currentStep.fromY, currentStep.toY, t);

  if (t >= 1) {
    player.x = currentStep.toX;
    player.y = currentStep.toY;
    player.posX = player.x;
    player.posY = player.y;
    currentStep = null;
    isMoving = false;
  }
}

export function handleDirectionalInput(dx, dy) {
  player.destination = null; // cancela clique anterior

  if (isMoving) return;

  const moved = tryMove(player, dx, dy);
  if (!moved) {
    currentStep = null;
    isMoving = false;
  }
}

export function handleClickDestination(tx, ty) {
  player.destination = { x: tx, y: ty };
  currentStep = null;
  isMoving = false;

  const dx = tx - player.x;
  const dy = ty - player.y;

  if (dx !== 0 || dy !== 0) {
    const stepX = dx > 0 ? 1 : dx < 0 ? -1 : 0;
    const stepY = dy > 0 ? 1 : dy < 0 ? -1 : 0;

    let moved = false;

    if (Math.abs(dx) > Math.abs(dy)) {
      moved = tryMove(player, stepX, 0) || tryMove(player, 0, stepY);
    } else {
      moved = tryMove(player, 0, stepY) || tryMove(player, stepX, 0);
    }

    if (!moved) {
      currentStep = null;
      isMoving = false;
    }
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

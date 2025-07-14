import { player, walls, enemies } from './canvas-config.js';
import { tileSize, gridSize } from './canvas-config.js';

export const __movementQueue__ = [];

export function handleClickDestination(tx, ty) {
  player.target = { x: tx, y: ty };
  player.targetEnemy = null;
  __movementQueue__.length = 0;
  __movementQueue__.push({ x: tx, y: ty });
}

export function handleDirectionalInput(dx, dy) {
  const nx = player.x + dx;
  const ny = player.y + dy;

  if (!isBlocked(nx, ny)) {
    player.x = nx;
    player.y = ny;
  }

  player.target = null;
  __movementQueue__.length = 0;
}

export function releaseInput() {
  // usado para animação futura
}

export function updatePlayerMovement() {
  if (player.targetEnemy && !player.targetEnemy.dead) {
    const tx = player.targetEnemy.x;
    const ty = player.targetEnemy.y;

    // Se já está colado, não move
    if (Math.abs(tx - player.x) + Math.abs(ty - player.y) <= 1) {
      __movementQueue__.length = 0;
      return;
    }

    // Move em direção ao inimigo
    const dx = Math.sign(tx - player.x);
    const dy = Math.sign(ty - player.y);

    const nx = player.x + dx;
    const ny = player.y + dy;

    if (!isBlocked(nx, ny)) {
      player.x = nx;
      player.y = ny;
    }
    __movementQueue__.length = 0;
    __movementQueue__.push({ x: tx, y: ty });
    return;
  }

  // Movimento para destino clicado
  if (player.target) {
    const dx = Math.sign(player.target.x - player.x);
    const dy = Math.sign(player.target.y - player.y);
    const nx = player.x + dx;
    const ny = player.y + dy;

    if (!isBlocked(nx, ny)) {
      player.x = nx;
      player.y = ny;
    }

    if (nx === player.target.x && ny === player.target.y) {
      player.target = null;
    }
  }
}

function isBlocked(x, y) {
  if (
    x < 0 || x >= gridSize || y < 0 || y >= gridSize ||
    walls.some(w => w.x === x && w.y === y) ||
    enemies.some(e => e.x === x && e.y === y && !e.dead)
  ) {
    return true;
  }
  return false;
}

export function getEntityCooldown(entity) {
  return Math.max(10, 60 - entity.spd * 5);
}

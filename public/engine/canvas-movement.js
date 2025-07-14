import { player, walls, enemies, camera, canvas } from './canvas-config.js';
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
  player.targetEnemy = null;
  __movementQueue__.length = 0;
}

export function releaseInput() {
  // reservado pra futura animação ou movimento suave
}

export function updatePlayerMovement() {
  // 🔍 Perseguindo inimigo clicado
  if (player.targetEnemy && !player.targetEnemy.dead) {
    const tx = player.targetEnemy.x;
    const ty = player.targetEnemy.y;

    if (Math.abs(tx - player.x) + Math.abs(ty - player.y) <= 1) {
      __movementQueue__.length = 0;
      return;
    }

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

  // 👣 Caminhando até destino clicado
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

// 🛡️ Checagem de obstáculos
function isBlocked(x, y) {
  return (
    x < 0 || x >= gridSize || y < 0 || y >= gridSize ||
    walls.some(w => w.x === x && w.y === y) ||
    enemies.some(e => e.x === x && e.y === y && !e.dead) ||
    (player.x === x && player.y === y)
  );
}

// ⚙️ Exporta para uso por inimigos
export function tryMove(entity, dx, dy) {
  const nx = entity.x + dx;
  const ny = entity.y + dy;

  if (
    nx < 0 || nx >= gridSize || ny < 0 || ny >= gridSize ||
    walls.some(w => w.x === nx && w.y === ny) ||
    enemies.some(e => e !== entity && e.x === nx && e.y === ny && !e.dead) ||
    (player.x === nx && player.y === ny)
  ) {
    return false;
  }

  entity.x = nx;
  entity.y = ny;
  return true;
}

// 🕒 Cooldown baseado na velocidade
export function getEntityCooldown(entity) {
  return Math.max(10, 60 - entity.spd * 5);
}

// 🧭 Centraliza câmera no jogador
export function updateCamera() {
  camera.x = player.x * tileSize - canvas.width / 2 + tileSize / 2;
  camera.y = player.y * tileSize - canvas.height / 2 + tileSize / 2;
}

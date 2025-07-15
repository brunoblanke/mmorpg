import { enemies, player } from './canvas-config.js';
import { isBlocked, getEntityCooldown, tryMove } from './canvas-movement.js';

export function updateEnemyMovements() {
  for (const enemy of enemies) {
    if (enemy.dead || enemy.health <= 0) continue;

    if (enemy.cooldown > 0) {
      enemy.cooldown--;
      continue;
    }

    const dx = player.x - enemy.x;
    const dy = player.y - enemy.y;
    const distX = Math.abs(dx);
    const distY = Math.abs(dy);

    const isAdjacent =
      (distX <= 1 && distY <= 1) &&
      !(distX === 0 && distY === 0);

    if (isAdjacent) {
      // 🧱 Modo cercamento: tenta alinhar lateralmente se possível
      if (Math.abs(dx) > 0 && tryMove(enemy, Math.sign(dx), 0)) {
        enemy.cooldown = getEntityCooldown(enemy);
        continue;
      }
      if (Math.abs(dy) > 0 && tryMove(enemy, 0, Math.sign(dy))) {
        enemy.cooldown = getEntityCooldown(enemy);
        continue;
      }
      continue; // Não há espaço para mover
    }

    // 👣 Modo deslocamento: move em direção ao player
    const bestMove = getBestStepTowards(enemy.x, enemy.y, player.x, player.y);
    if (bestMove && !isBlocked(bestMove.x, bestMove.y)) {
      enemy.x = bestMove.x;
      enemy.y = bestMove.y;
      enemy.cooldown = getEntityCooldown(enemy);
    }
  }
}

function getBestStepTowards(sx, sy, tx, ty) {
  const steps = [
    { x: sx + 1, y: sy },
    { x: sx - 1, y: sy },
    { x: sx, y: sy + 1 },
    { x: sx, y: sy - 1 },
    { x: sx + 1, y: sy + 1 },
    { x: sx - 1, y: sy - 1 },
    { x: sx + 1, y: sy - 1 },
    { x: sx - 1, y: sy + 1 }
  ];

  let best = null;
  let bestScore = Infinity;

  for (const step of steps) {
    const dx = step.x - tx;
    const dy = step.y - ty;
    const score = Math.abs(dx) + Math.abs(dy);

    if (score < bestScore) {
      best = step;
      bestScore = score;
    }
  }

  return best;
}

import { enemies, player, walls } from './canvas-config.js';
import { tryMove, updateEntityAnimation } from './canvas-movement.js';

export function updateEnemies() {
  enemies.forEach(enemy => {
    const now = Date.now();
    if (now - enemy.lastMove < enemy.speed) return;

    enemy.lastMove = now;

    const dist = Math.abs(enemy.x - player.x) + Math.abs(enemy.y - player.y);

    if (dist <= enemy.detectionRadius) {
      enemy.chasing = true;
      enemy.target = { x: player.x, y: player.y };
    } else {
      enemy.chasing = false;
      enemy.target = null;
    }

    const tx = enemy.target?.x ?? enemy.x + Math.floor(Math.random() * 3 - 1);
    const ty = enemy.target?.y ?? enemy.y + Math.floor(Math.random() * 3 - 1);

    const blocked = walls.some(w => w.x === tx && w.y === ty) ||
      enemies.some(e => e !== enemy && e.x === tx && e.y === ty) ||
      (player.x === tx && player.y === ty);

    if (
      tx >= 0 && tx < 50 &&
      ty >= 0 && ty < 50 &&
      !blocked
    ) {
      const dx = tx - enemy.x;
      const dy = ty - enemy.y;

      const stepX = dx > 0 ? 1 : dx < 0 ? -1 : 0;
      const stepY = dy > 0 ? 1 : dy < 0 ? -1 : 0;

      if (Math.abs(dx) > Math.abs(dy)) {
        tryMove(enemy, stepX, 0) || tryMove(enemy, 0, stepY);
      } else {
        tryMove(enemy, 0, stepY) || tryMove(enemy, stepX, 0);
      }
    }
  });
}

export function animateEnemies() {
  enemies.forEach(updateEntityAnimation);
}

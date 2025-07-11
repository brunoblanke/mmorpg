import { enemies, player } from './canvas-config.js';
import { tryMove, updateEntityAnimation } from './canvas-movement.js';

export function updateEnemies() {
  enemies.forEach(enemy => {
    const now = Date.now();
    if (now - enemy.lastMove < enemy.speed) return;
    enemy.lastMove = now;

    // 🎯 Detecta o player
    const dist = Math.abs(enemy.x - player.x) + Math.abs(enemy.y - player.y);
    if (dist <= enemy.detectionRadius) {
      enemy.chasing = true;
      enemy.target = { x: player.x, y: player.y };
    } else {
      enemy.chasing = false;
      // 👣 Patrulha simples aleatória
      enemy.target = {
        x: enemy.x + Math.floor(Math.random() * 3 - 1),
        y: enemy.y + Math.floor(Math.random() * 3 - 1)
      };
    }

    // 🧭 Calcula direção
    const tx = enemy.target.x;
    const ty = enemy.target.y;
    const dx = tx - enemy.x;
    const dy = ty - enemy.y;

    const stepX = dx > 0 ? 1 : dx < 0 ? -1 : 0;
    const stepY = dy > 0 ? 1 : dy < 0 ? -1 : 0;

    let moved = false;

    // 🛤️ Prioriza eixo com maior distância
    if (Math.abs(dx) > Math.abs(dy)) {
      moved = tryMove(enemy, stepX, 0) || tryMove(enemy, 0, stepY);
    } else {
      moved = tryMove(enemy, 0, stepY) || tryMove(enemy, stepX, 0);
    }

    // 🔄 Tenta diagonal caso esteja preso
    if (!moved && stepX !== 0 && stepY !== 0) {
      tryMove(enemy, stepX, stepY);
    }
  });
}

export function animateEnemies() {
  enemies.forEach(updateEntityAnimation);
}

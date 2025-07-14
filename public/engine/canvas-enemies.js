import { enemies, player } from './canvas-config.js';
import { tryMove } from './canvas-movement.js';

function distance(a, b) {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

function getCooldown(spd) {
  const base = 14;
  return Math.max(3, base - spd);
}

export function updateEnemyMovements() {
  for (const e of enemies) {
    if (e.cooldown > 0) {
      e.cooldown--;
      continue;
    }

    const dist = distance(e, player);
    const isChasing = dist <= 5;

    if (isChasing) {
      const dx = Math.sign(player.x - e.x);
      const dy = Math.sign(player.y - e.y);
      tryMove(e, dx, dy);
    } else {
      if (!e.patrolArea || e._justStoppedChasing) {
        const px = e.x;
        const py = e.y;
        const range = 2;

        e.patrolArea = {
          x1: Math.max(0, px - range),
          y1: Math.max(0, py - range),
          x2: Math.min(49, px + range),
          y2: Math.min(49, py + range)
        };

        e._justStoppedChasing = false;
      }

      const dx = Math.floor(Math.random() * 3) - 1;
      const dy = Math.floor(Math.random() * 3) - 1;
      const nx = e.x + dx;
      const ny = e.y + dy;

      if (
        nx >= e.patrolArea.x1 && nx <= e.patrolArea.x2 &&
        ny >= e.patrolArea.y1 && ny <= e.patrolArea.y2
      ) {
        tryMove(e, dx, dy);
      }
    }

    e._justStoppedChasing = !isChasing && (e._wasChasing ?? false);
    e._wasChasing = isChasing;
    e.cooldown = getCooldown(e.spd);
  }
}

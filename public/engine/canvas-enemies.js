import { enemies, player, safeZone } from './canvas-config.js';
import { tryMove, getEntityCooldown } from './canvas-movement.js';

function distance(a, b) {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

function getSurroundTiles(target) {
  return [
    { x: target.x + 1, y: target.y },
    { x: target.x - 1, y: target.y },
    { x: target.x, y: target.y + 1 },
    { x: target.x, y: target.y - 1 },
    { x: target.x + 1, y: target.y + 1 },
    { x: target.x - 1, y: target.y - 1 },
    { x: target.x + 1, y: target.y - 1 },
    { x: target.x - 1, y: target.y + 1 }
  ];
}

export function updateEnemyMovements() {
  const occupiedTiles = enemies.map(e => `${e.x},${e.y}`);
  const playerIsInSafeZone = safeZone.some(tile => tile.x === player.x && tile.y === player.y);

  for (const e of enemies) {
    if (e.cooldown > 0) {
      e.cooldown--;
      continue;
    }

    const dist = distance(e, player);
    const isChasing = !playerIsInSafeZone && dist <= 5;

    if (isChasing) {
      // Tentativa de cercar
      const surround = getSurroundTiles(player)
        .filter(pos => {
          const key = `${pos.x},${pos.y}`;
          return !occupiedTiles.includes(key);
        })
        .sort((a, b) => distance(e, a) - distance(e, b));

      let moved = false;
      for (const pos of surround) {
        const dx = pos.x - e.x;
        const dy = pos.y - e.y;
        if (tryMove(e, dx, dy)) {
          occupiedTiles.push(`${e.x},${e.y}`);
          moved = true;
          break;
        }
      }

      if (!moved) {
        const dx = Math.sign(player.x - e.x);
        const dy = Math.sign(player.y - e.y);
        if (tryMove(e, dx, dy)) {
          occupiedTiles.push(`${e.x},${e.y}`);
        }
      }
    } else {
      // Patrulha aleatória
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
    e.cooldown = getEntityCooldown(e);
  }
}

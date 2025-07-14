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
  const playerIsInSafe = safeZone.some(tile => tile.x === player.x && tile.y === player.y);

  for (const e of enemies) {
    if (e.cooldown > 0) {
      e.cooldown--;
      continue;
    }

    const dist = distance(e, player);
    const isChasing = !playerIsInSafe && dist <= 5;

    // 🔍 Identifica tipo de inimigo
    const type = e.id.toLowerCase();
    let strategy = 'default';
    if (type.includes('troll') || type.includes('orc')) strategy = 'closeAggressive';
    if (type.includes('mago') || type.includes('elemental')) strategy = 'ranged';

    // 🔁 Magos tentam manter distância-alvo
    if (strategy === 'ranged' && isChasing) {
      const ideal = 6;

      if (dist < ideal - 1) {
        const dx = Math.sign(e.x - player.x);
        const dy = Math.sign(e.y - player.y);

        // Apenas 10% de chance de recuar
        if (Math.random() < 0.10) {
          if (tryMove(e, dx, dy)) {
            e.cooldown = getEntityCooldown(e);
          }
        }
        continue;
      }

      if (dist > ideal + 1) {
        const dx = Math.sign(player.x - e.x);
        const dy = Math.sign(player.y - e.y);

        // Apenas 10% de chance de avançar
        if (Math.random() < 0.10) {
          if (tryMove(e, dx, dy)) {
            e.cooldown = getEntityCooldown(e);
          }
        }
        continue;
      }

      // Pequena movimentação dentro da faixa ideal
      const dx = Math.floor(Math.random() * 3) - 1;
      const dy = Math.floor(Math.random() * 3) - 1;
      const nx = e.x + dx;
      const ny = e.y + dy;

      const key = `${nx},${ny}`;
      if (!occupiedTiles.includes(key) && Math.random() < 0.08) {
        if (tryMove(e, dx, dy)) {
          e.cooldown = getEntityCooldown(e);
        }
      }

      continue;
    }

    // ⚔️ Inimigos melee cercando
    if (isChasing) {
      const surround = getSurroundTiles(player)
        .filter(pos => !occupiedTiles.includes(`${pos.x},${pos.y}`))
        .sort((a, b) => distance(e, a) - distance(e, b));

      const hasSpace = surround.length > 0;
      let moved = false;

      if (hasSpace && Math.random() < 0.04) {
        for (const pos of surround) {
          const dx = pos.x - e.x;
          const dy = pos.y - e.y;
          if (tryMove(e, dx, dy)) {
            e.cooldown = getEntityCooldown(e);
            occupiedTiles.push(`${e.x},${e.y}`);
            moved = true;
            break;
          }
        }
      }

      if (!moved && hasSpace && Math.random() < 0.02) {
        const dx = Math.sign(player.x - e.x);
        const dy = Math.sign(player.y - e.y);
        const nx = e.x + dx;
        const ny = e.y + dy;
        const key = `${nx},${ny}`;

        if (!occupiedTiles.includes(key)) {
          if (tryMove(e, dx, dy)) {
            e.cooldown = getEntityCooldown(e);
            occupiedTiles.push(`${e.x},${e.y}`);
          }
        }
      }

      continue;
    }

    // 🧍 Patrulha aleatória (fora da perseguição)
    const moveChance = strategy === 'ranged' ? 0.15 : 0.5;
    if (Math.random() > moveChance) continue;

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
    const key = `${nx},${ny}`;

    if (
      nx >= e.patrolArea.x1 && nx <= e.patrolArea.x2 &&
      ny >= e.patrolArea.y1 && ny <= e.patrolArea.y2 &&
      !occupiedTiles.includes(key)
    ) {
      if (tryMove(e, dx, dy)) {
        e.cooldown = getEntityCooldown(e);
      }
    }

    e._justStoppedChasing = !isChasing && (e._wasChasing ?? false);
    e._wasChasing = isChasing;
  }
}

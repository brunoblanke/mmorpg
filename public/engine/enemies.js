import { createPlayerElement, updateHpBar } from './player.js';
import { findPath } from './pathfinding.js';

export function spawnEnemies(enemies) {
  enemies.forEach(enemy => {
    enemy.detectionRadius = 4;
    enemy.isChasing = false;
    enemy._moving = false;

    enemy.patrolOrigin = { x: enemy.x, y: enemy.y };
    enemy.patrolArea = generateArea(enemy.patrolOrigin.x, enemy.patrolOrigin.y, 2);

    const tile = $(`[data-x="${enemy.x}"][data-y="${enemy.y}"]`);
    const el = createEnemyElement(enemy);
    tile.append(el);
    enemy.element = el;
  });
}

function generateArea(cx, cy, radius) {
  const area = [];
  for (let dy = -radius; dy <= radius; dy++) {
    for (let dx = -radius; dx <= radius; dx++) {
      const x = cx + dx;
      const y = cy + dy;
      if (x >= 0 && y >= 0 && x < 50 && y < 50) {
        area.push({ x, y });
      }
    }
  }
  return area;
}

function createEnemyElement(enemy) {
  const el = $('<div class="player enemy"></div>');
  const nameTag = $(`<div class="name-tag">${enemy.name}</div>`);
  const hpBar = $('<div class="hp-bar"><div class="hp-fill"></div></div>');

  const info = $(`
    <div class="enemy-info">
      LVL: ${enemy.level}<br>
      XP: ${enemy.xp}<br>
      ATK: ${enemy.attack}<br>
      DEF: ${enemy.defense}<br>
      VEL: ${enemy.speed}ms<br>
      POS: x:${enemy.x}, y:${enemy.y}
    </div>
  `);

  el.append(nameTag, hpBar, info);
  updateHpBar(el, enemy.hp, enemy.maxHp);
  return el;
}

export function patrolEnemies(enemies, walls, player) {
  enemies.forEach(enemy => {
    if (enemy._moving) return;

    const detectionTiles = generateArea(enemy.x, enemy.y, enemy.detectionRadius);
    const isPlayerDetected = detectionTiles.some(pos => pos.x === player.x && pos.y === player.y);

    if (isPlayerDetected) {
      enemy.isChasing = true;
      $(`[data-x="${player.x}"][data-y="${player.y}"]`).find('.player').addClass('highlighted');
    } else {
      if (enemy.isChasing) {
        enemy.isChasing = false;
        $('.player.highlighted').removeClass('highlighted');
      }
    }

    const destination = enemy.isChasing
      ? { x: player.x, y: player.y }
      : getRandomPatrolDestination(enemy, walls);

    const path = findPath(
      { x: enemy.x, y: enemy.y },
      destination,
      (x, y) => walls.some(w => w.x === x && w.y === y),
      50
    );

    if (!path.length) return;

    let step = 0;
    enemy._moving = true;

    const interval = setInterval(() => {
      if (step >= path.length) {
        clearInterval(interval);
        enemy._moving = false;
        return;
      }

      enemy.x = path[step].x;
      enemy.y = path[step].y;

      const tile = $(`[data-x="${enemy.x}"][data-y="${enemy.y}"]`);
      enemy.element.detach();
      tile.append(enemy.element);

      enemy.element.find('.enemy-info').html(`
        LVL: ${enemy.level}<br>
        XP: ${enemy.xp}<br>
        ATK: ${enemy.attack}<br>
        DEF: ${enemy.defense}<br>
        VEL: ${enemy.speed}ms<br>
        POS: x:${enemy.x}, y:${enemy.y}
      `);

      step++;
    }, Math.max(80, enemy.speed * 0.6)); // movimento mais ágil

    updateDetectionVisual(enemy);
  });
}

function getRandomPatrolDestination(enemy, walls) {
  const valid = enemy.patrolArea.filter(pos =>
    !walls.some(w => w.x === pos.x && w.y === pos.y) &&
    (pos.x !== enemy.x || pos.y !== enemy.y)
  );
  return valid[Math.floor(Math.random() * valid.length)];
}

function updateDetectionVisual(enemy) {
  $('.tile').removeClass(`detect-${enemy.id}`);
  const detectionTiles = generateArea(enemy.x, enemy.y, enemy.detectionRadius);
  detectionTiles.forEach(({ x, y }) => {
    $(`[data-x="${x}"][data-y="${y}"]`).addClass(`detect-${enemy.id}`);
  });
}

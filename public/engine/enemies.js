import { createPlayerElement, updateHpBar } from './player.js';
import { findPath } from './pathfinding.js';

export function spawnEnemies(enemies) {
  enemies.forEach(enemy => {
    // Gera uma área 5x5 ao redor do inimigo
    enemy.area = [];
    for (let dy = -2; dy <= 2; dy++) {
      for (let dx = -2; dx <= 2; dx++) {
        const tx = enemy.x + dx;
        const ty = enemy.y + dy;
        if (tx >= 0 && ty >= 0 && tx < 50 && ty < 50) {
          enemy.area.push({ x: tx, y: ty });
        }
      }
    }

    const tile = $(`[data-x="${enemy.x}"][data-y="${enemy.y}"]`);
    const el = createEnemyElement(enemy);
    tile.append(el);
    enemy.element = el;
  });
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

export function patrolEnemies(enemies, walls) {
  enemies.forEach(enemy => {
    if (enemy._moving) return; // impede duplo movimento

    const validTiles = enemy.area.filter(pos =>
      !walls.some(w => w.x === pos.x && w.y === pos.y) &&
      (pos.x !== enemy.x || pos.y !== enemy.y)
    );

    const destination = validTiles[Math.floor(Math.random() * validTiles.length)];
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
    }, enemy.speed);
  });
}

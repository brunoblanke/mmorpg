import { createPlayerElement, updateHpBar } from './player.js';

export function spawnEnemies(enemies) {
  enemies.forEach(enemy => {
    const tile = $(`[data-x="${enemy.x}"][data-y="${enemy.y}"]`);
    const el = createPlayerElement(enemy.name, enemy.hp, enemy.maxHp);
    el.addClass('enemy');
    tile.append(el);
    enemy.element = el;
  });
}

export function patrolEnemies(enemies, walls) {
  enemies.forEach(enemy => {
    const valid = enemy.area.filter(p => !walls.some(w => w.x === p.x && w.y === p.y));
    const dest = valid[Math.floor(Math.random() * valid.length)];
    enemy.x = dest.x;
    enemy.y = dest.y;
    enemy.element.detach();
    $(`[data-x="${dest.x}"][data-y="${dest.y}"]`).append(enemy.element);
  });
}

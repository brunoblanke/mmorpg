import { player, enemies } from './canvas-config.js';

export function applyAttack(attacker, target) {
  if (!attacker || !target || target.health <= 0) return;

  const damage = Math.max(1, attacker.atk - target.def);
  target.health -= damage;

  if (target.health < 0) target.health = 0;
}

export function checkEnemyAttacks() {
  for (const enemy of enemies) {
    const dx = Math.abs(enemy.x - player.x);
    const dy = Math.abs(enemy.y - player.y);

    if (dx <= 1 && dy <= 1) {
      if (Math.random() < 0.25) { // chance de atacar se estiver colado
        applyAttack(enemy, player);
      }
    }
  }
}

export function checkPlayerAttack() {
  for (const enemy of enemies) {
    const dx = Math.abs(enemy.x - player.x);
    const dy = Math.abs(enemy.y - player.y);

    if (dx <= 1 && dy <= 1 && enemy.health > 0) {
      applyAttack(player, enemy);
    }
  }
}

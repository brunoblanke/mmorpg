import { player, enemies } from './canvas-config.js';

export const floatingTexts = [];

const enemyAttackCooldown = new Map();
let playerAttackCooldown = 0;

export function applyAttack(attacker, target) {
  if (!attacker || !target || target.health <= 0) return;

  const damage = Math.max(1, attacker.atk - target.def);
  target.health -= damage;

  floatingTexts.push({
    value: `-${damage}`,
    x: target.x,
    y: target.y,
    duration: 30
  });

  if (target.health <= 0) {
    target.health = 0;
    if (attacker === player && target.xp) {
      player.xp += target.xp;
    }
  }
}

export function checkEnemyAttacks() {
  for (const enemy of enemies) {
    const dx = Math.abs(enemy.x - player.x);
    const dy = Math.abs(enemy.y - player.y);
    const key = enemy.id;

    if (dx <= 1 && dy <= 1) {
      const cd = enemyAttackCooldown.get(key) || 0;
      if (cd <= 0 && Math.random() < 0.25) {
        applyAttack(enemy, player);
        enemyAttackCooldown.set(key, 30); // cooldown de 30 ticks
      }
    } else {
      enemyAttackCooldown.set(key, 0);
    }
  }

  // Atualiza cooldowns
  for (const [key, cd] of enemyAttackCooldown) {
    enemyAttackCooldown.set(key, Math.max(0, cd - 1));
  }
}

export function checkPlayerAttack() {
  if (playerAttackCooldown > 0) {
    playerAttackCooldown--;
    return;
  }

  for (const enemy of enemies) {
    const dx = Math.abs(enemy.x - player.x);
    const dy = Math.abs(enemy.y - player.y);

    if (dx <= 1 && dy <= 1 && enemy.health > 0) {
      applyAttack(player, enemy);
      playerAttackCooldown = 20;
      break;
    }
  }
}

export function updateFloatingTexts() {
  for (const text of floatingTexts) {
    text.y -= 0.05;
    text.duration--;
    if (text.duration <= 0) {
      const index = floatingTexts.indexOf(text);
      floatingTexts.splice(index, 1);
    }
  }
}

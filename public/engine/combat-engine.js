import { player, enemies } from './canvas-config.js';

export const floatingTexts = [];

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

    // Jogador ganha XP ao eliminar
    if (attacker === player && target.xp) {
      player.xp += target.xp;
    }
  }
}

export function checkEnemyAttacks() {
  for (const enemy of enemies) {
    const dx = Math.abs(enemy.x - player.x);
    const dy = Math.abs(enemy.y - player.y);

    if (dx <= 1 && dy <= 1 && Math.random() < 0.25) {
      applyAttack(enemy, player);
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

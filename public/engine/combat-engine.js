import { player, enemies, safeZone } from './canvas-config.js';

export const floatingTexts = [];

let playerAttackCooldown = 0;
const enemyAttackCooldowns = new Map();

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

  // ⚰️ Inimigo derrotado
  if (target !== player && target.health <= 0) {
    target.health = 0;
    target.dead = true;
    if (attacker === player && target.xp) {
      player.xp += target.xp;
    }
  }

  // 💀 Jogador derrotado
  if (target === player && player.health <= 0) {
    player.health = 0;
    player.xp = Math.floor(player.xp * 0.9);
    const spawn = safeZone[0];
    player.x = spawn.x;
    player.y = spawn.y;
    player.health = player.maxHealth;

    floatingTexts.push({
      value: `Revive -10% XP`,
      x: player.x,
      y: player.y,
      duration: 60
    });
  }
}

export function checkEnemyAttacks() {
  for (const enemy of enemies) {
    if (enemy.dead) continue;

    const type = enemy.id.toLowerCase();
    const isRanged = type.includes('mago') || type.includes('elemental');

    const dx = Math.abs(enemy.x - player.x);
    const dy = Math.abs(enemy.y - player.y);
    const dist = dx + dy;
    const key = enemy.id;
    const cd = enemyAttackCooldowns.get(key) || 0;

    if (cd > 0) {
      enemyAttackCooldowns.set(key, cd - 1);
      continue;
    }

    // 👊 Corpo-a-corpo
    if (!isRanged && dx <= 1 && dy <= 1 && Math.random() < 0.3) {
      applyAttack(enemy, player);
      enemyAttackCooldowns.set(key, 60);
    }

    // 🔮 Magia à distância
    if (isRanged && dist <= 10 && Math.random() < 0.15) {
      applyAttack(enemy, player);
      enemyAttackCooldowns.set(key, 60);
      floatingTexts.push({
        value: `⚡ MAGIA`,
        x: enemy.x,
        y: enemy.y,
        duration: 20
      });
    }
  }
}

export function checkPlayerAttack() {
  if (playerAttackCooldown > 0) {
    playerAttackCooldown--;
    return;
  }

  for (const enemy of enemies) {
    if (enemy.dead) continue;

    const dx = Math.abs(enemy.x - player.x);
    const dy = Math.abs(enemy.y - player.y);

    if (dx <= 1 && dy <= 1 && enemy.health > 0) {
      applyAttack(player, enemy);
      playerAttackCooldown = 40;
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
      if (index !== -1) floatingTexts.splice(index, 1);
    }
  }
}

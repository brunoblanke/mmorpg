import {
  tileSize, gridSize, canvas, ctx,
  player, enemies, camera, walls, safeZone
} from './canvas-config.js';

import { floatingTexts } from './combat-engine.js';

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

export function drawGrid() {
  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      ctx.strokeStyle = '#333';
      ctx.strokeRect(
        x * tileSize - camera.x,
        y * tileSize - camera.y,
        tileSize, tileSize
      );
    }
  }

  // 🟩 Safe Zone
  ctx.fillStyle = 'rgba(0, 255, 0, 0.2)';
  for (const tile of safeZone) {
    ctx.fillRect(
      tile.x * tileSize - camera.x,
      tile.y * tileSize - camera.y,
      tileSize, tileSize
    );
  }

  // 🔴 Área de patrulha
  ctx.fillStyle = 'rgba(255, 0, 0, 0.08)';
  for (const enemy of enemies) {
    if (enemy.dead) continue;
    const area = enemy.patrolArea;
    if (!area) continue;
    for (let y = area.y1; y <= area.y2; y++) {
      for (let x = area.x1; x <= area.x2; x++) {
        ctx.fillRect(
          x * tileSize - camera.x,
          y * tileSize - camera.y,
          tileSize, tileSize
        );
      }
    }
  }

  // 🟡 Área de detecção com borda circular
  for (const enemy of enemies) {
    if (enemy.dead) continue;

    const type = enemy.id.toLowerCase();
    let range = 5;
    if (enemy.level === 1) range = 3;
    if (type.includes('mago') || type.includes('elemental')) range = 10;

    const centerX = enemy.x * tileSize - camera.x + tileSize / 2;
    const centerY = enemy.y * tileSize - camera.y + tileSize / 2;
    const radius = range * tileSize;

    ctx.strokeStyle = 'rgba(255, 255, 0, 0.3)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.stroke();
  }
}

export function drawWalls() {
  ctx.fillStyle = '#444';
  for (const wall of walls) {
    ctx.fillRect(
      wall.x * tileSize - camera.x,
      wall.y * tileSize - camera.y,
      tileSize, tileSize
    );
  }
}

function drawEntityBase(entity, color) {
  ctx.fillStyle = color;
  ctx.fillRect(
    entity.x * tileSize - camera.x,
    entity.y * tileSize - camera.y,
    tileSize, tileSize
  );

  // 🏷️ Nome
  ctx.fillStyle = '#fff';
  ctx.font = '12px Segoe UI';
  ctx.textAlign = 'center';
  ctx.fillText(
    entity.id,
    entity.x * tileSize - camera.x + tileSize / 2,
    entity.y * tileSize - camera.y - 6
  );

  // 📊 Atributos
  ctx.fillText(
    `LV:${entity.level} HP:${entity.health} XP:${entity.xp ?? 0}`,
    entity.x * tileSize - camera.x + tileSize / 2,
    entity.y * tileSize - camera.y + tileSize + 14
  );

  ctx.fillText(
    `ATK:${entity.atk} DEF:${entity.def} SPD:${entity.spd}`,
    entity.x * tileSize - camera.x + tileSize / 2,
    entity.y * tileSize - camera.y + tileSize + 28
  );

  // 🟦 Barra de vida
  const w = tileSize - 6;
  const ratio = entity.health / entity.maxHealth;
  ctx.fillStyle = 'black';
  ctx.fillRect(
    entity.x * tileSize - camera.x + 3,
    entity.y * tileSize - camera.y + tileSize - 6,
    w, 4
  );
  ctx.fillStyle = '#00ff00';
  ctx.fillRect(
    entity.x * tileSize - camera.x + 3,
    entity.y * tileSize - camera.y + tileSize - 6,
    w * ratio, 4
  );
}

export function drawPlayer(player) {
  drawEntityBase(player, '#0066ff');
}

export function drawEnemies() {
  for (const enemy of enemies) {
    const color = enemy.dead ? '#888' : '#ff3333';
    drawEntityBase(enemy, color);
  }
}

export function drawFloatingTexts() {
  ctx.fillStyle = 'yellow';
  ctx.font = 'bold 14px Segoe UI';
  ctx.textAlign = 'center';

  for (const text of floatingTexts) {
    ctx.fillText(
      text.value,
      text.x * tileSize - camera.x + tileSize / 2,
      text.y * tileSize - camera.y + tileSize / 2
    );
  }
}

export function drawXPBar() {
  const maxXP = player.level * 100;
  const ratio = Math.min(player.xp / maxXP, 1);

  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, 20);

  ctx.fillStyle = '#00ccff';
  ctx.fillRect(0, 0, canvas.width * ratio, 20);

  ctx.fillStyle = '#fff';
  ctx.font = '14px Segoe UI';
  ctx.textAlign = 'center';
  ctx.fillText(`XP: ${player.xp} / ${maxXP}`, canvas.width / 2, 14);
}

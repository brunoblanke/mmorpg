import {
  tileSize, gridSize, canvas, ctx,
  player, enemies, camera, walls, safeZone
} from './canvas-config.js';

import { floatingTexts } from './combat-engine.js';

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

  // Safe Zone
  ctx.fillStyle = 'rgba(0, 255, 0, 0.2)';
  for (const tile of safeZone) {
    ctx.fillRect(
      tile.x * tileSize - camera.x,
      tile.y * tileSize - camera.y,
      tileSize, tileSize
    );
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

  // Nome
  ctx.fillStyle = '#fff';
  ctx.font = '12px Segoe UI';
  ctx.textAlign = 'center';
  ctx.fillText(
    entity.id,
    entity.x * tileSize - camera.x + tileSize / 2,
    entity.y * tileSize - camera.y - 6
  );

  // Atributos + XP
  ctx.fillText(
    `LV:${entity.level} HP:${entity.health} XP:${entity.xp ?? 0}`,
    entity.x * tileSize - camera.x + tileSize / 2,
    entity.y * tileSize - camera.y + tileSize + 14
  );

  // Barra de vida
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
  drawEntityBase(player, '#0066ff'); // azul
}

export function drawEnemies() {
  for (const enemy of enemies) {
    drawEntityBase(enemy, '#ff3333'); // vermelho
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

import { ctx, tileSize, gridSize, canvas, camera, player, walls, enemies } from './canvas-config.js';

export function drawGrid() {
  ctx.strokeStyle = '#1E293B';
  for (let i = 0; i <= gridSize; i++) {
    const x = i * tileSize - camera.x;
    ctx.beginPath();
    ctx.moveTo(x, -camera.y);
    ctx.lineTo(x, gridSize * tileSize - camera.y);
    ctx.stroke();

    const y = i * tileSize - camera.y;
    ctx.beginPath();
    ctx.moveTo(-camera.x, y);
    ctx.lineTo(gridSize * tileSize - camera.x, y);
    ctx.stroke();
  }
}

export function drawRect(x, y, color) {
  const screenX = x * tileSize - camera.x;
  const screenY = y * tileSize - camera.y;
  ctx.fillStyle = color;
  ctx.fillRect(screenX, screenY, tileSize, tileSize);
}

export function drawText(text, x, y, color = '#F8FAFC', offsetY = -6) {
  const screenX = x * tileSize - camera.x;
  const screenY = y * tileSize - camera.y;
  ctx.fillStyle = color;
  ctx.font = '10px Segoe UI';
  ctx.textAlign = 'center';
  ctx.fillText(text, screenX + tileSize / 2, screenY + offsetY);
}

export function drawStats(entity) {
  drawText(
    `LV:${entity.level} XP:${entity.xp} ATK:${entity.attack} DEF:${entity.defense} SPD:${Math.round(1000 / entity.speed)}`,
    entity.posX, entity.posY, '#CBD5E1', tileSize + 12
  );
}

export function drawDestinationMarker(x, y) {
  const screenX = x * tileSize - camera.x;
  const screenY = y * tileSize - camera.y;
  ctx.strokeStyle = '#94A3B8';
  ctx.lineWidth = 2;
  ctx.strokeRect(screenX + 1, screenY + 1, tileSize - 2, tileSize - 2);
}

import { ctx, tileSize, camera, walls, enemies } from './canvas-config.js';

export function drawGrid(gridSize) {
  ctx.strokeStyle = '#1E293B';
  for (let i = 0; i <= gridSize; i++) {
    const x = i * tileSize - camera.x;
    const y = i * tileSize - camera.y;

    ctx.beginPath();
    ctx.moveTo(x, -camera.y);
    ctx.lineTo(x, gridSize * tileSize - camera.y);
    ctx.stroke();

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

export function drawText(txt, x, y, offset = -6, color = '#F8FAFC') {
  const screenX = x * tileSize - camera.x + tileSize / 2;
  const screenY = y * tileSize - camera.y + offset;
  ctx.fillStyle = color;
  ctx.font = '10px Segoe UI';
  ctx.textAlign = 'center';
  ctx.fillText(txt, screenX, screenY);
}

export function drawStats(entity) {
  drawText(
    `LV:${entity.level} XP:${entity.xp} ATK:${entity.attack} DEF:${entity.defense} SPD:${Math.round(1000 / entity.speed)}`,
    entity.posX,
    entity.posY,
    tileSize + 12,
    '#CBD5E1'
  );
}

export function drawWalls() {
  walls.forEach(w => drawRect(w.x, w.y, '#334155'));
}

export function drawDestinationMarker(x, y) {
  const screenX = x * tileSize - camera.x;
  const screenY = y * tileSize - camera.y;
  ctx.strokeStyle = '#94A3B8';
  ctx.lineWidth = 2;
  ctx.strokeRect(screenX + 1, screenY + 1, tileSize - 2, tileSize - 2);
}

export function drawEnemyAreas() {
  enemies.forEach(enemy => {
    ctx.fillStyle = 'rgba(59,130,246,0.1)';
    for (let dx = -enemy.patrolRadius; dx <= enemy.patrolRadius; dx++) {
      for (let dy = -enemy.patrolRadius; dy <= enemy.patrolRadius; dy++) {
        const px = enemy.x + dx;
        const py = enemy.y + dy;
        drawRect(px, py, ctx.fillStyle);
      }
    }

    ctx.fillStyle = 'rgba(16,185,129,0.2)';
    ctx.beginPath();
    ctx.arc(
      enemy.posX * tileSize - camera.x + tileSize / 2,
      enemy.posY * tileSize - camera.y + tileSize / 2,
      enemy.detectionRadius * tileSize,
      0,
      Math.PI * 2
    );
    ctx.fill();
  });
}

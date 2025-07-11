import { ctx, tileSize, camera, gridSize, walls, player, enemies } from './canvas-config.js';

export function drawGrid() {
  ctx.strokeStyle = '#333';
  for (let x = 0; x <= gridSize; x++) {
    ctx.beginPath();
    ctx.moveTo(x * tileSize - camera.x, 0);
    ctx.lineTo(x * tileSize - camera.x, gridSize * tileSize);
    ctx.stroke();
  }
  for (let y = 0; y <= gridSize; y++) {
    ctx.beginPath();
    ctx.moveTo(0, y * tileSize - camera.y);
    ctx.lineTo(gridSize * tileSize, y * tileSize - camera.y);
    ctx.stroke();
  }
}

export function drawTile(x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x * tileSize - camera.x, y * tileSize - camera.y, tileSize, tileSize);
}

export function drawWalls() {
  for (const w of walls) drawTile(w.x, w.y, '#444');
}

export function drawPlayer(p) {
  drawTile(p.x, p.y, '#00A0FF');
  const px = p.x * tileSize - camera.x;
  const py = p.y * tileSize - camera.y;
  const ratio = p.health / p.maxHealth;

  ctx.fillStyle = '#111';
  ctx.fillRect(px + 2, py + 2, tileSize - 4, 4);
  ctx.fillStyle = '#0f0';
  ctx.fillRect(px + 2, py + 2, (tileSize - 4) * ratio, 4);

  ctx.fillStyle = '#fff';
  ctx.font = '10px sans-serif';
  ctx.fillText(`Player`, px + 4, py + tileSize - 24);
  ctx.fillText(`LV:${p.level} XP:${p.xp}`, px + 4, py + tileSize - 14);
}

export function drawEnemies() {
  for (const e of enemies) {
    drawTile(e.x, e.y, '#FF5050');
    const px = e.x * tileSize - camera.x;
    const py = e.y * tileSize - camera.y;
    const ratio = e.health / e.maxHealth;

    ctx.fillStyle = '#111';
    ctx.fillRect(px + 2, py + 2, tileSize - 4, 4);
    ctx.fillStyle = '#0f0';
    ctx.fillRect(px + 2, py + 2, (tileSize - 4) * ratio, 4);

    ctx.fillStyle = '#fff';
    ctx.font = '10px sans-serif';
    ctx.fillText(`${e.id}`, px + 4, py + tileSize - 24);
    ctx.fillText(`LV:${e.level} XP:${e.xp}`, px + 4, py + tileSize - 14);
  }
}

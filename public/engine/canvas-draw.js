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

function drawCharacter(x, y, color, label, stats) {
  const px = x * tileSize - camera.x;
  const py = y * tileSize - camera.y;

  // Corpo quadrado
  ctx.fillStyle = color;
  ctx.fillRect(px, py, tileSize, tileSize);

  // Borda
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 1;
  ctx.strokeRect(px, py, tileSize, tileSize);

  // Barra de vida no topo
  const ratio = stats.health / stats.maxHealth;
  ctx.fillStyle = '#111';
  ctx.fillRect(px + 2, py - 6, tileSize - 4, 4);
  ctx.fillStyle = '#0f0';
  ctx.fillRect(px + 2, py - 6, (tileSize - 4) * ratio, 4);

  // HUD abaixo
  ctx.fillStyle = '#fff';
  ctx.font = '10px sans-serif';
  ctx.fillText(label, px + 4, py + tileSize + 12);
  ctx.fillText(`LV:${stats.level} XP:${stats.xp}`, px + 4, py + tileSize + 22);
  ctx.fillText(`ATK:${stats.atk} DEF:${stats.def} SPD:${stats.spd}`, px + 4, py + tileSize + 32);
}

export function drawPlayer(p) {
  drawCharacter(p.x, p.y, '#00A0FF', 'Player', p);
}

export function drawEnemies() {
  for (const e of enemies) {
    const px = e.x * tileSize - camera.x;
    const py = e.y * tileSize - camera.y;

    // Área de patrulha
    if (e.patrolArea) {
      ctx.fillStyle = 'rgba(255, 255, 0, 0.2)';
      ctx.fillRect(
        e.patrolArea.x1 * tileSize - camera.x,
        e.patrolArea.y1 * tileSize - camera.y,
        (e.patrolArea.x2 - e.patrolArea.x1 + 1) * tileSize,
        (e.patrolArea.y2 - e.patrolArea.y1 + 1) * tileSize
      );
    }

    // Raio de detecção
    ctx.strokeStyle = 'rgba(255, 0, 0, 0.3)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(
      e.x * tileSize - camera.x + tileSize / 2,
      e.y * tileSize - camera.y + tileSize / 2,
      tileSize * 5,
      0, Math.PI * 2
    );
    ctx.stroke();

    drawCharacter(e.x, e.y, '#FF5050', e.id, e);
  }
}

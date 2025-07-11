import { ctx, tileSize, camera, gridSize, walls, player, enemies } from './canvas-config.js';
import { otherPlayers } from './multiplayer-client.js';

export function drawGrid() {
  ctx.strokeStyle = '#2b2b2b';
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
  for (const w of walls) {
    drawTile(w.x, w.y, '#333');
  }
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
  ctx.fillText(`ATK:${p.atk} DEF:${p.def} SPD:${p.spd}`, px + 4, py + tileSize - 4);
}

export function drawEnemies() {
  for (const e of enemies) {
    // 🟥 Área de detecção em tiles
    for (let dx = -5; dx <= 5; dx++) {
      for (let dy = -5; dy <= 5; dy++) {
        const dist = Math.abs(dx) + Math.abs(dy);
        if (dist <= 5) {
          const tx = e.x + dx;
          const ty = e.y + dy;
          if (tx >= 0 && ty >= 0 && tx < gridSize && ty < gridSize) {
            ctx.fillStyle = 'rgba(255, 0, 0, 0.1)';
            ctx.fillRect(tx * tileSize - camera.x, ty * tileSize - camera.y, tileSize, tileSize);
          }
        }
      }
    }

    // 🟩 Patrulha
    if (e.patrolArea) {
      const { x1, y1, x2, y2 } = e.patrolArea;
      ctx.strokeStyle = 'rgba(0, 255, 0, 0.3)';
      ctx.strokeRect(
        x1 * tileSize - camera.x,
        y1 * tileSize - camera.y,
        (x2 - x1 + 1) * tileSize,
        (y2 - y1 + 1) * tileSize
      );
    }

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
    ctx.fillText(`ATK:${e.atk} DEF:${e.def} SPD:${e.spd}`, px + 4, py + tileSize - 4);
  }
}

export function drawOthers() {
  for (const id in otherPlayers) {
    const p = otherPlayers[id];
    drawTile(p.x, p.y, '#FFD700');
    const px = p.x * tileSize - camera.x;
    const py = p.y * tileSize - camera.y;
    ctx.fillStyle = '#fff';
    ctx.font = '10px sans-serif';
    ctx.fillText(`Remoto`, px + 4, py + tileSize - 14);
  }
}

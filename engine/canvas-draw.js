import { tileSize, camera, player, walls, enemies, destination } from './canvas-config.js';
import { otherPlayers } from './multiplayer-client.js';

const ctx = document.getElementById('game').getContext('2d');

export function drawTile(x, y, color) {
  const px = x * tileSize - camera.x;
  const py = y * tileSize - camera.y;
  ctx.fillStyle = color;
  ctx.fillRect(px, py, tileSize, tileSize);
}

export function drawGrid() {
  ctx.strokeStyle = '#555';
  for (let i = 0; i < 50; i++) {
    for (let j = 0; j < 50; j++) {
      const x = i * tileSize - camera.x;
      const y = j * tileSize - camera.y;
      ctx.strokeRect(x, y, tileSize, tileSize);
    }
  }
}

export function drawWalls() {
  for (const w of walls) {
    drawTile(w.x, w.y, '#444');
  }
}

export function drawEnemies() {
  for (const e of enemies) {
    drawTile(e.x, e.y, '#900');
    const px = e.x * tileSize - camera.x;
    const py = e.y * tileSize - camera.y;
    ctx.fillStyle = '#fff';
    ctx.font = '10px sans-serif';
    ctx.fillText(`${e.id}`, px + 4, py + tileSize - 14);
  }
}

export function drawPlayer(p) {
  drawTile(p.x, p.y, '#06c');
  const px = p.x * tileSize - camera.x;
  const py = p.y * tileSize - camera.y;
  ctx.fillStyle = '#fff';
  ctx.font = '10px sans-serif';
  ctx.fillText(`Você`, px + 4, py + tileSize - 4);
}

export function drawOthers() {
  for (const id in otherPlayers) {
    const p = otherPlayers[id];
    drawTile(p.x, p.y, '#FFD700');
    const px = p.x * tileSize - camera.x;
    const py = p.y * tileSize - camera.y;
    ctx.fillStyle = '#fff';
    ctx.font = '10px sans-serif';
    ctx.fillText(`Remoto ${id}`, px + 4, py + tileSize - 14);
  }
}

export function drawDestinationTile() {
  if (destination) {
    drawTile(destination.x, destination.y, 'rgba(0,255,0,0.3)');
  }
}

import {
  tileSize, gridSize, canvas, ctx,
  player, enemies, camera, walls, safeZone
} from './canvas-config.js';

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
      ctx.strokeRect(x * tileSize - camera.x, y * tileSize - camera.y, tileSize, tileSize);
    }
  }

  // Safe Zone (verde translúcido)
  ctx.fillStyle = 'rgba(0, 255, 0, 0.2)';
  for (const tile of safeZone) {
    ctx.fillRect(tile.x * tileSize - camera.x, tile.y * tileSize - camera.y, tileSize, tileSize);
  }

  // Áreas de patrulha (vermelho suave)
  ctx.fillStyle = 'rgba(255, 0, 0, 0.1)';
  for (const e of enemies) {
    const area = e.patrolArea;
    for (let y = area.y1; y <= area.y2; y++) {
      for (let x = area.x1; x <= area.x2; x++) {
        ctx.fillRect(x * tileSize - camera.x, y * tileSize - camera.y, tileSize, tileSize);
      }
    }
  }
}

export function drawWalls() {
  ctx.fillStyle = '#444';
  for (const wall of walls) {
    ctx.fillRect(wall.x * tileSize - camera.x, wall.y * tileSize - camera.y, tileSize, tileSize);
  }
}

function drawEntityBase(entity, color) {
  // Caixa do personagem
  ctx.fillStyle = color;
  ctx.fillRect(
    entity.x * tileSize - camera.x,
    entity.y * tileSize - camera.y,
    tileSize, tileSize
  );

  // Nome acima
  ctx.fillStyle = '#ffffff';
  ctx.font = '12px Segoe UI';
  ctx.textAlign = 'center';
  ctx.fillText(
    entity.id,
    entity.x * tileSize - camera.x + tileSize / 2,
    entity.y * tileSize - camera.y - 6
  );

  // Atributos abaixo (uma linha)
  const attrText = `LV:${entity.level} HP:${entity.health} ATK:${entity.atk} DEF:${entity.def} SPD:${entity.spd}`;
  ctx.fillText(
    attrText,
    entity.x * tileSize - camera.x + tileSize / 2,
    entity.y * tileSize - camera.y + tileSize + 14
  );
}

export function drawPlayer(player) {
  drawEntityBase(player, '#0066ff'); // azul
}

export function drawEnemies() {
  for (const e of enemies) {
    drawEntityBase(e, '#ff3333'); // vermelho
  }
}

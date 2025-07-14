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

  // 🔴 Áreas de patrulha
  ctx.fillStyle = 'rgba(255, 0, 0, 0.1)';
  for (const enemy of enemies) {
    const area = enemy.patrolArea;
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

  // 🟡 Áreas de detecção personalizadas
  for (const enemy of enemies) {
    const type = enemy.id.toLowerCase();
    let range = 5;

    if (enemy.level === 1) range = 3;
    if (type.includes('mago') || type.includes('elemental')) range = 10;

    ctx.fillStyle = 'rgba(255, 255, 0, 0.08)';
    for (let y = enemy.y - range; y <= enemy.y + range; y++) {
      for (let x = enemy.x - range; x <= enemy.x + range; x++) {
        if (
          x >= 0 && y >= 0 && x < gridSize && y < gridSize &&
          Math.abs(x - enemy.x) + Math.abs(y - enemy.y) <= range
        ) {
          ctx.fillRect(
            x * tileSize - camera.x,
            y * tileSize - camera.y,
            tileSize, tileSize
          );
        }
      }
    }
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

  // Nome acima
  ctx.fillStyle = '#fff';
  ctx.font = '12px Segoe UI';
  ctx.textAlign = 'center';
  ctx.fillText(
    entity.id,
    entity.x * tileSize - camera.x + tileSize / 2,
    entity.y * tileSize - camera.y - 6
  );

  // Atributos abaixo
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
  for (const enemy of enemies) {
    drawEntityBase(enemy, '#ff3333'); // vermelho
  }
}

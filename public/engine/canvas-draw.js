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

  // 🟩 Safe zone em verde translúcido
  ctx.fillStyle = 'rgba(0, 255, 0, 0.2)';
  for (const tile of safeZone) {
    ctx.fillRect(
      tile.x * tileSize - camera.x,
      tile.y * tileSize - camera.y,
      tileSize, tileSize
    );
  }

  // 🔴 Patrulhas dos inimigos
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

  // 🟡 Área de detecção (tiles com alcance Manhattan ≤ 5)
  ctx.fillStyle = 'rgba(255, 255, 0, 0.2)';
  for (const enemy of enemies) {
    for (let y = enemy.y - 5; y <= enemy.y + 5; y++) {
      for (let x = enemy.x - 5; x <= enemy.x + 5; x++) {
        const withinGrid = x >= 0 && y >= 0 && x < gridSize && y < gridSize;
        const inDetectionRange = Math.abs(x - enemy.x) + Math.abs(y - enemy.y) <= 5;

        if (withinGrid && inDetectionRange) {
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
  drawEntityBase(player, '#0066ff');
}

export function drawEnemies() {
  for (const enemy of enemies) {
    drawEntityBase(enemy, '#ff3333');
  }
}

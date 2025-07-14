import {
  canvas, ctx, player, camera, tileSize
} from './canvas-config.js';

import {
  updatePlayerMovement,
  updateCamera,
  handleClickDestination,
  handleDirectionalInput
} from './canvas-movement.js';

import {
  drawGrid,
  drawWalls,
  drawPlayer,
  drawEnemies
} from './canvas-draw.js';

import { updateEnemyMovements } from './canvas-enemies.js';

let targetTile = null;
let movementQueueRef = [];

canvas.addEventListener('click', e => {
  const rect = canvas.getBoundingClientRect();
  const mx = e.clientX - rect.left;
  const my = e.clientY - rect.top;

  const tx = Math.floor((mx + camera.x) / tileSize);
  const ty = Math.floor((my + camera.y) / tileSize);

  handleClickDestination(tx, ty);
  targetTile = { x: tx, y: ty };
});

window.addEventListener('keydown', e => {
  const input = {
    ArrowUp: [0, -1], ArrowDown: [0, 1],
    ArrowLeft: [-1, 0], ArrowRight: [1, 0],
    w: [0, -1], s: [0, 1], a: [-1, 0], d: [1, 0]
  };

  if (input[e.key]) {
    const [dx, dy] = input[e.key];
    handleDirectionalInput(dx, dy);
    targetTile = null;
    movementQueueRef = []; // limpa visualização
  }
});

function drawTargetMarker() {
  if (!targetTile) return;

  ctx.strokeStyle = '#00ffcc';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(
    targetTile.x * tileSize - camera.x + tileSize / 2,
    targetTile.y * tileSize - camera.y + tileSize / 2,
    tileSize / 3,
    0, Math.PI * 2
  );
  ctx.stroke();
}

function drawPathShadow() {
  ctx.fillStyle = 'rgba(0, 255, 255, 0.2)';
  for (const step of movementQueueRef) {
    ctx.fillRect(
      step.x * tileSize - camera.x,
      step.y * tileSize - camera.y,
      tileSize, tileSize
    );
  }
}

function syncPathReference() {
  // Captura a fila atual diretamente do módulo de movimento
  // Copie o array externo `movementQueue` para visualização
  import('./canvas-movement.js').then(mod => {
    movementQueueRef = [...mod.__movementQueue__ || []];
  });
}

function gameLoop() {
  updatePlayerMovement();
  updateEnemyMovements();
  updateCamera();
  syncPathReference();

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawGrid();
  drawWalls();
  drawPathShadow();
  drawEnemies();
  drawPlayer(player);
  drawTargetMarker();

  requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);

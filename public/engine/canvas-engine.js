import {
  canvas, ctx, player, camera, tileSize
} from './canvas-config.js';

import {
  updatePlayerMovement,
  updateCamera,
  handleClickDestination,
  handleDirectionalInput,
  releaseInput,
  __movementQueue__
} from './canvas-movement.js';

import {
  drawGrid,
  drawWalls,
  drawPlayer,
  drawEnemies
} from './canvas-draw.js';

import { updateEnemyMovements } from './canvas-enemies.js';
import { checkEnemyAttacks, checkPlayerAttack } from './combat-engine.js';

let targetTile = null;
let pressedKeys = {};

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
  pressedKeys[e.key] = true;

  const input = {
    ArrowUp: [0, -1], ArrowDown: [0, 1],
    ArrowLeft: [-1, 0], ArrowRight: [1, 0],
    w: [0, -1], s: [0, 1], a: [-1, 0], d: [1, 0]
  };

  const activeDirs = Object.entries(input)
    .filter(([key]) => pressedKeys[key])
    .map(([, dir]) => dir);

  if (activeDirs.length === 1) {
    const [dx, dy] = activeDirs[0];
    handleDirectionalInput(dx, dy);
    targetTile = null;
  }

  if (activeDirs.length === 2) {
    const dx = activeDirs[0][0] + activeDirs[1][0];
    const dy = activeDirs[0][1] + activeDirs[1][1];
    handleDirectionalInput(dx, dy);
    targetTile = null;
  }
});

window.addEventListener('keyup', e => {
  delete pressedKeys[e.key];
  releaseInput();
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
  for (const step of __movementQueue__) {
    ctx.fillRect(
      step.x * tileSize - camera.x,
      step.y * tileSize - camera.y,
      tileSize, tileSize
    );
  }
}

function gameLoop() {
  updatePlayerMovement();
  updateEnemyMovements();
  checkEnemyAttacks();    // inimigos atacam o jogador
  checkPlayerAttack();    // jogador ataca inimigos próximos
  updateCamera();

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

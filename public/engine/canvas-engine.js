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
  drawEnemies,
  drawFloatingTexts,
  drawXPBar
} from './canvas-draw.js';

import { updateEnemyMovements } from './canvas-enemies.js';
import {
  checkEnemyAttacks,
  checkPlayerAttack,
  updateFloatingTexts
} from './combat-engine.js';

import { enemies } from './canvas-config.js';

let targetTile = null;
let pressedKeys = {};

canvas.addEventListener('click', e => {
  const rect = canvas.getBoundingClientRect();
  const mx = e.clientX - rect.left;
  const my = e.clientY - rect.top;
  const tx = Math.floor((mx + camera.x) / tileSize);
  const ty = Math.floor((my + camera.y) / tileSize);

  const clickedEnemy = enemies.find(en => en.x === tx && en.y === ty && !en.dead);

  if (clickedEnemy) {
    player.targetEnemy = clickedEnemy;
    player.target = null;
    targetTile = null;
  } else {
    player.targetEnemy = null;
    handleClickDestination(tx, ty);
    targetTile = { x: tx, y: ty };
  }
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

  if (activeDirs.length >= 1) {
    const dx = activeDirs.reduce((sum, dir) => sum + dir[0], 0);
    const dy = activeDirs.reduce((sum, dir) => sum + dir[1], 0);
    handleDirectionalInput(dx, dy);
    targetTile = null;
    player.targetEnemy = null; // 🛑 cancela perseguição ao mover manualmente
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

function drawFollowBorders() {
  if (player.targetEnemy && !player.targetEnemy.dead) {
    // 🟩 borda verde em torno do inimigo sendo seguido
    const target = player.targetEnemy;
    ctx.strokeStyle = '#00ff00';
    ctx.lineWidth = 2;
    ctx.strokeRect(
      target.x * tileSize - camera.x,
      target.y * tileSize - camera.y,
      tileSize, tileSize
    );

    // 🟩 borda verde em torno do player
    ctx.strokeStyle = '#00ff00';
    ctx.lineWidth = 2;
    ctx.strokeRect(
      player.x * tileSize - camera.x,
      player.y * tileSize - camera.y,
      tileSize, tileSize
    );
  }
}

function gameLoop() {
  updatePlayerMovement();
  updateEnemyMovements();
  checkEnemyAttacks();
  checkPlayerAttack();
  updateFloatingTexts();
  updateCamera();

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawXPBar();
  drawGrid();
  drawWalls();
  drawPathShadow();
  drawEnemies();
  drawPlayer(player);
  drawFollowBorders();      // 🟩 bordas de perseguição
  drawTargetMarker();
  drawFloatingTexts();

  requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);

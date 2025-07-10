import { canvas, ctx, player } from './canvas-config.js';
import {
  updatePlayerMovement,
  handleClickDestination,
  handleDirectionalInput,
  updateCamera
} from './canvas-movement.js';

import {
  updateEnemyMovements,
  animateEnemies
} from './canvas-enemies.js';

import {
  drawGrid,
  drawWalls,
  drawPlayer,
  drawEnemies,
  drawOthers
} from './canvas-draw.js';

import { emitPlayerPosition } from './multiplayer-client.js';

function gameLoop() {
  updatePlayerMovement();
  updateEnemyMovements();
  animateEnemies(); // função mantida por compatibilidade
  updateCamera();
  emitPlayerPosition();

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawGrid();
  drawWalls();
  drawEnemies();
  drawPlayer(player);
  drawOthers();

  requestAnimationFrame(gameLoop);
}

canvas.addEventListener('click', e => {
  const rect = canvas.getBoundingClientRect();
  const mx = e.clientX - rect.left;
  const my = e.clientY - rect.top;
  const tx = Math.floor((mx + camera.x) / 50);
  const ty = Math.floor((my + camera.y) / 50);
  handleClickDestination(tx, ty);
});

window.addEventListener('keydown', e => {
  const input = {
    ArrowUp: [0, -1],
    ArrowDown: [0, 1],
    ArrowLeft: [-1, 0],
    ArrowRight: [1, 0],
    w: [0, -1],
    s: [0, 1],
    a: [-1, 0],
    d: [1, 0],
  };

  if (input[e.key]) {
    const [dx, dy] = input[e.key];
    handleDirectionalInput(dx, dy);
  }
});

requestAnimationFrame(gameLoop);

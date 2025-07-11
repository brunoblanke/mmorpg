import { canvas, ctx, player, camera, tileSize } from './canvas-config.js';
import {
  updatePlayerMovement,
  updateCamera,
  handleClickDestination,
  handleDirectionalInput
} from './canvas-movement.js';
import { drawGrid, drawWalls, drawPlayer, drawEnemies } from './canvas-draw.js';
import { updateEnemyMovements } from './canvas-enemies.js';

function gameLoop() {
  updatePlayerMovement();
  updateEnemyMovements();
  updateCamera();

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawGrid();
  drawWalls();
  drawEnemies();
  drawPlayer(player);

  requestAnimationFrame(gameLoop);
}

canvas.addEventListener('click', e => {
  const rect = canvas.getBoundingClientRect();
  const mx = e.clientX - rect.left;
  const my = e.clientY - rect.top;
  const tx = Math.floor((mx + camera.x) / tileSize);
  const ty = Math.floor((my + camera.y) / tileSize);
  handleClickDestination(tx, ty);
});

window.addEventListener('keydown', e => {
  const input = {
    ArrowUp: [0, -1],
    ArrowDown: [0, 1],
    ArrowLeft: [-1, 0],
    ArrowRight: [1, 0],
    w: [0, -1], s: [0, 1], a: [-1, 0], d: [1, 0]
  };
  if (input[e.key]) {
    const [dx, dy] = input[e.key];
    handleDirectionalInput(dx, dy);
  }
});

requestAnimationFrame(gameLoop);

import { canvas, ctx, player, enemies, gridSize } from './canvas-config.js';
import {
  drawGrid,
  drawWalls,
  drawEnemyAreas,
  drawRect,
  drawText,
  drawStats,
  drawDestinationMarker
} from './canvas-draw.js';

import {
  updatePlayerMovement,
  updateCamera,
  handleDirectionalInput,
  handleClickDestination
} from './canvas-movement.js';

import {
  updateEnemies,
  animateEnemies
} from './canvas-enemies.js';

function gameLoop() {
  updatePlayerMovement();
  updateEnemies();

  updateCamera();

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawGrid(gridSize);
  drawWalls();
  drawEnemyAreas();

  drawRect(player.posX, player.posY, player.color);
  drawText('Você', player.posX, player.posY);
  drawStats(player);

  if (player.destination) {
    drawDestinationMarker(player.destination.x, player.destination.y);
  }

  enemies.forEach(enemy => {
    drawRect(enemy.posX, enemy.posY, enemy.color);
    drawText(enemy.name, enemy.posX, enemy.posY);
    drawStats(enemy);
  });

  requestAnimationFrame(gameLoop);
}

gameLoop();

document.addEventListener('keydown', e => {
  const dir = {
    ArrowUp: [0, -1],
    ArrowDown: [0, 1],
    ArrowLeft: [-1, 0],
    ArrowRight: [1, 0]
  }[e.key];

  if (dir) {
    handleDirectionalInput(dir[0], dir[1]);
  }
});

canvas.addEventListener('click', e => {
  const rect = canvas.getBoundingClientRect();
  const x = Math.floor((e.clientX - rect.left) / 30 + player.x - canvas.width / 60);
  const y = Math.floor((e.clientY - rect.top) / 30 + player.y - canvas.height / 60);
  handleClickDestination(x, y);
});

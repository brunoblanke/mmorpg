import { canvas, ctx, player, enemies } from './canvas-config.js';
import { drawGrid, drawRect, drawText, drawStats, drawDestinationMarker } from './canvas-draw.js';
import { updatePlayerMovement, updateEntityAnimation, updateCamera } from './canvas-movement.js';
import { updateEnemies, animateEnemies } from './canvas-enemies.js';

function gameLoop() {
  // Atualiza movimentações
  updatePlayerMovement();
  updateEnemies();

  // Interpolação suave
  updateEntityAnimation(player);
  animateEnemies();

  // Atualiza a câmera
  updateCamera();

  // Renderização
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawGrid();

  // Player
  drawRect(player.posX, player.posY, player.color);
  drawText('Você', player.posX, player.posY);
  drawStats(player);
  if (player.destination) {
    drawDestinationMarker(player.destination.x, player.destination.y);
  }

  // Inimigos
  enemies.forEach(enemy => {
    drawRect(enemy.posX, enemy.posY, enemy.color);
    drawText(enemy.name, enemy.posX, enemy.posY);
    drawStats(enemy);
  });

  requestAnimationFrame(gameLoop);
}

gameLoop();

// ⌨️ Movimento por teclado
document.addEventListener('keydown', e => {
  const dir = {
    ArrowUp: [0, -1],
    ArrowDown: [0, 1],
    ArrowLeft: [-1, 0],
    ArrowRight: [1, 0]
  }[e.key];
  if (dir) {
    player.destination = {
      x: player.x + dir[0],
      y: player.y + dir[1]
    };
  }
});

// 🖱️ Movimento por clique
canvas.addEventListener('click', e => {
  const rect = canvas.getBoundingClientRect();
  const x = Math.floor((e.clientX - rect.left) / 30 + player.x - canvas.width / 60);
  const y = Math.floor((e.clientY - rect.top) / 30 + player.y - canvas.height / 60);
  player.destination = { x, y };
});

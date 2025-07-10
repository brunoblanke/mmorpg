import { canvas, ctx, player, camera, tileSize } from './canvas-config.js';
import {
  updatePlayerMovement,
  updateCamera,
  handleClickDestination,
  handleDirectionalInput
} from './canvas-movement.js';
import { drawGrid, drawWalls, drawPlayer, drawEnemies, drawOthers } from './canvas-draw.js';
import { updateEnemyMovements } from './canvas-enemies.js';

/**
 * Loop principal do jogo — renderiza e atualiza tudo a cada quadro.
 */
function gameLoop() {
  updatePlayerMovement();    // atualiza movimento do jogador
  updateEnemyMovements();    // atualiza IA dos inimigos
  updateCamera();            // posiciona a câmera

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Renderização do mundo
  drawGrid();
  drawWalls();
  drawEnemies();
  drawPlayer(player);
  drawOthers(); // jogadores remotos

  requestAnimationFrame(gameLoop);
}

// 🖱️ Evento de clique no canvas para mover
canvas.addEventListener('click', (e) => {
  const rect = canvas.getBoundingClientRect();
  const mx = e.clientX - rect.left;
  const my = e.clientY - rect.top;
  const tx = Math.floor((mx + camera.x) / tileSize);
  const ty = Math.floor((my + camera.y) / tileSize);
  handleClickDestination(tx, ty);
});

// 🎮 Evento de teclado para movimentação
window.addEventListener('keydown', (e) => {
  const input = {
    ArrowUp: [0, -1],
    ArrowDown: [0, 1],
    ArrowLeft: [-1, 0],
    ArrowRight: [1, 0],
    w: [0, -1],
    s: [0, 1],
    a: [-1, 0],
    d: [1, 0]
  };
  const dir = input[e.key];
  if (dir) {
    const [dx, dy] = dir;
    handleDirectionalInput(dx, dy);
  }
});

// 🚀 Inicia o loop
requestAnimationFrame(gameLoop);

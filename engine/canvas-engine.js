import { canvas, ctx, player, camera, tileSize } from './canvas-config.js';
import {
  updatePlayerMovement,
  updateCamera,
  handleDirectionalInput
} from './canvas-movement.js';
import {
  drawGrid,
  drawWalls,
  drawPlayer,
  drawEnemies,
  drawOthers
} from './canvas-draw.js';

// 🎮 Loop principal do jogo
function gameLoop() {
  updatePlayerMovement();    // movimenta jogador (se houver)
  updateCamera();            // atualiza câmera com base no jogador

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawGrid();
  drawWalls();
  drawEnemies();
  drawPlayer(player);
  drawOthers();

  requestAnimationFrame(gameLoop);
}

// 🎮 Movimentação via teclado
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

// 🚀 Inicia o loop gráfico
requestAnimationFrame(gameLoop);

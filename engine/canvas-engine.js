const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

const gridSize = 50;
const tileSize = 30;
canvas.width = gridSize * tileSize;
canvas.height = gridSize * tileSize;

// 🎮 Objetos do jogo
const player = { x: 5, y: 5, color: '#E2E8F0' };

const walls = [
  { x: 6, y: 5 }, { x: 7, y: 5 }, { x: 8, y: 5 },
  { x: 8, y: 6 }, { x: 8, y: 7 }, { x: 8, y: 8 }
];

const enemies = [
  {
    id: 'enemy1',
    x: 15,
    y: 15,
    color: '#FBBF24',
    speed: 1,
    detectionRadius: 4,
    patrolRadius: 2,
    chasing: false,
    target: null
  }
];

// 🔧 Utilitários
function drawTileGrid() {
  ctx.strokeStyle = '#1E293B';
  for (let i = 0; i <= gridSize; i++) {
    ctx.beginPath();
    ctx.moveTo(i * tileSize, 0);
    ctx.lineTo(i * tileSize, gridSize * tileSize);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, i * tileSize);
    ctx.lineTo(gridSize * tileSize, i * tileSize);
    ctx.stroke();
  }
}

function drawRect(x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
}

function drawText(txt, x, y) {
  ctx.fillStyle = '#F8FAFC';
  ctx.font = '8px Segoe UI';
  ctx.textAlign = 'center';
  ctx.fillText(txt, x * tileSize + tileSize / 2, y * tileSize - 10);
}

// 💠 Desenhar área em volta do personagem
function drawArea(x, y, radius, color) {
  ctx.fillStyle = color;
  for (let dy = -radius; dy <= radius; dy++) {
    for (let dx = -radius; dx <= radius; dx++) {
      const tx = x + dx;
      const ty = y + dy;
      if (tx >= 0 && ty >= 0 && tx < gridSize && ty < gridSize) {
        ctx.fillRect(tx * tileSize, ty * tileSize, tileSize, tileSize);
      }
    }
  }
}

// 🔄 Lógica de inimigo
function updateEnemy(enemy) {
  const dist = Math.abs(enemy.x - player.x) + Math.abs(enemy.y - player.y);
  if (dist <= enemy.detectionRadius) {
    enemy.chasing = true;
    enemy.target = { x: player.x, y: player.y };
  } else if (enemy.chasing) {
    enemy.chasing = false;
    enemy.target = null;
    enemy.patrolOrigin = { x: enemy.x, y: enemy.y };
  }

  const tx = enemy.target?.x ?? player.x + Math.floor(Math.random() * 3 - 1);
  const ty = enemy.target?.y ?? player.y + Math.floor(Math.random() * 3 - 1);

  const blocked = walls.some(w => w.x === tx && w.y === ty) ||
                  enemies.some(e => e !== enemy && e.x === tx && e.y === ty);

  if (
    tx >= 0 && tx < gridSize &&
    ty >= 0 && ty < gridSize &&
    !blocked
  ) {
    if (enemy.x < tx) enemy.x++;
    else if (enemy.x > tx) enemy.x--;
    else if (enemy.y < ty) enemy.y++;
    else if (enemy.y > ty) enemy.y--;
  }
}

// 🎮 Loop principal
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawTileGrid();

  // 🟫 Paredes
  walls.forEach(w => drawRect(w.x, w.y, '#334155'));

  // 🧍‍♂️ Player
  drawRect(player.x, player.y, player.color);
  drawText('Você', player.x, player.y);

  // 👹 Inimigos
  enemies.forEach(enemy => {
    drawArea(enemy.x, enemy.y, enemy.patrolRadius, 'rgba(59, 130, 246, 0.15)');
    drawArea(enemy.x, enemy.y, enemy.detectionRadius, 'rgba(16, 185, 129, 0.2)');
    drawRect(enemy.x, enemy.y, enemy.color);
    drawText('Goblin', enemy.x, enemy.y);
  });
}

function loop() {
  enemies.forEach(updateEnemy);
  draw();
  requestAnimationFrame(loop);
}

loop();

// 🕹️ Movimento do player
document.addEventListener('keydown', e => {
  const dir = {
    ArrowUp: [0, -1],
    ArrowDown: [0, 1],
    ArrowLeft: [-1, 0],
    ArrowRight: [1, 0]
  }[e.key];
  if (dir) {
    const nx = player.x + dir[0];
    const ny = player.y + dir[1];

    const blocked = walls.some(w => w.x === nx && w.y === ny) ||
      enemies.some(e => e.x === nx && e.y === ny);

    if (
      nx >= 0 && nx < gridSize &&
      ny >= 0 && ny < gridSize &&
      !blocked
    ) {
      player.x = nx;
      player.y = ny;
    }
  }
});

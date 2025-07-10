const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

const tileSize = 30;
const gridSize = 50;
const mapWidth = gridSize * tileSize;
const mapHeight = gridSize * tileSize;

canvas.width = mapWidth;
canvas.height = mapHeight;

// 🎮 Game objects
const walls = [
  { x: 6, y: 5 }, { x: 7, y: 5 }, { x: 8, y: 5 },
  { x: 8, y: 6 }, { x: 8, y: 7 }, { x: 8, y: 8 }
];

const player = {
  x: 5,
  y: 5,
  color: '#E2E8F0',
  speed: 1
};

const enemies = [
  {
    id: 'enemy1',
    x: 15,
    y: 15,
    patrolOrigin: { x: 15, y: 15 },
    patrolArea: [],
    detectionRadius: 4,
    chasing: false,
    color: '#FBBF24',
    speed: 1,
    target: null
  }
];

function generatePatrolArea(enemy) {
  enemy.patrolArea = [];
  const { x, y } = enemy.patrolOrigin;
  for (let dy = -2; dy <= 2; dy++) {
    for (let dx = -2; dx <= 2; dx++) {
      const tx = x + dx;
      const ty = y + dy;
      if (tx >= 0 && ty >= 0 && tx < gridSize && ty < gridSize) {
        enemy.patrolArea.push({ x: tx, y: ty });
      }
    }
  }
}

enemies.forEach(generatePatrolArea);

// 🧱 Utility
function drawRect(x, y, color, size = tileSize) {
  ctx.fillStyle = color;
  ctx.fillRect(x * tileSize, y * tileSize, size, size);
}

function drawDot(x, y, color = '#1E293B') {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x * tileSize + 3, y * tileSize + 3, 2, 0, Math.PI * 2);
  ctx.fill();
}

function drawText(text, x, y, color = '#F1F5F9') {
  ctx.fillStyle = color;
  ctx.font = '8px Segoe UI';
  ctx.textAlign = 'center';
  ctx.fillText(text, x * tileSize + tileSize / 2, y * tileSize + tileSize + 10);
}

// 🧠 Game loop
function draw() {
  ctx.clearRect(0, 0, mapWidth, mapHeight);

  // Fundo Railway e pontos de grid
  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      drawDot(x, y);
    }
  }

  // Paredes
  walls.forEach(w => drawRect(w.x, w.y, '#334155'));

  // Player
  drawRect(player.x, player.y, player.color);
  drawText('Você', player.x, player.y);

  // Enemies
  enemies.forEach(enemy => {
    drawRect(enemy.x, enemy.y, enemy.color);
    drawText('Goblin', enemy.x, enemy.y);

    // Área de detecção (móvel e centrada)
    ctx.fillStyle = 'rgba(22, 163, 74, 0.2)';
    ctx.beginPath();
    ctx.arc(
      enemy.x * tileSize + tileSize / 2,
      enemy.y * tileSize + tileSize / 2,
      enemy.detectionRadius * tileSize,
      0,
      Math.PI * 2
    );
    ctx.fill();

    // Patrulha (quadrados fixos)
    ctx.fillStyle = 'rgba(59, 130, 246, 0.15)';
    enemy.patrolArea.forEach(pos => {
      drawRect(pos.x, pos.y, ctx.fillStyle);
    });
  });
}

function updateEnemies() {
  enemies.forEach(enemy => {
    const dist = Math.abs(enemy.x - player.x) + Math.abs(enemy.y - player.y);
    if (dist <= enemy.detectionRadius) {
      enemy.chasing = true;
      enemy.target = { x: player.x, y: player.y };
    } else {
      if (enemy.chasing) {
        enemy.chasing = false;
        enemy.patrolOrigin = { x: enemy.x, y: enemy.y };
        generatePatrolArea(enemy);
      }
    }

    const moveTarget = enemy.chasing ? enemy.target :
      enemy.patrolArea[Math.floor(Math.random() * enemy.patrolArea.length)];

    if (moveTarget && (enemy.x !== moveTarget.x || enemy.y !== moveTarget.y)) {
      if (enemy.x < moveTarget.x) enemy.x += 1;
      else if (enemy.x > moveTarget.x) enemy.x -= 1;
      else if (enemy.y < moveTarget.y) enemy.y += 1;
      else if (enemy.y > moveTarget.y) enemy.y -= 1;
    }
  });
}

function loop() {
  updateEnemies();
  draw();
  requestAnimationFrame(loop);
}

loop();

// 🎮 Movimentação com colisão
document.addEventListener('keydown', e => {
  const dir = {
    ArrowUp: [0, -1],
    ArrowDown: [0, 1],
    ArrowLeft: [-1, 0],
    ArrowRight: [1, 0]
  }[e.key];
  if (dir) {
    const newX = player.x + dir[0];
    const newY = player.y + dir[1];

    const blocked = walls.some(w => w.x === newX && w.y === newY) ||
      enemies.some(e => e.x === newX && e.y === newY);

    if (
      newX >= 0 && newX < gridSize &&
      newY >= 0 && newY < gridSize &&
      !blocked
    ) {
      player.x = newX;
      player.y = newY;
    }
  }
});

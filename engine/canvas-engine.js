const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

const tileSize = 30;
const gridSize = 50;
canvas.width = gridSize * tileSize;
canvas.height = gridSize * tileSize;

// 📊 Fórmulas de atributos por nível
function calculateStats(level) {
  return {
    level,
    xp: level * 20,
    attack: 3 + level * 2,
    defense: 2 + level * 1.5,
    speed: 1000 - level * 100 // quanto maior o nível, menor o delay
  };
}

// 🧍 Player
const player = {
  x: 5,
  y: 5,
  color: '#E2E8F0',
  ...calculateStats(1)
};

let playerDestination = null;

// ⛔ Paredes
const walls = [
  { x: 6, y: 5 }, { x: 7, y: 5 }, { x: 8, y: 5 },
  { x: 8, y: 6 }, { x: 8, y: 7 }, { x: 8, y: 8 }
];

// 👹 Inimigos
const enemies = [
  {
    id: 'enemy1',
    name: 'Goblin',
    x: 15,
    y: 15,
    color: '#FBBF24',
    ...calculateStats(2),
    detectionRadius: 4,
    patrolRadius: 2,
    chasing: false,
    target: null,
    patrolArea: [],
    lastMove: 0
  },
  {
    id: 'enemy2',
    name: 'Ogro',
    x: 35,
    y: 35,
    color: '#EF4444',
    ...calculateStats(5),
    detectionRadius: 7,
    patrolRadius: 5,
    chasing: false,
    target: null,
    patrolArea: [],
    lastMove: 0
  }
];

function generatePatrolArea(enemy) {
  const area = [];
  for (let dy = -enemy.patrolRadius; dy <= enemy.patrolRadius; dy++) {
    for (let dx = -enemy.patrolRadius; dx <= enemy.patrolRadius; dx++) {
      const tx = enemy.x + dx;
      const ty = enemy.y + dy;
      if (tx >= 0 && ty >= 0 && tx < gridSize && ty < gridSize) {
        area.push({ x: tx, y: ty });
      }
    }
  }
  enemy.patrolArea = area;
}

enemies.forEach(generatePatrolArea);

// 🎨 Grid
function drawGrid() {
  ctx.strokeStyle = '#1E293B';
  for (let i = 0; i <= gridSize; i++) {
    ctx.beginPath();
    ctx.moveTo(i * tileSize, 0);
    ctx.lineTo(i * tileSize, canvas.height);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, i * tileSize);
    ctx.lineTo(canvas.width, i * tileSize);
    ctx.stroke();
  }
}

// 📦 Render
function drawRect(x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
}

function drawNameTag(txt, x, y) {
  ctx.fillStyle = '#F8FAFC';
  ctx.font = '10px Segoe UI';
  ctx.textAlign = 'center';
  ctx.fillText(txt, x * tileSize + tileSize / 2, y * tileSize - 6);
}

function drawStats(entity, x, y) {
  ctx.fillStyle = '#F1F5F9';
  ctx.font = '8px Segoe UI';
  ctx.textAlign = 'center';
  const info = `LV:${entity.level} XP:${entity.xp} ATK:${entity.attack} DEF:${entity.defense} SPD:${Math.round(1000 / entity.speed)}`;
  ctx.fillText(info, x * tileSize + tileSize / 2, y * tileSize + tileSize + 12);
}

function drawDestinationTile(tx, ty) {
  ctx.strokeStyle = '#94A3B8';
  ctx.lineWidth = 2;
  ctx.strokeRect(tx * tileSize + 1, ty * tileSize + 1, tileSize - 2, tileSize - 2);
}

// 💠 Áreas
function drawPatrolArea(enemy) {
  ctx.fillStyle = 'rgba(59,130,246,0.15)';
  enemy.patrolArea.forEach(pos => {
    ctx.fillRect(pos.x * tileSize, pos.y * tileSize, tileSize, tileSize);
  });
}

function drawDetectionArea(enemy) {
  ctx.fillStyle = 'rgba(16,185,129,0.2)';
  ctx.beginPath();
  ctx.arc(
    enemy.x * tileSize + tileSize / 2,
    enemy.y * tileSize + tileSize / 2,
    enemy.detectionRadius * tileSize,
    0, Math.PI * 2
  );
  ctx.fill();
}

// 🔁 Inimigos
function updateEnemy(enemy) {
  const now = Date.now();
  if (now - enemy.lastMove < enemy.speed) return;
  enemy.lastMove = now;

  const dist = Math.abs(enemy.x - player.x) + Math.abs(enemy.y - player.y);
  if (dist <= enemy.detectionRadius) {
    enemy.chasing = true;
    enemy.target = { x: player.x, y: player.y };
  } else if (enemy.chasing) {
    enemy.chasing = false;
    enemy.target = null;
    generatePatrolArea(enemy);
  }

  const tx = enemy.target?.x ?? getRandomFrom(enemy.patrolArea)?.x ?? enemy.x;
  const ty = enemy.target?.y ?? getRandomFrom(enemy.patrolArea)?.y ?? enemy.y;

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

function getRandomFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// 🎯 Render principal
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawGrid();

  walls.forEach(w => drawRect(w.x, w.y, '#334155'));

  drawRect(player.x, player.y, player.color);
  drawNameTag('Você', player.x, player.y);
  drawStats(player, player.x, player.y);

  if (playerDestination) {
    drawDestinationTile(playerDestination.x, playerDestination.y);
  }

  enemies.forEach(enemy => {
    drawPatrolArea(enemy);
    drawDetectionArea(enemy);
    drawRect(enemy.x, enemy.y, enemy.color);
    drawNameTag(enemy.name, enemy.x, enemy.y);
    drawStats(enemy, enemy.x, enemy.y);
  });
}

function loop() {
  enemies.forEach(updateEnemy);
  draw();
  requestAnimationFrame(loop);
}

loop();

// ⌨️ Teclado
document.addEventListener('keydown', e => {
  const dir = {
    ArrowUp: [0, -1],
    ArrowDown: [0, 1],
    ArrowLeft: [-1, 0],
    ArrowRight: [1, 0]
  }[e.key];
  if (dir) tryMove(dir[0], dir[1]);
});

// 🖱️ Clique
canvas.addEventListener('click', e => {
  const rect = canvas.getBoundingClientRect();
  const x = Math.floor((e.clientX - rect.left) / tileSize);
  const y = Math.floor((e.clientY - rect.top) / tileSize);
  playerDestination = { x, y };
  movePlayerTo(x, y);
});

// 🧭 Movimento com colisão
function tryMove(dx, dy) {
  const nx = player.x + dx;
  const ny = player.y + dy;
  const blocked = walls.some(w => w.x === nx && w.y === ny) ||
    enemies.some(e => e.x === nx && e.y === ny);
  if (nx >= 0 && nx < gridSize && ny >= 0 && ny < gridSize && !blocked) {
    player.x = nx;
    player.y = ny;
    return true;
  }
  return false;
}

// 🚶 Movimento por clique com tentativa de contorno
function movePlayerTo(tx, ty) {
  const dx = tx - player.x;
  const dy = ty - player.y;
  const stepX = dx > 
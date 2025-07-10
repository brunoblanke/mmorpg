import { buildMap } from './engine/map.js';
import {
  createPlayerElement,
  updateHpBar,
  spawnOtherPlayer,
  moveOtherPlayer,
  removeOtherPlayer
} from './engine/player.js';
import {
  spawnEnemies,
  patrolEnemies
} from './engine/enemies.js';
import { findPath } from './engine/pathfinding.js';
import { setupSocketHandlers } from './engine/socket.js';

const socket = io();
const gridSize = 50;
const tileSize = 30;
const spawnPoint = { x: 5, y: 5 };

const $map = $('#game-map');
const $mapContainer = $('<div id="map-container"></div>').appendTo($map);

window.localPlayerID = null;
window.otherPlayers = {};
const playerPositions = {};

const walls = [
  ...Array.from({ length: 8 }, (_, i) => ({ x: 20 + i, y: 25 })),
  { x: 6, y: 5 }, { x: 7, y: 5 }, { x: 8, y: 5 },
  { x: 8, y: 6 }, { x: 8, y: 7 }, { x: 8, y: 8 },
  { x: 10, y: 10 }, { x: 11, y: 10 }, { x: 12, y: 10 }
];

const enemies = [
  {
    id: 'enemy1',
    name: 'Goblin',
    x: 15,
    y: 15,
    level: 2,
    attack: 4,
    defense: 2,
    xp: 15,
    speed: 400,
    hp: 10,
    maxHp: 10
  },
  {
    id: 'enemy2',
    name: 'Orc',
    x: 30,
    y: 30,
    level: 4,
    attack: 6,
    defense: 4,
    xp: 30,
    speed: 500,
    hp: 20,
    maxHp: 20
  }
];

// Define áreas de patrulha antes do mapa
enemies.forEach(enemy => {
  enemy.detectionRadius = 4;
  enemy.isChasing = false;
  enemy._moving = false;
  enemy.patrolOrigin = { x: enemy.x, y: enemy.y };
  enemy.patrolArea = [];
  for (let dy = -2; dy <= 2; dy++) {
    for (let dx = -2; dx <= 2; dx++) {
      const tx = enemy.x + dx;
      const ty = enemy.y + dy;
      if (tx >= 0 && ty >= 0 && tx < gridSize && ty < gridSize) {
        enemy.patrolArea.push({ x: tx, y: ty });
      }
    }
  }
});

const player = {
  x: spawnPoint.x,
  y: spawnPoint.y,
  level: 1,
  xp: 0,
  attack: 5,
  defense: 3,
  speed: 150,
  hp: 10,
  maxHp: 10
};

let moveInterval = null;

buildMap($mapContainer, gridSize, spawnPoint, walls, enemies);
spawnEnemies(enemies);
renderPlayer(); // ✅ Garante que o jogador aparece logo no início
setInterval(() => patrolEnemies(enemies, walls, player), 1500); // movimento mais dinâmico

function renderPlayer() {
  $('.player:not(.other-player):not(.enemy)').remove();
  const tile = $(`[data-x="${player.x}"][data-y="${player.y}"]`);
  const el = createPlayerElement('Você', player.hp, player.maxHp, {
    level: player.level,
    xp: player.xp,
    attack: player.attack,
    defense: player.defense,
    speed: player.speed,
    x: player.x,
    y: player.y
  });
  tile.append(el);

  $mapContainer.css({
    left: -(player.x * tileSize - $(window).width() / 2 + tileSize / 2),
    top: -(player.y * tileSize - $(window).height() / 2 + tileSize / 2)
  });

  playerPositions[window.localPlayerID] = { x: player.x, y: player.y };
  socket.emit('move', { x: player.x, y: player.y });
}

function attemptMove(x, y) {
  const isOccupied = Object.entries(playerPositions).some(([id, pos]) =>
    id !== window.localPlayerID && pos.x === x && pos.y === y
  );

  const isWall = walls.some(w => w.x === x && w.y === y);

  if (
    x >= 0 && x < gridSize &&
    y >= 0 && y < gridSize &&
    !isWall && !isOccupied
  ) {
    player.x = x;
    player.y = y;
    renderPlayer();
  }
}

function moveToTile(tx, ty) {
  if (moveInterval) clearInterval(moveInterval);

  const path = findPath(
    { x: player.x, y: player.y },
    { x: tx, y: ty },
    (x, y) =>
      walls.some(w => w.x === x && w.y === y) ||
      Object.values(playerPositions).some(p => p.x === x && p.y === y),
    gridSize
  );

  if (!path.length) return;

  $('.tile').removeClass('destination');
  $(`[data-x="${tx}"][data-y="${ty}"]`).addClass('destination');

  let step = 0;
  moveInterval = setInterval(() => {
    if (step >= path.length) {
      clearInterval(moveInterval);
      return;
    }
    attemptMove(path[step].x, path[step].y);
    step++;
  }, player.speed);
}

$('#game-map').on('click', e => {
  const offset = $mapContainer.offset();
  const x = Math.floor((e.pageX - offset.left) / tileSize);
  const y = Math.floor((e.pageY - offset.top) / tileSize);
  moveToTile(x, y);
});

$(document).on('keydown', e => {
  const dir = {
    ArrowUp: [0, -1],
    ArrowDown: [0, 1],
    ArrowLeft: [-1, 0],
    ArrowRight: [1, 0]
  }[e.key];
  if (dir) {
    if (moveInterval) clearInterval(moveInterval);
    attemptMove(player.x + dir[0], player.y + dir[1]);
  }
});

setupSocketHandlers(
  socket,
  renderPlayer,
  spawnOtherPlayer,
  moveOtherPlayer,
  removeOtherPlayer,
  playerPositions
);

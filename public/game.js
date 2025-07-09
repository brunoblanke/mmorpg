import {
  buildMap
} from './engine/map.js';
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
import {
  findPath
} from './engine/pathfinding.js';
import {
  setupSocketHandlers
} from './engine/socket.js';

// 🧩 Configurações básicas
const socket = io();
const gridSize = 50;
const tileSize = 30;
const spawnPoint = { x: 5, y: 5 };

const $map = $('#game-map');
const $mapContainer = $('<div id="map-container"></div>').appendTo($map);

// 🔧 Variáveis globais
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
    x: 15, y: 15,
    area: [{x:15,y:15},{x:16,y:15},{x:15,y:16},{x:16,y:16},{x:17,y:15}],
    level: 2, attack: 4, defense: 2, xp: 15, speed: 400,
    hp: 10, maxHp: 10
  },
  {
    id: 'enemy2',
    name: 'Orc',
    x: 30, y: 30,
    area: [
      {x:30,y:30},{x:31,y:30},{x:32,y:30},{x:30,y:31},{x:31,y:31},
      {x:32,y:31},{x:30,y:32},{x:31,y:32},{x:32,y:32},{x:33,y:31}
    ],
    level: 4, attack: 6, defense: 4, xp: 30, speed: 500,
    hp: 20, maxHp: 20
  }
];

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
setInterval(() => patrolEnemies(enemies, walls), 2000);

// 🧠 Atualiza HUD
function updateHUD() {
  $('#level').text(player.level);
  $('#xp').text(player.xp);
  $('#attack').text(player.attack);
  $('#defense').text(player.defense);
  $('#speed').text(player.speed);
  $('#position').text(`x:${player.x}, y:${player.y}`);
}

// 🎮 Renderiza o jogador local
function renderPlayer() {
  $('.player:not(.other-player):not(.enemy)').remove();
  const tile = $(`[data-x="${player.x}"][data-y="${player.y}"]`);
  const el = createPlayerElement('Você', player.hp, player.maxHp);
  tile.append(el);

  $mapContainer.css({
    left: -(player.x * tileSize - $(window).width() / 2 + tileSize / 2),
    top: -(player.y * tileSize - $(window).height() / 2 + tileSize / 2)
  });

  playerPositions[window.localPlayerID] = { x: player.x, y: player.y };
  updateHUD();
  socket.emit('move', { x: player.x, y: player.y });
}

// 🚫 Tenta mover o jogador local
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

// 🧭 Movimenta com pathfinding A*
function moveToTile(tx, ty) {
  if (moveInterval) clearInterval(moveInterval);

  const path = findPath(
    { x: player.x, y: player.y },
    { x: tx, y: ty },
    (x, y) => walls.some(w => w.x === x && w.y === y) ||
             Object.values(playerPositions).some(p => p.x === x && p.y === y),
    gridSize
  );

  if (!path.length) return;

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

// 🖱 Clique para movimentar
$('#game-map').on('click', e => {
  const offset = $mapContainer.offset();
  const x = Math.floor((e.pageX - offset.left) / tileSize);
  const y = Math.floor((e.pageY - offset.top) / tileSize);
  moveToTile(x, y);
});

// ⌨️ Movimento por teclado
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

// 🔌 Configura eventos socket
setupSocketHandlers(
  socket,
  renderPlayer,
  spawnOtherPlayer,
  moveOtherPlayer,
  removeOtherPlayer,
  playerPositions
);

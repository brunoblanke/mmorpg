import {
  player, walls, enemies, camera, canvas
} from './canvas-config.js';

import { tileSize, gridSize } from './canvas-config.js';

export const __movementQueue__ = [];

function isBlocked(x, y) {
  return (
    x < 0 || x >= gridSize || y < 0 || y >= gridSize ||
    walls.some(w => w.x === x && w.y === y) ||
    enemies.some(e => e !== player.targetEnemy && e.x === x && e.y === y && !e.dead) ||
    (player.x === x && player.y === y)
  );
}

export function tryMove(entity, dx, dy) {
  const nx = entity.x + dx;
  const ny = entity.y + dy;

  if (isBlocked(nx, ny)) return false;

  entity.x = nx;
  entity.y = ny;
  return true;
}

export function getEntityCooldown(entity) {
  return Math.max(10, 60 - entity.spd * 5);
}

export function updateCamera() {
  camera.x = player.x * tileSize - canvas.width / 2 + tileSize / 2;
  camera.y = player.y * tileSize - canvas.height / 2 + tileSize / 2;
}

export function handleClickDestination(tx, ty) {
  player.targetEnemy = null;
  const path = findPath(player.x, player.y, tx, ty);
  player.targetPath = path;
  __movementQueue__.length = 0;
  if (path) __movementQueue__.push(...path);
  console.log('🖱️ Destino clicado:', tx, ty);
  console.log('Rota gerada:', path);
}

export function handleDirectionalInput(dx, dy) {
  const nx = player.x + dx;
  const ny = player.y + dy;

  if (!isBlocked(nx, ny)) {
    player.x = nx;
    player.y = ny;
  }

  player.targetEnemy = null;
  player.targetPath = null;
  __movementQueue__.length = 0;
  console.log('⌨️ Movimento manual:', dx, dy);
}

export function releaseInput() {}

export function updatePlayerMovement() {
  if (player.cooldown > 0) {
    player.cooldown--;
    return;
  }

  if (player.targetEnemy && !player.targetEnemy.dead) {
    const tx = player.targetEnemy.x;
    const ty = player.targetEnemy.y;
    console.log('🎯 Perseguindo inimigo:', player.targetEnemy.id, '→ Posição:', tx, ty);

    const path = findPath(player.x, player.y, tx, ty);
    console.log('🔄 Rota recalculada:', path);

    if (path && path.length > 0) {
      const next = path[0];
      if (!isBlocked(next.x, next.y)) {
        player.x = next.x;
        player.y = next.y;
        player.cooldown = 8;
        player.targetPath = path;
        __movementQueue__.length = 0;
        __movementQueue__.push(...path);
        console.log('👣 Player moveu para:', next.x, next.y);
        return;
      } else {
        console.log('❌ Tile bloqueado:', next.x, next.y);
        player.targetPath = null;
      }
    } else {
      console.log('⚠️ Nenhuma rota possível para perseguição.');
    }
  }

  if (player.targetPath && player.targetPath.length > 0) {
    const next = player.targetPath.shift();
    if (!isBlocked(next.x, next.y)) {
      player.x = next.x;
      player.y = next.y;
      player.cooldown = 8;
      console.log('👣 Player moveu por caminho clicado:', next.x, next.y);
    } else {
      console.log('❌ Caminho clicado bloqueado em:', next.x, next.y);
      player.targetPath = null;
    }
  }
}

function findPath(startX, startY, targetX, targetY) {
  if (startX === targetX && startY === targetY) return [];

  const open = [];
  const closed = new Set();
  const cameFrom = {};
  const gScore = {};
  const fScore = {};

  const startKey = `${startX},${startY}`;
  gScore[startKey] = 0;
  fScore[startKey] = heuristic(startX, startY, targetX, targetY);
  open.push({ x: startX, y: startY, key: startKey });

  const directions = [
    [0,1],[1,0],[0,-1],[-1,0],
    [1,1],[1,-1],[-1,1],[-1,-1]
  ];

  while (open.length > 0) {
    open.sort((a, b) => fScore[a.key] - fScore[b.key]);
    const current = open.shift();
    const { x, y, key } = current;

    if (x === targetX && y === targetY) {
      return reconstructPath(cameFrom, key);
    }

    closed.add(key);

    for (const [dx, dy] of directions) {
      const nx = x + dx;
      const ny = y + dy;
      const neighborKey = `${nx},${ny}`;

      if (isBlocked(nx, ny) || closed.has(neighborKey)) continue;

      const tentativeG = gScore[key] + ((dx !== 0 && dy !== 0) ? 1.4 : 1);

      if (
        !gScore.hasOwnProperty(neighborKey) ||
        tentativeG < gScore[neighborKey]
      ) {
        cameFrom[neighborKey] = key;
        gScore[neighborKey] = tentativeG;
        fScore[neighborKey] = tentativeG + heuristic(nx, ny, targetX, targetY);

        if (!open.some(n => n.key === neighborKey)) {
          open.push({ x: nx, y: ny, key: neighborKey });
        }
      }
    }
  }

  return null;
}

function heuristic(x1, x2, y1, y2) {
  return Math.max(Math.abs(x1 - x2), Math.abs(y1 - y2));
}

function reconstructPath(cameFrom, currentKey) {
  const path = [];
  while (cameFrom[currentKey]) {
    const [x, y] = currentKey.split(',').map(Number);
    path.unshift({ x, y });
    currentKey = cameFrom[currentKey];
  }
  return path;
}

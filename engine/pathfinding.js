import { walls, enemies, gridSize } from './canvas-config.js';

export function findPath(start, goal) {
  const openSet = [start];
  const cameFrom = new Map();
  const gScore = new Map();
  const fScore = new Map();

  const key = (x, y) => `${x},${y}`;
  const heuristic = (a, b) => Math.abs(a.x - b.x) + Math.abs(a.y - b.y);

  gScore.set(key(start.x, start.y), 0);
  fScore.set(key(start.x, start.y), heuristic(start, goal));

  while (openSet.length > 0) {
    openSet.sort((a, b) => fScore.get(key(a.x, a.y)) - fScore.get(key(b.x, b.y)));
    const current = openSet.shift();
    const ck = key(current.x, current.y);

    if (current.x === goal.x && current.y === goal.y) {
      return reconstructPath(cameFrom, current);
    }

    for (const neighbor of getNeighbors(current)) {
      const nk = key(neighbor.x, neighbor.y);
      const tentativeG = gScore.get(ck) + 1;

      if (isBlocked(neighbor.x, neighbor.y)) continue;
      if (gScore.has(nk) && tentativeG >= gScore.get(nk)) continue;

      cameFrom.set(nk, current);
      gScore.set(nk, tentativeG);
      fScore.set(nk, tentativeG + heuristic(neighbor, goal));

      if (!openSet.find(n => n.x === neighbor.x && n.y === neighbor.y)) {
        openSet.push(neighbor);
      }
    }
  }

  return []; // Nenhum caminho encontrado
}

function reconstructPath(cameFrom, current) {
  const path = [current];
  let k = `${current.x},${current.y}`;
  while (cameFrom.has(k)) {
    current = cameFrom.get(k);
    k = `${current.x},${current.y}`;
    path.unshift(current);
  }
  return path;
}

function getNeighbors(pos) {
  const directions = [
    { x: 0, y: -1 }, // cima
    { x: 1, y: 0 },  // direita
    { x: 0, y: 1 },  // baixo
    { x: -1, y: 0 }  // esquerda
  ];

  return directions
    .map(d => ({ x: pos.x + d.x, y: pos.y + d.y }))
    .filter(n => n.x >= 0 && n.y >= 0 && n.x < gridSize && n.y < gridSize);
}

function isBlocked(x, y) {
  return walls.some(w => w.x === x && w.y === y) ||
         enemies.some(e => e.x === x && e.y === y);
}

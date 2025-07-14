import { gridSize, walls, enemies } from './canvas-config.js';

function isWalkable(x, y) {
  return (
    x >= 0 && y >= 0 && x < gridSize && y < gridSize &&
    !walls.some(w => w.x === x && w.y === y) &&
    !enemies.some(e => e.x === x && e.y === y)
  );
}

export function findPath(start, end) {
  const open = [start];
  const cameFrom = {};
  const gScore = {};
  const fScore = {};

  const key = (p) => `${p.x},${p.y}`;
  const neighbors = [
    [0, -1], [0, 1], [-1, 0], [1, 0],
    [-1, -1], [1, -1], [-1, 1], [1, 1] // 🧭 Diagonais habilitadas
  ];

  gScore[key(start)] = 0;
  fScore[key(start)] = heuristic(start, end);

  while (open.length > 0) {
    open.sort((a, b) => fScore[key(a)] - fScore[key(b)]);
    const current = open.shift();
    if (current.x === end.x && current.y === end.y) {
      return reconstructPath(cameFrom, current);
    }

    for (const [dx, dy] of neighbors) {
      const nx = current.x + dx;
      const ny = current.y + dy;
      const neighbor = { x: nx, y: ny };
      const neighborKey = key(neighbor);

      if (!isWalkable(nx, ny)) continue;

      const tentativeG = gScore[key(current)] + 1;
      if (tentativeG < (gScore[neighborKey] ?? Infinity)) {
        cameFrom[neighborKey] = current;
        gScore[neighborKey] = tentativeG;
        fScore[neighborKey] = tentativeG + heuristic(neighbor, end);

        if (!open.find(p => p.x === nx && p.y === ny)) {
          open.push(neighbor);
        }
      }
    }
  }

  return [];
}

function heuristic(a, b) {
  // 🧮 Distância diagonal
  return Math.max(Math.abs(a.x - b.x), Math.abs(a.y - b.y));
}

function reconstructPath(cameFrom, current) {
  const path = [current];
  while (cameFrom[`${current.x},${current.y}`]) {
    current = cameFrom[`${current.x},${current.y}`];
    path.unshift(current);
  }
  return path;
}

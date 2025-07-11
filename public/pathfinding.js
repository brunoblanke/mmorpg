export function findPath(start, end, isBlocked, gridSize) {
  const open = [start], cameFrom = {}, gScore = {}, fScore = {};
  const key = (x, y) => `${x},${y}`;

  gScore[key(start.x, start.y)] = 0;
  fScore[key(start.x, start.y)] = heuristic(start, end);

  while (open.length) {
    open.sort((a, b) => fScore[key(a.x, a.y)] - fScore[key(b.x, b.y)]);
    const current = open.shift();
    const k = key(current.x, current.y);

    if (current.x === end.x && current.y === end.y) return reconstructPath(cameFrom, current);

    for (const [dx, dy] of [[0,1],[1,0],[0,-1],[-1,0]]) {
      const neighbor = { x: current.x + dx, y: current.y + dy };
      const nk = key(neighbor.x, neighbor.y);

      if (neighbor.x < 0 || neighbor.y < 0 ||
          neighbor.x >= gridSize || neighbor.y >= gridSize ||
          isBlocked(neighbor.x, neighbor.y)) continue;

      const g = gScore[k] + 1;
      if (!gScore[nk] || g < gScore[nk]) {
        cameFrom[nk] = current;
        gScore[nk] = g;
        fScore[nk] = g + heuristic(neighbor, end);
        if (!open.some(n => n.x === neighbor.x && n.y === neighbor.y)) open.push(neighbor);
      }
    }
  }
  return [];
}

function heuristic(a, b) {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

function reconstructPath(cameFrom, current) {
  const path = [];
  let k = `${current.x},${current.y}`;
  path.push(current);
  while (cameFrom[k]) {
    current = cameFrom[k];
    k = `${current.x},${current.y}`;
    path.unshift(current);
  }
  return path;
}

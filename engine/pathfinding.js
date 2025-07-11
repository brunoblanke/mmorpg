export function findPath(start, goal, isBlocked, gridSize) {
  const queue = [];
  const visited = {};
  const key = (p) => `${p.x},${p.y}`;
  queue.push({ x: start.x, y: start.y, path: [] });

  while (queue.length > 0) {
    const current = queue.shift();
    const { x, y, path } = current;
    const curKey = key(current);

    if (visited[curKey]) continue;
    visited[curKey] = true;

    if (x === goal.x && y === goal.y) return [...path, { x, y }];

    const directions = [
      { x: 0, y: -1 },
      { x: 0, y: 1 },
      { x: -1, y: 0 },
      { x: 1, y: 0 }
    ];

    for (const d of directions) {
      const nx = x + d.x;
      const ny = y + d.y;
      const nextKey = `${nx},${ny}`;
      if (
        nx >= 0 && nx < gridSize &&
        ny >= 0 && ny < gridSize &&
        !visited[nextKey] &&
        !isBlocked(nx, ny)
      ) {
        queue.push({
          x: nx,
          y: ny,
          path: [...path, { x, y }]
        });
      }
    }
  }

  return [];
}

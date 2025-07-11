// Simples caminho em linha reta — substituível por algoritmo real depois

export function findPath(start, end) {
  const path = [];
  const dx = Math.sign(end.x - start.x);
  const dy = Math.sign(end.y - start.y);

  let x = start.x;
  let y = start.y;

  while (x !== end.x || y !== end.y) {
    if (x !== end.x) x += dx;
    else if (y !== end.y) y += dy;
    path.push({ x, y });
  }

  return path;
}

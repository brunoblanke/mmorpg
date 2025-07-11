export function buildMap(container, gridSize, spawnPoint, walls, enemies) {
  container.empty();

  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      const tile = $('<div class="tile"></div>');
      tile.attr('data-x', x);
      tile.attr('data-y', y);

      // Parede
      const isWall = walls.some(w => w.x === x && w.y === y);
      if (isWall) tile.addClass('wall');

      // Ponto de spawn
      if (x === spawnPoint.x && y === spawnPoint.y) {
        tile.addClass('spawn');
      }

      // Áreas visuais
      for (const enemy of enemies) {
        const inArea = enemy.area?.some(pos => pos.x === x && pos.y === y);
        const inDetect = Math.abs(enemy.x - x) + Math.abs(enemy.y - y) <= enemy.detectionRadius;

        if (inArea) tile.addClass(`area-${enemy.id}`);
        if (inDetect) tile.addClass(`detect-${enemy.id}`);
      }

      container.append(tile);
    }
  }
}

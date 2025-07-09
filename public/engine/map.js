export function buildMap(container, gridSize, spawnPoint, walls, enemies) {
  container.empty();
  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      const tile = $('<div class="tile"></div>');
      tile.attr('data-x', x);
      tile.attr('data-y', y);

      const isWall = walls.some(w => w.x === x && w.y === y);
      if (isWall) tile.addClass('wall');

      const isSpawn = x === spawnPoint.x && y === spawnPoint.y;
      if (isSpawn) tile.addClass('spawn');

      const isGoblinArea = enemies[0]?.area?.some(pos => pos.x === x && pos.y === y);
      const isOrcArea = enemies[1]?.area?.some(pos => pos.x === x && pos.y === y);

      if (isGoblinArea) tile.addClass('area-goblin');
      if (isOrcArea) tile.addClass('area-orc');

      container.append(tile);
    }
  }
}

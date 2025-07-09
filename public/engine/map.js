export function buildMap($mapContainer, gridSize, spawnPoint, walls, enemies) {
  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      const tile = $('<div>').addClass('tile').attr({ 'data-x': x, 'data-y': y });

      const isWall = walls.some(w => w.x === x && w.y === y);
      if (isWall) tile.addClass('wall');

      if (x === spawnPoint.x && y === spawnPoint.y) tile.addClass('spawn');

      if (enemies[0]?.area.some(p => p.x === x && p.y === y)) tile.addClass('area-goblin');
      if (enemies[1]?.area.some(p => p.x === x && p.y === y)) tile.addClass('area-orc');

      $mapContainer.append(tile);
    }
  }
}

$(function () {
  const socket = io();
  const gridSize = 50, tileSize = 30;
  const spawnPoint = { x: 5, y: 5 };

  const $map = $('#game-map');
  const $mapContainer = $('<div id="map-container"></div>').appendTo($map);

  let moveInterval;
  let localPlayerID;
  const otherPlayers = {};

  const player = {
    x: spawnPoint.x,
    y: spawnPoint.y,
    level: 1,
    xp: 0,
    attack: 5,
    defense: 3,
    speed: 150
  };

  const walls = [
    ...Array.from({ length: 8 }, (_, i) => ({ x: 20 + i, y: 25 })),
    { x: 6, y: 5 }, { x: 7, y: 5 }, { x: 8, y: 5 },
    { x: 8, y: 6 }, { x: 8, y: 7 }, { x: 8, y: 8 },
    { x: 10, y: 10 }, { x: 11, y: 10 }, { x: 12, y: 10 },
  ];

  // Evita que o spawn esteja em parede
  const filteredWalls = walls.filter(w => !(w.x === spawnPoint.x && w.y === spawnPoint.y));

  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      $('<div>')
        .addClass('tile')
        .attr({ 'data-x': x, 'data-y': y })
        .toggleClass('wall', filteredWalls.some(w => w.x === x && w.y === y))
        .toggleClass('spawn', x === spawnPoint.x && y === spawnPoint.y)
        .appendTo($mapContainer);
    }
  }

  function updateHUD() {
    $('#level').text(player.level);
    $('#xp').text(player.xp);
    $('#attack').text(player.attack);
    $('#defense').text(player.defense);
    $('#speed').text(player.speed);
    $('#position').text(`x:${player.x}, y:${player.y}`);
  }

  function isWall(x, y) {
    return filteredWalls.some(w => w.x === x && w.y === y);
  }

  function clearDestinationMarker() {
    $('.tile').removeClass('destination');
  }

  function markDestination(x, y) {
    clearDestinationMarker();
    $(`[data-x="${x}"][data-y="${y}"]`).addClass('destination');
  }

  function renderPlayer() {
    $('.player:not(.other-player)').remove();
    $(`[data-x="${player.x}"][data-y="${player.y}"]`).append('<div class="player"></div>');
    $mapContainer.css({
      left: -(player.x * tileSize - $(window).width() / 2 + tileSize / 2),
      top: -(player.y * tileSize - $(window).height() / 2 + tileSize / 2)
    });
    updateHUD();
    socket.emit('move', { x: player.x, y: player.y });
  }

  function attemptMove(x, y) {
    if (
      x >= 0 && x < gridSize &&
      y >= 0 && y < gridSize &&
      !isWall(x, y)
    ) {
      player.x = x;
      player.y = y;
      renderPlayer();
    }
  }

  function generatePath(x0, y0, x1, y1) {
    const path = [];
    let x = x0, y = y0;
    while (x !== x1 || y !== y1) {
      if (x < x1) x++; else if (x > x1) x--;
      else if (y < y1) y++; else if (y > y1) y--;
      path.push({ x, y });
    }
    return path;
  }

  function moveToTile(tx, ty) {
    if (moveInterval) clearInterval(moveInterval);
    const path = generatePath(player.x, player.y, tx, ty);
    markDestination(tx, ty);
    let step = 0;
    moveInterval = setInterval(() => {
      if (step >= path.length) {
        clearInterval(moveInterval);

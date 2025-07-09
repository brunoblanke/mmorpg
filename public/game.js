$(function () {
  const socket = io();
  const gridSize = 50, tileSize = 30;
  const $map = $('#game-map');
  const $mapContainer = $('<div id="map-container"></div>').appendTo($map);
  let moveInterval;
  const otherPlayers = {};
  let localPlayerID;

  const player = {
    x: 25, y: 25,
    level: 1,
    xp: 0,
    attack: 5,
    defense: 3,
    speed: 150
  };

  const walls = [...Array.from({ length: 8 }, (_, i) => ({ x: 20 + i, y: 25 }))];

  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      $('<div>')
        .addClass('tile')
        .attr({ 'data-x': x, 'data-y': y })
        .toggleClass('wall', walls.some(w => w.x === x && w.y === y))
        .appendTo($mapContainer);
    }
  }

  const updateHUD = () => {
    $('#level').text(player.level);
    $('#xp').text(player.xp);
    $('#attack').text(player.attack);
    $('#defense').text(player.defense);
    $('#speed').text(player.speed);
    $('#position').text(`x:${player.x}, y:${player.y}`);
  };

  const renderPlayer = () => {
    $('.player').remove();
    $(`[data-x="${player.x}"][data-y="${player.y}"]`).append('<div class="player"></div>');
    $mapContainer.css({
      left: -(player.x * tileSize - $(window).width() / 2 + tileSize / 2),
      top: -(player.y * tileSize - $(window).height() / 2 + tileSize / 2)
    });
    updateHUD();
    socket.emit('move', { x: player.x, y: player.y });
  };

  const isWall = (x, y) => walls.some(({ x: wx, y: wy }) => wx === x && wy === y);

  const attemptMove = (x, y) => {
    if (x >= 0 && x < gridSize && y >= 0 && y < gridSize && !isWall(x, y)) {
      player.x = x;
      player.y = y;
      renderPlayer();
    }
  };

  const generatePath = (x0, y0, x1, y1) => {
    const path = [];
    let [x, y] = [x0, y0];
    while (x !== x1 || y !== y1) {
      if (x < x1) x++; else if (x > x1) x--;
      else if (y < y1) y++; else if (y > y1) y--;
      path.push({ x, y });
    }
    return path;
  };

  const clearDestinationMarker = () => $('.tile').removeClass('destination');
  const markDestination = (x, y) => {
    clearDestinationMarker();
    $(`[data-x="${x}"][data-y="${y}"]`).addClass('destination');
  };

  const moveToTile = (tx, ty) => {
    if (moveInterval) clearInterval(moveInterval);
    const path = generatePath(player.x, player.y, tx, ty);
    markDestination(tx, ty);
    let step = 0;
    moveInterval = setInterval(() => {
      if (step >= path.length) {
        clearInterval(moveInterval);
        clearDestinationMarker();
        return;
      }
      attemptMove(path[step].x, path[step].y);
      step++;
    }, player.speed);
  };

  const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

  $('#game-map').on('click', function (e) {
    const offset = $mapContainer.offset();
    const mouseX = e.pageX - offset.left;
    const mouseY = e.pageY - offset.top;
    const x = Math.floor(mouseX / tileSize);
    const y = Math.floor(mouseY / tileSize);
    moveToTile(x, y);
  });

  $(document).on('keydown', e => {
    const dir = {
      ArrowUp: [0, -1],
      ArrowDown: [0, 1],
      ArrowLeft: [-1, 0],
      ArrowRight: [1, 0]
    }[e.key];
    if (dir) {
      if (moveInterval) clearInterval(moveInterval);
      clearDestinationMarker();
      attemptMove(player.x + dir[0], player.y + dir[1]);
    }
  });

  socket.on('init', data => {
    localPlayerID = data.id;
    for (const [id
$(function () {
  const socket = io();
  const gridSize = 50;
  const tileSize = 30;
  const $map = $('#game-map');
  const $mapContainer = $('<div id="map-container"></div>').appendTo($map);
  let moveInterval;
  let localPlayerID;
  const otherPlayers = {};

  const player = {
    x: 25, y: 25,
    level: 1,
    xp: 0,
    attack: 5,
    defense: 3,
    speed: 150 // milissegundos por passo
  };

  const walls = Array.from({ length: 8 }, (_, i) => ({ x: 20 + i, y: 25 }));

  // Construção do mapa
  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      $('<div>')
        .addClass('tile')
        .attr({ 'data-x': x, 'data-y': y })
        .toggleClass('wall', walls.some(w => w.x === x && w.y === y))
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
    return walls.some(w => w.x === x && w.y === y);
  }

  function clearDestinationMarker() {
    $('.tile').removeClass('destination');
  }

  function markDestination(x, y) {
    clearDestinationMarker();
    $(`[data-x="${x}"][data-y="${y}"]`).addClass('destination');
  }

  function renderPlayer() {
    $('.player').remove();
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
        clearDestinationMarker();
        return;
      }
      attemptMove(path[step].x, path[step].y);
      step++;
    }, player.speed);
  }

  // Clique absoluto no mapa
  $('#game-map').on('click', function (e) {
    const offset = $mapContainer.offset();
    const mouseX = e.pageX - offset.left;
    const mouseY = e.pageY - offset.top;
    const x = Math.floor(mouseX / tileSize);
    const y = Math.floor(mouseY / tileSize);
    moveToTile(x, y);
  });

  // Movimento por teclas
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

  // Socket.IO multiplayer
  socket.on('init', data => {
    localPlayerID = data.id;
    for (const [id, pos] of Object.entries(data.players)) {
      if (id !== localPlayerID) spawnOtherPlayer(id, pos);
    }
  });

  socket.on('newPlayer', ({ id, pos }) => {
    spawnOtherPlayer(id, pos);
  });

  socket.on('playerMoved', ({ id, pos }) => {
    moveOtherPlayer(id, pos);
  });

  socket.on('playerLeft', id => {
    removeOtherPlayer(id);
  });

  function spawnOtherPlayer(id, pos) {
    const el = $('<div class="player other-player"></div>');
    otherPlayers[id] = el;
    $(`[data-x="${pos.x}"][data-y="${pos.y}"]`).append(el);
  }

  function moveOtherPlayer(id, pos) {
    const el = otherPlayers[id];
    if (el) {
      el.detach();
      $(`[data-x="${pos.x}"][data-y="${pos.y}"]`).append(el);
    }
  }

  function removeOtherPlayer(id) {
    if (otherPlayers[id]) {
      otherPlayers[id].remove();
      delete otherPlayers[id];
    }
  }

  renderPlayer();
});

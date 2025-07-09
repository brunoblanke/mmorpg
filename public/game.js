$(function () {
  const socket = io();
  const gridSize = 50, tileSize = 30;
  const spawnPoint = { x: 5, y: 5 };

  const $map = $('#game-map');
  const $mapContainer = $('<div id="map-container"></div>').appendTo($map);

  let moveInterval;
  let localPlayerID;
  const otherPlayers = {};
  const playerNicknames = {};
  const playerPositions = {};

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

    const tile = $(`[data-x="${player.x}"][data-y="${player.y}"]`);
    const playerDiv = $('<div class="player"></div>');
    const nameTag = $('<div class="name-tag">Você</div>');
    playerDiv.append(nameTag);
    tile.append(playerDiv);

    $mapContainer.css({
      left: -(player.x * tileSize - $(window).width() / 2 + tileSize / 2),
      top: -(player.y * tileSize - $(window).height() / 2 + tileSize / 2)
    });

    playerPositions[localPlayerID] = { x: player.x, y: player.y };
    updateHUD();
    socket.emit('move', { x: player.x, y: player.y });
  }

  function attemptMove(x, y) {
    const isOccupied = Object.entries(playerPositions).some(([id, pos]) => {
      return id !== localPlayerID && pos.x === x && pos.y === y;
    });

    if (
      x >= 0 && x < gridSize &&
      y >= 0 && y < gridSize &&
      !isWall(x, y) &&
      !isOccupied
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
    for (const [id, pos] of Object.entries(data.players)) {
      if (id !== localPlayerID) {
        spawnOtherPlayer(id, pos);
        playerPositions[id] = pos;
      }
    }
    renderPlayer();
  });

  socket.on('newPlayer', ({ id, pos }) => {
    spawnOtherPlayer(id, pos);
    playerPositions[id] = pos;
  });

  socket.on('playerMoved', ({ id, pos }) => {
    moveOtherPlayer(id, pos);
    playerPositions[id] = pos;
  });

  socket.on('playerLeft', id => {
    removeOtherPlayer(id);
    delete playerPositions[id];
  });

  function spawnOtherPlayer(id, pos) {
    const tile = $(`[data-x="${pos.x}"][data-y="${pos.y}"]`);
    const nickname = `Jogador-${id.slice(0, 4)}`; // Nome automático

    const el = $('<div class="player other-player"></div>');
    const tag = $(`<div class="name-tag">${nickname}</div>`);
    el.append(tag);

    otherPlayers[id] = el;
    playerNicknames[id] = nickname;
    tile.append(el);
  }

  function moveOtherPlayer(id, pos) {
    const el = otherPlayers[id];
    if (el) {
      el.detach();
      const tile = $(`[data-x="${pos.x}"][data-y="${pos.y}"]`);
      tile.append(el);
    }
  }

  function removeOtherPlayer(id) {
    if (otherPlayers[id]) {
      otherPlayers[id].remove();
      delete otherPlayers[id];
      delete playerNicknames[id];
    }
  }
});

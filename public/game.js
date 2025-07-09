$(function () {
  const socket = io();
  const gridSize = 50;
  const tileSize = 30;
  const spawnPoint = { x: 5, y: 5 };

  const $map = $('#game-map');
  const $mapContainer = $('<div id="map-container"></div>').appendTo($map);

  let moveInterval;
  let localPlayerID;
  const otherPlayers = {};
  const playerPositions = {};
  const playerNicknames = {};

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

  function moveToTile(tx, ty) {
    if (moveInterval) clearInterval(moveInterval);

    const start = { x: player.x, y: player.y };
    const end = { x: tx, y: ty };

    const isBlocked = (x, y) =>
      isWall(x, y) || Object.values(playerPositions).some(pos => pos.x === x && pos.y === y);

    const path = findPath(start, end, isBlocked);
    if (!path.length) return;

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
    const nickname = `Jogador-${id.slice(0, 4)}`;
    const tile = $(`[data-x="${pos.x}"][data-y="${pos.y}"]`);
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

  function findPath(start, end, isBlocked) {
    const open = [start];
    const cameFrom = {};
    const gScore = {};
    const fScore = {};
    const key = (x, y) => `${x},${y}`;
    gScore[key(start.x, start.y)] = 0;
    fScore[key(start.x, start.y)] = heuristic(start, end);

    while (open.length) {
      open.sort((a, b) => fScore[key(a.x, a.y)] - fScore[key(b.x, b.y)]);
      const current = open.shift();
      const k = key(current.x, current.y);

      if (current.x === end.x && current.y === end.y) {
        return reconstructPath(cameFrom, current);
      }

      for (const [dx, dy] of [[0,1],[1,0],[0,-1],[-1,0]]) {
        const neighbor = { x: current.x + dx, y: current.y + dy };
        const nk = key(neighbor.x, neighbor.y);
        if (
          neighbor.x < 0 || neighbor.y < 0 ||
          neighbor.x >= gridSize || neighbor.y >= gridSize ||
          isBlocked(neighbor.x, neighbor.y)
        ) continue;

        const tentativeG = gScore[k] + 1;
        if (gScore[nk] === undefined || tentativeG < gScore[nk]) {
          cameFrom[nk] = current;
          gScore[nk] = tentativeG;
          fScore[nk] = tentativeG + heuristic(neighbor, end);
          if (!open.some(n => n.x === neighbor.x && n.y === neighbor.y)) {
            open.push(neighbor);
          }
        }
      }
    }

    return []; // Sem caminho possível
  }

  function heuristic(a, b) {
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y); // Distância Manhattan
  }

  function reconstructPath(cameFrom, current) {
    const path = [];
    let k = `${current.x},${current.y}`;
    while (cameFrom[k]) {
      current = cameFrom[k];
      k = `${current.x},${current.y}`;
      path.unshift(current);
    }
    return path;
  }
});
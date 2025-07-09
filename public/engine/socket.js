export function setupSocketHandlers(socket, renderPlayer, spawnOtherPlayer, moveOtherPlayer, removeOtherPlayer, playerPositions) {
  socket.on('init', data => {
    window.localPlayerID = data.id;
    for (const [id, pos] of Object.entries(data.players)) {
      if (id !== window.localPlayerID) {
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
}

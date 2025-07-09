export function setupSocketHandlers(socket, renderPlayer, spawnOtherPlayer, moveOtherPlayer, removeOtherPlayer, playerPositions) {
  window.localPlayerID = socket.id;

  socket.on('playerMoved', ({ id, pos }) => {
    playerPositions[id] = pos;
    if (!window.otherPlayers[id]) {
      spawnOtherPlayer(id, pos);
    } else {
      moveOtherPlayer(id, pos);
    }
  });

  socket.on('playerDisconnected', (id) => {
    delete playerPositions[id];
    removeOtherPlayer(id);
  });
}

let movementQueue = [];
let movementCooldown = 0;
let keyHeld = null;

export const __movementQueue__ = movementQueue;

export function handleClickDestination(tx, ty) {
  // cancela movimentação atual
  movementQueue = findPath({ x: player.x, y: player.y }, { x: tx, y: ty });
  keyHeld = null;
}

export function handleDirectionalInput(dx, dy) {
  // interrompe rota por clique
  movementQueue = [];
  keyHeld = { dx, dy };
}

export function releaseInput() {
  keyHeld = null;
}

export function updatePlayerMovement() {
  if (movementCooldown > 0) {
    movementCooldown--;
    return;
  }

  if (movementQueue.length > 0) {
    const next = movementQueue.shift();
    const dx = next.x - player.x;
    const dy = next.y - player.y;

    if (tryMove(player, dx, dy)) {
      movementCooldown = getEntityCooldown(player);
    } else {
      movementQueue = [];
    }

    if (movementQueue.length === 0) {
      keyHeld = null; // chegou no destino
    }

    return;
  }

  if (keyHeld) {
    const { dx, dy } = keyHeld;
    if (tryMove(player, dx, dy)) {
      movementCooldown = getEntityCooldown(player);
    } else {
      keyHeld = null;
    }
  }
}

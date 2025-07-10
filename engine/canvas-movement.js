import { player, canvas, camera, tileSize, enemies, walls } from './canvas-config.js';
import { findPath } from './pathfinding.js';
import { socket } from './multiplayer-client.js';

/**
 * Move o jogador até o tile clicado (com pathfinding).
 */
export function tryMoveTo(tile) {
  const path = findPath({ x: player.x, y: player.y }, tile);
  if (path.length > 1) {
    const final = path.at(-1);
    const moved = player.x !== final.x || player.y !== final.y;
    player.x = final.x;
    player.y = final.y;

    if (moved) {
      socket.emit('move', { x: player.x, y: player.y });
    }
  }
}

/**
 * Move uma entidade (jogador ou inimigo) em uma direção, se possível.
 */
export function tryMove(entity, dx, dy) {
  const nx = entity.x + dx;
  const ny = entity.y + dy;

  const blocked =
    nx < 0 || ny < 0 || nx >= 50 || ny >= 50 ||
    walls.some(w => w.x === nx && w.y === ny) ||
    enemies.some(e => e.x === nx && e.y === ny) ||
    (entity !== player && player.x === nx && player.y === ny);

  if (blocked) return false;

  entity.x = nx;
  entity.y = ny;

  // Se for o jogador, envia posição ao servidor
  if (entity === player) {
    socket.emit('move', { x: player.x, y: player.y });
  }

  return true;
}

/**
 * Detecta clique no mapa e tenta mover o jogador até o ponto.
 */
export function handleClickDestination(tx, ty) {
  const before = { x: player.x, y: player.y };
  tryMoveTo({ x: tx, y: ty });

  if (player.x !== before.x || player.y !== before.y) {
    socket.emit('move', { x: player.x, y: player.y });
  }
}

/**
 * Detecta comando de tecla e tenta mover o jogador.
 */
export function handleDirectionalInput(dx, dy) {
  tryMove(player, dx, dy);
}

/**
 * Atualizações futuras de movimento contínuo ou interpolado.
 * Atualmente é instantâneo.
 */
export function updatePlayerMovement() {
  // A animação de movimento pode ser implementada aqui no futuro.
}

/**
 * Centraliza a câmera no jogador.
 */
export function updateCamera() {
  camera.x = player.x * tileSize - canvas.width / 2 + tileSize / 2;
  camera.y = player.y * tileSize - canvas.height / 2 + tileSize / 2;
}

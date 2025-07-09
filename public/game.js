import { buildMap } from './engine/map.js';
import { createPlayerElement, updateHpBar } from './engine/player.js';
import { spawnEnemies, patrolEnemies } from './engine/enemies.js';
import { findPath } from './engine/pathfinding.js';
import { setupSocketHandlers } from './engine/socket.js';

// Inicialização das variáveis, player, inimigos, etc.

// Depois:
buildMap($mapContainer, gridSize, spawnPoint, walls, enemies);
spawnEnemies(enemies);
setInterval(() => patrolEnemies(enemies, walls), 2000);
setupSocketHandlers(socket, renderPlayer, spawnOtherPlayer, moveOtherPlayer, removeOtherPlayer, playerPositions);

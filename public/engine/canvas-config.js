export const canvas = document.getElementById('game-canvas');
export const ctx = canvas.getContext('2d');
export const tileSize = 32;
export const gridSize = 50;

export const camera = { x: 0, y: 0 };

export const player = {
  x: 10,
  y: 10,
  level: 5,
  xp: 350,
  atk: 18,
  def: 12,
  spd: 5,
  health: 100,
  maxHealth: 100
};

export const enemies = [
  // 👹 Inimigos de nível 1 (patrulheiros simples)
  { x: 15, y: 15, level: 1, xp: 20, atk: 6, def: 4, spd: 2, health: 30, maxHealth: 30, id: 'Goblin-1' },
  { x: 18, y: 20, level: 1, xp: 20, atk: 5, def: 4, spd: 3, health: 30, maxHealth: 30, id: 'Goblin-2' },
  { x: 25, y: 18, level: 1, xp: 20, atk: 6, def: 5, spd: 2, health: 30, maxHealth: 30, id: 'Goblin-3' },
  { x: 30, y: 12, level: 1, xp: 20, atk: 7, def: 5, spd: 2, health: 30, maxHealth: 30, id: 'Goblin-4' },
  { x: 22, y: 24, level: 1, xp: 20, atk: 5, def: 3, spd: 3, health: 30, maxHealth: 30, id: 'Goblin-5' },

  // 🧠 Inimigo de nível 8 (intermediário estratégico)
  { x: 35, y: 14, level: 8, xp: 150, atk: 25, def: 18, spd: 6, health: 90, maxHealth: 90, id: 'Ogre-Captain' },

  // 💀 Inimigo de nível 20 (chefe)
  { x: 40, y: 40, level: 20, xp: 500, atk: 40, def: 35, spd: 4, health: 150, maxHealth: 150, id: 'Shadow-Beast' }
];

export const walls = [
  // 🧱 Parede vertical — corredor oeste
  ...Array.from({ length: 10 }, (_, i) => ({ x: 12, y: i + 5 })),
  ...Array.from({ length: 8 }, (_, i) => ({ x: 20, y: i + 15 })),
  ...Array.from({ length: 6 }, (_, i) => ({ x: 32, y: i + 10 })),

  // 🧱 Parede horizontal — divisores internos
  ...Array.from({ length: 12 }, (_, i) => ({ x: i + 25, y: 22 })),
  ...Array.from({ length: 6 }, (_, i) => ({ x: i + 18, y: 32 })),
  ...Array.from({ length: 4 }, (_, i) => ({ x: i + 10, y: 38 })),

  // 🧱 Bloco fechado — canto inferior
  ...Array.from({ length: 5 }, (_, i) => ({ x: 45, y: 45 + i })),
  ...Array.from({ length: 5 }, (_, i) => ({ x: 45 + i, y: 45 })),
];

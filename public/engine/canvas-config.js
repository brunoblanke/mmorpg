export const tileSize = 50;
export const gridSize = 50;

export const canvas = document.getElementById('game');
export const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

export const camera = { x: 0, y: 0 };

export const safeZone = [
  { x: 3, y: 3 }, { x: 3, y: 4 }, { x: 4, y: 3 }, { x: 4, y: 4 }
];

export const player = {
  x: 3, y: 3,
  level: 5,
  xp: 150,
  health: 120,
  maxHealth: 120,
  atk: 10,
  def: 6,
  spd: 4
};

export const enemies = [
  { id: 'Goblin1', x: 12, y: 10, level: 1, xp: 10, health: 40, maxHealth: 40, atk: 3, def: 2, spd: 2, patrolArea: { x1: 10, y1: 8, x2: 14, y2: 12 }, cooldown: 0 },
  { id: 'Goblin2', x: 14, y: 14, level: 1, xp: 10, health: 40, maxHealth: 40, atk: 3, def: 2, spd: 2, patrolArea: { x1: 12, y1: 12, x2: 16, y2: 16 }, cooldown: 0 },
  { id: 'Goblin3', x: 20, y: 6, level: 1, xp: 10, health: 40, maxHealth: 40, atk: 3, def: 2, spd: 2, patrolArea: { x1: 18, y1: 4, x2: 22, y2: 8 }, cooldown: 0 },
  { id: 'Goblin4', x: 8, y: 18, level: 1, xp: 10, health: 40, maxHealth: 40, atk: 3, def: 2, spd: 2, patrolArea: { x1: 6, y1: 16, x2: 10, y2: 20 }, cooldown: 0 },
  { id: 'Goblin5', x: 5, y: 12, level: 1, xp: 10, health: 40, maxHealth: 40, atk: 3, def: 2, spd: 2, patrolArea: { x1: 3, y1: 10, x2: 7, y2: 14 }, cooldown: 0 },
  { id: 'Rato', x: 6, y: 22, level: 1, xp: 5, health: 30, maxHealth: 30, atk: 2, def: 1, spd: 3, patrolArea: { x1: 4, y1: 20, x2: 8, y2: 24 }, cooldown: 0 },
  { id: 'Besouro', x: 10, y: 30, level: 1, xp: 8, health: 35, maxHealth: 35, atk: 2, def: 3, spd: 1, patrolArea: { x1: 8, y1: 28, x2: 12, y2: 32 }, cooldown: 0 },
  { id: 'Troll', x: 25, y: 10, level: 7, xp: 80, health: 160, maxHealth: 160, atk: 12, def: 10, spd: 2, patrolArea: { x1: 23, y1: 8, x2: 27, y2: 12 }, cooldown: 0 },
  { id: 'OrcBruto', x: 35, y: 12, level: 6, xp: 70, health: 140, maxHealth: 140, atk: 11, def: 8, spd: 2, patrolArea: { x1: 33, y1: 10, x2: 37, y2: 14 }, cooldown: 0 },
  { id: 'EsqueletoMago', x: 42, y: 42, level: 8, xp: 100, health: 80, maxHealth: 80, atk: 15, def: 4, spd: 5, patrolArea: { x1: 40, y1: 40, x2: 44, y2: 44 }, cooldown: 0 },
  { id: 'DemônioSombrio', x: 18, y: 38, level: 9, xp: 120, health: 180, maxHealth: 180, atk: 16, def: 9, spd: 4, patrolArea: { x1: 16, y1: 36, x2: 20, y2: 40 }, cooldown: 0 },
  { id: 'ElementalFogo', x: 45, y: 5, level: 10, xp: 150, health: 200, maxHealth: 200, atk: 20, def: 6, spd: 3, patrolArea: { x1: 43, y1: 3, x2: 47, y2: 7 }, cooldown: 0 }
  {
  id: 'EsqueletoMago2', x: 42, y: 35, level: 7,
  xp: 90, health: 70, maxHealth: 70,
  atk: 14, def: 4, spd: 5,
  patrolArea: { x1: 40, y1: 33, x2: 44, y2: 37 },
  cooldown: 0
},
{
  id: 'ElementalGelo', x: 45, y: 15, level: 9,
  xp: 130, health: 180, maxHealth: 180,
  atk: 19, def: 5, spd: 4,
  patrolArea: { x1: 43, y1: 13, x2: 47, y2: 17 },
  cooldown: 0
}
];

export const walls = [
  // ✅ Removidas as paredes que bloqueavam a safeZone
  { x: 2, y: 3 }, { x: 2, y: 4 },
  { x: 5, y: 3 }, { x: 5, y: 4 },
  { x: 3, y: 5 }, { x: 4, y: 5 },

  // Restante do mapa
  ...Array.from({ length: 10 }, (_, i) => ({ x: 25 + i, y: 25 })),
  ...Array.from({ length: 5 }, (_, i) => ({ x: 30, y: 21 + i })),
  { x: 10, y: 9 }, { x: 11, y: 9 }, { x: 10, y: 11 }, { x: 11, y: 11 },
  { x: 20, y: 20 }, { x: 21, y: 20 }, { x: 22, y: 20 },
  { x: 40, y: 10 }, { x: 40, y: 11 }, { x: 41, y: 10 }, { x: 41, y: 11 },
  { x: 15, y: 5 }, { x: 15, y: 6 }, { x: 16, y: 5 },
  { x: 33, y: 33 }, { x: 34, y: 33 }, { x: 35, y: 33 },
  { x: 7, y: 28 }, { x: 8, y: 28 }, { x: 9, y: 28 },
  { x: 26, y: 8 }, { x: 27, y: 8 }, { x: 27, y: 9 },
  { x: 18, y: 40 }, { x: 19, y: 40 }, { x: 20, y: 40 }
];

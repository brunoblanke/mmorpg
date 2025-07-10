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

export const player = {
  x: 5, y: 5,
  level: 1,
  xp: 0,
  health: 100,
  maxHealth: 100,
  atk: 5,
  def: 3,
  spd: 2
};

export const enemies = [
  {
    id: 'Ogro',
    x: 10, y: 8,
    health: 100,
    maxHealth: 100,
    level: 5,
    xp: 50,
    atk: 9,
    def: 6,
    spd: 3,
    patrolArea: { x1: 8, y1: 6, x2: 12, y2: 10 },
    cooldown: 0
  },
  {
    id: 'Goblin',
    x: 15, y: 12,
    health: 80,
    maxHealth: 80,
    level: 3,
    xp: 30,
    atk: 6,
    def: 4,
    spd: 4,
    patrolArea: { x1: 13, y1: 10, x2: 17, y2: 14 },
    cooldown: 0
  }
];

export const walls = [
  { x: 7, y: 5 }, { x: 8, y: 5 }, { x: 9, y: 5 },
  { x: 10, y: 5 }, { x: 11, y: 5 }, { x: 12, y: 5 },
  { x: 12, y: 6 }, { x: 12, y: 7 }, { x: 12, y: 8 }, { x: 12, y: 9 }
];

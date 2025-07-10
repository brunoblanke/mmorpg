export const tileSize = 30;
export const gridSize = 50;
export const canvas = document.getElementById('game-canvas');
export const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

export const lerp = (a, b, t) => a + (b - a) * t;

export const camera = { x: 0, y: 0 };

export const walls = [
  { x: 6, y: 5 }, { x: 7, y: 5 }, { x: 8, y: 5 },
  { x: 8, y: 6 }, { x: 8, y: 7 }, { x: 8, y: 8 }
];

export const player = {
  x: 5,
  y: 5,
  posX: 5,
  posY: 5,
  level: 1,
  speed: 1000,
  attack: 5,
  defense: 3,
  xp: 0,
  destination: null,
  animationProgress: 1,
  color: '#E2E8F0'
};

export const enemies = [
  {
    id: 'goblin',
    name: 'Goblin',
    x: 15,
    y: 15,
    posX: 15,
    posY: 15,
    level: 2,
    speed: 800,
    attack: 4,
    defense: 2,
    xp: 15,
    detectionRadius: 4,
    patrolRadius: 2,
    animationProgress: 1,
    lastMove: 0,
    chasing: false,
    target: null,
    color: '#FBBF24'
  },
  {
    id: 'ogro',
    name: 'Ogro',
    x: 35,
    y: 35,
    posX: 35,
    posY: 35,
    level: 5,
    speed: 400,
    attack: 9,
    defense: 6,
    xp: 50,
    detectionRadius: 7,
    patrolRadius: 5,
    animationProgress: 1,
    lastMove: 0,
    chasing: false,
    target: null,
    color: '#EF4444'
  }
];

export const tileSize = 30;
export const gridSize = 50;
export const canvas = document.getElementById('game-canvas');
export const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// 🎮 Utilitário de interpolação
export function lerp(a, b, t) {
  return a + (b - a) * t;
}

// 🎮 Entidades iniciais
export const player = {
  x: 5,
  y: 5,
  posX: 5,
  posY: 5,
  color: '#E2E8F0',
  level: 1,
  speed: 1000,
  attack: 5,
  defense: 3,
  xp: 0,
  destination: null,
  animationProgress: 1
};

export const walls = [
  { x: 6, y: 5 }, { x: 7, y: 5 }, { x: 8, y: 5 },
  { x: 8, y: 6 }, { x: 8, y: 7 }, { x: 8, y: 8 }
];

export const enemies = [
  {
    id: 'goblin',
    name: 'Goblin',
    x: 15,
    y: 15,
    posX: 15,
    posY: 15,
    color: '#FBBF24',
    level: 2,
    speed: 800,
    attack: 4,
    defense: 2,
    xp: 15,
    detectionRadius: 4,
    patrolRadius: 2,
    lastMove: 0,
    chasing: false,
    target: null,
    animationProgress: 1
  },
  {
    id: 'ogro',
    name: 'Ogro',
    x: 35,
    y: 35,
    posX: 35,
    posY: 35,
    color: '#EF4444',
    level: 5,
    speed: 400,
    attack: 9,
    defense: 6,
    xp: 50,
    detectionRadius: 7,
    patrolRadius: 5,
    lastMove: 0,
    chasing: false,
    target: null,
    animationProgress: 1
  }
];

export const camera = { x: 0, y: 0 };

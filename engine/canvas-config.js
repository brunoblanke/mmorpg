export const canvas = document.getElementById('game');
canvas.width = 640;
canvas.height = 480;
export const ctx = canvas.getContext('2d');

export const tileSize = 32;
export const gridSize = 50;

export const camera = { x: 0, y: 0 };

export const player = {
  x: 2,
  y: 2,
  health: 100,
  maxHealth: 100,
  level: 1,
  atk: 5,
  def: 3,
  spd: 2
};

export const walls = [
  { x: 5, y: 5 },
  { x: 6, y: 5 }
];

export const enemies = [];

export let destination = null;

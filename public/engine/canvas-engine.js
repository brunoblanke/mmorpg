window.addEventListener('keydown', e => {
  const input = {
    ArrowUp: [0, -1], ArrowDown: [0, 1],
    ArrowLeft: [-1, 0], ArrowRight: [1, 0],
    w: [0, -1], s: [0, 1], a: [-1, 0], d: [1, 0]
  };

  if (input[e.key]) {
    const [dx, dy] = input[e.key];
    handleDirectionalInput(dx, dy);
    targetTile = null;
  }
});

window.addEventListener('keyup', () => {
  releaseInput();
});

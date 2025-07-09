export function createPlayerElement(name, hp, maxHp) {
  const div = $('<div class="player"></div>');
  const tag = $(`<div class="name-tag">${name}</div>`);
  const hpBar = $('<div class="hp-bar"><div class="hp-fill"></div></div>');
  div.append(tag, hpBar);
  updateHpBar(div, hp, maxHp);
  return div;
}

export function updateHpBar(el, hp, maxHp) {
  const percent = Math.floor((hp / maxHp) * 100);
  el.find('.hp-fill').css('width', `${percent}%`);
}

export function spawnOtherPlayer(id, pos) {
  const nickname = `Jogador-${id.slice(0, 4)}`;
  const tile = $(`[data-x="${pos.x}"][data-y="${pos.y}"]`);
  const el = createPlayerElement(nickname, 10, 10);
  el.addClass('other-player');
  tile.append(el);
  window.otherPlayers[id] = el;
}

export function moveOtherPlayer(id, pos) {
  const el = window.otherPlayers[id];
  if (el) {
    el.detach();
    const tile = $(`[data-x="${pos.x}"][data-y="${pos.y}"]`);
    tile.append(el);
  }
}

export function removeOtherPlayer(id) {
  if (window.otherPlayers[id]) {
    window.otherPlayers[id].remove();
    delete window.otherPlayers[id];
  }
}

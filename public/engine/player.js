export function createPlayerElement(name, hp, maxHp, stats = {}) {
  const div = $('<div class="player"></div>');
  const tag = $(`<div class="name-tag">${name}</div>`);
  const hpBar = $('<div class="hp-bar"><div class="hp-fill"></div></div>');

  const info = $(`
    <div class="player-info">
      LVL: ${stats.level ?? 1}<br>
      XP: ${stats.xp ?? 0}<br>
      ATK: ${stats.attack ?? 5}<br>
      DEF: ${stats.defense ?? 3}<br>
      VEL: ${stats.speed ?? 150}ms<br>
      POS: x:${stats.x ?? 0}, y:${stats.y ?? 0}
    </div>
  `);

  div.append(tag, hpBar, info);
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

  const stats = {
    level: 1, xp: 0, attack: 5, defense: 3, speed: 150,
    x: pos.x, y: pos.y
  };

  const el = createPlayerElement(nickname, 10, 10, stats);
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

    el.find('.player-info').html(`
      LVL: 1<br>
      XP: 0<br>
      ATK: 5<br>
      DEF: 3<br>
      VEL: 150ms<br>
      POS: x:${pos.x}, y:${pos.y}
    `);
  }
}

export function removeOtherPlayer(id) {
  if (window.otherPlayers[id]) {
    window.otherPlayers[id].remove();
    delete window.otherPlayers[id];
  }
}

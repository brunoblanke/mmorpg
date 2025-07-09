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

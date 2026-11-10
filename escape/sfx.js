/* 肘家班 · 极简点击音（无 BGM）
 * 给「关卡选择」等纯按钮页面用：window.ZJBSfx.click()
 */
(function () {
  'use strict';
  var ctx = null;

  function ensure() {
    if (ctx) return;
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    ctx = new AC();
  }

  function click() {
    ensure();
    if (!ctx) return;
    if (ctx.state === 'suspended') ctx.resume();
    var t = ctx.currentTime;

    var g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(0.08, t + 0.004);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.11);

    var o = ctx.createOscillator();
    o.type = 'sine';
    o.frequency.setValueAtTime(1180, t);
    o.frequency.exponentialRampToValueAtTime(520, t + 0.09);
    o.connect(g); g.connect(ctx.destination);
    o.start(t); o.stop(t + 0.13);

    var g2 = ctx.createGain();
    g2.gain.setValueAtTime(0.0001, t);
    g2.gain.linearRampToValueAtTime(0.05, t + 0.004);
    g2.gain.exponentialRampToValueAtTime(0.0001, t + 0.08);
    var o2 = ctx.createOscillator();
    o2.type = 'triangle';
    o2.frequency.setValueAtTime(240, t);
    o2.connect(g2); g2.connect(ctx.destination);
    o2.start(t); o2.stop(t + 0.1);
  }

  window.ZJBSfx = { click: click, tick: click };

  /* 任何带 .sfx 的元素自动发声；其余按钮也让页面手动调用 */
  document.addEventListener('pointerdown', function (e) {
    var el = e.target;
    if (el && el.closest && el.closest('[data-sfx]')) click();
  }, true);
})();

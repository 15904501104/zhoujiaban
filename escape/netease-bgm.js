/* 肘家班 · 主页原曲（网易云外链播放器）
 * 目标：进主页就响，不需要点按钮。
 * 现实限制：浏览器（尤其 iOS / 微信）禁止「有声音的自动播放」，
 * 必须先有一次用户手势。因此这里做成「一次遮罩」：
 *   首次进入 → 全屏提示「点击屏幕 · 播放原曲」→ 点任意处 → 音乐自动开始，遮罩消失
 *   同一次会话（sessionStorage）再进来 → 不再弹遮罩，直接加载并尝试自动播放
 * 右下角留一个小的 ♪ 开关，可随时停/开。
 */
(function () {
  'use strict';

  var SONG_ID = '2091823800';
  var KEY = 'zjb.bgm.started';
  var FRAME_ID = 'zjb-nt-frame';
  var frame = null;
  var muted = false;

  function buildSrc(auto) {
    return 'https://music.163.com/outchain/player?type=2&id=' + SONG_ID +
      '&auto=' + (auto ? 1 : 0) + '&height=66';
  }

  function ensureFrame(auto) {
    if (frame && frame.parentNode) return frame;
    frame = document.createElement('iframe');
    frame.id = FRAME_ID;
    frame.src = buildSrc(auto);
    frame.width = '330';
    frame.height = '86';
    frame.frameBorder = '0';
    frame.allow = 'autoplay';
    /* 放在屏幕外但要真实渲染，否则部分浏览器不加载音频 */
    frame.style.cssText = [
      'position:fixed', 'left:-9999px', 'top:0', 'width:330px', 'height:86px',
      'border:0', 'opacity:0.01', 'pointer-events:none'
    ].join(';');
    document.body.appendChild(frame);
    return frame;
  }

  function killFrame() {
    if (frame && frame.parentNode) frame.parentNode.removeChild(frame);
    frame = null;
  }

  function markStarted() {
    try { sessionStorage.setItem(KEY, '1'); } catch (e) {}
  }
  function startedBefore() {
    try { return sessionStorage.getItem(KEY) === '1'; } catch (e) { return false; }
  }

  /* ── 右下角小开关（可停/可开） ───────────────────────────── */
  function addToggle() {
    var b = document.createElement('button');
    b.type = 'button';
    b.textContent = '♪';
    b.title = '关闭背景音乐';
    b.style.cssText = [
      'position:fixed', 'right:12px', 'bottom:12px', 'z-index:55',
      'width:34px', 'height:34px', 'border-radius:50%', 'padding:0',
      'border:1px solid rgba(60,50,36,.28)', 'background:rgba(246,239,221,.72)',
      'color:#3c3224', 'font:16px/32px "Songti SC",Georgia,serif',
      'cursor:pointer', 'opacity:.6', '-webkit-tap-highlight-color:transparent'
    ].join(';');
    b.addEventListener('click', function (e) {
      e.stopPropagation();
      muted = !muted;
      if (muted) { killFrame(); b.textContent = '✕'; b.title = '打开背景音乐'; }
      else { ensureFrame(true); b.textContent = '♪'; b.title = '关闭背景音乐'; }
    });
    document.body.appendChild(b);
  }

  /* ── 首屏遮罩：一次点击 ──────────────────────────────────── */
  function showGate() {
    var g = document.createElement('div');
    g.id = 'zjb-bgm-gate';
    g.style.cssText = [
      'position:fixed', 'inset:0', 'z-index:60',
      'background:rgba(233,220,190,.94)',
      'display:flex', 'flex-direction:column', 'align-items:center', 'justify-content:center',
      'gap:18px', 'cursor:pointer', 'color:#3c3224',
      'font-family:"Songti SC","Songti SC",Georgia,serif',
      '-webkit-tap-highlight-color:transparent'
    ].join(';');

    var t1 = document.createElement('div');
    t1.textContent = '点击屏幕';
    t1.style.cssText = 'font-size:30px;letter-spacing:.28em;text-shadow:2px 3px 0 rgba(163,45,36,.16)';

    var t2 = document.createElement('div');
    t2.textContent = '播放原曲 · The Beginning';
    t2.style.cssText = 'font-size:15px;letter-spacing:.18em;opacity:.62';

    var t3 = document.createElement('div');
    t3.textContent = '（浏览器要求先有一次点击，之后整页自动播放）';
    t3.style.cssText = 'font-size:12px;opacity:.42;margin-top:6px';

    g.appendChild(t1); g.appendChild(t2); g.appendChild(t3);

    function go() {
      if (g.parentNode) g.parentNode.removeChild(g);
      document.removeEventListener('pointerdown', go, true);
      document.removeEventListener('touchstart', go, true);
      document.removeEventListener('keydown', go, true);
      markStarted();
      ensureFrame(true);
    }
    document.addEventListener('pointerdown', go, true);
    document.addEventListener('touchstart', go, true);
    document.addEventListener('keydown', go, true);

    document.body.appendChild(g);
  }

  function init() {
    addToggle();
    if (startedBefore()) {
      ensureFrame(true);   /* 同一会话内直接尝试播放 */
    } else {
      showGate();          /* 首屏点一次 */
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

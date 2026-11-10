/* 肘家班 · 主页背景音乐
 * 由 game4/bgm.js 提供：<audio id="bgm" src="audio/home.mp3" loop preload="auto">
 * · 首次用户手势后才播放（iOS / 微信禁止自动播放）
 * · 右上角 ♪ 开关；静音状态记在 localStorage['zjban.bgm']
 * · 音量从 0 淡入到 0.55；页面隐藏自动暂停
 * · 音频缺失 / 解码失败时按钮自动隐藏，不影响页面其它功能
 */
(function () {
  'use strict';

  var KEY = 'zjban.bgm';
  var TARGET = 0.55;
  var el, btn, started = false, muted = false, fadeTimer = 0;

  function readMuted() {
    try { return localStorage.getItem(KEY) === 'off'; } catch (e) { return false; }
  }
  function saveMuted(v) {
    try { localStorage.setItem(KEY, v ? 'off' : 'on'); } catch (e) {}
  }

  function paintBtn() {
    if (!btn) return;
    btn.textContent = muted ? '🔇' : '♪';
    btn.setAttribute('aria-label', muted ? '打开背景音乐' : '关闭背景音乐');
    btn.title = muted ? '打开背景音乐' : '关闭背景音乐';
    btn.style.opacity = muted ? '0.55' : '0.92';
  }

  function fadeTo(target, ms) {
    if (!el) return;
    clearInterval(fadeTimer);
    var from = el.volume, steps = Math.max(1, Math.round(ms / 40)), i = 0;
    fadeTimer = setInterval(function () {
      i++;
      var k = i / steps;
      if (k >= 1) { el.volume = target; clearInterval(fadeTimer); return; }
      el.volume = from + (target - from) * k;
    }, 40);
  }

  function start() {
    if (!el || started || muted) return;
    started = true;
    el.volume = 0;
    var p = el.play();
    if (p && p.catch) p.catch(function () { started = false; });
    else { /* 老浏览器 */ }
    fadeTo(TARGET, 1400);
  }

  function toggle() {
    muted = !muted;
    saveMuted(muted);
    paintBtn();
    if (!el) return;
    if (muted) {
      fadeTo(0, 260);
      setTimeout(function () { if (muted && el) el.pause(); }, 300);
    } else {
      started = false;
      start();
    }
  }

  function init() {
    muted = readMuted();

    el = document.getElementById('bgm');
    if (!el) {
      el = document.createElement('audio');
      el.id = 'bgm';
      el.src = 'audio/home.mp3';
      el.loop = true;
      el.preload = 'auto';
      el.setAttribute('playsinline', '');
      document.body.appendChild(el);
    }
    el.volume = 0;

    btn = document.createElement('button');
    btn.type = 'button';
    btn.style.cssText = [
      'position:fixed', 'right:16px', 'top:16px', 'z-index:30',
      'width:42px', 'height:42px', 'border-radius:50%',
      'border:1px solid rgba(60,50,36,.35)', 'background:rgba(246,239,221,.88)',
      'color:#3c3224', 'font:20px/40px "Songti SC",Georgia,serif',
      'text-align:center', 'cursor:pointer', 'padding:0',
      'box-shadow:0 1px 6px rgba(60,50,36,.18)',
      '-webkit-tap-highlight-color:transparent', 'user-select:none'
    ].join(';');
    btn.addEventListener('click', function (e) { e.stopPropagation(); toggle(); });
    document.body.appendChild(btn);
    paintBtn();

    el.addEventListener('error', function () {
      if (btn) btn.style.display = 'none';
    });

    /* 首次手势：任意位置点一下就开始（按钮自己已处理） */
    function firstGesture(e) {
      if (e && e.target === btn) return;
      start();
      document.removeEventListener('pointerdown', firstGesture, true);
      document.removeEventListener('touchstart', firstGesture, true);
      document.removeEventListener('keydown', firstGesture, true);
    }
    if (!muted) {
      document.addEventListener('pointerdown', firstGesture, true);
      document.addEventListener('touchstart', firstGesture, true);
      document.addEventListener('keydown', firstGesture, true);
    }

    document.addEventListener('visibilitychange', function () {
      if (!el) return;
      if (document.hidden) { el.pause(); }
      else if (!muted && started) { el.play().catch(function () {}); }
    });

    /* 暴露给关卡页做「进入游戏时压低音乐」，同标签页跳转后失效，故仅本页用 */
    window.ZJBBGM = {
      duck: function () { if (el && !muted) fadeTo(0.18, 600); },
      unduck: function () { if (el && !muted) fadeTo(TARGET, 600); }
    };
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

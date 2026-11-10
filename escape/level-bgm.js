/* 肘家班 · 关卡内背景音乐（合成版）
 * 与主页《The Beginning》同一路数：温暖的七和弦、钢琴分解、磁带底噪。
 * 这一版比首页稍快一点（92 BPM），加了沙锤和上行的旋律，整体更明快。
 * 自包含：不加载任何音频文件；第一次用户手势后自动开始；左下角 ♪ 可关闭。
 */
(function () {
  'use strict';

  var BPM = 92;
  var BEAT = 60 / BPM;
  var BAR = BEAT * 4;

  /* Cmaj7 – Am7 – Fmaj7 – G6，整体比首页高一个色彩 */
  var CHORDS = [
    [48, 55, 59, 64],
    [45, 52, 57, 60],
    [41, 48, 53, 57],
    [43, 50, 55, 59]
  ];
  var ARP = [0, 1, 2, 3, 2, 1, 2, 3];
  /* 每小节一个长音，落在第三拍，避免太"练习曲" */
  var MEL = [76, 0, 81, 0, 77, 0, 83, 0];

  var ctx = null, master = null, delay = null, wet = null;
  var timer = 0, nextTime = 0, bar = 0, muted = false, running = false;
  var btn = null, noiseBuf = null, allNodes = [];

  function noteHz(m) { return 440 * Math.pow(2, (m - 69) / 12); }
  function now() { return ctx ? ctx.currentTime : 0; }

  function mkNoise(seconds) {
    var len = Math.floor((seconds || 2) * ctx.sampleRate);
    var b = ctx.createBuffer(1, len, ctx.sampleRate);
    var d = b.getChannelData(0), last = 0;
    for (var i = 0; i < len; i++) {
      var w = Math.random() * 2 - 1;
      last = (last + 0.02 * w) / 1.02;
      d[i] = last * 3.2;
    }
    return b;
  }

  function tone(o) {
    if (!ctx) return;
    var t = o.t || now();
    var osc = ctx.createOscillator();
    osc.type = o.type || 'sine';
    osc.frequency.setValueAtTime(o.f || 440, t);

    var g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(Math.max(0.0002, o.gain || 0.08), t + (o.attack || 0.008));
    if (o.decay) {
      g.gain.exponentialRampToValueAtTime(0.0001, t + o.decay);
    } else {
      g.gain.setValueAtTime(o.gain || 0.08, t + (o.dur || 1));
      g.gain.exponentialRampToValueAtTime(0.0001, t + (o.dur || 1) + (o.rel || 0.12));
    }

    var out = g;
    if (o.filter) {
      var f = ctx.createBiquadFilter();
      f.type = o.filter.type || 'lowpass';
      f.frequency.value = o.filter.f || 1200;
      if (o.filter.q) f.Q.value = o.filter.q;
      g.connect(f); out = f;
    }
    osc.connect(g);

    if (o.vibrato) {
      var lfo = ctx.createOscillator(), lg = ctx.createGain();
      lfo.frequency.value = o.vibrato.rate || 5;
      lg.gain.value = o.vibrato.depth || 4;
      lfo.connect(lg); lg.connect(osc.frequency);
      lfo.start(t); lfo.stop(t + (o.dur || 1) + 0.3);
      allNodes.push(lfo);
    }

    var dest = (o.wet && wet) ? wet : master;
    out.connect(dest);
    osc.start(t);
    osc.stop(t + (o.decay || ((o.dur || 1) + (o.rel || 0.2))));
    allNodes.push(osc);
    if (allNodes.length > 400) allNodes.splice(0, 200);
  }

  function piano(m, t, dur, gain) {
    tone({ type: 'triangle', f: noteHz(m), t: t, gain: gain, decay: dur });
    tone({ type: 'sine', f: noteHz(m + 12), t: t, gain: gain * 0.35, decay: dur * 0.7 });
  }

  function pad(m, t, dur, gain) {
    [0, -7].forEach(function (detune) {
      var o = ctx.createOscillator(), g = ctx.createGain(), f = ctx.createBiquadFilter();
      o.type = 'sawtooth';
      o.frequency.value = noteHz(m);
      o.detune.value = detune;
      f.type = 'lowpass'; f.frequency.value = 900;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.linearRampToValueAtTime(gain, t + 0.6);
      g.gain.linearRampToValueAtTime(0.0001, t + dur);
      o.connect(f); f.connect(g); g.connect(master);
      o.start(t); o.stop(t + dur + 0.1);
      allNodes.push(o);
    });
  }

  function shaker(t) {
    if (!noiseBuf) noiseBuf = mkNoise(1);
    var src = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain();
    src.buffer = noiseBuf;
    f.type = 'highpass'; f.frequency.value = 5200;
    g.gain.setValueAtTime(0.02, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.055);
    src.connect(f); f.connect(g); g.connect(master);
    src.start(t); src.stop(t + 0.08);
  }

  function barAt(t, i) {
    var ch = CHORDS[i % CHORDS.length];
    /* 低音：一、三拍 */
    piano(ch[0] - 12, t, BEAT * 1.6, 0.10);
    piano(ch[0] - 12, t + BEAT * 2, BEAT * 1.2, 0.075);
    /* 分解和弦：八分音符，后半拍稍轻 */
    for (var s = 0; s < 8; s++) {
      var m = ch[ARP[s]] + (s >= 4 ? 0 : 0);
      var tt = t + s * BEAT * 0.5;
      piano(m, tt, BEAT * 0.9, s % 2 === 0 ? 0.075 : 0.05);
      if (s % 2 === 1) shaker(tt);
    }
    /* 铺底 */
    pad(ch[1], t, BAR, 0.02);
    /* 长音旋律 */
    var mel = MEL[i % MEL.length];
    if (mel) tone({ type: 'sine', f: noteHz(mel), t: t + BEAT * 1.5, gain: 0.05, dur: BEAT * 2.2, wet: 1 });
  }

  function tick() {
    if (!running || !ctx) return;
    while (nextTime < ctx.currentTime + 0.45) {
      barAt(nextTime, bar);
      bar++;
      nextTime += BAR;
    }
  }

  function ensure() {
    if (ctx) return true;
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return false;
    ctx = new AC();

    master = ctx.createGain();
    master.gain.value = 0;
    master.connect(ctx.destination);

    delay = ctx.createDelay(1.0);
    delay.delayTime.value = 0.33;
    var fb = ctx.createGain(); fb.gain.value = 0.26;
    wet = ctx.createGain(); wet.gain.value = 0.17;
    delay.connect(fb); fb.connect(delay);
    delay.connect(wet); wet.connect(master);
    master.connect(delay) /* 干声也送一点进延迟 */;

    return true;
  }

  function fade(target, ms) {
    if (!master) return;
    var t = ctx.currentTime;
    master.gain.cancelScheduledValues(t);
    master.gain.setValueAtTime(Math.max(0.0001, master.gain.value), t);
    master.gain.linearRampToValueAtTime(Math.max(0.0001, target), t + ms / 1000);
  }

  function start() {
    if (muted) return;
    if (!ensure()) return;
    if (ctx.state === 'suspended') ctx.resume();
    if (running) return;
    running = true;
    nextTime = ctx.currentTime + 0.12;
    bar = 0;
    tick();
    timer = setInterval(tick, 60);
    fade(0.45, 900);
  }

  function stop(hard) {
    running = false;
    clearInterval(timer);
    if (!ctx) return;
    if (hard) {
      try { ctx.close(); } catch (e) {}
      ctx = null; master = null; wet = null; delay = null;
      return;
    }
    fade(0, 400);
  }

  function click() {
    if (!ensure()) return;
    if (ctx.state === 'suspended') ctx.resume();
    var t = ctx.currentTime;
    tone({ type: 'sine', f: 1180, t: t, gain: 0.07, decay: 0.06 });
    tone({ type: 'triangle', f: 520, t: t + 0.012, gain: 0.05, decay: 0.09 });
    tone({ type: 'triangle', f: 240, t: t + 0.014, gain: 0.04, decay: 0.10 });
  }

  function paint() {
    if (!btn) return;
    btn.textContent = muted ? '🔇' : '♪';
    btn.style.opacity = muted ? '0.5' : '0.62';
  }

  function toggle() {
    muted = !muted;
    try { localStorage.setItem('zjban.levelbgm', muted ? 'off' : 'on'); } catch (e) {}
    paint();
    if (muted) stop(false);
    else { running = false; start(); }
  }

  function addButton() {
    btn = document.createElement('button');
    btn.type = 'button';
    btn.title = '关卡音乐';
    btn.style.cssText = [
      'position:fixed', 'left:12px', 'bottom:12px', 'z-index:45',
      'width:34px', 'height:34px', 'border-radius:50%', 'padding:0',
      'border:1px solid rgba(60,50,36,.3)', 'background:rgba(246,239,221,.8)',
      'color:#3c3224', 'font:16px/32px serif', 'cursor:pointer',
      'opacity:0.62', '-webkit-tap-highlight-color:transparent'
    ].join(';');
    btn.addEventListener('click', function (e) { e.stopPropagation(); toggle(); });
    document.body.appendChild(btn);
    paint();
  }

  function boot() {
    try { muted = localStorage.getItem('zjban.levelbgm') === 'off'; } catch (e) {}
    addButton();

    function first(e) {
      if (e && e.target === btn) return;
      document.removeEventListener('pointerdown', first, true);
      document.removeEventListener('touchstart', first, true);
      document.removeEventListener('keydown', first, true);
      if (!muted) start();
    }
    document.addEventListener('pointerdown', first, true);
    document.addEventListener('touchstart', first, true);
    document.addEventListener('keydown', first, true);

    document.addEventListener('visibilitychange', function () {
      if (!ctx) return;
      if (document.hidden) ctx.suspend();
      else if (!muted && running) ctx.resume();
    });
  }

  window.ZJBLevel = {
    start: function () { running = false; start(); },
    stop: function () { stop(false); },
    click: click,
    duck: function () { fade(0.08, 300); },
    unduck: function () { if (!muted) fade(0.45, 500); }
  };
  window.ZJBSfx = window.ZJBSfx || { tick: click };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();

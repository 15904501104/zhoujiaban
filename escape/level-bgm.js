/* 肘家班 · 关卡内背景音乐（合成版）
 * 与主页《The Beginning》同一路数：温暖的七和弦、钢琴分解、磁带底噪。
 * 这一版比首页稍快一点（92 BPM），加了沙锤和上行的旋律，整体更明快。
 * 自包含：不加载任何音频文件；第一次用户手势后自动开始；左下角 ♪ 可关闭。
 */
(function () {
  'use strict';

  /* 两种气质：
   * calm = 主页用的慢速 lo-fi 钢琴（66 BPM、A 小调、磁带底噪、无鼓）
   * up   = 关卡选择/关卡内用的明快版（92 BPM、沙锤）
   * 页面在引入本文件前设置 window.ZJB_BGM_STYLE = 'calm' | 'up'，或用 ?bgm=up 覆盖。
   */
  var STYLE_NAME = window.ZJB_BGM_STYLE || (/[?&]bgm=up/.test(location.search) ? 'up' : 'calm');
  var STYLES = {
    calm: {
      BPM: 66,
      CHORDS: [[45, 52, 57, 60], [41, 48, 53, 57], [48, 55, 59, 64], [43, 50, 55, 59]],
      ARP: [0, 2, 1, 3, 2, 3, 1, 2],
      MEL: [76, 0, 0, 72, 0, 74, 0, 0],
      shaker: false, hiss: true, pad: 0.028, arpGain: 0.085, master: 0.42
    },
    up: {
      BPM: 92,
      CHORDS: [[48, 55, 59, 64], [45, 52, 57, 60], [41, 48, 53, 57], [43, 50, 55, 59]],
      ARP: [0, 1, 2, 3, 2, 1, 2, 3],
      MEL: [76, 0, 81, 0, 77, 0, 83, 0],
      shaker: true, hiss: false, pad: 0.02, arpGain: 0.075, master: 0.45
    }
  };
  var CFG = STYLES[STYLE_NAME] || STYLES.calm;
  var BPM = CFG.BPM;
  var BEAT = 60 / BPM;
  var BAR = BEAT * 4;
  var CHORDS = CFG.CHORDS;
  var ARP = CFG.ARP;
  var MEL = CFG.MEL;

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
      piano(m, tt, BEAT * 0.9, s % 2 === 0 ? CFG.arpGain : CFG.arpGain * 0.66);
      if (CFG.shaker && s % 2 === 1) shaker(tt);
    }
    /* 铺底 */
    pad(ch[1], t, BAR, CFG.pad);
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

  var hissSrc = null;

  /* 磁带底噪（只在 calm 用）：一层很轻的带限噪声，让钢琴不那么"干净电子味" */
  function hissBed() {
    if (!ctx || hissSrc) return;
    if (!noiseBuf) noiseBuf = mkNoise(4);
    var src = ctx.createBufferSource();
    src.buffer = noiseBuf;
    src.loop = true;
    var f = ctx.createBiquadFilter();
    f.type = 'bandpass'; f.frequency.value = 1600; f.Q.value = 0.5;
    var g = ctx.createGain();
    g.gain.value = 0.012;
    src.connect(f); f.connect(g); g.connect(master);
    src.start();
    hissSrc = src;
  }

  function start() {
    if (muted) return;
    if (!ensure()) return;
    var go = function () {
      if (running) return;
      running = true;
      bar = 0;
      nextTime = ctx.currentTime + 0.12;   /* resume 之后再排程，避免音符落在"过去" */
      tick();
      clearInterval(timer);
      timer = setInterval(tick, 60);
      if (CFG.hiss) hissBed();
      fade(CFG.master, 1200);
    };
    if (ctx.state === 'suspended' && ctx.resume) {
      try { ctx.resume().then(go)['catch'](go); } catch (e) { go(); }
    } else {
      go();
    }
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

  var hint = null;

  function hideHint() {
    if (!hint) return;
    hint.style.opacity = '0';
    setTimeout(function () {
      if (hint && hint.parentNode) hint.parentNode.removeChild(hint);
      hint = null;
    }, 800);
  }

  function addHint() {
    hint = document.createElement('div');
    hint.id = 'zjb-bgm-hint';
    hint.textContent = '轻触任意处开始';
    hint.style.cssText = [
      'position:fixed', 'left:50%', 'top:52%', 'transform:translate(-50%,-50%)',
      'z-index:46', 'pointer-events:none', 'user-select:none',
      'font:14px/1 serif', 'letter-spacing:0.2em', 'white-space:nowrap',
      'color:rgba(60,50,36,.62)', 'text-shadow:0 1px 0 rgba(255,252,244,.75)',
      'opacity:0', 'transition:opacity .7s ease'
    ].join(';');
    document.body.appendChild(hint);
    setTimeout(function () { if (hint) hint.style.opacity = '1'; }, 30);
    setTimeout(hideHint, 1600);
  }

  function paint() {
    if (!btn) return;
    btn.textContent = muted ? '🔇' : '♪';
    btn.style.opacity = muted ? '0.5' : '0.62';
    /* 起播前不显示，避免"要点这个按钮"的错觉；开声后才作为静音开关出现 */
    btn.style.display = (running || muted) ? 'block' : 'none';
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
    /* 每次进页面都默认开音乐：清掉旧的 'off'，避免"上次静音过就永远没声" */
    try { localStorage.removeItem('zjban.levelbgm'); } catch (e) {}
    muted = false;
    addButton();
    addHint();

    function first(e) {
      if (e && e.target === btn) return;
      document.removeEventListener('pointerdown', first, true);
      document.removeEventListener('touchstart', first, true);
      document.removeEventListener('keydown', first, true);
      hideHint();
      start();
      paint();
      /* 兜底：个别浏览器首个手势里 resume 仍被拖到下一帧 */
      setTimeout(function () {
        if (!muted && ctx && ctx.state === 'suspended' && ctx.resume) {
          ctx.resume()['catch'](function () {});
          running = false; start();
        }
      }, 600);
    }
    document.addEventListener('pointerdown', first, true);
    document.addEventListener('touchstart', first, true);
    document.addEventListener('keydown', first, true);

    /* 先尝试零交互自动播放：有些环境（曾在站点交互过 / 系统允许自动播放 /
       本地带 autoplay 参数的浏览器）能直接 running，就不再需要任何点击。 */
    function tryAuto() {
      if (muted || running) return;
      start();
      setTimeout(function () {
        if (!ctx) return;
        if (ctx.state !== 'running') { stop(true); }        /* 被拦：静默等第一次手势 */
        else {
          document.removeEventListener('pointerdown', first, true);
          document.removeEventListener('touchstart', first, true);
          document.removeEventListener('keydown', first, true);
          hideHint(); paint();
        }
      }, 350);
    }
    tryAuto();
    setTimeout(tryAuto, 900);

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
    unduck: function () { if (!muted) fade(0.45, 500); },
    diag: function () {
      return {
        hasCtx: !!ctx,
        state: ctx ? ctx.state : 'none',
        running: running,
        muted: muted,
        master: master ? Math.round(master.gain.value * 1000) / 1000 : null,
        bar: bar,
        now: ctx ? Math.round(ctx.currentTime * 10) / 10 : 0
      };
    },
    beep: function () {
      if (!ensure()) return 'no-ctx';
      var go = function () { tone({ type: 'sine', f: 660, t: now() + 0.02, gain: 0.35, dur: 0.5 }); return 'ok'; };
      if (ctx.state === 'suspended' && ctx.resume) { ctx.resume(); }
      return go();
    }
  };
  window.ZJBSfx = window.ZJBSfx || { tick: click };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();

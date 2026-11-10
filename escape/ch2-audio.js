/* 周家班 · 逃生 —— 第一关场景声（纯 WebAudio 合成，无外部音频文件）
 *
 * 目标：站前广场 vs 盒饭店，一听就能分清；事件声（喇叭/报站/炒菜/人声）要"像真的"。
 *
 * 现实感靠四件事：
 *   1) 距离感——远处的声音低通 + 混响 + 更轻；
 *   2) 混响——程序生成脉冲响应（IR），室外短、室内长；
 *   3) 泛音结构——金属是"非谐波"分音，人声是"声门脉冲 + 共振峰"；
 *   4) 随机与不完美——音高抖动、间隔不均、偶尔抢话。
 *
 * 对外接口：window.ZJBAudio = { start, unlock, stop, win, setRoom, click }
 */
(function () {
  'use strict';

  var ctx = null, master = null;
  var gStreet = null, gShopBed = null, gShopBgm = null, gWin = null;
  var revStreetIn = null, revShopIn = null;
  var timers = [], bgmTimer = null, pollTimer = null;
  var running = false, started = false, muted = false, room = '';
  var bgmNext = 0, bgmBar = 0;

  var BGM_BPM = 104;
  var BG_BEAT = 60 / BGM_BPM;
  var CH = [[48, 55, 59, 64], [43, 50, 55, 59], [45, 52, 57, 60], [41, 48, 53, 57]];

  /* 真实录音层：有文件就用文件，没有就退回合成 */
  var MIX = { cook: 1, crowd: 1, station: 1 };
  var MIXREF = {};
  var LAYERS = [];

  function hz(m) { return 440 * Math.pow(2, (m - 69) / 12); }
  function rnd(a, b) { return a + Math.random() * (b - a); }
  function t0() { return ctx ? ctx.currentTime : 0; }

  function ensure() {
    if (ctx) return true;
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return false;
    try { ctx = new AC(); } catch (e) { return false; }
    master = ctx.createGain();
    master.gain.value = 0.0001;
    master.connect(ctx.destination);
    return true;
  }

  /* ---------- 噪声 ---------- */
  function noiseBuffer(sec) {
    var n = Math.floor(ctx.sampleRate * sec);
    var buf = ctx.createBuffer(1, n, ctx.sampleRate);
    var d = buf.getChannelData(0);
    var last = 0;
    for (var i = 0; i < n; i++) {
      var w = Math.random() * 2 - 1;
      last = (last + 0.02 * w) / 1.02;
      d[i] = last * 3.2;
    }
    return buf;
  }

  var _noise = null;
  function noiseSrc(loop) {
    if (!_noise) _noise = noiseBuffer(2.5);
    var s = ctx.createBufferSource();
    s.buffer = _noise;
    s.loop = !!loop;
    return s;
  }

  function loopNoise(dest, gain, type, freq, q) {
    var s = noiseSrc(true);
    var f = ctx.createBiquadFilter();
    f.type = type || 'lowpass';
    f.frequency.value = freq || 800;
    if (q) f.Q.value = q;
    var g = ctx.createGain();
    g.gain.value = gain;
    s.connect(f); f.connect(g); g.connect(dest);
    s.start();
    return { src: s, f: f, g: g };
  }

  /* ---------- 程序化混响（IR） ---------- */
  function makeIR(seconds, decay, damp) {
    var n = Math.floor(ctx.sampleRate * seconds);
    var buf = ctx.createBuffer(2, n, ctx.sampleRate);
    for (var c = 0; c < 2; c++) {
      var d = buf.getChannelData(c), lp = 0;
      for (var i = 0; i < n; i++) {
        var k = i / n;
        var white = Math.random() * 2 - 1;
        lp = lp + (damp || 0.55) * (white - lp);   /* 简单低通，模拟墙面吸高频 */
        d[i] = lp * Math.pow(1 - k, 2.2) * Math.pow(1 - k, decay);
      }
    }
    return buf;
  }

  function reverb(seconds, decay, damp, wet, dest) {
    var conv = ctx.createConvolver();
    conv.buffer = makeIR(seconds, decay, damp);
    var g = ctx.createGain();
    g.gain.value = wet;
    conv.connect(g); g.connect(dest);
    return conv;
  }

  /* ---------- 基本音：带泛音、带包络 ---------- */
  function tone(o) {
    var t = o.t || t0();
    var dur = o.dur || 0.3;
    var osc = ctx.createOscillator();
    osc.type = o.type || 'sine';
    osc.frequency.setValueAtTime(o.f, t);
    if (o.f2) osc.frequency.exponentialRampToValueAtTime(o.f2, t + dur);

    var g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(o.gain || 0.05, t + (o.attack || 0.008));
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);

    var node = g;
    if (o.bp) {
      var b = ctx.createBiquadFilter();
      b.type = 'bandpass'; b.frequency.value = o.bp; b.Q.value = o.q || 1.2;
      g.connect(b); node = b;
    }
    if (o.lp) {
      var l = ctx.createBiquadFilter();
      l.type = 'lowpass'; l.frequency.value = o.lp;
      node.connect(l); node = l;
    }
    osc.connect(g);
    node.connect(o.dest || master);
    if (o.send) node.connect(o.send);
    osc.start(t);
    osc.stop(t + dur + 0.05);

    /* 泛音：金属/号角靠它 */
    if (o.partials) {
      for (var i = 0; i < o.partials.length; i++) {
        tone({
          type: o.type, f: o.f * o.partials[i][0], t: t + (o.partials[i][2] || 0),
          dur: dur * (o.partials[i][1] || 0.9), gain: (o.gain || 0.05) * (o.partials[i][3] || 0.3),
          attack: 0.004, dest: o.dest, lp: o.lp, send: o.send
        });
      }
    }
  }

  /* 非谐波金属敲击（碗碟/锅铲） */
  function metal(t, base, gain, dest) {
    var parts = [[1, 1, 0], [1.58, 0.55, 0.004], [2.31, 0.38, 0.006], [2.97, 0.22, 0.01]];
    for (var i = 0; i < parts.length; i++) {
      tone({
        type: 'sine', f: base * parts[i][0], t: t + parts[i][2],
        dur: 0.22 / (1 + i * 0.5), gain: gain * parts[i][1], attack: 0.002, dest: dest
      });
    }
  }

  /* ---------- 人声：声门脉冲 + 共振峰 ---------- */
  var VOWELS = [
    [730, 1090, 2440],  /* a */
    [530, 1840, 2480],  /* e */
    [270, 2290, 3010],  /* i */
    [570, 840, 2410],   /* o */
    [300, 870, 2240]    /* u */
  ];

  function voiceSyl(t, f0, dur, gain, vowel, dest, pan) {
    var v = vowel || VOWELS[Math.floor(Math.random() * VOWELS.length)];
    var src = ctx.createOscillator();
    src.type = 'sawtooth';
    src.frequency.setValueAtTime(f0, t);
    /* 语调：句尾下滑 / 句首上扬 */
    src.frequency.linearRampToValueAtTime(f0 * rnd(0.94, 1.06), t + dur * 0.75);

    var pre = ctx.createGain();
    pre.gain.value = 0.5;

    var mix = ctx.createGain();
    mix.gain.value = 0;

    /* 三个共振峰 */
    var F = [v[0], v[1], v[2]], G = [1.0, 0.55, 0.22];
    for (var i = 0; i < 3; i++) {
      var bp = ctx.createBiquadFilter();
      bp.type = 'bandpass';
      bp.frequency.value = F[i] * rnd(0.96, 1.04);
      bp.Q.value = (i === 0 ? 7 : 11);
      var gg = ctx.createGain();
      gg.gain.value = G[i];
      src.connect(bp); bp.connect(gg); gg.connect(mix);
    }
    /* 一点直通，让声音不至于太"电子" */
    var direct = ctx.createGain();
    direct.gain.value = 0.05;
    src.connect(direct); direct.connect(mix);

    var env = ctx.createGain();
    env.gain.setValueAtTime(0.0001, t);
    env.gain.linearRampToValueAtTime(gain, t + Math.min(0.05, dur * 0.35));
    env.gain.setValueAtTime(gain, t + dur * 0.55);
    env.gain.exponentialRampToValueAtTime(0.0001, t + dur);

    mix.connect(env);
    var out = env;
    if (pan !== undefined && ctx.createStereoPanner) {
      var p = ctx.createStereoPanner();
      p.pan.value = pan;
      env.connect(p); out = p;
    }
    out.connect(dest);

    /* 辅音：开头一小段噪声，像"说"而不是"哼" */
    if (Math.random() < 0.65) {
      var c = noiseSrc(false);
      var cf = ctx.createBiquadFilter();
      cf.type = 'bandpass';
      cf.frequency.value = rnd(1800, 4200);
      cf.Q.value = 1.4;
      var cg = ctx.createGain();
      cg.gain.setValueAtTime(0.0001, t);
      cg.gain.linearRampToValueAtTime(gain * 0.55, t + 0.006);
      cg.gain.exponentialRampToValueAtTime(0.0001, t + 0.05);
      c.connect(cf); cf.connect(cg); cg.connect(out);
      c.start(t); c.stop(t + 0.08);
    }

    src.start(t);
    src.stop(t + dur + 0.05);
  }

  /* ---------- 室外 ---------- */
  function buildStreet() {
    gStreet = ctx.createGain();
    gStreet.gain.value = 0;
    gStreet.connect(master);

    /* 广场混响：开阔、很短 */
    var conv = reverb(1.5, 1.1, 0.35, 0.28, master);
    revStreetIn = conv;

    /* 风：低频滚动 + 缓慢起伏 */
    var wind = loopNoise(gStreet, 0.030, 'lowpass', 700, 0.4);
    var lfo = ctx.createOscillator(), lg = ctx.createGain();
    lfo.frequency.value = 0.07; lg.gain.value = 0.012;
    lfo.connect(lg); lg.connect(wind.g.gain); lfo.start();

    /* 空气嘶声 */
    loopNoise(gStreet, 0.008, 'highpass', 3000, 0.5);

    /* 远处城市底噪 */
    var city = loopNoise(gStreet, 0.018, 'lowpass', 260, 0.9);
    city.g.connect(revStreetIn);
    MIXREF.wind = wind.g;
    MIXREF.city = city.g;

    /* 车流驶过：扫频 + 声像 + 距离低通 */
    function whoosh() {
      if (!running) return;
      var t = t0() + 0.02;
      var dur = rnd(1.4, 2.6);
      var s = noiseSrc(true);
      var f = ctx.createBiquadFilter();
      f.type = 'bandpass'; f.Q.value = 0.9;
      f.frequency.setValueAtTime(300, t);
      f.frequency.exponentialRampToValueAtTime(1800, t + dur * 0.4);
      f.frequency.exponentialRampToValueAtTime(340, t + dur);
      var lp = ctx.createBiquadFilter();
      lp.type = 'lowpass'; lp.frequency.value = 2600;
      var g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, t);
      g.gain.linearRampToValueAtTime(rnd(0.05, 0.09), t + dur * 0.35);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      var pan = ctx.createStereoPanner();
      var dir = Math.random() < 0.5 ? 1 : -1;
      pan.pan.setValueAtTime(-0.85 * dir, t);
      pan.pan.linearRampToValueAtTime(0.85 * dir, t + dur);
      s.connect(f); f.connect(lp); lp.connect(g); g.connect(pan);
      pan.connect(gStreet); pan.connect(revStreetIn);
      s.start(t); s.stop(t + dur + 0.05);
      timers.push(setTimeout(whoosh, rnd(2600, 6800)));
    }
    timers.push(setTimeout(whoosh, 800));

    /* 汽车喇叭：真实车是双音（约 400/500Hz）+ 少量谐波 + 轻微颤音 */
    function horn() {
      var t = t0() + 0.03;
      var far = Math.random() < 0.45;            /* 远处的车，更闷更轻 */
      var base = far ? rnd(0.94, 1.02) : 1;
      var g0 = far ? 0.026 : 0.055;
      var lp = far ? 900 : 2200;
      var pan = rnd(-0.8, 0.8);
      var honks = Math.random() < 0.7 ? 2 : 1;
      for (var k = 0; k < honks; k++) {
        var tt = t + k * rnd(0.22, 0.30);
        var detune = k === 1 ? rnd(0.97, 1.0) : 1;   /* 第二声略低，像真人按喇叭 */
        [[392, 0.55], [494, 0.5], [784, 0.18], [988, 0.15]].forEach(function (p) {
          var o = ctx.createOscillator(), g = ctx.createGain();
          o.type = 'sawtooth';
          o.frequency.value = p[0] * base * detune;
          /* 轻微颤音 */
          var vib = ctx.createOscillator(), vg = ctx.createGain();
          vib.frequency.value = rnd(5, 7); vg.gain.value = p[0] * 0.004;
          vib.connect(vg); vg.connect(o.frequency); vib.start(tt); vib.stop(tt + 0.5);

          g.gain.setValueAtTime(0.0001, tt);
          g.gain.linearRampToValueAtTime(g0 * p[1], tt + 0.02);
          g.gain.setValueAtTime(g0 * p[1], tt + rnd(0.18, 0.34));
          g.gain.exponentialRampToValueAtTime(0.0001, tt + rnd(0.30, 0.46));

          var f = ctx.createBiquadFilter();
          f.type = 'lowpass'; f.frequency.value = lp;
          var pn = ctx.createStereoPanner(); pn.pan.value = pan;

          o.connect(g); g.connect(f); f.connect(pn);
          pn.connect(gStreet); pn.connect(revStreetIn);
          o.start(tt); o.stop(tt + 0.55);
        });
      }
    }

    /* 站台广播：先是双音钟声，然后一段"报站腔"的人声（带 PA 滤波 + 混响） */
    function announce() {
      var t = t0() + 0.05;
      var bellG = 0.035;
      /* 钟声：三个非谐波分音，长衰减 */
      [[1, 1, 0.55], [2.02, 0.5, 0.45], [3.01, 0.3, 0.30]].forEach(function (p) {
        tone({ type: 'sine', f: 880 * p[0], t: t, dur: p[2] * 1.4,
               gain: bellG * p[1] * 0.8, attack: 0.005, dest: gStreet, send: revStreetIn });
      });
      tone({ type: 'sine', f: 660, t: t + 0.02, dur: 1.1, gain: bellG, attack: 0.005, dest: gStreet, send: revStreetIn });
      tone({ type: 'sine', f: 990, t: t + 0.02, dur: 0.9, gain: bellG * 0.5, attack: 0.005, dest: gStreet, send: revStreetIn });

      /* "报站腔"：1.8 秒后开始，PA 频带 + 混响 + 稍稍压住底噪 */
      var st = t + 1.6;
      var paG = ctx.createGain(); paG.gain.value = 0.9;
      var paBand = ctx.createBiquadFilter();
      paBand.type = 'bandpass'; paBand.frequency.value = 1200; paBand.Q.value = 0.9;
      var paHp = ctx.createBiquadFilter();
      paHp.type = 'highpass'; paHp.frequency.value = 320;
      var paLp = ctx.createBiquadFilter();
      paLp.type = 'lowpass'; paLp.frequency.value = 3200;
      paG.connect(paBand); paBand.connect(paHp); paHp.connect(paLp);
      paLp.connect(gStreet); paLp.connect(revStreetIn);

      var f0 = 190;                       /* 女声报站 */
      var syls = 8 + Math.floor(Math.random() * 5);
      for (var i = 0; i < syls; i++) {
        var d = rnd(0.13, 0.20);
        voiceSyl(st + i * rnd(0.19, 0.26), f0 * rnd(0.97, 1.04), d, 0.05, null, paG, rnd(-0.15, 0.15));
        if (i === 4) st += 0.28;          /* 句中停一下，像念站名 */
      }
    }

    function event() {
      if (!running) return;
      if (Math.random() < 0.55) horn(); else announce();
      timers.push(setTimeout(event, rnd(2600, 5200)));
    }
    timers.push(setTimeout(event, 700));
  }

  /* ---------- 店内 ---------- */
  function buildShop() {
    gShopBed = ctx.createGain();
    gShopBed.gain.value = 0;
    gShopBed.connect(master);

    gShopBgm = ctx.createGain();
    gShopBgm.gain.value = 0;
    gShopBgm.connect(master);

    /* 室内：先整体低通（墙吸高频），再进混响 */
    var roomLp = ctx.createBiquadFilter();
    roomLp.type = 'lowpass'; roomLp.frequency.value = 1700;
    gShopBed.connect(roomLp);
    roomLp.connect(master);
    gShopBed.disconnect(master);

    var conv = reverb(1.9, 1.35, 0.62, 0.34, master);
    revShopIn = conv;
    roomLp.connect(conv);

    /* 冰柜：50Hz 基频 + 谐波 + 极轻的风机噪声 */
    [50, 100, 150].forEach(function (f, i) {
      var o = ctx.createOscillator(), g = ctx.createGain();
      o.type = 'sine'; o.frequency.value = f;
      g.gain.value = [0.018, 0.007, 0.003][i];
      o.connect(g); g.connect(roomLp); o.start();
    });
    loopNoise(roomLp, 0.006, 'bandpass', 320, 0.7);

    /* 吊扇 */
    var fan = loopNoise(roomLp, 0.014, 'bandpass', 560, 0.7);
    var lfo = ctx.createOscillator(), lg = ctx.createGain();
    lfo.frequency.value = 0.55; lg.gain.value = 0.006;
    lfo.connect(lg); lg.connect(fan.g.gain); lfo.start();

    /* 电视：被压得很闷，音量缓慢起伏（像远处在放节目） */
    var tv = loopNoise(roomLp, 0.010, 'bandpass', 780, 1.6);
    var lfo2 = ctx.createOscillator(), lg2 = ctx.createGain();
    lfo2.frequency.value = 0.21; lg2.gain.value = 0.008;
    lfo2.connect(lg2); lg2.connect(tv.g.gain); lfo2.start();

    /* 后厨：抽油烟机（低频）+ 油锅滋啦 + 锅铲 */
    var hood = loopNoise(roomLp, 0.020, 'bandpass', 300, 0.6);
    var hlfo = ctx.createOscillator(), hlg = ctx.createGain();
    hlfo.frequency.value = 0.35; hlg.gain.value = 0.005;
    hlfo.connect(hlg); hlg.connect(hood.g.gain); hlfo.start();

    /* 油锅：高频"嘶"底 + 随机油爆（短噪声簇） */
    var wok = loopNoise(roomLp, 0.016, 'highpass', 3600, 0.6);
    var wlfo = ctx.createOscillator(), wlg = ctx.createGain();
    wlfo.frequency.value = 0.19; wlg.gain.value = 0.007;
    wlfo.connect(wlg); wlg.connect(wok.g.gain); wlfo.start();
    MIXREF.hood = hood.g;
    MIXREF.wok = wok.g;

    function oilPop(t) {
      var s = noiseSrc(false);
      var f = ctx.createBiquadFilter();
      f.type = 'bandpass'; f.frequency.value = rnd(2600, 6200); f.Q.value = 2.2;
      var g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, t);
      g.gain.linearRampToValueAtTime(rnd(0.012, 0.030) * MIX.cook, t + 0.004);
      g.gain.exponentialRampToValueAtTime(0.0001, t + rnd(0.03, 0.08));
      s.connect(f); f.connect(g); g.connect(roomLp);
      s.start(t); s.stop(t + 0.12);
    }

    function stirFry() {
      if (!running) return;
      var t = t0() + 0.02;
      var n = Math.floor(rnd(2, 6));
      for (var i = 0; i < n; i++) oilPop(t + i * rnd(0.02, 0.10));
      timers.push(setTimeout(stirFry, rnd(700, 2200)));
    }

    /* 锅铲：金属碰铁锅，音高不高、衰减快 */
    function spatula() {
      if (!running) return;
      var t = t0() + 0.02;
      metal(t, rnd(900, 1500), 0.020 * MIX.cook, roomLp);
      if (Math.random() < 0.45) metal(t + rnd(0.10, 0.22), rnd(850, 1400), 0.014 * MIX.cook, roomLp);
      timers.push(setTimeout(spatula, rnd(1200, 3400)));
    }

    /* 碗碟 */
    function clink() {
      if (!running) return;
      var t = t0() + 0.03;
      metal(t, rnd(2100, 3100), 0.016 * MIX.cook, roomLp);
      timers.push(setTimeout(clink, rnd(2600, 7000)));
    }

    /* 人声：一屋子人吃饭聊天 */
    function talker(t, opts) {
      var male = opts.male;
      var f0 = male ? rnd(104, 138) : rnd(180, 226);
      var n = Math.floor(rnd(4, 11));
      var pan = rnd(-0.75, 0.75);
      var vol = opts.vol;
      var tt = t;
      for (var i = 0; i < n; i++) {
        var d = rnd(0.10, 0.20);
        voiceSyl(tt, f0 * rnd(0.93, 1.09), d, vol * rnd(0.7, 1.15) * MIX.crowd, null, roomLp, pan);
        tt += d + rnd(0.03, 0.12);
        if (Math.random() < 0.18) tt += rnd(0.18, 0.45);   /* 说话间隙 */
      }
      return tt;
    }

    function crowd() {
      if (!running) return;
      var t = t0() + 0.02;
      if (MIX.crowd > 0.01) {
        /* 1–2 桌同时说 */
        talker(t, { male: Math.random() < 0.5, vol: rnd(0.016, 0.030) });
        if (Math.random() < 0.6) talker(t + rnd(0.15, 0.7), { male: Math.random() < 0.5, vol: rnd(0.012, 0.024) });
      }
      timers.push(setTimeout(crowd, rnd(180, 700)));
    }

    function laugh() {
      if (!running) return;
      var t = t0() + 0.02;
      var f0 = rnd(150, 230), pan = rnd(-0.6, 0.6);
      for (var i = 0; i < 5; i++) {
        voiceSyl(t + i * rnd(0.11, 0.15), f0 * (1 + i * 0.03), 0.09, rnd(0.012, 0.022), [600, 1500, 2500], roomLp, pan);
      }
      timers.push(setTimeout(laugh, rnd(5000, 12000)));
    }

    /* 起手就把"店里该有的"排上 */
    timers.push(setTimeout(stirFry, 500));
    timers.push(setTimeout(spatula, 1200));
    timers.push(setTimeout(clink, 1600));
    timers.push(setTimeout(crowd, 200));
    timers.push(setTimeout(laugh, 4200));
  }

  /* ---------- 店内小曲 ---------- */
  function pluck(m, t, dur, gain) {
    tone({ type: 'triangle', f: hz(m), t: t, dur: dur, gain: gain, attack: 0.004, dest: gShopBgm });
    tone({ type: 'sine', f: hz(m + 12), t: t, dur: dur * 0.55, gain: gain * 0.28, attack: 0.004, dest: gShopBgm });
  }
  function woodblock(t) {
    tone({ type: 'square', f: 880, t: t, dur: 0.05, gain: 0.010, lp: 2600, attack: 0.002, dest: gShopBgm });
  }
  function bgmBarAt(t, i) {
    var ch = CH[i % CH.length];
    tone({ type: 'sine', f: hz(ch[0] - 12), t: t, dur: BG_BEAT * 0.85, gain: 0.045, dest: gShopBgm });
    tone({ type: 'sine', f: hz(ch[0] - 12), t: t + BG_BEAT * 2, dur: BG_BEAT * 0.8, gain: 0.034, dest: gShopBgm });
    woodblock(t + BG_BEAT);
    woodblock(t + BG_BEAT * 3);
    var order = [0, 1, 2, 3, 2, 1, 2, 3];
    for (var k = 0; k < 8; k++) {
      pluck(ch[order[k]] + 12, t + k * (BG_BEAT / 2), BG_BEAT * 0.42, 0.020);
    }
  }
  function bgmTick() {
    if (!running || room !== 'shop') return;
    var now = t0();
    if (!bgmNext || bgmNext < now) bgmNext = now + 0.1;
    while (bgmNext < now + 0.5) {
      bgmBarAt(bgmNext, bgmBar);
      bgmNext += BG_BEAT * 4;
      bgmBar++;
    }
  }

  /* ---------- 通关：稍急促的上升号角 ---------- */
  function win() {
    if (!running || !ctx) return;
    var t = t0() + 0.05;
    var step = 0.128;
    var notes = [72, 76, 79, 84, 79, 84, 88, 91];
    notes.forEach(function (m, i) {
      var tt = t + i * step;
      [[1, 1], [2, 0.35], [3, 0.16]].forEach(function (p) {
        tone({ type: 'triangle', f: hz(m) * p[0], t: tt, dur: 0.30, gain: 0.055 * p[1], attack: 0.006, dest: gWin });
      });
      tone({ type: 'sawtooth', f: hz(m - 12), t: tt, dur: 0.22, gain: 0.020, lp: 2200, attack: 0.008, dest: gWin });
    });
    /* 急促鼓点 */
    for (var d = 0; d < 12; d++) {
      var s = noiseSrc(false), f = ctx.createBiquadFilter(), g = ctx.createGain();
      f.type = 'highpass'; f.frequency.value = 3600;
      g.gain.setValueAtTime(0.0001, t + d * 0.075);
      g.gain.linearRampToValueAtTime(0.030, t + d * 0.075 + 0.003);
      g.gain.exponentialRampToValueAtTime(0.0001, t + d * 0.075 + 0.06);
      s.connect(f); f.connect(g); g.connect(gWin);
      s.start(t + d * 0.075); s.stop(t + d * 0.075 + 0.09);
    }
  }

  /* ---------- 进门：门轴吱呀 + 门帘哗啦 + 门铃 + 合门闷响 ---------- */
  function doorEnter(t) {
    /* 门轴吱呀 */
    var o = ctx.createOscillator(), g = ctx.createGain(), bp = ctx.createBiquadFilter();
    o.type = 'sawtooth';
    o.frequency.setValueAtTime(250, t);
    o.frequency.exponentialRampToValueAtTime(148, t + 0.42);
    var lfo = ctx.createOscillator(), lg = ctx.createGain();
    lfo.type = 'sine'; lfo.frequency.value = 13; lg.gain.value = 24;
    lfo.connect(lg); lg.connect(o.frequency);
    bp.type = 'bandpass'; bp.frequency.value = 1150; bp.Q.value = 2.2;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(0.032, t + 0.07);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.5);
    o.connect(bp); bp.connect(g); g.connect(master);
    o.start(t); o.stop(t + 0.55); lfo.start(t); lfo.stop(t + 0.55);

    /* 塑料门帘哗啦 */
    var s = noiseSrc(false), f2 = ctx.createBiquadFilter(), g2 = ctx.createGain();
    f2.type = 'bandpass'; f2.frequency.value = 3200; f2.Q.value = 0.7;
    g2.gain.setValueAtTime(0.0001, t + 0.16);
    g2.gain.linearRampToValueAtTime(0.05, t + 0.23);
    g2.gain.exponentialRampToValueAtTime(0.0001, t + 0.64);
    s.connect(f2); f2.connect(g2); g2.connect(master);
    s.start(t + 0.16); s.stop(t + 0.72);

    /* 门口挂铃：叮—— */
    tone({ type: 'sine', f: 1568, t: t + 0.30, dur: 0.9, gain: 0.06, attack: 0.003, send: revShopIn });
    tone({ type: 'sine', f: 2093, t: t + 0.30, dur: 0.7, gain: 0.032, attack: 0.003, send: revShopIn });
    tone({ type: 'sine', f: 784, t: t + 0.33, dur: 0.95, gain: 0.024, attack: 0.003, send: revShopIn });

    /* 门合上的闷响 */
    tone({ type: 'sine', f: 98, f2: 56, t: t + 0.60, dur: 0.30, gain: 0.055, attack: 0.004 });
  }

  /* ---------- 界面点击音：短促「嗒」+ 高频颗粒，压得住任何背景声 ---------- */
  /* 点击瞬间把环境声压一下，保证「嗒」听得见 */
  function duckQuick() {
    ['station', 'cook', 'crowd'].forEach(function (k) {
      var L = samples[k];
      if (!L || !L.el || !L.playing) return;
      var v = L.el.volume;
      L.el.volume = Math.max(0.04, v * 0.5);
      setTimeout(function () { if (L.el) L.el.volume = v; }, 150);
    });
    if (gShopBed) {
      var now = t0(), cur = gShopBed.gain.value;
      gShopBed.gain.cancelScheduledValues(now);
      gShopBed.gain.setValueAtTime(cur, now);
      gShopBed.gain.linearRampToValueAtTime(cur * 0.55, now + 0.02);
      gShopBed.gain.linearRampToValueAtTime(cur, now + 0.20);
    }
  }

  function uiClick() {
    if (!ctx || !master || muted) return;
    duckQuick();
    var t = t0();
    tone({ type: 'triangle', f: 1320, t: t, dur: 0.05, gain: 0.34, attack: 0.001 });
    tone({ type: 'sine', f: 660, t: t, dur: 0.075, gain: 0.18, attack: 0.001 });
    var s = noiseSrc(false), f = ctx.createBiquadFilter(), g = ctx.createGain();
    f.type = 'highpass'; f.frequency.value = 2600;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(0.070, t + 0.004);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.06);
    s.connect(f); f.connect(g); g.connect(master);
    s.start(t); s.stop(t + 0.08);
  }

  /* ---------- 房间切换 ---------- */
  function applyRoom(r) {
    if (!ctx || r === room) return;
    var prev = room;
    room = r;
    var now = t0();
    var tS = (r === 'street') ? 1 : 0;
    var tB = (r === 'shop') ? 1 : 0;
    gStreet.gain.cancelScheduledValues(now);
    gStreet.gain.setValueAtTime(gStreet.gain.value, now);
    gStreet.gain.linearRampToValueAtTime(tS * 0.9, now + 0.7);

    gShopBed.gain.cancelScheduledValues(now);
    gShopBed.gain.setValueAtTime(gShopBed.gain.value, now);
    gShopBed.gain.linearRampToValueAtTime(tB * 1.0, now + 0.7);

    gShopBgm.gain.cancelScheduledValues(now);
    gShopBgm.gain.setValueAtTime(gShopBgm.gain.value, now);
    gShopBgm.gain.linearRampToValueAtTime(tB * 0.30, now + 0.9);

    if (samples.station) { if (r === 'street') samples.station.start(); else samples.station.stop(); }
    if (samples.cook) { if (r === 'shop') samples.cook.start(); else samples.cook.stop(); }
    if (samples.crowd) { if (r === 'shop') samples.crowd.start(); else samples.crowd.stop(); }

    if (r === 'shop') { bgmNext = 0; bgmBar = 0; doorEnter(now + 0.02); }
    if (prev === 'shop' && r !== 'shop') { /* 出店 */ }
  }

  /* ---------- 真实录音层（车站 / 炒菜 / 嘈杂人声） ---------- */
  var samples = {};
  var SAMPLE_FADE = 1.1;

  function SampleLayer(url, dest, level, roomKey) {
    this.url = url;
    this.dest = dest;
    this.level = level;
    this.roomKey = roomKey;
    this.el = null;
    this.src = null;
    this.gainNode = null;
    this.ok = false;
    this.failed = false;
    this.wanted = false;
    this.playing = false;
    this.mixed = false;
    this.mixFn = null;
    this.timer = null;
  }
  SampleLayer.prototype.ensure = function () {
    if (this.el) return this.ok;
    if (this.failed || !ctx) return false;
    var self = this;
    var el = document.createElement('audio');
    el.src = this.url;
    el.loop = true;
    el.preload = 'auto';
    el.setAttribute('playsinline', '');
    el.style.display = 'none';
    document.body.appendChild(el);
    this.el = el;
    /* file:// 页面里 createMediaElementSource 不报错但输出 -180dB 静音（媒体被视为跨源），
       所以本地双击打开时直接让 <audio> 元素自己出声，不经过 WebAudio。 */
    var isFile = (location.protocol === 'file:');
    if (isFile) {
      this.direct = true;
      this.ok = true;
    } else {
      try {
        this.src = ctx.createMediaElementSource(el);
        var g = ctx.createGain();
        g.gain.value = 0.0001;
        this.src.connect(g);
        g.connect(this.dest);
        this.gainNode = g;
        try {
          var an = ctx.createAnalyser();
          an.fftSize = 1024;
          g.connect(an);
          this.an = an;
          this.abuf = new Float32Array(an.fftSize);
        } catch (e2) { this.an = null; }
        this.ok = true;
      } catch (e) {
        /* 少数情况下 <audio> 不能接入 WebAudio，退化为直接播放元素 */
        this.direct = true;
        this.ok = true;
      }
    }
    el.addEventListener('error', function () { self.failed = true; self.ok = false; self.playing = false; });
    el.addEventListener('canplay', function () { if (self.wanted && !self.playing) self.play(); });
    return true;
  };
  SampleLayer.prototype.play = function () {
    if (!this.ok || !this.el) return;
    var self = this, t = t0();
    if (!this.mixed && this.mixFn) { this.mixed = true; this.mixFn(); }
    this.playing = true;
    if (this.direct) {
      try { this.el.volume = Math.min(1, this.level * 1.8); this.el.muted = false; } catch (e) {}
    } else if (this.gainNode) {
      this.gainNode.gain.cancelScheduledValues(t);
      this.gainNode.gain.setValueAtTime(Math.max(0.0001, this.gainNode.gain.value), t);
      this.gainNode.gain.linearRampToValueAtTime(this.level, t + 0.9);
    }
    var p = this.el.play();
    if (p && p.catch) p.catch(function () { self.playing = false; });
  };
  SampleLayer.prototype.start = function () {
    this.wanted = true;
    if (!running) return;
    if (!this.ensure()) return;
    if (!this.playing) this.play();
  };
  SampleLayer.prototype.stop = function () {
    this.wanted = false;
    if (!this.ok) return;
    var self = this, t = t0();
    if (this.direct) {
      try { this.el.pause(); } catch (e) {}
      this.playing = false;
      return;
    }
    if (!this.gainNode) return;
    this.gainNode.gain.cancelScheduledValues(t);
    this.gainNode.gain.setValueAtTime(Math.max(0.0001, this.gainNode.gain.value), t);
    this.gainNode.gain.linearRampToValueAtTime(0.0001, t + 0.7);
    this.playing = false;
    if (this.timer) clearTimeout(this.timer);
    this.timer = setTimeout(function () { if (!self.wanted && self.el) { try { self.el.pause(); } catch (e) {} } }, 760);
  };

  var SOLO = /(\?|&)solo=1/.test(location.search);

  function loadSamples() {
    /* ?swap=1（默认）：把 station 与 crowd 对调；?swap=2：station 与 cook 对调；?swap=0：原始映射 */
    var sw = (location.search.match(/[?&]swap=(\d)/) || [, '1'])[1];
    var U = { station: 'audio/station.mp4', cook: 'audio/cook.mp4', crowd: 'audio/crowd.mp4' };
    if (sw === '1') { var a = U.station; U.station = U.crowd; U.crowd = a; }
    if (sw === '2') { var b = U.station; U.station = U.cook; U.cook = b; }

    samples.station = new SampleLayer(U.station, gStreet, 0.55, 'street');
    samples.cook = new SampleLayer(U.cook, gShopBed, 0.40, 'shop');
    samples.crowd = new SampleLayer(U.crowd, gShopBed, 0.50, 'shop');

    samples.station.mixFn = function () {
      MIX.station = 0.35;
      if (MIXREF.wind) MIXREF.wind.gain.value *= SOLO ? 0 : 0.45;
      if (MIXREF.city) MIXREF.city.gain.value *= SOLO ? 0 : 0.50;
    };
    samples.cook.mixFn = function () {
      MIX.cook = 0.30;
      if (MIXREF.wok) MIXREF.wok.gain.value *= SOLO ? 0 : 0.25;
      if (MIXREF.hood) MIXREF.hood.gain.value *= SOLO ? 0 : 0.50;
    };
    samples.crowd.mixFn = function () { MIX.crowd = 0; };

    for (var k in samples) { if (samples[k]) samples[k].ensure(); }
  }

  /* ---------- 调试状态条（测试用，正式发布可删） ---------- */
  function debugPanel() {
    var d = document.createElement('div');
    d.id = 'zjb-adbg';
    d.style.cssText = 'position:fixed;left:10px;bottom:96px;z-index:70;background:rgba(18,14,10,.86);' +
      'color:#ffd9a0;font:11px/1.55 Consolas,Menlo,monospace;padding:6px 8px;border-radius:6px;' +
      'max-width:64vw;white-space:pre;pointer-events:none;opacity:.92';
    document.body.appendChild(d);
    setInterval(function () {
      var lines = ['ctx=' + (ctx ? ctx.state : '-') + '  started=' + (started ? 1 : 0)];
      ['station', 'cook', 'crowd'].forEach(function (k) {
        var L = samples[k];
        if (!L) { lines.push(k + ': 未创建'); return; }
        var st = L.failed ? 'ERR' : (L.ok ? (L.direct ? 'direct' : 'webaudio') : 'pending');
        var db = '-';
        if (L.direct && L.el) {
          db = 'vol' + (L.el.volume || 0).toFixed(2);
        } else if (L.an && L.abuf) {
          L.an.getFloatTimeDomainData(L.abuf);
          var sum = 0, n = L.abuf.length;
          for (var i = 0; i < n; i++) { var v = L.abuf[i]; sum += v * v; }
          var rms = Math.sqrt(sum / n);
          db = (20 * Math.log10(rms + 1e-9)).toFixed(0) + 'dB';
        }
        lines.push(k + ': ' + st + '  t=' + (L.el && L.el.currentTime ? L.el.currentTime.toFixed(1) : '0') +
          '  play=' + (L.playing ? 1 : 0) + '  lvl=' + db + (L.wanted ? ' want' : ''));
      });
      d.textContent = lines.join('\n');
    }, 500);
  }

  /* ---------- 生命周期 ---------- */
  function kick() {
    if (!ctx || started) return;
    if (ctx.state !== 'running') return;
    started = true; running = true;
    master.gain.cancelScheduledValues(t0());
    master.gain.setValueAtTime(0.0001, t0());
    master.gain.linearRampToValueAtTime(0.7, t0() + 1.2);
    room = '';
    applyRoom(gameRoom());
    if (bgmTimer) clearInterval(bgmTimer);
    bgmTimer = setInterval(bgmTick, 70);
    if (pollTimer) clearInterval(pollTimer);
    pollTimer = setInterval(function () {
      var r = gameRoom();
      if (r !== room) applyRoom(r);
    }, 260);
  }

  function start() {
    if (muted) return;
    if (!ensure()) return;
    if (started) return;
    if (ctx.state === 'running') { kick(); return; }
    ctx.resume().then(kick).catch(function () {});
    setTimeout(kick, 180);
    setTimeout(kick, 600);
  }
  function unlock() { start(); }

  function stopAll() {
    running = false; started = false; room = '';
    for (var k in samples) { if (samples[k]) samples[k].stop(); }
    if (bgmTimer) { clearInterval(bgmTimer); bgmTimer = null; }
    if (pollTimer) { clearInterval(pollTimer); pollTimer = null; }
    for (var i = 0; i < timers.length; i++) clearTimeout(timers[i]);
    timers.length = 0;
    if (master && ctx) {
      try { master.gain.cancelScheduledValues(t0()); master.gain.setValueAtTime(0.0001, t0()); } catch (e) {}
    }
    if (ctx && ctx.state === 'running') { try { ctx.suspend(); } catch (e) {} }
  }

  function gameRoom() {
    try { if (typeof G !== 'undefined' && G && G.room) return G.room; } catch (e) {}
    if (window.G && window.G.room) return window.G.room;
    return 'street';
  }

  /* ---------- 按钮 ---------- */
  function button() {
    var b = document.createElement('button');
    b.id = 'zjb-audio-btn';
    b.type = 'button';
    b.textContent = '♪';
    b.setAttribute('aria-label', '声音开关');
    b.style.cssText = [
      'position:fixed', 'right:12px', 'bottom:12px', 'width:34px', 'height:34px',
      'border-radius:50%', 'border:1px solid rgba(120,96,60,.35)',
      'background:rgba(246,239,221,.8)', 'color:#5a4630', 'font-size:15px',
      'line-height:32px', 'text-align:center', 'cursor:pointer', 'z-index:45',
      'padding:0', 'outline:none', 'transition:opacity .2s', 'opacity:.62'
    ].join(';');
    try { if (localStorage.getItem('zjban.ch2audio') === '0') muted = true; } catch (e) {}
    if (muted) b.style.opacity = '.26';
    b.addEventListener('click', function (e) {
      e.stopPropagation();
      muted = !muted;
      b.style.opacity = muted ? '.26' : '.62';
      try { localStorage.setItem('zjban.ch2audio', muted ? '0' : '1'); } catch (er) {}
      if (muted) stopAll(); else { started = false; start(); }
    });
    document.body.appendChild(b);
  }

  function boot() {
    if (!ensure()) return;
    buildStreet();
    buildShop();
    gWin = ctx.createGain();
    gWin.gain.value = 1;
    gWin.connect(master);

    loadSamples();
    if (/(\?|&)debug=1/.test(location.search)) debugPanel();

    /* 任何界面点击都给一声「嗒」，压得住背景 */
    document.addEventListener('pointerdown', function (e) {
      var t = e.target;
      if (!t) return;
      uiClick();
    }, true);

    button();
    start();
    setTimeout(start, 260);
    setTimeout(start, 900);

    var h = function () {
      start();
      if (!started) return;
      window.removeEventListener('pointerdown', h, true);
      window.removeEventListener('touchstart', h, true);
      window.removeEventListener('keydown', h, true);
      window.removeEventListener('click', h, true);
    };
    window.addEventListener('pointerdown', h, true);
    window.addEventListener('touchstart', h, true);
    window.addEventListener('keydown', h, true);
    window.addEventListener('click', h, true);

    document.addEventListener('visibilitychange', function () {
      if (!ctx) return;
      if (document.hidden) { try { ctx.suspend(); } catch (e) {} }
      else { try { ctx.resume().then(kick); } catch (e) {} }
    });
  }

  window.ZJBAudio = {
    start: start,
    unlock: unlock,
    stop: stopAll,
    win: win,
    setRoom: function (r) { if (running && ctx) applyRoom(r); },
    click: function () { uiClick(); }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();

/* 粉色小猪 · 可旋转 3D 模型（纯 canvas，无外部依赖）
   平滑着色：每个顶点带法线，三角形用三顶点法线均值着色，减少块面感。 */
(function () {
  var canvas = document.getElementById("pig-canvas");
  if (!canvas) return;
  var ctx = canvas.getContext("2d");

  var W = canvas.width, H = canvas.height;
  var DPR = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = W * DPR;
  canvas.height = H * DPR;
  ctx.scale(DPR, DPR);

  var tris = [];
  var HEAD = false;  // 头部零件排序时给它一点前置偏置，避免被身体吞掉

  function nrm(v) {
    var l = Math.hypot(v[0], v[1], v[2]) || 1;
    return [v[0] / l, v[1] / l, v[2] / l];
  }

  function tri(p0, p1, p2, col, n0, n1, n2) {
    var nx, ny, nz;
    if (n0) {
      nx = n0[0] + n1[0] + n2[0];
      ny = n0[1] + n1[1] + n2[1];
      nz = n0[2] + n1[2] + n2[2];
    } else {
      var ux = p1[0] - p0[0], uy = p1[1] - p0[1], uz = p1[2] - p0[2];
      var vx = p2[0] - p0[0], vy = p2[1] - p0[1], vz = p2[2] - p0[2];
      nx = uy * vz - uz * vy;
      ny = uz * vx - ux * vz;
      nz = ux * vy - uy * vx;
    }
    tris.push({ a: p0, b: p1, c: p2, n: nrm([nx, ny, nz]), col: col });
  }

  var PINK = [255, 172, 200];
  var PINK_D = [238, 140, 172];
  var SNOUT = [255, 196, 214];
  var DARK = [58, 38, 48];

  function mix(a, b, t) {
    return [
      a[0] + (b[0] - a[0]) * t,
      a[1] + (b[1] - a[1]) * t,
      a[2] + (b[2] - a[2]) * t
    ];
  }

  function ellipsoid(cx, cy, cz, rx, ry, rz, su, sv, colorFn) {
    var P = [], N = [];
    for (var i = 0; i <= su; i++) {
      var u = (i / su) * Math.PI * 2;
      var rp = [], rn = [];
      for (var j = 0; j <= sv; j++) {
        var v = (j / sv) * Math.PI;
        var sx = Math.sin(v) * Math.cos(u), sy = Math.cos(v), sz = Math.sin(v) * Math.sin(u);
        rp.push([cx + sx * rx, cy + sy * ry, cz + sz * rz]);
        rn.push(nrm([sx / rx, sy / ry, sz / rz]));
      }
      P.push(rp); N.push(rn);
    }
    for (var i2 = 0; i2 < su; i2++) {
      for (var j2 = 0; j2 < sv; j2++) {
        var p00 = P[i2][j2], p10 = P[i2 + 1][j2], p01 = P[i2][j2 + 1], p11 = P[i2 + 1][j2 + 1];
        var n00 = N[i2][j2], n10 = N[i2 + 1][j2], n01 = N[i2][j2 + 1], n11 = N[i2 + 1][j2 + 1];
        var mid = [(p00[0] + p11[0]) / 2, (p00[1] + p11[1]) / 2, (p00[2] + p11[2]) / 2];
        var col = colorFn ? colorFn(mid) : PINK;
        tri(p00, p10, p11, col, n00, n10, n11);
        tri(p00, p11, p01, col, n00, n11, n01);
      }
    }
  }

  function tube(x0, x1, cy, cz, r0, r1, seg, col) {
    var A = [], B = [], NA = [], NB = [];
    for (var i = 0; i < seg; i++) {
      var a = (i / seg) * Math.PI * 2;
      var ny = Math.cos(a), nz = Math.sin(a);
      A.push([x0, cy + ny * r0, cz + nz * r0]);
      B.push([x1, cy + ny * r1, cz + nz * r1]);
      NA.push([0, ny, nz]); NB.push([0, ny, nz]);
    }
    for (var k = 0; k < seg; k++) {
      var k2 = (k + 1) % seg;
      tri(A[k], B[k], B[k2], col, NA[k], NB[k], NB[k2]);
      tri(A[k], B[k2], A[k2], col, NA[k], NB[k2], NA[k2]);
    }
  }

  function build() {
    tris = [];

    ellipsoid(0, 0, 0, 1.02, 0.96, 0.98, 36, 26, function (p) {
      var t = Math.max(0, Math.min(1, (-p[1] + 0.9) / 1.8));
      return mix(PINK, PINK_D, t * 0.35);
    });

    HEAD = true;
    ellipsoid(1.30, 0.16, 0, 0.72, 0.72, 0.72, 30, 24, function (p) {
      var t = Math.max(0, Math.min(1, (0.9 - p[1]) / 1.5));
      return mix(PINK, PINK_D, t * 0.28);
    });

    tube(1.84, 2.00, -0.34, 0, 0.19, 0.22, 24, SNOUT);
    ellipsoid(2.03, -0.34, 0, 0.05, 0.21, 0.23, 22, 18, function () { return SNOUT; });
    ellipsoid(2.07, -0.34, 0.085, 0.022, 0.042, 0.038, 8, 6, function () { return DARK; });
    ellipsoid(2.07, -0.34, -0.085, 0.022, 0.042, 0.038, 8, 6, function () { return DARK; });

    // 大眼睛：白眼圈 + 大黑瞳 + 两点高光
    [[1, 0], [-1, 0]].forEach(function (side) {
      var zz = 0.21 * side[0];
      ellipsoid(1.86, 0.40, zz, 0.285, 0.295, 0.265, 20, 16, function () { return [255, 255, 255]; });
      ellipsoid(1.93, 0.39, zz, 0.225, 0.235, 0.21, 18, 14, function () { return [16, 12, 16]; });
      ellipsoid(2.00, 0.49, zz + 0.045 * side[0], 0.07, 0.07, 0.05, 10, 8, function () { return [255, 255, 255]; });
      ellipsoid(2.01, 0.30, zz - 0.06 * side[0], 0.04, 0.04, 0.028, 8, 6, function () { return [255, 255, 255]; });
    });

    function ear(side) {
      var s = side;
      var base = [[0.98, 0.70, 0.28 * s], [1.34, 0.62, 0.22 * s], [1.20, 0.72, 0.60 * s]];
      var tip = [1.06, 1.08, 0.66 * s];
      var colA = mix(PINK, PINK_D, 0.15);
      var colB = mix(PINK_D, PINK, 0.1);
      for (var i = 0; i < 3; i++) {
        var a = base[i], b = base[(i + 1) % 3];
        tri(a, b, tip, i % 2 ? colA : colB);
        tri(b, a, tip, i % 2 ? mix(colB, PINK_D, 0.3) : mix(colA, PINK_D, 0.2));
      }
    }
    ear(1);
    ear(-1);
    HEAD = false;

    [[0.64, 0.48], [0.64, -0.48], [-0.64, 0.48], [-0.64, -0.48]].forEach(function (l) {
      var x = l[0], z = l[1];
      tube(x - 0.17, x + 0.17, -0.78, z, 0.2, 0.19, 13, mix(PINK, PINK_D, 0.3));
      ellipsoid(x, -1.03, z, 0.2, 0.23, 0.2, 13, 11, function () { return mix(PINK, PINK_D, 0.45); });
    });

    for (var i = 0; i < 12; i++) {
      var a2 = i * 0.26;
      var r = 0.32 - i * 0.008;
      var px = -0.92 - i * 0.022;
      var py = 0.34 + Math.sin(a2) * r * 0.72;
      var pz = Math.cos(a2) * r * 0.85;
      var rr = 0.105 - i * 0.004;
      ellipsoid(px, py, pz, rr, rr, rr, 8, 7, function () { return mix(PINK_D, PINK, 0.4); });
    }
  }

  build();

  var yaw = 1.57, pitch = 0.16, dist = 12, zoom = 1;
  var vyaw = 0.004, dragging = false, lastX = 0, lastY = 0, auto = true, idle = 0;
  var movedDist = 0, downTime = 0;
  var LIGHT = nrm([0.42, 0.75, 0.5]);

  function render() {
    ctx.clearRect(0, 0, W, H);

    var cy = Math.cos(yaw), sy = Math.sin(yaw);
    var cp = Math.cos(pitch), sp = Math.sin(pitch);
    var cx = W / 2, cyy = H / 2 + 12;
    var f = W * 2.1 * zoom;

    var list = [];
    for (var i = 0; i < tris.length; i++) {
      var tr = tris[i];
      var pts = [], zsum = 0;
      for (var k = 0; k < 3; k++) {
        var p = k === 0 ? tr.a : (k === 1 ? tr.b : tr.c);
        var x1 = p[0] * cy + p[2] * sy;
        var z1 = -p[0] * sy + p[2] * cy;
        var y2 = p[1] * cp - z1 * sp;
        var z2 = p[1] * sp + z1 * cp;
        var zz = z2 + dist;
        pts.push([cx + (x1 * f) / zz, cyy - (y2 * f) / zz]);
        zsum += zz;
      }
      var n = tr.n;
      var nx1 = n[0] * cy + n[2] * sy;
      var nz1 = -n[0] * sy + n[2] * cy;
      var ny2 = n[1] * cp - nz1 * sp;
      var nz2 = n[1] * sp + nz1 * cp;

      var diff = Math.abs(nx1 * LIGHT[0] + ny2 * LIGHT[1] + nz2 * LIGHT[2]);
      var spec = Math.pow(Math.max(0, ny2 * 0.7 + nz2 * 0.7), 22) * 0.5;
      var sh = 0.68 + diff * 0.48;
      var r = Math.min(255, tr.col[0] * sh + spec * 255);
      var gg = Math.min(255, tr.col[1] * sh + spec * 255);
      var b = Math.min(255, tr.col[2] * sh + spec * 255);
      list.push({ z: zsum / 3 - (HEAD ? 0.35 : 0), p: pts, c: "rgb(" + (r | 0) + "," + (gg | 0) + "," + (b | 0) + ")" });
    }

    list.sort(function (a, b) { return b.z - a.z; });

    ctx.lineJoin = "round";
    for (var j = 0; j < list.length; j++) {
      var it = list[j];
      ctx.beginPath();
      ctx.moveTo(it.p[0][0], it.p[0][1]);
      ctx.lineTo(it.p[1][0], it.p[1][1]);
      ctx.lineTo(it.p[2][0], it.p[2][1]);
      ctx.closePath();
      ctx.fillStyle = it.c;
      ctx.strokeStyle = it.c;
      ctx.lineWidth = 0.6;
      ctx.fill();
      ctx.stroke();
    }

  }

  function loop() {
    if (!dragging) {
      // 一直自转，拖拽的惯性叠加在上面，松手后自然续转
      yaw += vyaw + (auto ? 0.0165 : 0);
      vyaw *= 0.94;
      pitch += (0.16 - pitch) * 0.012;
    }
    render();
    requestAnimationFrame(loop);
  }

  function pos(e) {
    var p = e.touches ? e.touches[0] : e;
    return { x: p.clientX, y: p.clientY };
  }
  function down(e) {
    dragging = true; auto = false; idle = 0; vyaw = 0;
    var p = pos(e); lastX = p.x; lastY = p.y;
    movedDist = 0; downTime = Date.now();
  }
  function move(e) {
    if (!dragging) return;
    var p = pos(e);
    var dx = p.x - lastX, dy = p.y - lastY;
    lastX = p.x; lastY = p.y;
    yaw += dx * 0.008;
    pitch = Math.max(-1.1, Math.min(1.1, pitch - dy * 0.006));
    vyaw = dx * 0.0005;
    movedDist += Math.abs(dx) + Math.abs(dy);
    if (e.cancelable) e.preventDefault();
  }
  function up() {
    dragging = false; idle = 0;
    setTimeout(function () { auto = true; }, 800);
    // 轻点（几乎没拖动）时进入“肘家班在大连”页面
    if (movedDist < 8 && Date.now() - downTime < 600 && window.PIG_LINK !== false) {
      window.location.href = "pig.html";
    }
  }

  canvas.addEventListener("mousedown", down);
  window.addEventListener("mousemove", move);
  window.addEventListener("mouseup", up);
  canvas.addEventListener("touchstart", down, { passive: true });
  canvas.addEventListener("touchmove", move, { passive: false });
  canvas.addEventListener("touchend", up);

  loop();
})();

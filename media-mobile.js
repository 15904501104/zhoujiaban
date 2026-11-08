/* 手机端视频：一次点击即播放；自动播放失败时给出可点的播放提示 */
(function () {
  var CSS = '.media-tap{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);z-index:5;' +
    'border:0;border-radius:999px;padding:10px 20px;font:600 14px/1 -apple-system,"PingFang SC",sans-serif;' +
    'color:#fff;background:rgba(0,0,0,.55);backdrop-filter:blur(6px);cursor:pointer}' +
    '.media-tap:active{background:rgba(0,0,0,.72)}';

  function style() {
    if (document.getElementById('media-mobile-style')) return;
    var s = document.createElement('style');
    s.id = 'media-mobile-style';
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  function wrap(v) {
    var p = v.parentNode;
    if (p && getComputedStyle(p).position === 'static') p.style.position = 'relative';
    return p;
  }

  function hint(v) {
    if (v.dataset.tapHint === '1') return;
    v.dataset.tapHint = '1';
    var p = wrap(v);
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'media-tap';
    b.textContent = '▶ 点击播放';
    b.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      v.play().then(function () {
        if (b.parentNode) b.parentNode.removeChild(b);
        v.dataset.tapHint = '';
      }).catch(function () {});
    }, false);
    p.appendChild(b);
  }

  function boot() {
    style();
    var vids = document.querySelectorAll('video');
    for (var i = 0; i < vids.length; i++) {
      (function (v) {
        v.setAttribute('playsinline', '');
        v.setAttribute('webkit-playsinline', '');
        v.setAttribute('x5-playsinline', '');
        if (v.hasAttribute('muted')) v.muted = true;

        function firstTap() {
          if (v.paused) {
            var pr = v.play();
            if (pr && pr.catch) pr.catch(function () {});
          }
        }
        v.addEventListener('touchstart', firstTap, { passive: true });
        v.addEventListener('click', firstTap, false);

        if (v.hasAttribute('autoplay')) {
          var tryPlay = function () {
            var pr = v.play();
            if (pr && pr.catch) pr.catch(function () { hint(v); });
            setTimeout(function () { if (v.paused) hint(v); }, 900);
          };
          tryPlay();
          document.addEventListener('visibilitychange', function () {
            if (!document.hidden && v.paused) tryPlay();
          }, false);
          window.addEventListener('pageshow', function () { if (v.paused) tryPlay(); }, false);
        }
      })(vids[i]);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, false);
  } else {
    boot();
  }
})();

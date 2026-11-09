/* 肘家班 · 访客上报（只写不读）
   依赖 js/track-config.js；配置为空时静默跳过。 */
(function () {
  var C = window.ZJB_TRACK || {};
  if (!C.url || !C.key) return;
  var table = C.table || 'visits';

  function sid() {
    try {
      var k = 'zjb.sid';
      var v = sessionStorage.getItem(k);
      if (!v) { v = (Date.now().toString(36) + Math.random().toString(36).slice(2, 8)); sessionStorage.setItem(k, v); }
      return v;
    } catch (e) { return 'na'; }
  }

  function screenStr() {
    return (screen.width || 0) + 'x' + (screen.height || 0) + '@' + (window.devicePixelRatio || 1);
  }

  function send(geo) {
    var body = {
      page: location.pathname + location.search,
      referrer: document.referrer || '',
      ua: navigator.userAgent,
      lang: navigator.language || '',
      tz: (window.Intl && Intl.DateTimeFormat().resolvedOptions().timeZone) || '',
      screen: screenStr(),
      country: geo.country || '',
      region: geo.region || '',
      city: geo.city || '',
      lat: typeof geo.latitude === 'number' ? geo.latitude : null,
      lon: typeof geo.longitude === 'number' ? geo.longitude : null,
      sid: sid()
    };
    try {
      fetch(C.url.replace(/\/$/, '') + '/rest/v1/' + table, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': C.key,
          'Authorization': 'Bearer ' + C.key,
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify(body),
        keepalive: true,
        mode: 'cors'
      }).catch(function () {});
    } catch (e) {}
  }

  function run() {
    var cached = null;
    try { cached = JSON.parse(sessionStorage.getItem('zjb.geo') || 'null'); } catch (e) {}
    if (cached && cached.ts && Date.now() - cached.ts < 6 * 3600e3) { send(cached.geo || {}); return; }
    send({});                       // 先把「有人来过」记下来，再补地理位置
    fetch('https://ipwho.is/?lang=zh-CN', { mode: 'cors' })
      .then(function (r) { return r.json(); })
      .then(function (g) {
        if (!g || g.success === false) return;
        var geo = { country: g.country, region: g.region, city: g.city, latitude: g.latitude, longitude: g.longitude };
        try { sessionStorage.setItem('zjb.geo', JSON.stringify({ ts: Date.now(), geo: geo })); } catch (e) {}
      })
      .catch(function () {});
  }

  if (document.readyState === 'complete') setTimeout(run, 600);
  else addEventListener('load', function () { setTimeout(run, 600); });
})();

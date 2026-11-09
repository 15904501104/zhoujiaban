/* 肘家班 · 访客上报（只写不读）
   依赖 js/track-config.js；配置为空时静默跳过。
   城市来自 ipwho.is；若配置了 tencentKey，再用腾讯位置服务补「区/县」。 */
(function () {
  var C = window.ZJB_TRACK || {};
  if (!C.url || !C.key) return;
  var table = C.table || 'visits';
  var ENDPOINT = C.url.replace(/\/$/, '') + '/rest/v1/' + table;

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

  function makeBody(geo) {
    return {
      page: location.pathname + location.search,
      referrer: document.referrer || '',
      ua: navigator.userAgent,
      lang: navigator.language || '',
      tz: (window.Intl && Intl.DateTimeFormat().resolvedOptions().timeZone) || '',
      screen: screenStr(),
      country: geo.country || '',
      region: geo.region || '',
      city: geo.city || '',
      district: geo.district || '',
      lat: typeof geo.latitude === 'number' ? geo.latitude : null,
      lon: typeof geo.longitude === 'number' ? geo.longitude : null,
      sid: sid()
    };
  }

  function post(o) {
    return fetch(ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': C.key,
        'Authorization': 'Bearer ' + C.key,
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify(o),
      keepalive: true,
      mode: 'cors'
    }).then(function (r) {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r;
    });
  }

  function send(geo) {
    var o = makeBody(geo);
    if (!o.district) { post(o).catch(function () {}); return; }
    // 库里还没有 district 列时（没跑过 ALTER），退回不带区县的记录，避免整条丢失
    post(o).catch(function () {
      delete o.district;
      post(o).catch(function () {});
    });
  }

  function tencent(cb) {
    if (!C.tencentKey) return cb(null);
    var name = '__zjbGeo' + Math.floor(Math.random() * 1e6);
    var s = document.createElement('script');
    var done = false;
    function fin(d) {
      if (done) return;
      done = true;
      try { delete window[name]; } catch (e) { window[name] = null; }
      if (s.parentNode) s.parentNode.removeChild(s);
      cb(d);
    }
    window[name] = function (r) { fin(r && r.result && r.result.ad_info ? r.result.ad_info : null); };
    s.onerror = function () { fin(null); };
    s.src = 'https://apis.map.qq.com/ws/location/v1/ip?key=' + encodeURIComponent(C.tencentKey) +
            '&output=jsonp&callback=' + name;
    (document.head || document.documentElement).appendChild(s);
    setTimeout(function () { fin(null); }, 3000);
  }

  function lookup(cb) {
    var geo = {}, done = false;
    var timer = setTimeout(finish, 4500);
    function finish() {
      if (done) return;
      done = true;
      clearTimeout(timer);
      cb(geo);
    }
    fetch('https://ipwho.is/?lang=zh-CN', { mode: 'cors' })
      .then(function (r) { return r.json(); })
      .then(function (g) {
        if (g && g.success !== false) {
          geo.country = g.country; geo.region = g.region; geo.city = g.city;
          geo.latitude = g.latitude; geo.longitude = g.longitude;
        }
      })
      .catch(function () {})
      .then(function () {
        tencent(function (d) {
          if (d) {
            if (d.district) geo.district = d.district;
            if (d.city && !geo.city) geo.city = d.city;
            if (d.province && !geo.region) geo.region = d.province;
          }
          finish();
        });
      });
  }

  function run() {
    var cached = null;
    try { cached = JSON.parse(sessionStorage.getItem('zjb.geo') || 'null'); } catch (e) {}
    if (cached && cached.ts && Date.now() - cached.ts < 6 * 3600e3) { send(cached.geo || {}); return; }
    lookup(function (geo) {
      try { sessionStorage.setItem('zjb.geo', JSON.stringify({ ts: Date.now(), geo: geo })); } catch (e) {}
      send(geo);
    });
  }

  if (document.readyState === 'complete') setTimeout(run, 600);
  else addEventListener('load', function () { setTimeout(run, 600); });
})();

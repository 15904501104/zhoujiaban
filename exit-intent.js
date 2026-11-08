/* 退出意向弹窗（全站共享）
 * 只有把「全部页面」都逛过之后，准备离开网站时才弹出一次。
 * 想调整触发门槛：改 VISIT_NEEDED（默认 6 = 六个主要页面全逛过）。
 */
(function () {
  var VISIT_NEEDED = 0; // 0 = 不再要求逛完全站；改成 6 则恢复“逛完六个页面才弹”
  var PAGES = ["index.html", "dalian.html", "pig.html", "school.html", "navy.html", "china.html"];
  var SEEN_KEY = "zjban.exitModalShown";
  var VISIT_KEY = "zjban.visitedPages";

  function currentPage() {
    var p = location.pathname.split("/").pop() || "index.html";
    return p === "" ? "index.html" : p;
  }

  function loadVisited() {
    try {
      var raw = localStorage.getItem(VISIT_KEY);
      var arr = raw ? JSON.parse(raw) : [];
      return Array.isArray(arr) ? arr : [];
    } catch (e) { return []; }
  }

  function saveVisited(list) {
    try { localStorage.setItem(VISIT_KEY, JSON.stringify(list)); } catch (e) {}
  }

  function markVisited() {
    var page = currentPage();
    if (PAGES.indexOf(page) === -1) return;
    var list = loadVisited();
    if (list.indexOf(page) === -1) {
      list.push(page);
      saveVisited(list);
    }
  }

  function visitedCount() {
    var list = loadVisited();
    return PAGES.filter(function (p) { return list.indexOf(p) > -1; }).length;
  }

  function alreadyShown() {
    try { return sessionStorage.getItem(SEEN_KEY) === "1"; } catch (e) { return false; }
  }

  function markShown() {
    try { sessionStorage.setItem(SEEN_KEY, "1"); } catch (e) {}
  }

  function buildModal() {
    if (document.getElementById("exit-modal")) return document.getElementById("exit-modal");

    var style = document.createElement("style");
    style.textContent = [
      ".exit-modal{position:fixed;inset:0;z-index:120;display:none;align-items:center;justify-content:center;padding:24px;background:rgba(10,12,16,.55);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px)}",
      ".exit-modal.show{display:flex}",
      ".exit-card{width:min(420px,100%);padding:34px 30px 26px;border-radius:22px;background:#fff;box-shadow:0 30px 70px rgba(0,20,50,.32);text-align:center;animation:exitPop .24s ease-out both}",
      "@keyframes exitPop{from{transform:translateY(16px) scale(.97)}to{transform:none}}",
      ".exit-figure{display:block;width:min(240px,70%);height:auto;margin:0 auto 16px;border-radius:14px;box-shadow:0 12px 26px rgba(20,30,60,.18)}",
      ".exit-title{margin:0 0 10px;font-size:1.34rem;font-weight:800;color:#141414}",
      ".exit-body{margin:0 0 24px;font-size:.95rem;line-height:1.9;color:#6b7078}",
      ".exit-body--strong{font-size:1.06rem;font-weight:700;color:#141414;line-height:1.8}",
      ".exit-actions{display:flex;gap:12px}",
      ".exit-btn{flex:1 1 0;padding:13px 10px;border-radius:999px;border:0;font-size:.95rem;font-weight:700;cursor:pointer;transition:transform .16s ease,box-shadow .16s ease,background .16s ease;font-family:inherit}",
      ".exit-btn--reward{background:linear-gradient(180deg,#2683f0,#0071e3);color:#fff;box-shadow:0 10px 22px rgba(0,90,200,.28)}",
      ".exit-btn--reward:hover{transform:translateY(-1px);box-shadow:0 14px 26px rgba(0,90,200,.34)}",
      ".exit-btn--left{background:#f2f4f7;color:#6b7078;border:1px solid #e6e8ec}",
      ".exit-btn--left:hover{background:#e9edf3;color:#4a4f57}"
    ].join("");

    var modal = document.createElement("div");
    modal.className = "exit-modal";
    modal.id = "exit-modal";
    modal.setAttribute("aria-hidden", "true");
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.setAttribute("aria-labelledby", "exit-title");
    modal.innerHTML = [
      '<div class="exit-card">',
      '  <img class="exit-figure" src="exit-cry.jpg" alt="哭给你看">',
      '  <p class="exit-body exit-body--strong">呜呜呜您真的不要打赏一下么？</p>',
      '  <div class="exit-actions">',
      '    <button class="exit-btn exit-btn--reward" type="button" id="exit-reward">打赏</button>',
      '    <button class="exit-btn exit-btn--left" type="button" id="exit-stay">残忍离开</button>',
      "  </div>",
      "</div>"
    ].join("");

    document.head.appendChild(style);
    document.body.appendChild(modal);
    return modal;
  }

  function hide(modal) {
    modal.classList.remove("show");
    modal.setAttribute("aria-hidden", "true");
  }

  function show(modal) {
    if (alreadyShown()) return;
    markShown();
    modal.classList.add("show");
    modal.setAttribute("aria-hidden", "false");
  }

  var disabledPreviewGuard = false;

  markVisited();

  document.addEventListener("DOMContentLoaded", function () {
    var modal = buildModal();
    if (!modal) return;

    modal.addEventListener("click", function (e) {
      if (e.target === modal) hide(modal);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && modal.classList.contains("show")) hide(modal);
    });

    var reward = document.getElementById("exit-reward");
    if (reward) reward.addEventListener("click", function () { location.href = "reward.html"; });
    var stay = document.getElementById("exit-stay");
    if (stay) stay.addEventListener("click", function () { hide(modal); });

    function maybeShow() {
    // 只在整个网站的最后页（首页）页脚出现时弹
    var _p = location.pathname;
    var _isIndex = (_p === "/" || /index\.html$/.test(_p));
    if (!_isIndex) return;
      if (!disabledPreviewGuard && alreadyShown()) return;
      if (visitedCount() < VISIT_NEEDED) return;
      show(modal);
    }

    // 预览模式：加 ?exitpreview=1 直接弹出，方便填内容
    if (location.search.indexOf("exitpreview") > -1) {
      modal.classList.add("show");
      modal.setAttribute("aria-hidden", "false");
      disabledPreviewGuard = true;
      return;
    }

    // 触发条件：滚动到页脚（页面底部）时弹出，其他位置不弹
    var foot = document.querySelector("footer");
    if (foot && "IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            maybeShow();
            io.disconnect();
          }
        });
      }, { threshold: 0 });
      io.observe(foot);
    }

    // 兜底：没有 footer 或观察器不生效时，接近底部也弹
    window.addEventListener("scroll", function () {
      var doc = document.documentElement;
      var nearBottom = window.scrollY + window.innerHeight >= doc.scrollHeight - 120;
      if (nearBottom) maybeShow();
    }, { passive: true });
  });
})();

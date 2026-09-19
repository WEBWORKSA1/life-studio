/*! Life.Studio — core site script (no dependencies) */
(function () {
  "use strict";
  var C = window.LS_CONFIG || {};
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var store = {
    get: function (k, d) { try { var v = localStorage.getItem("ls_" + k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem("ls_" + k, JSON.stringify(v)); } catch (e) {} }
  };
  window.LS = { store: store, $: $, $$: $$ };

  /* ---------- Contact routing (address never appears in source) ---------- */
  function route() {
    try {
      var p = (C._r || []).map(function (x) { return atob(x).split("").reverse().join(""); });
      return p[0] + String.fromCharCode(64) + p[1];
    } catch (e) { return ""; }
  }
  $$("[data-mail]").forEach(function (a) {
    a.setAttribute("href", "#contact");
    a.addEventListener("click", function (e) {
      e.preventDefault();
      var subj = a.getAttribute("data-mail") || "Life.Studio inquiry";
      window.location.href = "mai" + "lto:" + route() + "?subject=" + encodeURIComponent(subj);
    });
  });

  /* ---------- Theme ---------- */
  var root = document.documentElement;
  var saved = store.get("theme", null);
  if (saved) root.setAttribute("data-theme", saved);
  $$("[data-theme-toggle]").forEach(function (b) {
    b.addEventListener("click", function () {
      var dark = root.getAttribute("data-theme") === "dark" ||
        (!root.getAttribute("data-theme") && window.matchMedia("(prefers-color-scheme: dark)").matches);
      var next = dark ? "light" : "dark";
      root.setAttribute("data-theme", next); store.set("theme", next);
    });
  });

  /* ---------- Mobile menu ---------- */
  var burger = $(".burger"), menu = $(".menu");
  if (burger && menu) burger.addEventListener("click", function () {
    var open = menu.classList.toggle("open");
    burger.setAttribute("aria-expanded", open ? "true" : "false");
  });

  /* ---------- Year ---------- */
  $$("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* ---------- Forms: every form posts to the hidden inbox ---------- */
  function sendForm(form) {
    var status = $(".form-status", form);
    var btn = $("[type=submit]", form);
    var fd = new FormData(form);
    if (fd.get("_honey")) return;
    var data = {};
    fd.forEach(function (v, k) {
      if (k === "_honey") return;
      data[k] = data[k] ? data[k] + ", " + v : v;
    });
    data._subject = "[Life.Studio] " + (form.getAttribute("data-ls-form") || "Form submission");
    data._template = "table";
    data._captcha = "false";
    data.page = location.href;
    data.submitted = new Date().toISOString();
    if (btn) { btn.disabled = true; btn.dataset.t = btn.textContent; btn.textContent = "Sending…"; }
    fetch("https://formsubmit.co/ajax/" + route(), {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify(data)
    }).then(function (r) { return r.json(); }).then(function (j) {
      var ok = j && (j.success === true || j.success === "true");
      if (status) {
        status.className = "form-status " + (ok ? "ok" : "err");
        status.textContent = ok ? (form.getAttribute("data-ok") || "Thank you! We received your submission and will reply within 1–2 business days.") :
          "Something went wrong. Please try again in a minute.";
      }
      if (ok) { form.reset(); form.dispatchEvent(new CustomEvent("ls:sent")); track("generate_lead", { form: data._subject }); }
    }).catch(function () {
      if (status) { status.className = "form-status err"; status.textContent = "Network error. Please try again."; }
    }).then(function () { if (btn) { btn.disabled = false; btn.textContent = btn.dataset.t; } });
  }
  $$("form[data-ls-form]").forEach(function (f) {
    if (!$(".form-status", f)) { var s = document.createElement("div"); s.className = "form-status"; s.setAttribute("role", "status"); f.appendChild(s); }
    if (!$("[name=_honey]", f)) { var h = document.createElement("input"); h.type = "text"; h.name = "_honey"; h.className = "hp"; h.tabIndex = -1; h.setAttribute("aria-hidden", "true"); h.autocomplete = "off"; f.appendChild(h); }
    f.addEventListener("submit", function (e) { e.preventDefault(); if (f.checkValidity()) sendForm(f); else f.reportValidity(); });
  });
  window.LS.sendForm = sendForm;

  /* ---------- Multi-step forms ---------- */
  $$("[data-stepper]").forEach(function (wrap) {
    var steps = $$(".step", wrap), i = 0, bar = $(".progress i", wrap), label = $("[data-step-label]", wrap);
    function show(n) {
      steps.forEach(function (s, k) { s.classList.toggle("active", k === n); });
      if (bar) bar.style.width = ((n + 1) / steps.length * 100) + "%";
      if (label) label.textContent = "Step " + (n + 1) + " of " + steps.length;
      $$("[data-prev]", wrap).forEach(function (b) { b.style.visibility = n === 0 ? "hidden" : "visible"; });
      i = n;
    }
    $$("[data-next]", wrap).forEach(function (b) {
      b.addEventListener("click", function () {
        var fields = $$("input,select,textarea", steps[i]), ok = true;
        fields.forEach(function (f) { if (ok && !f.checkValidity()) { f.reportValidity(); ok = false; } });
        var need = steps[i].getAttribute("data-require-choice");
        if (ok && need && !$("input[name='" + need + "']:checked", steps[i])) { alert("Please choose at least one option."); ok = false; }
        if (ok) show(Math.min(i + 1, steps.length - 1));
      });
    });
    $$("[data-prev]", wrap).forEach(function (b) { b.addEventListener("click", function () { show(Math.max(i - 1, 0)); }); });
    show(0);
  });

  /* ---------- Analytics + AdSense (consent-aware) ---------- */
  function track(ev, params) { if (window.gtag) window.gtag("event", ev, params || {}); }
  window.LS.track = track;
  function loadScript(src, attrs) {
    var s = document.createElement("script"); s.async = true; s.src = src;
    for (var k in (attrs || {})) s.setAttribute(k, attrs[k]);
    document.head.appendChild(s);
  }
  function startTracking() {
    if (C.ga4) {
      loadScript("https://www.googletagmanager.com/gtag/js?id=" + C.ga4);
      window.dataLayer = window.dataLayer || [];
      window.gtag = function () { window.dataLayer.push(arguments); };
      window.gtag("js", new Date()); window.gtag("config", C.ga4);
    }
  }
  function houseAd(slot) {
    var pool = [
      ["Reach 100% life-improvers.", "Sponsor this space on Life.Studio.", "advertise.html", "Advertise"],
      ["Want a personal coach?", "Get matched free in 2 minutes.", "coaching.html", "Get matched"],
      ["Win prizes for changing your life.", "Join the 30-Day Life Redesign Challenge.", "challenges.html", "Enter free"],
      ["Keep Life.Studio free.", "Support independent, ad-light tools.", "support.html", "Support us"]
    ];
    var a = pool[Math.floor(Math.random() * pool.length)];
    slot.innerHTML = '<div style="width:100%"><span class="ad-label">Sponsored</span><div class="house-ad"><p><strong>' + a[0] + "</strong> " + a[1] +
      '</p><a class="btn btn-sm btn-primary" href="' + a[2] + '">' + a[3] + "</a></div></div>";
  }
  function startAds() {
    var slots = $$(".ad-slot");
    if (!C.adsense || !C.adsense.client) { slots.forEach(houseAd); return; }
    loadScript("https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=" + C.adsense.client, { crossorigin: "anonymous" });
    slots.forEach(function (slot) {
      var id = (C.adsense.slots || {})[slot.getAttribute("data-slot") || "inArticle"];
      if (!id) { houseAd(slot); return; }
      slot.innerHTML = '<div style="width:100%"><span class="ad-label">Advertisement</span><ins class="adsbygoogle" style="display:block" data-ad-client="' +
        C.adsense.client + '" data-ad-slot="' + id + '" data-ad-format="auto" data-full-width-responsive="true"></ins></div>';
      try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch (e) {}
    });
  }
  var consent = store.get("consent", null);
  var cookie = $(".cookie");
  function applyConsent(v) { store.set("consent", v); if (cookie) cookie.classList.remove("show"); if (v === "all") startTracking(); startAds(); }
  if (consent) { if (consent === "all") startTracking(); startAds(); }
  else { startAds(); if (cookie) cookie.classList.add("show"); }
  $$("[data-consent]").forEach(function (b) { b.addEventListener("click", function () { applyConsent(b.getAttribute("data-consent")); }); });

  /* ---------- YouTube lite embeds ---------- */
  function ytCard(v) {
    return '<article class="video-card" data-cat="' + v.cat + '"><div class="yt" data-yt="' + v.id + '" role="button" tabindex="0" aria-label="Play ' + v.title.replace(/"/g, "") + '">' +
      '<img loading="lazy" src="https://i.ytimg.com/vi/' + v.id + '/hqdefault.jpg" alt="">' +
      '<span class="play" aria-hidden="true">▶</span></div><div class="meta"><span class="tag">' + v.cat + "</span><h3>" + v.title +
      "</h3><small>" + (v.by || "") + "</small></div></article>";
  }
  function wireYT(scope) {
    $$(".yt", scope).forEach(function (el) {
      var img = $("img", el);
      if (img) img.addEventListener("load", function () { if (img.naturalWidth === 120) { var c = el.closest(".video-card"); if (c) c.remove(); } });
      function play() {
        el.innerHTML = '<iframe src="https://www.youtube-nocookie.com/embed/' + el.getAttribute("data-yt") +
          '?autoplay=1&rel=0" title="YouTube video" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';
        track("video_play", { id: el.getAttribute("data-yt") });
      }
      el.addEventListener("click", play);
      el.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); play(); } });
    });
  }
  $$("[data-videos]").forEach(function (box) {
    var vids = (C.youtube && C.youtube.videos) || [];
    var n = parseInt(box.getAttribute("data-videos"), 10) || vids.length;
    box.innerHTML = vids.slice(0, n).map(ytCard).join("");
    wireYT(box);
    var filt = $("[data-video-filters]");
    if (filt && box.hasAttribute("data-filterable")) {
      var cats = ["All"].concat(vids.map(function (v) { return v.cat; }).filter(function (c, i, a) { return a.indexOf(c) === i; }));
      filt.innerHTML = cats.map(function (c, i) { return '<button type="button" class="' + (i ? "" : "on") + '">' + c + "</button>"; }).join("");
      $$("button", filt).forEach(function (b) {
        b.addEventListener("click", function () {
          $$("button", filt).forEach(function (x) { x.classList.remove("on"); }); b.classList.add("on");
          $$(".video-card", box).forEach(function (card) { card.style.display = (b.textContent === "All" || card.getAttribute("data-cat") === b.textContent) ? "" : "none"; });
        });
      });
    }
  });
  $$("[data-channel]").forEach(function (a) { if (C.youtube) a.href = C.youtube.channelUrl; });
  $$("[data-social]").forEach(function (a) { var k = a.getAttribute("data-social"); if (C.social && C.social[k]) a.href = C.social[k]; });

  /* ---------- Countdown ---------- */
  $$("[data-countdown]").forEach(function (el) {
    var end = new Date((C.contest && C.contest.deadline) || el.getAttribute("data-countdown")).getTime();
    function tick() {
      var d = Math.max(0, end - Date.now());
      var parts = [Math.floor(d / 864e5), Math.floor(d / 36e5) % 24, Math.floor(d / 6e4) % 60, Math.floor(d / 1e3) % 60];
      el.innerHTML = ["Days", "Hours", "Mins", "Secs"].map(function (l, i) { return "<div><b>" + parts[i] + "</b><span>" + l + "</span></div>"; }).join("");
    }
    tick(); setInterval(tick, 1000);
  });
  $$("[data-contest-name]").forEach(function (el) { if (C.contest) el.textContent = C.contest.name; });
  $$("[data-prize-pool]").forEach(function (el) { if (C.contest) el.textContent = C.contest.prizePool; });

  /* ---------- Reveal on scroll ---------- */
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }); }, { threshold: .12 });
    $$(".reveal").forEach(function (el) { io.observe(el); });
  } else $$(".reveal").forEach(function (el) { el.classList.add("in"); });

  /* ---------- Count-up stats ---------- */
  $$("[data-count]").forEach(function (el) {
    var target = parseFloat(el.getAttribute("data-count")), suf = el.getAttribute("data-suffix") || "", done = false;
    function run() {
      if (done) return; done = true; var t0 = null;
      function step(t) { if (!t0) t0 = t; var p = Math.min(1, (t - t0) / 1400); el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))).toLocaleString() + suf; if (p < 1) requestAnimationFrame(step); }
      requestAnimationFrame(step);
    }
    if ("IntersectionObserver" in window) new IntersectionObserver(function (es, o) { if (es[0].isIntersecting) { run(); o.disconnect(); } }).observe(el); else run();
  });

  /* ---------- Modals ---------- */
  function openModal(id) { var m = document.getElementById(id); if (m) { m.classList.add("open"); var f = $("input,button", m); if (f) f.focus(); } }
  function closeModal(m) { m.classList.remove("open"); }
  window.LS.openModal = openModal;
  $$("[data-open]").forEach(function (b) { b.addEventListener("click", function (e) { e.preventDefault(); openModal(b.getAttribute("data-open")); }); });
  $$(".modal").forEach(function (m) {
    m.addEventListener("click", function (e) { if (e.target === m || e.target.closest(".modal-close")) closeModal(m); });
  });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") $$(".modal.open").forEach(closeModal); });

  /* ---------- Lead magnet: exit intent / 45s timer, once per 7 days ---------- */
  var lm = document.getElementById("leadMagnet");
  if (lm && !document.body.hasAttribute("data-no-popup")) {
    var last = store.get("lm_seen", 0);
    if (Date.now() - last > 7 * 864e5) {
      var fired = false;
      var fire = function () { if (fired) return; fired = true; store.set("lm_seen", Date.now()); openModal("leadMagnet"); };
      document.addEventListener("mouseout", function (e) { if (!e.relatedTarget && e.clientY < 8) fire(); });
      setTimeout(fire, 45000);
    }
  }

  /* ---------- Sticky CTA after scroll ---------- */
  var sticky = $(".sticky-cta");
  if (sticky) window.addEventListener("scroll", function () { sticky.classList.toggle("show", window.scrollY > 900); }, { passive: true });

  /* ---------- Share buttons ---------- */
  $$("[data-share]").forEach(function (a) {
    var u = encodeURIComponent(location.href), t = encodeURIComponent(document.title);
    var map = {
      x: "https://twitter.com/intent/tweet?url=" + u + "&text=" + t,
      facebook: "https://www.facebook.com/sharer/sharer.php?u=" + u,
      linkedin: "https://www.linkedin.com/sharing/share-offsite/?url=" + u,
      whatsapp: "https://wa.me/?text=" + t + "%20" + u,
      pinterest: "https://pinterest.com/pin/create/button/?url=" + u + "&description=" + t
    };
    var k = a.getAttribute("data-share");
    if (k === "copy") a.addEventListener("click", function (e) { e.preventDefault(); if (navigator.clipboard) navigator.clipboard.writeText(location.href); a.textContent = "Copied!"; });
    else { a.href = map[k]; a.target = "_blank"; a.rel = "noopener"; }
  });

  /* ---------- Search/filter lists ---------- */
  $$("[data-filter-input]").forEach(function (inp) {
    var list = document.querySelector(inp.getAttribute("data-filter-input"));
    inp.addEventListener("input", function () {
      var q = inp.value.toLowerCase();
      $$("[data-search]", list).forEach(function (c) { c.style.display = c.getAttribute("data-search").toLowerCase().indexOf(q) > -1 || c.textContent.toLowerCase().indexOf(q) > -1 ? "" : "none"; });
    });
  });
})();

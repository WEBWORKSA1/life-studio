/*! Life.Studio — interactive tools */
(function () {
  "use strict";
  var L = window.LS, $ = L.$, $$ = L.$$, store = L.store;
  function css(v) { return getComputedStyle(document.documentElement).getPropertyValue(v).trim(); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function money(n) { return "$" + Math.round(n).toLocaleString(); }

  /* ================= 1. Wheel of Life ================= */
  var wheel = $("#wheelTool");
  if (wheel) {
    var areas = ["Health & Energy", "Career & Work", "Money & Finances", "Relationships", "Family & Friends", "Personal Growth", "Fun & Recreation", "Environment & Home"];
    var tips = {
      "Health & Energy": "Start with sleep: a fixed wake time and 7+ hours lifts every other area.",
      "Career & Work": "List the 3 tasks that create 80% of your value. Protect 2 hours a day for them.",
      "Money & Finances": "Automate a transfer of 10% of every paycheck into savings on payday.",
      "Relationships": "Schedule one undistracted, phone-free conversation each week.",
      "Family & Friends": "Pick two people you miss and put a recurring call in your calendar.",
      "Personal Growth": "Read 10 pages a day — roughly 12–15 books a year.",
      "Fun & Recreation": "Book one activity purely for joy this week. Put it on the calendar like a meeting.",
      "Environment & Home": "Declutter one drawer or surface per day for 14 days."
    };
    var vals = store.get("wheel", areas.map(function () { return 5; }));
    var box = $("#wheelInputs");
    box.innerHTML = areas.map(function (a, i) {
      return '<div class="range-row"><div class="lbl"><span>' + a + '</span><output id="wo' + i + '">' + vals[i] + '</output></div><input type="range" min="1" max="10" value="' + vals[i] + '" data-i="' + i + '" aria-label="' + a + '"></div>';
    }).join("");
    var cv = $("#wheelCanvas"), ctx = cv.getContext("2d");
    function draw() {
      var dpr = window.devicePixelRatio || 1, W = cv.clientWidth, H = W;
      cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var cx = W / 2, cy = H / 2, R = W / 2 - 86, n = areas.length;
      ctx.clearRect(0, 0, W, H);
      ctx.strokeStyle = css("--line"); ctx.lineWidth = 1;
      for (var r = 1; r <= 10; r++) { ctx.beginPath(); for (var k = 0; k <= n; k++) { var a = -Math.PI / 2 + k * 2 * Math.PI / n, x = cx + Math.cos(a) * R * r / 10, y = cy + Math.sin(a) * R * r / 10; k ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke(); }
      ctx.beginPath();
      vals.forEach(function (v, k) { var a = -Math.PI / 2 + k * 2 * Math.PI / n, x = cx + Math.cos(a) * R * v / 10, y = cy + Math.sin(a) * R * v / 10; k ? ctx.lineTo(x, y) : ctx.moveTo(x, y); });
      ctx.closePath();
      var g = ctx.createLinearGradient(0, 0, W, H); g.addColorStop(0, "rgba(255,90,54,.55)"); g.addColorStop(1, "rgba(108,92,231,.55)");
      ctx.fillStyle = g; ctx.fill(); ctx.strokeStyle = css("--brand-2"); ctx.lineWidth = 2.5; ctx.stroke();
      ctx.fillStyle = css("--ink"); ctx.font = "600 " + (W < 400 ? 10 : 12) + "px Inter,sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
      areas.forEach(function (label, k) { var a = -Math.PI / 2 + k * 2 * Math.PI / n, x = cx + Math.cos(a) * (R + 36), y = cy + Math.sin(a) * (R + 26); var parts = label.split(" & "); ctx.fillText(parts[0] + (parts[1] ? " &" : ""), x, y - (parts[1] ? 7 : 0)); if (parts[1]) ctx.fillText(parts[1], x, y + 8); });
      var avg = vals.reduce(function (s, v) { return s + v; }, 0) / n;
      var sorted = areas.map(function (a, i) { return [a, vals[i]]; }).sort(function (a, b) { return a[1] - b[1]; });
      $("#wheelScore").textContent = avg.toFixed(1);
      $("#wheelBalance").textContent = (10 - (sorted[n - 1][1] - sorted[0][1])) + "/10";
      $("#wheelFocus").innerHTML = sorted.slice(0, 3).map(function (s) { return "<li><strong>" + s[0] + " (" + s[1] + "/10)</strong> — " + tips[s[0]] + "</li>"; }).join("");
      var hidden = $("#wheelSummary"); if (hidden) hidden.value = areas.map(function (a, i) { return a + ": " + vals[i]; }).join(" | ");
    }
    $$("input[type=range]", box).forEach(function (r) {
      r.addEventListener("input", function () { var i = +r.getAttribute("data-i"); vals[i] = +r.value; $("#wo" + i).textContent = r.value; store.set("wheel", vals); draw(); });
    });
    window.addEventListener("resize", draw); draw();
    var dl = $("#wheelDownload"); if (dl) dl.addEventListener("click", function () { var a = document.createElement("a"); a.download = "my-wheel-of-life.png"; a.href = cv.toDataURL("image/png"); a.click(); });
  }

  /* ================= 2. Life in Weeks ================= */
  var weeks = $("#weeksTool");
  if (weeks) {
    var bd = $("#birthdate"), exp = $("#lifeExp"), grid = $("#weeksGrid");
    bd.value = store.get("bd", "");
    function render() {
      var years = +exp.value || 80, total = years * 52;
      var b = bd.value ? new Date(bd.value) : null;
      var lived = b ? Math.max(0, Math.floor((Date.now() - b.getTime()) / (7 * 864e5))) : 0;
      lived = Math.min(lived, total);
      var html = ""; for (var i = 0; i < total; i++) html += '<i class="' + (i < lived ? "past" : i === lived ? "now" : "") + '"></i>';
      grid.innerHTML = html;
      var left = total - lived;
      $("#wLived").textContent = lived.toLocaleString();
      $("#wLeft").textContent = left.toLocaleString();
      $("#wPct").textContent = (lived / total * 100).toFixed(1) + "%";
      $("#wSummers").textContent = Math.round(left / 52).toLocaleString();
      $("#wWeekends").textContent = left.toLocaleString();
      $("#wBooks").textContent = Math.round(left / 52 * 12).toLocaleString();
      if (bd.value) store.set("bd", bd.value);
    }
    bd.addEventListener("change", render); exp.addEventListener("input", function () { $("#expOut").textContent = exp.value; render(); });
    render();
  }

  /* ================= 3. SMART Goal Planner ================= */
  var goal = $("#goalTool");
  if (goal) {
    var saveG = store.get("goal", null);
    if (saveG) Object.keys(saveG).forEach(function (k) { var f = goal.elements[k]; if (f) f.value = saveG[k]; });
    goal.addEventListener("submit", function (e) {
      e.preventDefault();
      var d = {}; ["gTitle", "gWhy", "gMetric", "gDeadline", "gObstacle", "gArea"].forEach(function (k) { d[k] = goal.elements[k].value; });
      store.set("goal", d);
      var end = new Date(d.gDeadline), now = new Date(), days = Math.max(7, Math.round((end - now) / 864e5));
      var ms = [0.25, 0.5, 0.75, 1].map(function (p, i) {
        var dt = new Date(now.getTime() + days * p * 864e5);
        var label = ["Foundation", "Momentum", "Acceleration", "Finish line"][i];
        return "<li><strong>" + label + " — " + dt.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }) + ":</strong> reach " + Math.round(p * 100) + "% of “" + esc(d.gMetric) + "”.</li>";
      }).join("");
      $("#goalOut").innerHTML =
        '<span class="eyebrow">Your plan</span><h3>' + esc(d.gTitle) + "</h3>" +
        '<p class="muted">' + days + " days · Life area: " + esc(d.gArea) + "</p>" +
        "<h4>Why it matters</h4><p>" + esc(d.gWhy) + "</p>" +
        "<h4>Milestones</h4><ol>" + ms + "</ol>" +
        "<h4>If–then plan</h4><p><em>If</em> " + esc(d.gObstacle || "I lose motivation") + ", <em>then</em> I will do the smallest 2-minute version of the task and log it.</p>" +
        "<h4>Weekly rhythm</h4><ul><li>Sunday: 15-minute review — score progress 1–10.</li><li>Daily: one action that moves the metric.</li><li>Monthly: adjust the plan, not the goal.</li></ul>" +
        '<div class="cta-row" style="display:flex;gap:10px;flex-wrap:wrap;margin-top:14px"><button class="btn btn-dark btn-sm" onclick="window.print()">Print / Save PDF</button><a class="btn btn-primary btn-sm" href="coaching.html">Get an accountability coach</a></div>';
      $("#goalOut").scrollIntoView({ behavior: "smooth", block: "start" });
      L.track("tool_complete", { tool: "goal" });
    });
  }

  /* ================= 4. Habit Tracker ================= */
  var ht = $("#habitTool");
  if (ht) {
    var state = store.get("habits", { month: "", list: [] });
    var now = new Date(), key = now.getFullYear() + "-" + (now.getMonth() + 1);
    if (state.month !== key) { state.list.forEach(function (h) { h.days = []; }); state.month = key; }
    if (!state.list.length) state.list = [{ name: "Drink 2L water", days: [] }, { name: "Move 30 minutes", days: [] }, { name: "Read 10 pages", days: [] }];
    var dim = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    function streak(days) { var s = 0, d = now.getDate(); while (d > 0 && days.indexOf(d) > -1) { s++; d--; } return s; }
    function renderH() {
      var head = "<tr><th>Habit</th>" + Array.from({ length: dim }, function (_, i) { return "<th>" + (i + 1) + "</th>"; }).join("") + "<th>🔥</th><th></th></tr>";
      var rows = state.list.map(function (h, hi) {
        return "<tr><td>" + esc(h.name) + "</td>" + Array.from({ length: dim }, function (_, i) {
          var d = i + 1; return '<td><button class="d' + (h.days.indexOf(d) > -1 ? " on" : "") + '" data-h="' + hi + '" data-d="' + d + '" aria-label="' + esc(h.name) + " day " + d + '"></button></td>';
        }).join("") + "<td><strong>" + streak(h.days) + "</strong></td><td><button class='d' data-del='" + hi + "' aria-label='Remove'>×</button></td></tr>";
      }).join("");
      $("#habitTable").innerHTML = head + rows;
      var total = state.list.reduce(function (s, h) { return s + h.days.length; }, 0), possible = state.list.length * now.getDate();
      $("#habitRate").textContent = possible ? Math.round(total / possible * 100) + "%" : "0%";
      $("#habitBar").style.width = possible ? Math.min(100, total / possible * 100) + "%" : "0";
      store.set("habits", state);
    }
    $("#habitTable").addEventListener("click", function (e) {
      var b = e.target.closest("button"); if (!b) return;
      if (b.hasAttribute("data-del")) { state.list.splice(+b.getAttribute("data-del"), 1); }
      else { var h = state.list[+b.getAttribute("data-h")], d = +b.getAttribute("data-d"), ix = h.days.indexOf(d); ix > -1 ? h.days.splice(ix, 1) : h.days.push(d); }
      renderH();
    });
    $("#habitAdd").addEventListener("submit", function (e) { e.preventDefault(); var v = this.elements.hname.value.trim(); if (v) { state.list.push({ name: v, days: [] }); this.reset(); renderH(); } });
    $("#habitMonth").textContent = now.toLocaleDateString(undefined, { month: "long", year: "numeric" });
    renderH();
  }

  /* ================= 5. Financial Freedom (FIRE) Calculator ================= */
  var fire = $("#fireTool");
  if (fire) {
    var fc = $("#fireCanvas"), fx = fc.getContext("2d");
    function calc() {
      var inc = +fire.elements.income.value, spend = +fire.elements.spend.value, saved = +fire.elements.saved.value, ret = +fire.elements.ret.value / 100, swr = +fire.elements.swr.value / 100;
      var save = Math.max(0, inc - spend), rate = inc ? save / inc : 0, target = spend / swr, bal = saved, yrs = 0, pts = [bal];
      while (bal < target && yrs < 70) { bal = bal * (1 + ret) + save; yrs++; pts.push(bal); }
      $("#fYears").textContent = yrs >= 70 ? "70+" : yrs;
      $("#fTarget").textContent = money(target);
      $("#fRate").textContent = Math.round(rate * 100) + "%";
      $("#fMonthly").textContent = money(save / 12);
      var dpr = window.devicePixelRatio || 1, W = fc.clientWidth, H = 220; fc.width = W * dpr; fc.height = H * dpr; fx.setTransform(dpr, 0, 0, dpr, 0, 0);
      fx.clearRect(0, 0, W, H); var max = Math.max(target * 1.1, pts[pts.length - 1]);
      fx.strokeStyle = css("--line"); fx.setLineDash([5, 5]); var ty = H - 20 - (target / max) * (H - 40); fx.beginPath(); fx.moveTo(0, ty); fx.lineTo(W, ty); fx.stroke(); fx.setLineDash([]);
      fx.fillStyle = css("--muted"); fx.font = "12px Inter,sans-serif"; fx.fillText("Freedom number " + money(target), 8, ty - 6);
      fx.beginPath(); pts.forEach(function (p, i) { var x = (i / Math.max(1, pts.length - 1)) * (W - 10) + 5, y = H - 20 - (p / max) * (H - 40); i ? fx.lineTo(x, y) : fx.moveTo(x, y); });
      fx.strokeStyle = css("--brand"); fx.lineWidth = 3; fx.stroke();
    }
    fire.addEventListener("input", calc); window.addEventListener("resize", calc); calc();
  }

  /* ================= 6. Purpose (Ikigai) Quiz ================= */
  var quiz = $("#purposeTool");
  if (quiz) {
    var Q = [
      ["I lose track of time when I'm creating something new.", "Creator"], ["I feel most alive when I'm helping someone solve a problem.", "Healer"],
      ["I naturally take charge when a group lacks direction.", "Leader"], ["I love figuring out how complex things work.", "Explorer"],
      ["People come to me to explain things simply.", "Teacher"], ["I spot opportunities to make money others miss.", "Builder"],
      ["Beauty, design and craft matter deeply to me.", "Creator"], ["I'm energized by caring for people or animals.", "Healer"],
      ["I enjoy persuading people toward a vision.", "Leader"], ["I'd rather research a topic for hours than skim it.", "Explorer"],
      ["I feel fulfilled when someone I mentored succeeds.", "Teacher"], ["I like turning ideas into systems that run without me.", "Builder"]
    ];
    var types = {
      Creator: ["The Creator", "You find meaning in making things that didn't exist before. Paths: design, writing, content, product, art-driven businesses.", "Block 5 hours a week of protected creative time and publish one small piece weekly."],
      Healer: ["The Healer", "You're wired for care and service. Paths: health, coaching, therapy, nonprofit, people operations.", "Guard your energy — set one boundary this week so you can keep giving sustainably."],
      Leader: ["The Leader", "You create direction for others. Paths: management, entrepreneurship, advocacy, sales leadership.", "Pick one initiative to own end-to-end and recruit two people to it."],
      Explorer: ["The Explorer", "Curiosity is your compass. Paths: research, science, analysis, journalism, strategy.", "Choose one question to investigate deeply for 30 days and share what you learn."],
      Teacher: ["The Teacher", "You multiply yourself through others. Paths: education, training, content, mentoring, coaching.", "Teach one thing you know this week — a post, a video or a lunch-and-learn."],
      Builder: ["The Builder", "You turn ideas into working systems and value. Paths: startups, operations, engineering, investing.", "Ship a scrappy version of one idea within 14 days and charge for it."]
    };
    $("#quizQs").innerHTML = Q.map(function (q, i) {
      return '<div class="quiz-q"><strong>' + (i + 1) + ". " + q[0] + '</strong><div class="likert">' + [1, 2, 3, 4, 5].map(function (v) {
        return '<label><input type="radio" name="q' + i + '" value="' + v + '" required> ' + ["Not me", "Rarely", "Sometimes", "Often", "So me"][v - 1] + "</label>";
      }).join("") + "</div></div>";
    }).join("");
    quiz.addEventListener("submit", function (e) {
      e.preventDefault();
      var sc = {}; Q.forEach(function (q, i) { var v = quiz.querySelector("input[name=q" + i + "]:checked"); sc[q[1]] = (sc[q[1]] || 0) + (v ? +v.value : 0); });
      var ranked = Object.keys(sc).sort(function (a, b) { return sc[b] - sc[a]; }), t = types[ranked[0]], t2 = types[ranked[1]];
      $("#quizOut").innerHTML = '<span class="eyebrow">Your purpose archetype</span><h2>' + t[0] + "</h2><p class='lead'>" + t[1] + "</p><p><strong>Secondary:</strong> " + t2[0] +
        "</p><div class='callout'><strong>Your next step:</strong> " + t[2] + "</div>" +
        ranked.map(function (k) { return "<div style='margin:8px 0'><div class='lbl' style='display:flex;justify-content:space-between'><span>" + k + "</span><span>" + sc[k] + "/10</span></div><div class='meter'><i style='width:" + (sc[k] * 10) + "%'></i></div></div>"; }).join("");
      var hid = $("#quizSummary"); if (hid) hid.value = t[0] + " / " + t2[0] + " — " + JSON.stringify(sc);
      $("#quizLead").style.display = "block";
      $("#quizOut").scrollIntoView({ behavior: "smooth" });
      L.track("tool_complete", { tool: "purpose" });
    });
  }
})();

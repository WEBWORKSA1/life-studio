#!/usr/bin/env python3
"""Life.Studio static site builder.

Pages live in src/pages/*.html and src/guides/*.html. Each file starts with a
JSON meta comment:  <!--{"title": "...", "desc": "...", "nav": "tools"}-->
Run:  python3 build.py   -> writes finished .html files to the repo root.
No dependencies. Output is plain static HTML (GitHub Pages / Netlify / Vercel).
"""
import json, re, pathlib, datetime

ROOT = pathlib.Path(__file__).parent
SITE = "https://webworksa1.github.io/life-studio"   # change to https://life.studio after DNS
TODAY = datetime.date.today().isoformat()

NAV = [("tools.html", "Tools", "tools"), ("guides.html", "Guides", "guides"), ("videos.html", "Videos", "videos"),
       ("coaching.html", "Coaching", "coaching"), ("challenges.html", "Challenges", "challenges"),
       ("support.html", "Support", "support")]

HEAD = """<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>{title}</title>
<meta name="description" content="{desc}">
<link rel="canonical" href="{url}">
<meta name="robots" content="{robots}">
<meta name="theme-color" content="#FF5A36">
<meta property="og:type" content="{ogtype}">
<meta property="og:site_name" content="Life.Studio">
<meta property="og:title" content="{title}">
<meta property="og:description" content="{desc}">
<meta property="og:url" content="{url}">
<meta property="og:image" content="{site}/assets/img/og.svg">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="assets/img/favicon.svg" type="image/svg+xml">
<link rel="manifest" href="manifest.webmanifest">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,650;9..144,700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="assets/css/style.css">
<script>try{{var t=localStorage.getItem("ls_theme");if(t)document.documentElement.setAttribute("data-theme",JSON.parse(t))}}catch(e){{}}</script>
<script type="application/ld+json">{jsonld}</script>
</head>
<body{bodyattr}>
<a class="skip" href="#main">Skip to content</a>
<div class="domain-bar" role="note">Contact, if you are interested in this website/domain name — <a href="https://web.works/contact" target="_blank" rel="noopener">web.works/contact</a></div>
<header class="site-header">
  <nav class="container nav" aria-label="Main">
    <a class="logo" href="index.html" aria-label="Life.Studio home"><span class="logo-mark">✦</span><span>Life<b>.</b>Studio</span></a>
    <ul class="menu" id="menu">{menu}</ul>
    <div class="nav-actions">
      <button class="icon-btn" type="button" data-theme-toggle aria-label="Toggle dark mode"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg></button>
      <a class="btn btn-primary btn-sm btn-sm-hide" href="coaching.html#match">Get matched free</a>
      <button class="icon-btn burger" type="button" aria-controls="menu" aria-expanded="false" aria-label="Menu">☰</button>
    </div>
  </nav>
</header>
<main id="main">
"""

FOOT = """
</main>
<section class="section-sm">
  <div class="container">
    <div class="band">
      <div class="split">
        <div>
          <span class="eyebrow">Free weekly letter</span>
          <h2 class="mb0">One small upgrade to your life, every Sunday.</h2>
        </div>
        <form class="form" data-ls-form="Newsletter signup" data-ok="You're in! Check your inbox on Sunday.">
          <div class="inline-form">
            <label class="sr-only" for="nl-email">Email</label>
            <input id="nl-email" type="email" name="email" placeholder="you@example.com" required>
            <button class="btn btn-primary" type="submit">Subscribe</button>
          </div>
          <input type="hidden" name="source" value="footer-band">
          <p class="form-note">Join free. 1 email a week. Unsubscribe anytime. Includes the <strong>Life Design Workbook</strong>.</p>
        </form>
      </div>
    </div>
  </div>
</section>
<footer class="site-footer">
  <div class="container">
    <div class="foot-grid">
      <div>
        <a class="logo" href="index.html" style="color:#fff"><span class="logo-mark">✦</span><span>Life<b>.</b>Studio</span></a>
        <p style="margin-top:14px">The studio where you design the life you want — free tools, honest guides, expert coaches and a community that ships.</p>
        <div class="socials">
          <a data-social="youtube" href="#" aria-label="YouTube" target="_blank" rel="noopener">YT</a>
          <a data-social="instagram" href="#" aria-label="Instagram" target="_blank" rel="noopener">IG</a>
          <a data-social="tiktok" href="#" aria-label="TikTok" target="_blank" rel="noopener">TT</a>
          <a data-social="x" href="#" aria-label="X" target="_blank" rel="noopener">X</a>
          <a data-social="linkedin" href="#" aria-label="LinkedIn" target="_blank" rel="noopener">in</a>
          <a data-social="pinterest" href="#" aria-label="Pinterest" target="_blank" rel="noopener">P</a>
        </div>
      </div>
      <div><h4>Explore</h4><ul><li><a href="tools.html">Free tools</a></li><li><a href="guides.html">Guides</a></li><li><a href="videos.html">Videos</a></li><li><a href="challenges.html">Challenges &amp; prizes</a></li></ul></div>
      <div><h4>Work with us</h4><ul><li><a href="coaching.html">Find a coach</a></li><li><a href="for-coaches.html">For coaches</a></li><li><a href="advertise.html">Advertise &amp; sponsor</a></li><li><a href="careers.html">Careers &amp; talent</a></li></ul></div>
      <div><h4>Company</h4><ul><li><a href="about.html">About</a></li><li><a href="support.html">Support us</a></li><li><a href="contact.html">Contact</a></li><li><a href="https://web.works/contact" target="_blank" rel="noopener">Buy this domain</a></li></ul></div>
      <div><h4>Legal</h4><ul><li><a href="privacy.html">Privacy</a></li><li><a href="terms.html">Terms</a></li><li><a href="disclaimer.html">Disclaimer</a></li><li><a href="#" data-consent-reset onclick="try{{localStorage.removeItem('ls_consent')}}catch(e){{}};location.reload();return false;">Cookie settings</a></li></ul></div>
    </div>
    <div class="foot-bottom">
      <span>© <span data-year></span> Life.Studio · All rights reserved.</span>
      <span>Educational content only — not medical, legal or financial advice.</span>
    </div>
  </div>
</footer>

<div class="cookie" role="dialog" aria-label="Cookie consent">
  <strong>We value your privacy.</strong> We use cookies for analytics and to show ads that keep Life.Studio free. <a href="privacy.html">Learn more</a>.
  <div class="btns"><button class="btn btn-primary btn-sm" data-consent="all">Accept all</button><button class="btn btn-ghost btn-sm" data-consent="essential">Essential only</button></div>
</div>

<div class="modal" id="leadMagnet" role="dialog" aria-modal="true" aria-labelledby="lmTitle">
  <div class="modal-box">
    <button class="icon-btn modal-close" type="button" aria-label="Close">×</button>
    <span class="eyebrow">Free download</span>
    <h2 id="lmTitle">Get the Life Design Workbook</h2>
    <p class="muted">The 24-page workbook our readers use to redesign their year: Wheel of Life, values sort, 90-day plan and weekly review templates.</p>
    <form class="form" data-ls-form="Lead magnet — Life Design Workbook" data-ok="Done! The workbook is on its way to your inbox.">
      <input type="text" name="name" placeholder="First name" required>
      <input type="email" name="email" placeholder="Email address" required>
      <select name="focus" aria-label="Main focus"><option>My main focus is…</option><option>Career change</option><option>Health &amp; fitness</option><option>Money &amp; financial freedom</option><option>Relationships</option><option>Purpose &amp; meaning</option><option>Productivity</option></select>
      <label class="check"><input type="checkbox" name="coach_optin" value="yes"> I'd also like a free 20-minute call with a certified coach.</label>
      <button class="btn btn-primary btn-block" type="submit">Send me the workbook</button>
      <p class="form-note">No spam. Unsubscribe with one click.</p>
    </form>
  </div>
</div>

<div class="sticky-cta"><a class="btn btn-primary" href="coaching.html#match">✦ Get matched with a coach — free</a></div>

<script src="assets/js/config.js"></script>
<script src="assets/js/main.js"></script>
{scripts}
</body>
</html>
"""


def menu(active):
    out = []
    for href, label, key in NAV:
        cur = ' aria-current="page"' if key == active else ""
        out.append(f'<li><a href="{href}"{cur}>{label}</a></li>')
    return "".join(out)


def build_file(path, out_name, pages):
    raw = path.read_text(encoding="utf-8")
    m = re.match(r"\s*<!--(\{.*?\})-->", raw, re.S)
    meta = json.loads(m.group(1)) if m else {}
    body = raw[m.end():] if m else raw
    url = f"{SITE}/{'' if out_name == 'index.html' else out_name}"
    ld = {"@context": "https://schema.org"}
    if meta.get("article"):
        ld.update({"@type": "Article", "headline": meta["h1"] if "h1" in meta else meta["title"],
                   "description": meta["desc"], "datePublished": meta.get("date", TODAY), "dateModified": TODAY,
                   "author": {"@type": "Organization", "name": "Life.Studio Editorial"},
                   "publisher": {"@type": "Organization", "name": "Life.Studio"}, "mainEntityOfPage": url})
    else:
        ld.update({"@type": "WebSite" if out_name == "index.html" else "WebPage", "name": meta.get("title"), "url": url,
                   "description": meta.get("desc")})
    scripts = "\n".join(f'<script src="assets/js/{s}.js"></script>' for s in meta.get("scripts", []))
    html = HEAD.format(title=meta.get("title", "Life.Studio"), desc=meta.get("desc", ""), url=url, site=SITE,
                       robots="noindex" if out_name == "404.html" else "index,follow",
                       ogtype="article" if meta.get("article") else "website", jsonld=json.dumps(ld),
                       bodyattr=' data-no-popup' if meta.get("nopopup") else "", menu=menu(meta.get("nav", ""))) \
        + body + FOOT.format(scripts=scripts)
    (ROOT / out_name).write_text(html, encoding="utf-8")
    pages.append((out_name, meta))


ARTICLE = """<!--{meta}-->
<section class="page-hero"><div class="container"><div class="crumbs"><a href="index.html">Home</a> / <a href="guides.html">Guides</a> / {cat}</div>
<span class="tag">{cat}</span><h1 style="margin-top:14px;max-width:900px">{title}</h1>
<div class="article-meta"><span>By Life.Studio Editorial</span><span>·</span><span>{min} min read</span><span>·</span><span>Updated {updated}</span></div></div></section>
<section><div class="container layout-side">
<article class="article">
{body}
<div class="ad-slot" data-slot="inArticle"></div>
<div class="card mt2"><h3>Put it into practice</h3><p>Reading changes nothing until you act. Start now:</p><a class="btn btn-primary" href="{tool_href}">{tool_label} →</a></div>
<div class="share mt2 no-print"><strong style="align-self:center">Share:</strong><a class="btn btn-ghost btn-sm" data-share="x" href="#">X</a><a class="btn btn-ghost btn-sm" data-share="facebook" href="#">Facebook</a><a class="btn btn-ghost btn-sm" data-share="linkedin" href="#">LinkedIn</a><a class="btn btn-ghost btn-sm" data-share="whatsapp" href="#">WhatsApp</a><a class="btn btn-ghost btn-sm" data-share="pinterest" href="#">Pinterest</a><a class="btn btn-ghost btn-sm" data-share="copy" href="#">Copy link</a></div>
<p class="form-note mt2">Educational content only; not medical, psychological, legal or financial advice. See our <a href="disclaimer.html">disclaimer</a>.</p>
</article>
<aside class="sidebar no-print">
<div class="stepper" style="padding:22px"><span class="eyebrow">Free coach match</span><h3>Want help with this?</h3><p class="muted" style="font-size:.92rem">Get introduced to up to 3 vetted coaches. Free intro calls.</p>
<form class="form" data-ls-form="Lead — Guide sidebar ({cat})" data-ok="Thanks! Your coach matches arrive within 24 hours.">
<input type="hidden" name="guide" value="{title_attr}"><input name="name" placeholder="First name" required aria-label="First name"><input type="email" name="email" placeholder="Email" required aria-label="Email">
<label class="check"><input type="checkbox" name="consent" value="yes" required> Contact me about coaching.</label>
<button class="btn btn-primary btn-block" type="submit">Match me</button></form></div>
<div class="ad-slot" data-slot="sidebar"></div>
<div class="card"><h3>More guides</h3>{related}</div>
</aside></div></section>
"""


def build_articles(pages):
    arts = []
    for p in sorted((ROOT / "src/articles").glob("*.html")):
        first, body = p.read_text(encoding="utf-8").split("\n", 1)
        arts.append((json.loads(first), body))
    guides_dir = ROOT / "src/guides"
    guides_dir.mkdir(exist_ok=True)
    for m, body in arts:
        related = "".join(f'<p><a href="{o["slug"]}.html">{o["title"]}</a></p>' for o, _ in arts if o["slug"] != m["slug"])[:2000]
        meta = json.dumps({"title": f'{m["title"]} | Life.Studio', "h1": m["title"], "desc": m["desc"], "nav": "guides", "article": True})
        (guides_dir / f'{m["slug"]}.html').write_text(ARTICLE.format(
            meta=meta, cat=m["cat"], title=m["title"], title_attr=m["title"].replace('"', ""), min=m["min"],
            updated=datetime.date.today().strftime("%B %Y"), body=body, tool_href=m["tool"][0], tool_label=m["tool"][1],
            related=related), encoding="utf-8")
    cards = "".join(
        f'<a class="card" href="{m["slug"]}.html" data-search="{m["cat"]} {m["title"]}"><span class="tag">{m["cat"]}</span>'
        f'<h3 style="margin-top:12px">{m["title"]}</h3><p>{m["desc"]}</p><span class="more">Read · {m["min"]} min</span></a>'
        for m, _ in arts)
    hub = f"""<!--{json.dumps({"title": "Life Design Guides — Habits, Goals, Purpose, Money & Wellbeing | Life.Studio", "desc": "Practical, research-informed guides on life design, goal setting, habits, morning routines, purpose, financial independence, focus, burnout and choosing a coach.", "nav": "guides"})}-->
<section class="page-hero"><div class="container"><div class="crumbs"><a href="index.html">Home</a> / Guides</div><h1>Guides that end in action</h1><p class="lead">Research-informed, jargon-free and practical. Every guide links to a free tool so you can apply it immediately.</p>
<input style="max-width:420px;margin-top:10px" placeholder="Search guides…" data-filter-input="#guideList" aria-label="Search guides"></div></section>
<section><div class="container"><div class="grid g3" id="guideList">{cards}</div><div class="ad-slot" data-slot="inArticle"></div>
<div class="card mt2"><div class="split"><div><span class="eyebrow">Write for us</span><h3>Are you an expert or coach?</h3><p>We publish guest guides from credentialed coaches, clinicians and researchers.</p></div><div><a class="btn btn-dark" href="careers.html#apply">Pitch a guide</a></div></div></div></div></section>
"""
    (ROOT / "src/pages/guides.html").write_text(hub, encoding="utf-8")


def main():
    pages = []
    build_articles(pages)
    for p in sorted((ROOT / "src/pages").glob("*.html")):
        build_file(p, p.name, pages)
    for p in sorted((ROOT / "src/guides").glob("*.html")):
        build_file(p, p.name, pages)
    urls = "".join(
        f"<url><loc>{SITE}/{'' if n == 'index.html' else n}</loc><lastmod>{TODAY}</lastmod>"
        f"<priority>{'1.0' if n == 'index.html' else '0.8'}</priority></url>"
        for n, _ in pages if n != "404.html")
    (ROOT / "sitemap.xml").write_text(
        f'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">{urls}</urlset>\n')
    print(f"Built {len(pages)} pages")


if __name__ == "__main__":
    main()

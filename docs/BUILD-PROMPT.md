# Life.Studio — Phase-wise Master Build Prompt

Paste each phase into an AI coding assistant in order. Each phase is self-contained and assumes the previous phase is done.

---

## GLOBAL RULES (prepend to every phase)

```
Project: Life.Studio — "Design the life you actually want."
A life-design studio: free interactive self-improvement tools, research-informed guides,
curated YouTube videos, free coach matching (primary lead-gen), seasonal challenges with prizes,
donations, careers and advertising.

Hard requirements:
1. Pure static HTML/CSS/vanilla JS. No frameworks, no backend. Must run on GitHub Pages (free plan),
   Netlify or Vercel. All internal links are RELATIVE (site may live at /life-studio/).
2. On the TOP of EVERY page, above the header: a bar reading
   "Contact, if you are interested in this website/domain name — web.works/contact"
   linking to https://web.works/contact.
3. The ONLY contact/inbox for every form and mailto link is the owner's address, BUT it must never
   appear in plain text anywhere in the source or rendered page. Store it base64-encoded, reversed
   and split in config.js, assemble it at runtime in JS. Forms POST via fetch to the FormSubmit AJAX
   endpoint built at runtime. Mail links use data-mail="Subject" and open mailto only on click.
4. Mobile-first, responsive (no horizontal scroll at 360px), dark mode, WCAG-AA contrast, keyboard
   accessible, prefers-reduced-motion respected.
5. SEO on every page: unique <title> and meta description, canonical, Open Graph, JSON-LD, one H1.
6. Monetization is config-driven from assets/js/config.js (AdSense client/slots, GA4, YouTube
   videos, donation links, contest deadline). Empty config = graceful fallback (house ads, pledge form).
7. Honesty: no fake testimonials, fake user counts or fabricated winners.
```

---

## PHASE 1 — Foundation & design system
```
Create the repo structure:
/assets/css/style.css  /assets/js/config.js  /assets/js/main.js  /assets/js/tools.js
/assets/img/favicon.svg, og.svg  /src/pages/*.html  /src/articles/*.html  build.py
Design tokens on :root (+ dark theme): warm cream bg #FBF8F3, ink #16131F, coral #FF5A36,
violet #6C5CE7, green #12B886; gradient coral→orange→violet. Fonts: Fraunces (display) + Inter (UI).
Components: domain bar, sticky blurred header with nav + theme toggle + "Get matched free" CTA +
burger menu, buttons (primary/violet/ghost/dark), cards, tags, stats, grids (2/3/4 cols collapsing),
split layouts, forms (inputs, chips, check), multi-step stepper with progress bar, tiers/pricing,
countdown, FAQ <details>, CTA band, modal, cookie banner, sticky CTA, footer (5 columns).
Write build.py: wraps each page fragment (JSON meta comment on line 1) in a shared head/header/
footer template, generates sitemap.xml. No dependencies.
```

## PHASE 2 — Core JS engine (main.js)
```
Implement: runtime inbox assembly; universal form handler for form[data-ls-form] (honeypot,
_subject, _template=table, _captcha=false, page URL, timestamp → FormSubmit AJAX, inline success/
error status, GA4 generate_lead event); multi-step [data-stepper] with per-step validation and
"require at least one chip"; theme toggle persisted in localStorage (try/catch); mobile menu;
consent banner (Accept all → GA4 + ads, Essential → ads without GA4); AdSense loader that inserts
<ins class="adsbygoogle"> into .ad-slot[data-slot] when configured, otherwise rotating house ads
(advertise / coach match / challenge / donate); YouTube lite embeds from config (thumbnail → iframe on
click, youtube-nocookie, remove card if thumbnail is the 120px placeholder), category filters;
contest countdown; scroll reveal; count-up stats; modal system; exit-intent + 45s lead-magnet popup
(once per 7 days); sticky CTA after 900px scroll; share buttons (X, Facebook, LinkedIn, WhatsApp,
Pinterest, copy); live search filter [data-filter-input].
```

## PHASE 3 — Homepage (conversion architecture)
```
Sections in order: hero (headline, subcopy, CTA "Take the free Life Check-up", secondary
"Get matched with a coach", trust ticks, 4-tile "What do you want to change first?" picker) →
stat row → header ad slot → 6-tool grid → 4-step loop (Assess, Design, Act, Accelerate) →
coach lead section with quick-match form (area, budget, start, name, email, consent) →
3 featured guides → 3 videos → live challenge with countdown and prizes → footer ad slot →
Support / Advertise / Careers cards → FAQ. Global footer adds newsletter band.
```

## PHASE 4 — Interactive tools (tools.js + 6 pages + hub)
```
1 Wheel of Life: 8 sliders, canvas radar chart, average + balance score, top-3 focus areas with tips,
  PNG download, saves to localStorage, lead form carrying scores in a hidden field.
2 SMART Goal Planner: form → plan with 25/50/75/100% dated milestones, if-then obstacle plan,
  weekly rhythm, print/PDF, coach CTA.
3 Habit Tracker: month grid, add/remove habits, toggle days, streak, consistency %, persisted.
4 Life in Weeks: birth date + life expectancy → grid of weeks, lived/left/summers/weekends/books.
5 Financial Freedom: income, spending, invested, real return, SWR → years to FI, freedom number,
  savings rate, growth chart; financial-coach lead form.
6 Purpose Quiz: 12 Likert questions → 6 archetypes, ranked meters, next step, full-report lead form.
Each tool page: breadcrumb, tool, ad slot, explanatory SEO copy with internal links.
```

## PHASE 5 — Lead generation system
```
coaching.html: 5-step match (areas chips → situation → budget/format/timeline/language →
style/gender/location → name/email/phone/consent), specialties grid, transparent price ranges,
FAQ (coaching ≠ therapy, vetting, why free, re-match).
for-coaches.html: Listed $0 / Featured $99 / Partner $299 tiers + full application form.
Lead capture also on: every tool result, every guide sidebar, exit-intent workbook popup, newsletter band.
All leads route to the single hidden inbox with descriptive subjects ("LEAD — Coach match").
```

## PHASE 6 — Content: guides & videos
```
Guides hub with search + 10 original, research-cited articles (life design framework, Wheel of Life,
SMART vs systems, habit stacking, morning routine, financial independence, purpose, deep work,
how to choose a life coach, burnout). Article template: meta, body, in-article ad, "put it into
practice" tool CTA, share bar, disclaimer; sidebar with coach lead form, ad slot, related guides.
Article JSON-LD. Videos page: filterable lite-embed library, YouTube subscribe CTA, Originals
waitlist, suggest-a-video/creator-collab form.
```

## PHASE 7 — Community monetization pages
```
challenges.html: countdown, how it works, prize grid, sponsor CTA, registration form, story/entry
submission form (media link), official rules (no purchase necessary, 18+, judging weights, notification),
upcoming challenges.
support.html: monthly/one-time toggle, $5/$15/$50/$100 + custom, impact copy, config-driven
Stripe/PayPal/Ko-fi/BMAC/Patreon/GitHub Sponsors buttons, pledge-form fallback (bank, UPI,
Interac, crypto, corporate), fund-allocation meters (operations, talent, prizes, promotion),
supporter tiers, fund-a-prize/scholarship/volunteer.
careers.html: searchable roles (writer, video editor, community, SEO, dev, partnerships, coaches,
ambassadors) + talent application. advertise.html: audience, rate card table, inquiry with chips.
```

## PHASE 8 — Trust, legal & compliance
```
about, contact (topic router incl. "Buying the domain"), privacy (AdSense cookie disclosure,
opt-out links, GDPR/CCPA/PIPEDA/DPDP rights), terms, disclaimer + affiliate disclosure, 404.
ads.txt placeholder, robots.txt, sitemap.xml, manifest, _config.yml.
```

## PHASE 9 — QA
```
Headless test every page at 1366px and 390px: zero JS errors, zero horizontal overflow.
Grep the repo: the owner's address must return zero matches. Internal link check.
Lighthouse targets: Performance 90+, Accessibility 95+, SEO 100.
```

## PHASE 10 — Deploy & grow
```
Push to GitHub (account webworksa1, repo life-studio, public). Publish with GitHub Pages (built-in Jekyll).
Point life.studio DNS: A records 185.199.108-111.153 + CNAME file "life.studio"; update siteurl in
_config.yml and robots.txt. Submit sitemap to Google Search Console. Apply to AdSense once 15–25
quality pages are indexed; paste ids into config.js and ads.txt. Activate FormSubmit (first
submission sends a confirmation email). Growth: 2 guides/week, 1 tool/month, a YouTube Short per
guide, Pinterest pins per tool, quarterly challenge with a sponsor.
```

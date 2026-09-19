# Life.Studio — Concept, Revenue Model & Benchmark

## 1. The verdict: what Life.Studio should be

**Life.Studio = a "life design studio"** — free interactive self-improvement tools + evergreen guides + a coach-matching lead-gen engine + seasonal challenges with prizes.

Why this concept beats the alternatives for this exact domain:

| Candidate concept | Search demand | RPM / CPL potential | Fit with ".Studio" | Verdict |
|---|---|---|---|---|
| **Life design / personal growth studio (tools + coach leads)** | Very high, evergreen ("wheel of life", "habit tracker", "life coach near me", "how to find your purpose") | AdSense self-help/finance RPM $8–25; coach leads $20–150 each | Perfect — "a studio where you design your life" | **Chosen** |
| Lifestyle blog (travel/food/home) | High | RPM $5–15, weak lead gen | Generic | Crowded, no lead asset |
| Video/podcast production studio | Low-moderate | B2B leads, no ad volume | Literal but narrow | Small ceiling |
| Life insurance lead gen | High CPL | Very high but YMYL + licensing | Misleading brand fit | Regulatory drag |
| Photography "life studio" | Local only | Low | Literal | Tiny |

Key logic: **tools create repeat traffic and backlinks; guides capture SEO; the Wheel of Life score, budget and goal the user enters become a pre-qualified lead**. Few self-help sites own a tool → lead pipeline.

## 2. Revenue model (7 streams)

| Stream | Mechanism on site | Unit economics (assumptions) |
|---|---|---|
| Google AdSense | `.ad-slot` placements: header, in-article, sidebar, footer (config-driven) | 100k pageviews/mo × $12 RPM ≈ $1,200/mo |
| Coach lead-gen (primary) | 5-step match form, quick-match, tool result forms, guide sidebar | 1.5% of 40k visitors = 600 leads × $40 = $24,000/mo |
| Coach memberships | For-coaches page: $0 / $99 / $299 tiers | 40 featured coaches × $99 ≈ $4,000/mo |
| Sponsorships & direct ads | Advertise page: sponsored tools, newsletter, challenge title sponsor | 2 sponsors × $1,500 ≈ $3,000/mo |
| YouTube | Lite embeds + channel CTA + Originals waitlist | YPP revenue + traffic loop |
| Donations | Monthly/one-time with Stripe/PayPal/Ko-fi/Patreon links + pledge form | 0.1% of visitors × $15 |
| Affiliate | Disclosed in disclaimer; book/course/fintech links inside guides | 3–8% commissions |

Numbers are planning assumptions, not forecasts. Lead-gen is the engine: one coach lead is worth ~3,000 ad impressions.

## 3. Benchmark: 25 leading sites in the niche and what we took from each

Features compiled from our knowledge of these sites. Check each one's current version before copying a specific pattern.

| # | Site | Category | Pattern adopted |
|---|---|---|---|
| 1 | mindvalley.com | Transformational education | Quiz → personalised result → email capture |
| 2 | tonyrobbins.com | Coaching & events | Strong "results coaching" CTA, event-style countdowns |
| 3 | betterup.com | Coaching platform | Coach-matching flow, "whole person" wheel framing |
| 4 | psychologytoday.com | Therapist directory | Directory-as-lead-engine; filters by specialty/budget |
| 5 | noomii.com | Coach directory | Free match request → coaches pay for introductions |
| 6 | lifecoach-directory.org.uk | Coach directory | Coach listing tiers; "how to choose a coach" content |
| 7 | designingyour.life | Life design (Stanford) | Assess → ideate → prototype framework |
| 8 | jamesclear.com | Habits | Evergreen guides + weekly newsletter as the core CTA |
| 9 | markmanson.net | Self-help | Punchy voice, long-form pillar pages |
| 10 | tinybuddha.com | Wellbeing community | Contributor submissions ("write for us") |
| 11 | zenhabits.net | Minimalism | Clean reading layout, minimal chrome |
| 12 | waitbutwhy.com | Essays | "Life in weeks" visual that drives shares |
| 13 | fs.blog (Farnam Street) | Mental models | Membership + newsletter monetisation |
| 14 | nesslabs.com | Productivity & learning | Tools + community + sponsorship packages |
| 15 | lifehack.org | Self-improvement media | High-volume listicles + AdSense placements |
| 16 | verywellmind.com | Mental health media | Medical-review disclaimers, E-E-A-T signals |
| 17 | greatergood.berkeley.edu | Science of wellbeing | Research-cited practices, quizzes |
| 18 | headspace.com | Meditation app | Soft onboarding, calm visual language |
| 19 | calm.com | Sleep/meditation app | Emotion-first hero, trust copy |
| 20 | habitica.com | Gamified habits | Streaks, challenges, rewards |
| 21 | coach.me | Habit coaching | Habit tracker → upsell to a human coach |
| 22 | mrmoneymustache.com | Financial independence | Savings-rate math, FI calculator content |
| 23 | nerdfitness.com | Fitness for beginners | Challenges + community + coaching upsell |
| 24 | ted.com | Talks | Curated video library with topic filters |
| 25 | aliabdaal.com | Productivity creator | YouTube ↔ site loop, newsletter, sponsorship page |
| 26 | patreon.com / ko-fi.com | Creator support | Tiered support with clear "where money goes" |

### Feature checklist derived (all implemented)
- Hero with dual CTA (tool + coach) · 4-tile "start here" picker
- 6 interactive tools (Wheel of Life, SMART goals, habit tracker, life in weeks, FI calculator, purpose quiz)
- Tool results → personalised report lead form (captures scores/answers)
- 5-step coach-match form with progress bar, chips, budget, timeline and consent
- Coach-side supply funnel with pricing tiers and application form
- Guides hub with search, article template, sidebar lead form, share bar, related guides
- Video library with lite YouTube embeds, category filters, channel CTA, suggestion form
- Challenge/contest page: countdown, prizes, registration, story submission, official rules
- Donations: monthly/one-time toggle, amount picker, impact copy, payment links, pledge fallback, supporter tiers
- Careers: searchable roles + talent application
- Advertise: audience, rate card, multi-interest inquiry form
- Newsletter band on every page, exit-intent lead magnet, sticky CTA
- Cookie consent (gates GA4), AdSense loader with house-ad fallback, ads.txt
- SEO: unique titles/descriptions, canonical, OG, JSON-LD (WebSite/Article), sitemap.xml, robots.txt
- Dark mode, responsive, reduced-motion, accessible labels, print styles
- Legal: privacy (AdSense + GDPR/CCPA/PIPEDA/DPDP), terms, disclaimer/affiliate disclosure
- Domain inquiry bar on every page → web.works/contact

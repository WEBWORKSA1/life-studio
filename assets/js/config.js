/*!
 * Life.Studio — site configuration
 * Edit this file to switch on monetization. No build step required.
 */
window.LS_CONFIG = {
  siteName: "Life.Studio",
  siteUrl: "https://life.studio",
  domainInquiryUrl: "https://web.works/contact",

  /* Contact routing. Encoded + reversed on purpose so no plain address
     exists anywhere in the source. Do not replace with a plain address. */
  _r: ["MWFza3Jvd2Jldw==", "bW9jLmxpYW1n"],

  /* Google AdSense — paste your publisher id (ca-pub-XXXXXXXXXXXXXXXX)
     and the slot ids you create in AdSense. Empty = house ads shown. */
  adsense: {
    client: "",
    slots: { header: "", inArticle: "", sidebar: "", footer: "" }
  },

  /* Analytics — GA4 measurement id (G-XXXXXXX). Empty = disabled. */
  ga4: "",

  /* YouTube — your channel URL + curated videos (YouTube video ids). */
  youtube: {
    channelUrl: "https://www.youtube.com/@LifeStudio",
    videos: [
      { id: "8KkKuTCFvzI", title: "What makes a good life? Lessons from the longest study on happiness", cat: "Relationships", by: "Robert Waldinger · TED" },
      { id: "arj7oStGLkU", title: "Inside the mind of a master procrastinator", cat: "Productivity", by: "Tim Urban · TED" },
      { id: "u4ZoJKF_VuA", title: "Start with why — how great leaders inspire action", cat: "Purpose", by: "Simon Sinek · TEDx" },
      { id: "iCvmsMzlF7o", title: "The power of vulnerability", cat: "Mindset", by: "Brené Brown · TEDx" },
      { id: "H14bBuluwB8", title: "Grit: the power of passion and perseverance", cat: "Mindset", by: "Angela Lee Duckworth · TED" },
      { id: "RcGyVTAoXEU", title: "How to make stress your friend", cat: "Health", by: "Kelly McGonigal · TED" },
      { id: "fLJsdqxnZb0", title: "The happy secret to better work", cat: "Career", by: "Shawn Achor · TEDx" },
      { id: "UNP03fDSj1U", title: "Try something new for 30 days", cat: "Habits", by: "Matt Cutts · TED" },
      { id: "Ks-_Mh1QhMc", title: "Your body language may shape who you are", cat: "Confidence", by: "Amy Cuddy · TED" }
    ]
  },

  /* Donations — paste any/all of your hosted payment links.
     Empty links fall back to the pledge form (routed to the site inbox). */
  donations: {
    stripe: "",      // e.g. https://buy.stripe.com/xxxx
    paypal: "",      // e.g. https://www.paypal.com/donate/?hosted_button_id=XXXX
    kofi: "",        // e.g. https://ko-fi.com/lifestudio
    buymeacoffee: "",
    patreon: "",
    githubSponsors: ""
  },

  /* Current contest — drives the countdown + banners. */
  contest: {
    name: "The 30-Day Life Redesign Challenge",
    deadline: "2026-12-31T23:59:59-05:00",
    prizePool: "$2,500+"
  },

  social: {
    youtube: "https://www.youtube.com/@LifeStudio",
    instagram: "https://www.instagram.com/",
    tiktok: "https://www.tiktok.com/",
    x: "https://x.com/",
    linkedin: "https://www.linkedin.com/",
    pinterest: "https://www.pinterest.com/"
  }
};

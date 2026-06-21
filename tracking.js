/* LeadQuik Sites — marketing tags for Kitchen Cabinet Painting Guys LLC.
   Paste the IDs below and everything wires up automatically. Leave any ID blank
   to skip that platform. When a visitor submits a lead form (see site.js), a
   conversion fires on Google Ads + Meta and a generate_lead event on GA4. */
(function () {
  var CONFIG = {
    GA4_ID: "",                      // Google Analytics 4 — e.g. G-XXXXXXX
    GOOGLE_ADS_ID: "",               // Google Ads (AdWords) — e.g. AW-XXXXXXXXX
    GOOGLE_ADS_CONVERSION_LABEL: "", // the lead-conversion label — e.g. abcdEFGhIJ
    META_PIXEL_ID: ""                // Facebook/Meta Pixel — e.g. 1234567890
  };

  // ---- Google gtag (GA4 + Google Ads share one loader) ----
  var gtagIds = [CONFIG.GA4_ID, CONFIG.GOOGLE_ADS_ID].filter(Boolean);
  if (gtagIds.length) {
    var s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + gtagIds[0];
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag("js", new Date());
    gtagIds.forEach(function (id) { window.gtag("config", id); });
  }

  // ---- Meta (Facebook) Pixel ----
  if (CONFIG.META_PIXEL_ID) {
    !function (f, b, e, v, n, t, s) {
      if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
      if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = "2.0"; n.queue = [];
      t = b.createElement(e); t.async = !0; t.src = v; s = b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t, s);
    }(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
    window.fbq("init", CONFIG.META_PIXEL_ID);
    window.fbq("track", "PageView");
  }

  // ---- Lead conversion (site.js calls this on a successful form submit) ----
  window.lqTrackLead = function () {
    try {
      if (CONFIG.GOOGLE_ADS_ID && CONFIG.GOOGLE_ADS_CONVERSION_LABEL && window.gtag) {
        window.gtag("event", "conversion", { send_to: CONFIG.GOOGLE_ADS_ID + "/" + CONFIG.GOOGLE_ADS_CONVERSION_LABEL });
      }
      if (CONFIG.GA4_ID && window.gtag) window.gtag("event", "generate_lead");
      if (CONFIG.META_PIXEL_ID && window.fbq) window.fbq("track", "Lead");
    } catch (e) { /* never block the form on a tracking hiccup */ }
  };
})();

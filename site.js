/* LeadQuik Sites — public lead capture for The Cabinet Painting Guys.
   Every form on the site posts to LeadQuik's public-intake-submit, so each
   submission lands as a lead in the Cabinet Painting Guys pipeline. No secret
   token lives in the page; a hidden honeypot ("company_website") catches bots. */
(function () {
  var ENDPOINT = "https://knocrigsnrfkahrvgzch.supabase.co/functions/v1/public-intake-submit";
  var SLUG = "kitchen-cabinet-painting-guys-dd65c7e2";

  function val(el) { return ((el && el.value) || "").trim(); }

  function pickByType(form, type) { return val(form.querySelector('input[type="' + type + '"]')); }

  function labelText(form, el) {
    var f = el.closest ? el.closest(".field") : null;
    var lbl = f ? f.querySelector("label") : null;
    return lbl ? lbl.textContent : "";
  }

  function pickByHint(form, hints) {
    var els = form.querySelectorAll("input, textarea");
    for (var i = 0; i < els.length; i++) {
      var el = els[i];
      if (el.type === "hidden" || el.type === "submit" || el.type === "button") continue;
      var hay = ((el.placeholder || "") + " " + (el.name || "") + " " +
                 (el.getAttribute("aria-label") || "") + " " + labelText(form, el)).toLowerCase();
      for (var j = 0; j < hints.length; j++) {
        if (hay.indexOf(hints[j]) !== -1 && val(el)) return val(el);
      }
    }
    return "";
  }

  function fullName(form) {
    var first = pickByHint(form, ["first name", "first"]);
    var last = pickByHint(form, ["last name", "last"]);
    var both = [first, last].filter(Boolean).join(" ").trim();
    return both || pickByHint(form, ["name"]);
  }

  function attachHoneypot(form) {
    if (form.querySelector('input[name="company_website"]')) return;
    var hp = document.createElement("input");
    hp.type = "text"; hp.name = "company_website"; hp.tabIndex = -1;
    hp.autocomplete = "off"; hp.setAttribute("aria-hidden", "true");
    hp.style.cssText = "position:absolute;left:-9999px;width:1px;height:1px;opacity:0";
    form.appendChild(hp);
  }

  function handle(form) {
    attachHoneypot(form);
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var phone = pickByType(form, "tel") || pickByHint(form, ["phone", "tel", "number"]);
      var email = pickByType(form, "email") || pickByHint(form, ["email", "e-mail"]);
      var ta = form.querySelector("textarea");
      var notes = ta ? val(ta) : pickByHint(form, ["notes", "message", "job"]);
      var payload = {
        slug: SLUG,
        name: fullName(form),
        phone: phone,
        email: email,
        address: pickByHint(form, ["address"]),
        notes: notes,
        source: "embed_html",
        company_website: val(form.querySelector('input[name="company_website"]')),
      };
      if (!payload.phone) { alert("Please add a phone number so we can reach you."); return; }
      var btn = form.querySelector("button");
      var orig = btn ? btn.textContent : "";
      if (btn) { btn.disabled = true; btn.textContent = "Sending…"; }
      fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
        .then(function (r) { return r.ok ? r.json().catch(function () { return {}; }) : Promise.reject(r); })
        .then(function () {
          if (window.lqTrackLead) window.lqTrackLead(); // fire Google Ads + Meta + GA4 lead conversion
          form.innerHTML =
            '<div style="padding:28px;text-align:center;font-weight:600;color:#23395c;line-height:1.5">' +
            "Thanks! We got your request and will reach out shortly.<br>" +
            'Need us now? Call <a href="tel:4708280086" style="color:#f4a82a">470-828-0086</a>.</div>';
        })
        .catch(function () {
          if (btn) { btn.disabled = false; btn.textContent = orig; }
          alert("Sorry, something went wrong. Please call 470-828-0086 and we'll help right away.");
        });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    var forms = document.querySelectorAll("form");
    for (var i = 0; i < forms.length; i++) handle(forms[i]);
  });
})();

/* LeadQuik Sites — conditional media sections.
   Shows the YouTube / Instagram sections only when SITE has a link,
   so an empty section never renders. Builder writes config.js. */
(function () {
  var S = window.SITE || {};

  // --- YouTube ---
  var yt = (S.youtube || "").trim();
  if (yt) {
    // accept a bare ID or any youtube URL
    var id = yt;
    var m = yt.match(/(?:v=|youtu\.be\/|embed\/)([A-Za-z0-9_-]{6,})/);
    if (m) id = m[1];
    var ytSection = document.querySelector('[data-media="youtube"]');
    var ytFrame = document.querySelector('[data-yt]');
    if (ytSection && ytFrame) {
      ytFrame.src = "https://www.youtube.com/embed/" + id;
      ytSection.hidden = false;
    }
  }

  // --- Instagram ---
  var handle = (S.instagram || "").replace(/^@/, "").trim();
  if (handle) {
    var igSection = document.querySelector('[data-media="instagram"]');
    var igLink = document.querySelector('[data-ig-link]');
    var igGrid = document.querySelector('[data-ig-grid]');
    if (igSection && igLink) {
      igLink.href = "https://www.instagram.com/" + handle + "/";
      igLink.textContent = "Follow @" + handle;
      var posts = Array.isArray(S.instagramPosts) ? S.instagramPosts : [];
      if (igGrid) {
        igGrid.innerHTML = posts.map(function (p) {
          var url = (p && p.url) || ("https://www.instagram.com/" + handle + "/");
          var img = (p && p.img) || "";
          return '<a href="' + url + '" target="_blank" rel="noopener">' +
                 (img ? '<img src="' + img + '" alt="Instagram post" loading="lazy">' : '') +
                 '</a>';
        }).join("");
        igGrid.style.display = posts.length ? "" : "none";
      }
      igSection.hidden = false;
    }
  }
})();

// analytics-events.js
// GA4 custom event tracking for failurefirst.org
// Tiers: (1) Scroll/outbound, (2) CTA/media, (3) Navigation/search, (4) LinkedIn/time-on-page

(function () {
  if (typeof gtag !== 'function') return;

  // ── Tier 1: Scroll depth + outbound clicks ────────────────────────

  var depths = [25, 50, 75, 100];
  var firedDepths = {};
  window.addEventListener('scroll', function () {
    var scrollable = document.documentElement.scrollHeight - window.innerHeight;
    if (scrollable <= 0) return;
    var pct = Math.round((window.scrollY / scrollable) * 100);
    depths.forEach(function (d) {
      if (pct >= d && !firedDepths[d]) {
        firedDepths[d] = true;
        gtag('event', 'scroll_depth', { depth: d });
      }
    });
  }, { passive: true });

  document.body.addEventListener('click', function (e) {
    var a = e.target.closest('a[href^="http"], a[href^="mailto"]');
    if (!a) return;
    var href = a.href;
    if (href.startsWith('mailto:')) {
      gtag('event', 'mailto_click', { address: href.replace('mailto:', '') });
    } else if (a.hostname !== window.location.hostname) {
      gtag('event', 'outbound_click', {
        url: href,
        label: (a.textContent || '').trim().slice(0, 80)
      });
    }
  });

  // ── Tier 2: CTA clicks + media plays ──────────────────────────────

  document.body.addEventListener('click', function (e) {
    // CTA buttons (contact, services, advisory)
    var btn = e.target.closest('.cta-button, .link-button, [data-cta]');
    if (btn) {
      gtag('event', 'cta_click', {
        label: (btn.textContent || '').trim().slice(0, 60),
        page: window.location.pathname
      });
    }
  });

  // Audio play tracking
  document.querySelectorAll('audio').forEach(function (el) {
    var played = false;
    el.addEventListener('play', function () {
      if (!played) {
        played = true;
        var src = el.currentSrc || el.querySelector('source')?.src || '';
        gtag('event', 'audio_play', {
          src: src.split('/').pop(),
          page: window.location.pathname
        });
      }
    });
  });

  // Video play tracking
  document.querySelectorAll('video, iframe[src*="youtube"], iframe[src*="vimeo"]').forEach(function (el) {
    var played = false;
    if (el.tagName === 'VIDEO') {
      el.addEventListener('play', function () {
        if (!played) {
          played = true;
          gtag('event', 'video_play', {
            src: (el.currentSrc || '').split('/').pop(),
            page: window.location.pathname
          });
        }
      });
    }
  });

  // ── Tier 3: Navigation + search + directory ───────────────────────

  // Dropdown menu opens
  document.querySelectorAll('.nav-dropdown').forEach(function (dd) {
    dd.addEventListener('mouseenter', function () {
      var label = dd.querySelector('a');
      if (label) {
        gtag('event', 'nav_dropdown_open', {
          menu: (label.textContent || '').trim()
        });
      }
    });
  });

  // Pagefind search query tracking (debounced)
  var searchTimeout;
  var lastQuery = '';
  var searchInput = document.querySelector('.pagefind-ui__search-input');
  if (searchInput) {
    searchInput.addEventListener('input', function () {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(function () {
        var q = searchInput.value.trim();
        if (q.length >= 3 && q !== lastQuery) {
          lastQuery = q;
          gtag('event', 'search_query', { query: q });
        }
      }, 1500);
    });
  }

  // Directory/filter interactions
  document.body.addEventListener('click', function (e) {
    var filter = e.target.closest('[data-filter], .filter-btn, .tag-filter');
    if (filter) {
      gtag('event', 'directory_filter', {
        filter: (filter.textContent || filter.dataset.filter || '').trim().slice(0, 40),
        page: window.location.pathname
      });
    }
  });

  // Blog tag clicks
  document.body.addEventListener('click', function (e) {
    var tag = e.target.closest('.tag, .post-tag, a[href*="/blog/tag/"]');
    if (tag) {
      gtag('event', 'blog_tag_click', {
        tag: (tag.textContent || '').trim()
      });
    }
  });

  // ── Tier 4: LinkedIn conversion + time-on-page ────────────────────

  // LinkedIn CTA tracking (if lintrk available)
  document.body.addEventListener('click', function (e) {
    var linkedinLink = e.target.closest('a[href*="linkedin.com"]');
    if (linkedinLink && typeof window.lintrk === 'function') {
      window.lintrk('track', { conversion_id: 23275164 });
    }
  });

  // Engaged time-on-page (fires at 30s, 60s, 120s, 300s)
  var engagedTimes = [30, 60, 120, 300];
  var firedEngaged = {};
  var startTime = Date.now();
  var totalVisible = 0;
  var lastVisible = startTime;
  var isVisible = true;

  document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
      if (isVisible) totalVisible += Date.now() - lastVisible;
      isVisible = false;
    } else {
      lastVisible = Date.now();
      isVisible = true;
    }
  });

  setInterval(function () {
    var elapsed = totalVisible + (isVisible ? Date.now() - lastVisible : 0);
    var secs = Math.floor(elapsed / 1000);
    engagedTimes.forEach(function (t) {
      if (secs >= t && !firedEngaged[t]) {
        firedEngaged[t] = true;
        gtag('event', 'engaged_time', {
          seconds: t,
          page: window.location.pathname
        });
      }
    });
  }, 5000);

  // Section visibility (IntersectionObserver)
  var seenSections = {};
  var sectionObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting && !seenSections[e.target.id]) {
        seenSections[e.target.id] = true;
        gtag('event', 'section_view', { section: e.target.id });
      }
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('section[id], [id^="main"]').forEach(function (el) {
    if (el.id) sectionObserver.observe(el);
  });
})();

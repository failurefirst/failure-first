// analytics-events.js
// GA4 custom event tracking for failurefirst.org
// Tiers: (1) Scroll/outbound, (2) CTA/media, (3) Navigation/search, (4) LinkedIn/time-on-page, (5) Video completion, (6) File downloads, (7) 404/error, (8) Content category

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

  // Video play + completion tracking (25/50/75/100%)
  document.querySelectorAll('video').forEach(function (el) {
    var played = false;
    var videoDepths = [25, 50, 75, 100];
    var firedVideoDepths = {};
    var videoSrc = '';

    el.addEventListener('play', function () {
      videoSrc = (el.currentSrc || el.querySelector('source')?.src || '').split('/').pop();
      if (!played) {
        played = true;
        gtag('event', 'video_play', {
          src: videoSrc,
          page: window.location.pathname
        });
      }
    });

    el.addEventListener('timeupdate', function () {
      if (!el.duration || el.duration === Infinity) return;
      var pct = Math.round((el.currentTime / el.duration) * 100);
      videoDepths.forEach(function (d) {
        if (pct >= d && !firedVideoDepths[d]) {
          firedVideoDepths[d] = true;
          gtag('event', 'video_progress', {
            percent: d,
            src: videoSrc,
            page: window.location.pathname
          });
        }
      });
    });

    el.addEventListener('ended', function () {
      gtag('event', 'video_complete', {
        src: videoSrc,
        duration: Math.round(el.duration),
        page: window.location.pathname
      });
    });

    el.addEventListener('pause', function () {
      if (el.currentTime < el.duration) {
        gtag('event', 'video_pause', {
          src: videoSrc,
          percent: Math.round((el.currentTime / el.duration) * 100),
          page: window.location.pathname
        });
      }
    });
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

  // ── Tier 5: File download tracking ──────────────────────────────

  document.body.addEventListener('click', function (e) {
    var a = e.target.closest('a[href]');
    if (!a) return;
    var href = a.getAttribute('href') || '';
    var ext = href.split('.').pop().split('?')[0].toLowerCase();
    var downloadExts = ['pdf', 'mp4', 'm4a', 'mp3', 'wav', 'zip', 'jsonl', 'json', 'csv', 'xlsx', 'tex', 'bib'];
    if (downloadExts.indexOf(ext) !== -1 || a.hasAttribute('download')) {
      gtag('event', 'file_download', {
        file_name: href.split('/').pop(),
        file_extension: ext,
        link_url: href,
        page: window.location.pathname
      });
    }
  });

  // ── Tier 6: 404 / error page tracking ───────────────────────────

  if (document.title.toLowerCase().indexOf('not found') !== -1 ||
      document.title.indexOf('404') !== -1 ||
      document.querySelector('h1')?.textContent?.indexOf('404') !== -1) {
    gtag('event', 'page_not_found', {
      page: window.location.pathname,
      referrer: document.referrer
    });
  }

  // ── Tier 7: Content category tracking ───────────────────────────

  var path = window.location.pathname;
  var contentType = 'other';
  if (path.startsWith('/blog/')) contentType = 'blog';
  else if (path.startsWith('/research/')) contentType = 'research';
  else if (path.startsWith('/daily-paper/')) contentType = 'daily-paper';
  else if (path.startsWith('/policy/') || path.startsWith('/framework/')) contentType = 'policy';
  else if (path.startsWith('/about/')) contentType = 'about';
  else if (path === '/') contentType = 'homepage';

  // Detect incident analysis posts by URL pattern
  var incidentSlugs = [
    'haidilao', 'figure-ai', 'amazon-warehouse', 'robot-perception',
    'sidewalk-robots', 'kargu-2', 'uber-cruise', 'waymo-school',
    '274-deaths', 'unitree', '65-deaths', 'ocado', 'rio-tinto',
    'rewalk', 'jekyllbot', 'robots-extreme'
  ];
  var isIncident = incidentSlugs.some(function (slug) { return path.indexOf(slug) !== -1; });

  gtag('event', 'content_view', {
    content_type: contentType,
    is_incident_analysis: isIncident,
    page: path
  });

  // ── Tier 8: Social referrer attribution ─────────────────────────

  var ref = document.referrer.toLowerCase();
  var socialSource = 'direct';
  if (ref.indexOf('bsky.app') !== -1 || ref.indexOf('bsky.social') !== -1) socialSource = 'bluesky';
  else if (ref.indexOf('twitter.com') !== -1 || ref.indexOf('x.com') !== -1 || ref.indexOf('t.co') !== -1) socialSource = 'twitter';
  else if (ref.indexOf('linkedin.com') !== -1) socialSource = 'linkedin';
  else if (ref.indexOf('reddit.com') !== -1) socialSource = 'reddit';
  else if (ref.indexOf('news.ycombinator') !== -1) socialSource = 'hackernews';
  else if (ref.indexOf('mastodon') !== -1 || ref.indexOf('fosstodon') !== -1) socialSource = 'mastodon';
  else if (ref.indexOf('google') !== -1) socialSource = 'google';
  else if (ref.indexOf('bing') !== -1) socialSource = 'bing';
  else if (ref.indexOf('scholar.google') !== -1) socialSource = 'google_scholar';
  else if (ref) socialSource = 'other_referrer';

  if (socialSource !== 'direct') {
    gtag('event', 'social_referral', {
      source: socialSource,
      referrer: ref.slice(0, 200),
      page: path
    });
  }

  // ── Tier 9: Copy-to-clipboard detection ─────────────────────────

  document.addEventListener('copy', function () {
    var sel = (window.getSelection() || '').toString().trim();
    if (sel.length > 10) {
      gtag('event', 'content_copy', {
        length: sel.length,
        preview: sel.slice(0, 100),
        page: window.location.pathname
      });
    }
  });
})();

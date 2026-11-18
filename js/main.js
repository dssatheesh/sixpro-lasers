/* ══════════════════════════════════════════════════════════════
   SIXPRO PRECISION LASERS — site behaviour
   ══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* ────────────────────────────────────────────────────────────
     1. SITE CONFIG — edit these five values and the whole site
        updates (nav, contact block, footer, map, schema.org).
     ──────────────────────────────────────────────────────────── */
  const SITE = {
    // Manufacturing unit — one array entry per line.
    address: [
      'SIXPRO PRECISION LASERS',
      'Plot No. V30, Property No. 1/V-(30)(AB)',
      'Near SS Weigh Bridge, Chokkasandra',
      'Peenya 2nd Stage, Industrial Area',
      'Bengaluru – 560058, Karnataka, India'
    ],

    // Display number and the dial version (digits/+ only).
    phone:     '+91 95385 95335',
    phoneDial: '+919538595335',

    // Primary inbox: used for the topbar, the footer and as the RFQ
    // destination. Swap to another entry in `emails` below if enquiries
    // should land somewhere else.
    email: 'MARKETING@SIXPROLASERS.COM',

    // Where Request-for-Quote submissions go. Deliberately separate from
    // `email` above so changing the address shown in the top bar can never
    // silently redirect incoming quote requests.
    rfqEmail: 'marketing@sixprolasers.com',

    // Departmental inboxes, rendered as a list in the contact block.
    emails: [
      { label: 'Managing Director', addr: 'SATHEESH_MD@SIXPROLASERS.COM' },
      { label: 'Design',            addr: 'DESIGNS@SIXPROLASERS.COM' },
      { label: 'Marketing',         addr: 'MARKETING@SIXPROLASERS.COM' },
      { label: 'Accounts',          addr: 'ACCOUNTS@SIXPROLASERS.COM' }
    ],

    // Parent company (shown in the footer).
    parent: {
      name:  'YNSK LASER TECH',            // footer: "A group company of …"
      group: 'YNSK Group of Companies',   // header: "Powered by …"
      url:   'https://www.ynsklaser.in'
    },

    // Exact pin for the embedded map. Coordinates rather than a text search,
    // so Google drops the marker on the unit itself instead of guessing.
    mapQuery: '13.0157139,77.5017304',

    // The shareable Google Maps link, used by the "Open in Google Maps" /
    // directions button under the map.
    mapLink: 'https://maps.app.goo.gl/Wui1opSepR8peHcM9',

    // Social profile URLs — leave '' to hide that icon.
    social: { linkedin: '', facebook: '', instagram: '', youtube: '' }
  };

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $  = (s, c) => (c || document).querySelector(s);
  const $$ = (s, c) => Array.from((c || document).querySelectorAll(s));

  /* ────────────────────────────────────────────────────────────
     2. Apply config to the DOM
     ──────────────────────────────────────────────────────────── */
  function applyConfig() {
    $$('[data-contact="phone"]').forEach(el => { el.textContent = SITE.phone; });
    $$('[data-contact="email"]').forEach(el => { el.textContent = SITE.email; });
    $$('a[data-contact="phone-href"]').forEach(el => { el.href = 'tel:' + SITE.phoneDial; });
    $$('a[data-contact="email-href"]').forEach(el => { el.href = 'mailto:' + SITE.email; });

    $$('address[data-placeholder="address"]').forEach(el => {
      el.innerHTML = SITE.address.map(escapeHtml).join('<br>');
    });

    // Departmental inboxes — one linked row per entry.
    $$('[data-contact="email-list"]').forEach(el => {
      el.innerHTML = SITE.emails.map(e =>
        '<li><span>' + escapeHtml(e.label) + '</span>' +
        '<a href="mailto:' + encodeURI(e.addr) + '">' + escapeHtml(e.addr.toLowerCase()) + '</a></li>'
      ).join('');
    });

    // Parent-company credit — "Powered by …" in the header lockup.
    $$('[data-contact="powered"]').forEach(el => {
      el.innerHTML = 'Powered by <a href="' + encodeURI(SITE.parent.url) +
        '" target="_blank" rel="noopener noreferrer">' + escapeHtml(SITE.parent.group) + '</a>';
    });

    // …and "A group company of …" in the footer.
    $$('[data-contact="parent"]').forEach(el => {
      el.innerHTML = 'A group company of <a href="' + encodeURI(SITE.parent.url) +
        '" target="_blank" rel="noopener noreferrer">' + escapeHtml(SITE.parent.name) + '</a>';
    });

    // Social links: point them at real URLs, hide the ones left empty.
    const socialMap = [
      ['LinkedIn',  SITE.social.linkedin],
      ['Facebook',  SITE.social.facebook],
      ['Instagram', SITE.social.instagram],
      ['YouTube',   SITE.social.youtube]
    ];
    $$('.csocial a').forEach((a, i) => {
      const url = socialMap[i] && socialMap[i][1];
      if (url) {
        a.href = url;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
      } else {
        a.remove();
      }
    });
    const socialWrap = $('.csocial');
    if (socialWrap && !socialWrap.children.length) socialWrap.remove();

    const yr = $('#year');
    if (yr) yr.textContent = new Date().getFullYear();
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, c => (
      { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
    ));
  }

  /* ────────────────────────────────────────────────────────────
     3. Google Maps — loaded lazily, no API key required
     ──────────────────────────────────────────────────────────── */
  function initMap() {
    const frame = $('#map');
    if (!frame) return;

    $$('a[data-contact="map-link"]').forEach(a => { a.href = SITE.mapLink; });
    initRoute();
    const load = () => {
      frame.src = 'https://www.google.com/maps?q=' +
                  encodeURIComponent(SITE.mapQuery) + '&output=embed';
    };
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach(e => { if (e.isIntersecting) { load(); io.disconnect(); } });
      }, { rootMargin: '300px' });
      io.observe(frame);
    } else {
      load();
    }
  }

  // Directions search: builds a Google Maps directions URL and opens it in a
  // new tab. An empty origin makes Google route from the visitor's current
  // location, which is what "Use my location" relies on.
  function initRoute() {
    const form = $('#routeForm');
    if (!form) return;
    $$('[data-contact="route-dest"]').forEach(i => { i.value = SITE.mapQuery; });
    const open = (origin) => {
      const url = 'https://www.google.com/maps/dir/?api=1' +
        (origin ? '&origin=' + encodeURIComponent(origin) : '') +
        '&destination=' + encodeURIComponent(SITE.mapQuery) + '&travelmode=driving';
      window.open(url, '_blank', 'noopener');
    };
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const from = $('#routeFrom').value.trim();
      if (!from) { $('#routeFrom').focus(); return; }
      open(from);
    });
    const here = $('#routeHere');
    if (here) here.addEventListener('click', () => open(''));
  }

  /* ────────────────────────────────────────────────────────────
     4. Scroll reveal
     ──────────────────────────────────────────────────────────── */
  function initReveal() {
    const items = $$('.reveal');
    items.forEach(el => {
      const d = el.dataset.delay;
      if (d) el.style.setProperty('--d', d);
    });

    if (prefersReduced || !('IntersectionObserver' in window)) {
      items.forEach(el => el.classList.add('in'));
      return;
    }

    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        e.target.classList.add('in');
        obs.unobserve(e.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    items.forEach(el => io.observe(el));
  }

  /* ────────────────────────────────────────────────────────────
     5. Animated counters
     ──────────────────────────────────────────────────────────── */
  function animateCount(el) {
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    if (isNaN(target)) return;

    if (prefersReduced) { el.textContent = target + suffix; return; }

    const dur = 1500;
    const start = performance.now();
    const step = (now) => {
      const p = Math.min((now - start) / dur, 1);
      // easeOutExpo
      const eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
      el.textContent = Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  function initCounters() {
    const nums = $$('[data-count]');
    if (!nums.length) return;

    if (!('IntersectionObserver' in window)) {
      nums.forEach(animateCount);
      return;
    }
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        animateCount(e.target);
        obs.unobserve(e.target);
      });
    }, { threshold: 0.5 });
    nums.forEach(n => io.observe(n));
  }

  /* ────────────────────────────────────────────────────────────
     6. Sticky nav + mobile menu + scroll spy
     ──────────────────────────────────────────────────────────── */
  function initNav() {
    const nav     = $('#nav');
    const burger  = $('#burger');
    const links   = $('#navLinks');
    const toTop   = $('#toTop');

    const onScroll = () => {
      const y = window.scrollY;
      if (nav)   nav.classList.toggle('stuck', y > 20);
      if (toTop) toTop.classList.toggle('show', y > 700);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    const closeMenu = () => {
      links.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
      burger.setAttribute('aria-label', 'Open menu');
      document.body.classList.remove('menu-open');
    };

    if (burger && links) {
      burger.addEventListener('click', () => {
        const open = links.classList.toggle('open');
        burger.setAttribute('aria-expanded', String(open));
        burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
        document.body.classList.toggle('menu-open', open);
      });

      links.addEventListener('click', (e) => {
        if (e.target.closest('a')) closeMenu();
      });

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && links.classList.contains('open')) closeMenu();
      });

      document.addEventListener('click', (e) => {
        if (!links.classList.contains('open')) return;
        if (links.contains(e.target) || burger.contains(e.target)) return;
        closeMenu();
      });
    }

    // scroll spy
    const navAnchors = $$('#navLinks a[href^="#"]:not(.btn)');
    const sections = navAnchors
      .map(a => document.getElementById(a.getAttribute('href').slice(1)))
      .filter(Boolean);

    if (sections.length && 'IntersectionObserver' in window) {
      const spy = new IntersectionObserver((entries) => {
        entries.forEach(e => {
          if (!e.isIntersecting) return;
          navAnchors.forEach(a => {
            a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id);
          });
        });
      }, { rootMargin: '-45% 0px -50% 0px' });
      sections.forEach(s => spy.observe(s));
    }
  }

  /* ────────────────────────────────────────────────────────────
     7. Gallery lightbox
     ──────────────────────────────────────────────────────────── */
  function initLightbox() {
    const box   = $('#lightbox');
    const img   = $('#lbImg');
    const cap   = $('#lbCap');
    const items = $$('.gal__item');
    if (!box || !items.length) return;

    let index = 0;
    let lastFocus = null;

    const show = (i) => {
      index = (i + items.length) % items.length;
      const fig = items[index];
      const inner = fig.querySelector('img');
      img.src = fig.dataset.full || inner.currentSrc || inner.src;
      img.alt = inner.alt || '';
      const thk = fig.querySelector('.gal__thk');
      cap.textContent = (fig.dataset.cap || '') + (thk ? '  ·  ' + thk.textContent : '');
    };

    const open = (i) => {
      lastFocus = document.activeElement;
      show(i);
      box.hidden = false;
      requestAnimationFrame(() => box.classList.add('show'));
      document.body.classList.add('menu-open');
      $('#lbClose').focus();
    };

    const close = () => {
      box.classList.remove('show');
      document.body.classList.remove('menu-open');
      const done = () => { box.hidden = true; img.src = ''; };
      prefersReduced ? done() : setTimeout(done, 300);
      if (lastFocus) lastFocus.focus();
    };

    items.forEach((fig, i) => {
      fig.setAttribute('tabindex', '0');
      fig.setAttribute('role', 'button');
      fig.setAttribute('aria-label', 'View image: ' + (fig.dataset.cap || 'gallery image'));
      fig.addEventListener('click', () => open(i));
      fig.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(i); }
      });
    });

    $('#lbClose').addEventListener('click', close);
    $('#lbPrev').addEventListener('click', () => show(index - 1));
    $('#lbNext').addEventListener('click', () => show(index + 1));
    box.addEventListener('click', (e) => { if (e.target === box) close(); });

    document.addEventListener('keydown', (e) => {
      if (box.hidden) return;
      if (e.key === 'Escape')     close();
      if (e.key === 'ArrowLeft')  show(index - 1);
      if (e.key === 'ArrowRight') show(index + 1);
    });
  }

  /* ────────────────────────────────────────────────────────────
     8. RFQ form
        Validates, then POSTs to ENDPOINT, which forwards the enquiry to
        SITE.rfqEmail. Falls back to the visitor's mail client if the POST
        cannot be completed, so a submission is never silently lost.
     ──────────────────────────────────────────────────────────── */
  // Server-side handler. Submissions are POSTed here and forwarded by
  // FormSubmit to marketing@sixprolasers.com — no backend of our own.
  //
  // IMPORTANT — FormSubmit activation is per ORIGIN, not just per address.
  // Confirming the link once does not cover every site the form is served from:
  // the first submission from each new origin (localhost, a staging URL, the
  // live domain) triggers its own activation email. It never works at all from
  // a file:// page, because FormSubmit requires a Referer header.
  //
  // So: deploy, submit once from the real domain, click the activation link in
  // the email, and delivery is live from then on.
  //
  // If the POST fails for any reason the form falls back to the visitor's mail
  // client, pre-addressed to SITE.rfqEmail, so an enquiry is never lost.
  // Swap in Formspree / Web3Forms / your own API here if you prefer.
  const ENDPOINT = 'https://formsubmit.co/ajax/marketing@sixprolasers.com';

  // How long to wait before giving up on the endpoint and falling back.
  const SEND_TIMEOUT_MS = 12000;

  function initForm() {
    const form   = $('#rfqForm');
    const status = $('#formStatus');
    if (!form) return;

    const setError = (field, msg) => {
      const wrap = field.closest('.field');
      if (!wrap) return;
      wrap.classList.toggle('invalid', Boolean(msg));
      const err = wrap.querySelector('.err');
      if (err) err.textContent = msg || '';
    };

    const validate = () => {
      let ok = true;
      form.querySelectorAll('[required]').forEach(f => {
        const v = f.value.trim();
        let msg = '';
        if (!v) {
          msg = 'This field is required.';
        } else if (f.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) {
          msg = 'Enter a valid email address.';
        } else if (f.type === 'tel' && v.replace(/\D/g, '').length < 8) {
          msg = 'Enter a valid phone number.';
        }
        setError(f, msg);
        if (msg) ok = false;
      });
      return ok;
    };

    form.querySelectorAll('[required]').forEach(f => {
      f.addEventListener('blur', () => {
        if (f.value.trim()) setError(f, '');
      });
      f.addEventListener('input', () => {
        if (f.closest('.field').classList.contains('invalid') && f.value.trim()) setError(f, '');
      });
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      status.className = 'form__status';
      status.textContent = '';

      if (!validate()) {
        status.className = 'form__status bad';
        status.textContent = 'Please correct the highlighted fields.';
        const bad = form.querySelector('.field.invalid input, .field.invalid textarea');
        if (bad) bad.focus();
        return;
      }

      const btn = form.querySelector('button[type="submit"]');
      const original = btn.innerHTML;

      // Compose the human-readable enquiry once; used as the mail-client
      // fallback body and as a readable copy inside the POST payload.
      const d = new FormData(form);
      const body = [
        'Name: '      + (d.get('name')      || ''),
        'Company: '   + (d.get('company')   || ''),
        'Email: '     + (d.get('email')     || ''),
        'Phone: '     + (d.get('phone')     || ''),
        'Service: '   + (d.get('service')   || ''),
        'Material: '  + (d.get('material')  || ''),
        'Thickness: ' + (d.get('thickness') || ''),
        'Quantity: '  + (d.get('quantity')  || ''),
        '',
        'Part details:',
        d.get('message') || ''
      ].join('\n');

      const subject = 'RFQ from ' + (d.get('name') || 'website')
                    + (d.get('company') ? ' (' + d.get('company') + ')' : '');

      // Last resort: hand the enquiry to the visitor's mail client so it is
      // never silently lost, whatever went wrong upstream.
      const mailtoFallback = (note) => {
        window.location.href = 'mailto:' + SITE.rfqEmail +
          '?subject=' + encodeURIComponent(subject) +
          '&body=' + encodeURIComponent(body);
        status.className = 'form__status ok';
        status.textContent = note;
      };

      if (!ENDPOINT) { mailtoFallback('Opening your email app with the enquiry addressed to ' + SITE.rfqEmail + '.'); return; }

      // FormSubmit refuses submissions that arrive without a Referer header,
      // which is exactly what a page opened straight off disk sends. Skip the
      // pointless round trip and hand the enquiry to the mail client instead.
      if (location.protocol === 'file:') {
        console.warn('SIXPRO — the RFQ endpoint needs the site served over http(s). ' +
                     'This page was opened as a file, so the form fell back to the mail client. ' +
                     'Run "npx serve ." (or deploy) to test real delivery.');
        mailtoFallback('Opening your email app with the enquiry ready to send.');
        return;
      }

      btn.disabled = true;
      btn.textContent = 'Sending…';

      // Abort rather than leave the button spinning if the service hangs.
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), SEND_TIMEOUT_MS);

      try {
        // Send as multipart FormData, not JSON: multipart is a CORS-"simple"
        // content type, so the browser skips the preflight OPTIONS request
        // entirely. One less round trip and one less thing to misconfigure.
        // FormSubmit, Formspree and Web3Forms all accept it.
        d.append('_subject', subject);
        d.append('enquiry', body);   // readable copy in the notification email

        const res = await fetch(ENDPOINT, {
          method: 'POST',
          signal: ctrl.signal,
          headers: { Accept: 'application/json' },
          body: d
        });

        let data = null;
        try { data = await res.clone().json(); } catch (_) { /* non-JSON reply */ }

        if (!res.ok) throw new Error('HTTP ' + res.status);

        // FormSubmit answers HTTP 200 with success:"false" for EVERY
        // configuration problem, not just activation — awaiting the activation
        // click, wrong origin, or no Referer. Its own message says which, so log
        // that verbatim for whoever is debugging, and hand the enquiry to the
        // visitor's mail client rather than leaving them at a dead end.
        if (data && String(data.success) === 'false') {
          console.warn('SIXPRO — the RFQ endpoint refused this submission. ' +
                       'FormSubmit said: ' + (data.message || '(no message returned)'));
          mailtoFallback('Opening your email app with the enquiry ready to send.');
          return;
        }

        form.reset();
        status.className = 'form__status ok';
        status.textContent = 'Thank you — your request has been sent to our team. We will respond shortly.';
      } catch (err) {
        // Network down, blocked, timed out, or endpoint misconfigured.
        mailtoFallback('We could not reach our server, so we have opened your email app with the enquiry ready to send.');
        console.warn('SIXPRO — RFQ POST failed, fell back to mailto:', err && err.message);
      } finally {
        clearTimeout(timer);
        btn.disabled = false;
        btn.innerHTML = original;
      }
    });
  }

  /* ────────────────────────────────────────────────────────────
     9. Dev helper — warn about unfilled placeholders
     ──────────────────────────────────────────────────────────── */
  function checkPlaceholders() {
    const host = location.hostname;
    const isLocal = host === 'localhost' || host === '127.0.0.1' || host === '' || host.endsWith('.local');
    if (!isLocal) return;

    const todo = [];
    if (!ENDPOINT)                            todo.push('RFQ form endpoint (ENDPOINT in js/main.js)');
    if ($('[data-placeholder="testimonials"]'))    todo.push('customer testimonials (index.html)');
    if ($('[data-placeholder="certifications"]'))  todo.push('certifications (index.html)');
    if (!Object.values(SITE.social).some(Boolean)) todo.push('social links (SITE.social)');

    if (todo.length) {
      console.warn('%cSIXPRO — still to fill in before launch:', 'color:#FFB020;font-weight:700', '\n• ' + todo.join('\n• '));
    }
  }

  /* ────────────────────────────────────────────────────────────
     boot
     ──────────────────────────────────────────────────────────── */
  function init() {
    applyConfig();
    initNav();
    initReveal();
    initCounters();
    initLightbox();
    initForm();
    initMap();
    checkPlaceholders();
  }

  document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', init)
    : init();
})();

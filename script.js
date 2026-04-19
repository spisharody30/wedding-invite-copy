  const invDesktopRoot  = document.getElementById('invDesktopRoot');
  const invMobileRoot   = document.getElementById('invMobileRoot');
  const funcDesktopRoot = document.getElementById('funcDesktopRoot');
  const funcMobileRoot  = document.getElementById('funcMobileRoot');
  const faqRoot         = document.getElementById('faqRoot');
  const faqMobileRoot   = document.getElementById('faqMobileRoot');

  // ── Scale invitation + function canvases to fit viewport ───────────────
  function applyScale() {
    const W = window.innerWidth;
    const isMobile = W < 768;

    // Function details: mobile 402×1582, desktop 1440×1550 — width-only scaling
    if (isMobile) {
      funcDesktopRoot.style.display  = 'none';
      funcMobileRoot.style.display   = 'block';
      funcMobileRoot.style.position  = 'relative';
      funcMobileRoot.style.marginBottom = '';          // clear first so offsetHeight is clean
      const sf = W / 402;
      funcMobileRoot.style.transform = `scale(${sf})`;
      const fmobH = funcMobileRoot.offsetHeight;       // natural height in flow (accurate, font-independent for fixed-height cards)
      // scale shrinks visual height to fmobH*sf but layout footprint stays fmobH;
      // pull up by the difference so the section is exactly fmobH*sf tall
      funcMobileRoot.style.marginBottom = -Math.round(fmobH * (1 - sf)) + 'px';
      document.getElementById('functionSection').style.height = '';  // let CSS height:auto take over
    } else {
      funcMobileRoot.style.display      = 'none';
      funcMobileRoot.style.position     = '';          // restore CSS default (absolute)
      funcMobileRoot.style.marginBottom = '';
      funcDesktopRoot.style.display = 'block';
      const sf = W / 1440;
      funcDesktopRoot.style.transform = `scale(${sf})`;
      document.getElementById('functionSection').style.height = Math.round(1550 * sf) + 'px';
    }

    // FAQ & RSVP section: mobile 402×auto, desktop 1440×720
    if (isMobile) {
      faqRoot.style.display         = 'none';
      faqMobileRoot.style.display   = 'block';
      faqMobileRoot.style.position  = 'relative';
      faqMobileRoot.style.marginBottom = '';
      const sfq = W / 402;
      faqMobileRoot.style.transform = `scale(${sfq})`;
      const fmH = faqMobileRoot.offsetHeight;
      faqMobileRoot.style.marginBottom = -Math.round(fmH * (1 - sfq)) + 'px';
      document.getElementById('faqSection').style.height = '';
    } else {
      faqMobileRoot.style.display      = 'none';
      faqMobileRoot.style.position     = '';
      faqMobileRoot.style.marginBottom = '';
      faqRoot.style.display = 'block';
      const sfq = W / 1440;
      faqRoot.style.transform = `scale(${sfq})`;
      document.getElementById('faqSection').style.height = Math.round(820 * sfq) + 'px';
    }

    // Invitation section: desktop 1440×1024, mobile 402×940 — width-only scaling
    if (isMobile) {
      invDesktopRoot.style.display = 'none';
      invMobileRoot.style.display  = 'block';
      const si = W / 402;
      invMobileRoot.style.transform = `scale(${si})`;
      document.getElementById('invitationSection').style.height = Math.round(940 * si) + 'px';
    } else {
      invMobileRoot.style.display  = 'none';
      invDesktopRoot.style.display = 'block';
      const si = W / 1440;
      invDesktopRoot.style.transform = `scale(${si})`;
      document.getElementById('invitationSection').style.height = Math.round(1024 * si) + 'px';
    }
  }

  applyScale();
  window.addEventListener('resize', applyScale);
  document.fonts.ready.then(applyScale);
  window.addEventListener('load', applyScale);

  // ── Invitation section: staged animation chain ──
  const invSect     = document.getElementById('invitationSection');
  const invBorders  = invSect.querySelectorAll('.inv-border');
  const invCardC    = invSect.querySelector('.inv-card-center');
  const invCardL    = invSect.querySelector('.inv-card-left');
  const invCardR    = invSect.querySelector('.inv-card-right');
  const invMandala  = invSect.querySelector('.inv-orn-mandala');
  const invInvited  = invSect.querySelector('.wedding-invited');
  const invDateOn   = invSect.querySelector('.wedding-date-on');
  const invDate     = invSect.querySelector('.wedding-date');
  const invVenue    = invSect.querySelector('.wedding-venue');
  const invOrns     = invSect.querySelectorAll('.inv-orn, .inv-orn-flipped');
  // Mobile single-card elements
  const invMobCard    = document.getElementById('invMobCard');
  const invMobMandala = document.getElementById('invMobMandala');
  const invMobInvited = document.getElementById('invMobInvited');
  const invMobNameR   = document.getElementById('invMobNameR');
  const invMobParentR = document.getElementById('invMobParentR');
  const invMobNameK   = document.getElementById('invMobNameK');
  const invMobParentK = document.getElementById('invMobParentK');
  const invMobDateOn  = document.getElementById('invMobDateOn');
  const invMobDate    = document.getElementById('invMobDate');
  const invMobVenue   = document.getElementById('invMobVenue');
  const invMobOrnBot  = document.getElementById('invMobOrnBot');
  const invMobAnd     = document.getElementById('invMobAnd');

  let invFired = false;
  const invObserver = new IntersectionObserver(entries => {
    if (!entries[0].isIntersecting || invFired) return;
    invFired = true;
    invObserver.disconnect();

    const show = (el) => el && el.classList.add('inv-show');

    // 1. Borders fade in (0 ms — feel like henna drawn)
    invBorders.forEach(b => show(b));

    // 2. Center card scales up (1 s)
    setTimeout(() => show(invCardC), 1000);

    // 3. Mandala icon with golden glow (1.5 s)
    setTimeout(() => show(invMandala), 1500);

    // 4. Invited text line by line (2 s)
    setTimeout(() => show(invInvited), 2000);

    // 5. "On" label + date elegant scale-up (2.5 s)
    setTimeout(() => { show(invDateOn); show(invDate); }, 2500);

    // 6. Venue details (3 s)
    setTimeout(() => show(invVenue), 3000);

    // 7. Left + right cards arrive together (3.5 s — couple coming together)
    setTimeout(() => { show(invCardL); show(invCardR); }, 3500);

    // 9. All ornament flourishes (4 s)
    setTimeout(() => invOrns.forEach(o => show(o)), 4000);

    // Mobile: borders → card → content stagger
    const invMobBT = document.getElementById('invMobBorderTop');
    const invMobBB = document.getElementById('invMobBorderBot');
    show(invMobBT);
    setTimeout(() => show(invMobCard),    300);   // card scales up
    setTimeout(() => show(invMobMandala), 900);   // mandala glow
    setTimeout(() => show(invMobInvited), 1200);  // invited text
    setTimeout(() => { show(invMobNameR); show(invMobParentR); }, 1500); // Rahul
    setTimeout(() => show(invMobAnd), 1700);                             // "and"
    setTimeout(() => { show(invMobNameK); show(invMobParentK); }, 1900); // Kashish
    setTimeout(() => { show(invMobDateOn); show(invMobDate); }, 2300);   // date
    setTimeout(() => show(invMobVenue),   2700);  // venue
    setTimeout(() => { show(invMobOrnBot); show(invMobBB); }, 3000);     // ornament + bottom border
  }, { threshold: 0.15 });
  invObserver.observe(invSect);

  // ── Function details section: entrance animation ──
  const funcSect = document.getElementById('functionSection');
  let funcFired = false;
  const funcObserver = new IntersectionObserver(entries => {
    if (!entries[0].isIntersecting || funcFired) return;
    funcFired = true;
    funcObserver.disconnect();

    const fshow = el => el && el.classList.add('func-show');

    // Desktop
    fshow(document.getElementById('funcOrn'));
    setTimeout(() => fshow(document.getElementById('funcScript')),       300);
    setTimeout(() => fshow(document.getElementById('funcCardHaldi')),    500);
    setTimeout(() => fshow(document.getElementById('funcCardSangeet')),  700);
    setTimeout(() => fshow(document.getElementById('funcCardReception')),900);

    // Mobile
    fshow(document.getElementById('funcMobOrn'));
    setTimeout(() => fshow(document.getElementById('funcMobScript')),    300);
    setTimeout(() => fshow(document.getElementById('funcMobHaldi')),     500);
    setTimeout(() => fshow(document.getElementById('funcMobSangeet')),   700);
    setTimeout(() => fshow(document.getElementById('funcMobReception')), 900);
  }, { threshold: 0.1 });
  funcObserver.observe(funcSect);


  // ══════════════════════════════════════════════════════════════════════
  // SMOOTH SCROLL ENGINE (desktop only — mobile keeps native scroll)
  // ══════════════════════════════════════════════════════════════════════
  (function () {
    const container  = document.getElementById('pageContainer');
    const sections   = [...document.querySelectorAll('.page-section')];
    const prefersRM  = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ── easeOutExpo: fast then gradually decelerates ──────────────────
    function easeOutExpo(t) {
      return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
    }

    let scrolling  = false;
    let currentIdx = 0;
    const DURATION = 880; // ms — fast enough to feel premium, slow enough to feel weighted

    // Animate container.scrollTop to a section
    function scrollToIdx(idx) {
      idx = Math.max(0, Math.min(sections.length - 1, idx));
      if (scrolling || idx === currentIdx) return;
      scrolling  = true;
      currentIdx = idx;

      if (prefersRM) {
        container.scrollTop = sections[idx].offsetTop;
        scrolling = false;
        return;
      }

      const startY  = container.scrollTop;
      const targetY = sections[idx].offsetTop;
      const diff    = targetY - startY;
      const t0      = performance.now();

      function tick(now) {
        const p = Math.min((now - t0) / DURATION, 1);
        container.scrollTop = startY + diff * easeOutExpo(p);
        if (p < 1) {
          requestAnimationFrame(tick);
        } else {
          container.scrollTop = targetY;
          scrolling = false;
        }
      }
      requestAnimationFrame(tick);
    }

    // ── Wheel interception (tablet only — desktop uses free scroll) ───
    let wheelAcc = 0;
    let wheelTimer;
    container.addEventListener('wheel', function (e) {
      if (window.innerWidth >= 1024) return; // free scroll on desktop
      if (window.innerWidth < 768) return;   // native scroll on mobile
      e.preventDefault();
      if (scrolling) return;

      wheelAcc += e.deltaY;
      clearTimeout(wheelTimer);
      wheelTimer = setTimeout(function () { wheelAcc = 0; }, 200);

      if (Math.abs(wheelAcc) > 40) {
        const dir = wheelAcc > 0 ? 1 : -1;
        wheelAcc = 0;
        scrollToIdx(currentIdx + dir);
      }
    }, { passive: false });

    // ── Keyboard navigation (tablet only — desktop uses native keys) ──
    document.addEventListener('keydown', function (e) {
      if (window.innerWidth >= 1024) return; // free scroll on desktop
      if (window.innerWidth < 768) return;   // native scroll on mobile
      if (e.key === 'ArrowDown' || e.key === 'PageDown') { e.preventDefault(); scrollToIdx(currentIdx + 1); }
      if (e.key === 'ArrowUp'   || e.key === 'PageUp')   { e.preventDefault(); scrollToIdx(currentIdx - 1); }
    });

    // ── Sync currentIdx from scroll position (tablet only) ───────────
    container.addEventListener('scroll', function () {
      if (scrolling || window.innerWidth < 768 || window.innerWidth >= 1024) return;
      const mid = container.scrollTop + window.innerHeight / 2;
      let best = 0, bestDist = Infinity;
      sections.forEach(function (s, i) {
        const d = Math.abs(s.offsetTop + s.offsetHeight / 2 - mid);
        if (d < bestDist) { bestDist = d; best = i; }
      });
      currentIdx = best;
    }, { passive: true });

    // ── Subtle parallax on section background images ──────────────────
    if (!prefersRM) {
      const bgImgs = document.querySelectorAll('.section-bg > img');
      function applyParallax(scrollY) {
        bgImgs.forEach(function (img) {
          const sectionTop = img.closest('.page-section').offsetTop;
          const relY = scrollY - sectionTop;
          img.style.transform = 'translateY(' + (relY * 0.13).toFixed(2) + 'px)';
        });
      }
      // Mobile/tablet: scroll happens inside #pageContainer
      container.addEventListener('scroll', function () {
        if (window.innerWidth >= 1024) return;
        applyParallax(container.scrollTop);
      }, { passive: true });
      // Desktop: scroll happens on window
      window.addEventListener('scroll', function () {
        if (window.innerWidth < 1024) return;
        applyParallax(window.scrollY);
      }, { passive: true });
    }
  })();

  // ── FAQ accordion (desktop) ────────────────────────────────────────────
  document.querySelectorAll('#faqRoot .faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('#faqRoot .faq-item.open').forEach(el => el.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });

  // ── FAQ accordion (mobile) ─────────────────────────────────────────────
  document.querySelectorAll('#faqMobileRoot .fmfaq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.fmfaq-item');
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('#faqMobileRoot .fmfaq-item.open').forEach(el => el.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });

  // ── RSVP form (desktop) ────────────────────────────────────────────────
  document.getElementById('rsvpForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const name   = e.target.name.value.trim();
    const guests = e.target.guests.value.trim();
    if (!name || !guests) return;
    const btn = e.target.querySelector('.rsvp-btn');
    btn.textContent = '✓ Received!';
    btn.style.background = '#e8f5e9';
    btn.style.color = '#2e7d32';
    btn.disabled = true;
    e.target.name.value = '';
    e.target.guests.value = '';
  });

  // ── RSVP form (mobile) ────────────────────────────────────────────────
  document.getElementById('rsvpMobileForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const name   = e.target.name.value.trim();
    const guests = e.target.guests.value.trim();
    if (!name || !guests) return;
    const btn = e.target.querySelector('.fmrsvp-btn');
    btn.textContent = '✓ Received!';
    btn.style.background = '#e8f5e9';
    btn.style.color = '#2e7d32';
    btn.disabled = true;
    e.target.name.value = '';
    e.target.guests.value = '';
  });

  // ── Photo float: starts after hero oval reveals ───────────────────────
  setTimeout(function() {
    var mOval = document.querySelector('.hero-mob-oval');
    if (mOval) { mOval.style.opacity = '1'; mOval.style.animation = 'photoFloat 4s ease-in-out infinite'; }
  }, 1900);
  setTimeout(function() {
    var dOval = document.querySelector('.hero-photo');
    if (dOval) { dOval.style.opacity = '1'; dOval.style.animation = 'photoFloat 4s ease-in-out infinite'; }
  }, 3200);

  // ── 3D Perspective Carousel ───────────────────────────────────────────
  (function () {
    var slides   = Array.from(document.querySelectorAll('.c3d-slide'));
    var dots     = Array.from(document.querySelectorAll('.c3d-dot'));
    var viewport = document.getElementById('c3dViewport');
    var carousel = document.getElementById('c3dCarousel');
    var total    = slides.length;
    var current  = 0;
    var autoTimer   = null;
    var resumeTimer = null;

    // ── Position config per breakpoint ──────────────────────────────────
    // pos: -2, -1, 0, +1, +2  (relative to current center)
    function getCfg(pos) {
      if (Math.abs(pos) > 2) return null;
      var W = window.innerWidth;
      var isMob = W < 768;
      var isTab = W >= 768 && W <= 1024;

      if (isMob) {
        if (Math.abs(pos) > 1) return null; // only show ±1 on mobile
        var mob = [
          { x: -236, ry: 12,   s: 0.82, o: 0.6, z: 20 },  // -1
          { x: 0,    ry: 0,    s: 1,    o: 1,   z: 30 },  //  0
          { x: 236,  ry: -12,  s: 0.82, o: 0.6, z: 20 },  // +1
        ];
        return mob[pos + 1];
      }
      if (isTab) {
        var tab = [
          { x: -390, ry: 30,  s: 0.70, o: 0.35, z: 10 },
          { x: -220, ry: 22,  s: 0.85, o: 0.70, z: 20 },
          { x: 0,    ry: 0,   s: 1,    o: 1,    z: 30 },
          { x: 220,  ry: -22, s: 0.85, o: 0.70, z: 20 },
          { x: 390,  ry: -30, s: 0.70, o: 0.35, z: 10 },
        ];
        return tab[pos + 2];
      }
      // Desktop — 300px slides, ~18px gap between adjacent photos
      var desk = [
        { x: -545, ry: 32,  s: 0.70, o: 0.40, z: 10 },
        { x: -296, ry: 22,  s: 0.85, o: 0.70, z: 20 },
        { x: 0,    ry: 0,   s: 1,    o: 1,    z: 30 },
        { x: 296,  ry: -22, s: 0.85, o: 0.70, z: 20 },
        { x: 545,  ry: -32, s: 0.70, o: 0.40, z: 10 },
      ];
      return desk[pos + 2];
    }

    // ── Compute slide position relative to current center (circular) ──
    function getPos(i) {
      var pos = ((i - current) % total + total) % total;
      if (pos > Math.floor(total / 2)) pos -= total;
      return pos;
    }

    // ── Apply transforms to all slides ──────────────────────────────────
    function applyTransforms(dragOffsetX) {
      dragOffsetX = dragOffsetX || 0;
      slides.forEach(function (slide, i) {
        var pos     = getPos(i);
        var cfg     = getCfg(pos);
        var isCenter = pos === 0;
        slide.classList.toggle('is-center', isCenter);

        if (!cfg) {
          // Off-screen: park on the near side so it can slide in cleanly
          var farX = (pos > 0 ? 1 : -1) * 900;
          var farRY = pos > 0 ? -45 : 45;
          slide.style.transform = 'translateX(' + farX + 'px) rotateY(' + farRY + 'deg) scale(0.5)';
          slide.style.opacity = '0';
          slide.style.zIndex  = '1';
          slide.style.filter  = 'grayscale(100%)';
          return;
        }

        var x = cfg.x + dragOffsetX;
        slide.style.transform = 'translateX(' + x + 'px) rotateY(' + cfg.ry + 'deg) scale(' + cfg.s + ')';
        slide.style.opacity   = String(cfg.o);
        slide.style.zIndex    = String(cfg.z);
        slide.style.filter    = isCenter ? 'grayscale(0%)' : 'grayscale(100%)';
      });
      dots.forEach(function (d, i) { d.classList.toggle('active', i === current); });
    }

    // ── Toggle CSS transitions on all slides ────────────────────────────
    function setTransitions(on) {
      var val = on
        ? 'transform 0.6s ease-out, opacity 0.6s ease-out, filter 0.6s ease-out'
        : 'none';
      slides.forEach(function (s) { s.style.transition = val; });
    }

    // ── Navigate to a slide index ────────────────────────────────────────
    function goTo(idx, userInitiated) {
      current = ((idx % total) + total) % total;
      setTransitions(true);
      applyTransforms(0);
      if (userInitiated !== false) {
        pauseAuto();
        clearTimeout(resumeTimer);
        resumeTimer = setTimeout(startAuto, 10000);
      }
    }

    // ── Auto-play ────────────────────────────────────────────────────────
    function startAuto() {
      clearInterval(autoTimer);
      autoTimer = setInterval(function () { goTo(current + 1, false); }, 5000);
    }
    function pauseAuto() {
      clearInterval(autoTimer);
      autoTimer = null;
    }
    carousel.addEventListener('mouseenter', pauseAuto);
    carousel.addEventListener('mouseleave', function () {
      clearTimeout(resumeTimer);
      resumeTimer = setTimeout(startAuto, 2000);
    });

    // ── Click side slides to bring to center ─────────────────────────────
    slides.forEach(function (slide, i) {
      slide.addEventListener('click', function (e) {
        if (e.target.closest('.c3d-heart')) return;
        var pos = getPos(i);
        if (pos !== 0) { e.preventDefault(); goTo(i, true); }
      });
    });

    // ── Dot indicators ───────────────────────────────────────────────────
    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () { goTo(i, true); });
    });

    // ── Keyboard (← →, no conflict with scroll engine which uses ↑↓) ────
    document.addEventListener('keydown', function (e) {
      var lb = document.getElementById('lightbox');
      if (lb && lb.classList.contains('open')) return;
      if (e.key === 'ArrowLeft')  { e.preventDefault(); goTo(current - 1, true); }
      if (e.key === 'ArrowRight') { e.preventDefault(); goTo(current + 1, true); }
    });

    // ── Touch swipe (mobile) ─────────────────────────────────────────────
    var touchStartX = 0;
    var touchStartY = 0;
    var isSwiping   = false;
    var sect = document.getElementById('gallerySection');

    sect.addEventListener('touchstart', function (e) {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
      isSwiping   = false;
      pauseAuto();
    }, { passive: true });

    sect.addEventListener('touchmove', function (e) {
      var dx = e.touches[0].clientX - touchStartX;
      var dy = e.touches[0].clientY - touchStartY;
      if (!isSwiping && Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 10) isSwiping = true;
    }, { passive: true });

    sect.addEventListener('touchend', function (e) {
      var dx = e.changedTouches[0].clientX - touchStartX;
      if (isSwiping && Math.abs(dx) > 45) {
        goTo(dx < 0 ? current + 1 : current - 1, true);
      } else {
        clearTimeout(resumeTimer);
        resumeTimer = setTimeout(startAuto, 3000);
      }
    }, { passive: true });

    // ── Desktop drag ─────────────────────────────────────────────────────
    var isDragging = false;
    var dragStartX = 0;
    var dragDelta  = 0;
    var rafId      = null;

    viewport.addEventListener('mousedown', function (e) {
      if (e.target.closest('.c3d-heart') || e.button !== 0) return;
      isDragging = true;
      dragStartX = e.clientX;
      dragDelta  = 0;
      setTransitions(false);
      pauseAuto();
      viewport.classList.add('dragging');
      e.preventDefault();
    });

    document.addEventListener('mousemove', function (e) {
      if (!isDragging) return;
      dragDelta = e.clientX - dragStartX;
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(function () { applyTransforms(dragDelta * 0.7); });
    });

    document.addEventListener('mouseup', function () {
      if (!isDragging) return;
      isDragging = false;
      cancelAnimationFrame(rafId);
      viewport.classList.remove('dragging');
      setTransitions(true);
      if      (dragDelta >  65) goTo(current - 1, true);
      else if (dragDelta < -65) goTo(current + 1, true);
      else                       applyTransforms(0);
      clearTimeout(resumeTimer);
      resumeTimer = setTimeout(startAuto, 10000);
    });

    // ── Heart / like ─────────────────────────────────────────────────────
    var LIKES_KEY = 'gallery_likes_rk_v1';
    var likes;
    try { likes = JSON.parse(localStorage.getItem(LIKES_KEY) || '{}'); }
    catch (e) { likes = {}; }
    function saveLikes() {
      try { localStorage.setItem(LIKES_KEY, JSON.stringify(likes)); } catch(e) {}
    }

    function spawnParticles(slide) {
      var offsets = [{ x: -22, d: 0 }, { x: 4, d: 90 }, { x: 20, d: 45 }];
      offsets.forEach(function (o) {
        var p = document.createElement('span');
        p.className = 'c3d-particle';
        p.textContent = '♥';
        p.style.setProperty('--px', o.x + 'px');
        p.style.animationDelay = o.d + 'ms';
        slide.appendChild(p);
        setTimeout(function () { if (p.parentElement) p.remove(); }, 1000 + o.d);
      });
    }

    slides.forEach(function (slide, i) {
      var btn   = slide.querySelector('.c3d-heart');
      var path  = btn.querySelector('.c3d-heart-path');
      var countEl = btn.querySelector('.c3d-heart-count');
      var key   = 'photo_' + i;

      // Restore persisted state
      var n = parseInt(likes[key + '_n'], 10) || 0;
      if (likes[key]) {
        btn.classList.add('liked');
        btn.setAttribute('aria-pressed', 'true');
        path.setAttribute('fill', '#8B1A1A');
      }
      countEl.textContent = n;

      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        var isLiked = btn.classList.toggle('liked');
        btn.setAttribute('aria-pressed', String(isLiked));
        path.setAttribute('fill', isLiked ? '#8B1A1A' : 'none');
        n = isLiked ? n + 1 : Math.max(0, n - 1);
        countEl.textContent = n;
        likes[key]       = isLiked;
        likes[key + '_n'] = n;
        saveLikes();
        // Pop bounce
        btn.classList.remove('popping');
        void btn.offsetWidth;
        btn.classList.add('popping');
        btn.addEventListener('animationend', function () { btn.classList.remove('popping'); }, { once: true });
        // Particles
        if (isLiked) spawnParticles(slide);
      });
    });

    // ── Lightbox (double-click center photo) ─────────────────────────────
    var lb    = document.getElementById('lightbox');
    var lbImg = document.getElementById('lbImg');
    var lbIdx = 0;

    function openLb(idx) {
      lbIdx = idx;
      lbImg.src = slides[idx].querySelector('img').src;
      lbImg.alt = slides[idx].querySelector('img').alt || '';
      lb.classList.add('open');
      requestAnimationFrame(function () {
        requestAnimationFrame(function () { lb.classList.add('visible'); });
      });
      pauseAuto();
    }
    function closeLb() {
      lb.classList.remove('visible');
      setTimeout(function () { lb.classList.remove('open'); }, 330);
      clearTimeout(resumeTimer);
      resumeTimer = setTimeout(startAuto, 5000);
    }

    slides.forEach(function (slide, i) {
      slide.addEventListener('dblclick', function (e) {
        if (getPos(i) === 0 && !e.target.closest('.c3d-heart')) openLb(i);
      });
    });
    document.getElementById('lbClose').addEventListener('click', closeLb);
    document.getElementById('lbPrev').addEventListener('click', function (e) { e.stopPropagation(); openLb(((lbIdx - 1) + total) % total); });
    document.getElementById('lbNext').addEventListener('click', function (e) { e.stopPropagation(); openLb((lbIdx + 1) % total); });
    lb.addEventListener('click', function (e) { if (e.target === lb) closeLb(); });
    document.addEventListener('keydown', function (e) {
      if (!lb.classList.contains('open')) return;
      if (e.key === 'Escape')     closeLb();
      if (e.key === 'ArrowLeft')  openLb(((lbIdx - 1) + total) % total);
      if (e.key === 'ArrowRight') openLb((lbIdx + 1) % total);
    });
    var lbTx = 0;
    lb.addEventListener('touchstart', function (e) { lbTx = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener('touchend', function (e) {
      var dx = e.changedTouches[0].clientX - lbTx;
      if (Math.abs(dx) > 50) openLb(dx < 0 ? (lbIdx + 1) % total : ((lbIdx - 1) + total) % total);
    }, { passive: true });

    // ── Resize: recalculate positions ────────────────────────────────────
    var resizeTimer;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        setTransitions(false);
        applyTransforms(0);
        setTimeout(function () { setTransitions(true); }, 60);
      }, 120);
    });

    // ── Init ─────────────────────────────────────────────────────────────
    setTransitions(false);
    applyTransforms(0);
    requestAnimationFrame(function () {
      setTransitions(true);
      startAuto();
    });
  })();


  // ── Background music ─────────────────────────────────────────────────────
  // Wrapped in DOMContentLoaded because <audio> and <button> are parsed
  // after this <script> block in the HTML source.
  document.addEventListener('DOMContentLoaded', function () {
    'use strict';

    var audio  = document.getElementById('bg-music');
    var btn    = document.getElementById('musicToggle');
    if (!audio || !btn) return;

    var TARGET_VOL = 0.35;
    var isPlaying  = false;
    var fadeTimer  = null;

    // ── Volume fade helpers ───────────────────────────────────────────────
    function clearFade() {
      if (fadeTimer) { clearInterval(fadeTimer); fadeTimer = null; }
    }

    function fadeIn() {
      clearFade();
      audio.volume = 0;
      var step = TARGET_VOL / 40; // ~1 s at 25 ms intervals
      fadeTimer = setInterval(function () {
        audio.volume = Math.min(TARGET_VOL, audio.volume + step);
        if (audio.volume >= TARGET_VOL) clearFade();
      }, 25);
    }

    function fadeOut(onDone) {
      clearFade();
      var step = audio.volume / 20; // ~0.5 s at 25 ms intervals
      fadeTimer = setInterval(function () {
        audio.volume = Math.max(0, audio.volume - step);
        if (audio.volume <= 0) {
          clearFade();
          audio.pause();
          audio.volume = TARGET_VOL;
          if (onDone) onDone();
        }
      }, 25);
    }

    // ── UI state ─────────────────────────────────────────────────────────
    function setPlaying(on) {
      isPlaying = on;
      btn.classList.toggle('playing', on);
      btn.setAttribute('aria-pressed', on ? 'true' : 'false');
      btn.title = on ? 'Pause music' : 'Play music';
      try { localStorage.setItem('musicPreference', on ? 'on' : 'off'); }
      catch (e) {}
    }

    // ── Start / stop ─────────────────────────────────────────────────────
    function startMusic() {
      audio.volume = 0;
      var p = audio.play();
      if (p && p.then) {
        p.then(function () {
          if (!audio.paused) { fadeIn(); setPlaying(true); }
        }).catch(function () { setPlaying(false); });
      } else {
        // Old browsers: synchronous play
        if (!audio.paused) { fadeIn(); setPlaying(true); }
      }
    }

    function stopMusic() {
      clearFade();
      audio.pause();
      audio.volume = TARGET_VOL; // reset for next play
      setPlaying(false);
    }

    // ── Toggle button ─────────────────────────────────────────────────────
    btn.addEventListener('click', function () {
      // Use audio.paused as ground truth — more reliable than isPlaying flag
      // on mobile Safari where async state can drift.
      if (!audio.paused) {
        // Pause synchronously within the user gesture — required on mobile
        stopMusic();
      } else {
        // iOS Safari: play() MUST be called synchronously in a user event
        audio.volume = 0;
        var p = audio.play();
        if (p && p.then) {
          p.then(function () { fadeIn(); setPlaying(true); })
           .catch(function () { setPlaying(false); });
        } else {
          fadeIn(); setPlaying(true);
        }
      }
    });

    // ── Error handling: hide button if file fails to load ────────────────
    audio.addEventListener('error', function () {
      btn.style.display = 'none';
    });

    // ── Autoplay on load ─────────────────────────────────────────────────
    function attemptAutoplay() {
      // Respect user's saved preference
      var pref;
      try { pref = localStorage.getItem('musicPreference'); } catch (e) {}
      if (pref === 'off') { setPlaying(false); return; }

      // Respect prefers-reduced-motion (some users also prefer no audio)
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        setPlaying(false);
        return;
      }

      startMusic();
    }

    // Attempt after a short delay to let the page settle
    setTimeout(attemptAutoplay, 800);
  });
  // ── Music tooltip — first visit only ─────────────────────────────────────
  (function () {
    var storageKey = 'musicTooltipShown';
    var tip = document.getElementById('musicTooltip');
    var btn = document.getElementById('musicToggle');
    if (!tip || !btn) return;

    var alreadyShown = false;
    try {
      alreadyShown = localStorage.getItem(storageKey) === '1';
    } catch (e) {}
    if (alreadyShown) return;

    var hideTimer;
    function hideTip() {
      clearTimeout(hideTimer);
      tip.classList.remove('visible');
      tip.setAttribute('aria-hidden', 'true');
      try {
        localStorage.setItem(storageKey, '1');
      } catch (e) {}
    }

    setTimeout(function () {
      tip.classList.add('visible');
      tip.setAttribute('aria-hidden', 'false');
      hideTimer = setTimeout(hideTip, 8000);
    }, 3000);

    btn.addEventListener('click', hideTip, { once: true });
  })();

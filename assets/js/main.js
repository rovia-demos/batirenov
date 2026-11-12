(function () {
  'use strict';
  var d = document, root = d.documentElement;
  var $ = function (s, c) { return (c || d).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || d).querySelectorAll(s)); };
  var motion = root.classList.contains('motion');
  var fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  var isMobile = function () { return innerWidth < 768; };
  var hasGsap = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';
  var lenis = null;

  /* ---------- Viewport height: measured once, updated only when width changes ---------- */
  var lastW = innerWidth;
  addEventListener('resize', function () {
    if (innerWidth === lastW) return;
    lastW = innerWidth;
    root.style.setProperty('--vh', innerHeight / 100 + 'px');
    if (hasGsap) ScrollTrigger.refresh();
  });

  /* ---------- Smooth scroll (mouse only) ---------- */
  if (motion && fine && typeof window.Lenis !== 'undefined') {
    lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1 });
    root.classList.add('lenis');
    if (hasGsap) {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
      gsap.ticker.lagSmoothing(0);
    } else {
      (function raf(t) { lenis.raf(t); requestAnimationFrame(raf); })(0);
    }
  }
  function goTo(target) {
    var el = typeof target === 'string' ? $(target) : target;
    if (!el) return;
    if (lenis) lenis.scrollTo(el, { offset: -70, duration: 1.3 });
    else el.scrollIntoView({ behavior: motion ? 'smooth' : 'auto', block: 'start' });
  }
  d.addEventListener('click', function (e) {
    var a = e.target.closest('a[href^="#"]');
    if (!a) return;
    var id = a.getAttribute('href');
    if (id.length < 2) return;
    var el = $(id);
    if (!el) return;
    e.preventDefault();
    closeMenu();
    goTo(el);
  });

  if (hasGsap) {
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.config({ ignoreMobileResize: true, autoRefreshEvents: 'visibilitychange,DOMContentLoaded,load' });
  }

  /* ---------- Header ---------- */
  var hd = $('#hd'), hero = $('.hero');
  new IntersectionObserver(function (en) {
    hd.classList.toggle('is-solid', !en[0].isIntersecting);
  }, { rootMargin: '-72px 0px 0px 0px' }).observe(hero);

  /* ---------- Mobile menu ---------- */
  var burger = $('.burger'), menu = $('#menu');
  function closeMenu() {
    if (menu.hidden) return;
    menu.hidden = true;
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Ouvrir le menu');
    d.body.classList.remove('menu-open');
    if (lenis) lenis.start();
  }
  burger.addEventListener('click', function () {
    if (!menu.hidden) return closeMenu();
    menu.hidden = false;
    burger.setAttribute('aria-expanded', 'true');
    burger.setAttribute('aria-label', 'Fermer le menu');
    d.body.classList.add('menu-open');
    if (lenis) lenis.stop();
  });
  d.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });

  /* ---------- Hero ---------- */
  var poster = $('.hero__poster');
  var heroGo = function () { hero.classList.add('is-go'); };
  if (poster.complete) requestAnimationFrame(heroGo); else { poster.addEventListener('load', heroGo); setTimeout(heroGo, 1200); }

  var vid = $('.hero__video');
  var saveData = navigator.connection && navigator.connection.saveData;
  if (motion && !saveData) {
    var startVideo = function () {
      vid.src = isMobile() ? vid.dataset.srcM : vid.dataset.srcD;
      vid.addEventListener('playing', function () { vid.classList.add('is-on'); }, { once: true });
      var p = vid.play();
      if (p && p.catch) p.catch(function () {});
    };
    if (d.readyState === 'complete') setTimeout(startVideo, 300);
    else addEventListener('load', function () { setTimeout(startVideo, 300); });
  }

  if (hasGsap && motion && !isMobile()) {
    gsap.to('.hero__in', { yPercent: 18, opacity: 0.15, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } });
    gsap.to('.hero__media', { scale: 1.08, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } });
  }

  /* ---------- Quick form in hero ---------- */
  var quick = $('#quick');
  if (quick) quick.addEventListener('submit', function (e) {
    e.preventDefault();
    pickType($('#quickType').value);
    goTo('#devis');
  });
  function pickType(v) {
    $$('#typeChips input').forEach(function (i) { if (i.value === v) i.checked = true; });
    var f = $('#typeChips').closest('.f'); f.classList.remove('is-err');
  }

  /* ---------- Split headings into words ---------- */
  $$('[data-split]').forEach(function (h) {
    if (!motion) return;
    var i = 0;
    (function walk(node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (n) {
        if (n.nodeType === 3) {
          var frag = d.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(function (part) {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(d.createTextNode(part)); return; }
            var w = d.createElement('span'); w.className = 'w';
            var s = d.createElement('span'); s.style.setProperty('--i', i++); s.textContent = part;
            w.appendChild(s); frag.appendChild(w);
          });
          n.parentNode.replaceChild(frag, n);
        } else if (n.nodeType === 1) walk(n);
      });
    })(h);
  });

  /* ---------- Reveal on scroll ---------- */
  var groups = new Map();
  $$('[data-reveal]').forEach(function (el) {
    var p = el.parentElement, n = groups.get(p) || 0;
    el.style.setProperty('--rd', Math.min(n, 6) * 0.08 + 's');
    groups.set(p, n + 1);
  });
  var io = new IntersectionObserver(function (en) {
    en.forEach(function (e) {
      if (!e.isIntersecting) return;
      e.target.classList.add('is-in');
      io.unobserve(e.target);
    });
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.08 });
  $$('[data-reveal],[data-split],.zone__map').forEach(function (el) { io.observe(el); });

  /* ---------- Services: panels change while scrolling ---------- */
  var svImgs = $$('.sv__img'), svPanels = $$('.sv__panel'), svBar = $('#svBar'), svCur = 0;
  function svSet(i) {
    if (i === svCur) return;
    svImgs.forEach(function (f, k) { f.classList.toggle('is-prev', k === svCur); f.classList.toggle('is-on', k === i); });
    svPanels.forEach(function (pn, k) { pn.classList.toggle('is-on', k === i); });
    svBar.parentNode.style.setProperty('--sv', ((i + 1) / svPanels.length).toFixed(3));
    svCur = i;
  }
  if (svPanels.length) {
    svBar.parentNode.style.setProperty('--sv', (1 / svPanels.length).toFixed(3));
    var svIO = null;
    var svObserve = function () {
      if (svIO) svIO.disconnect();
      // the trigger line sits in the middle of the free space (below the sticky photo on phones)
      var m = innerWidth <= 900 ? '-66% 0px -32% 0px' : '-48% 0px -50% 0px';
      svIO = new IntersectionObserver(function (en) {
        en.forEach(function (e) { if (e.isIntersecting) svSet(+e.target.dataset.i); });
      }, { rootMargin: m });
      svPanels.forEach(function (pn) { svIO.observe(pn); });
    };
    svObserve();
    addEventListener('resize', function () { if (innerWidth !== lastW2) { lastW2 = innerWidth; svObserve(); applyLimit(); } });
  }
  var lastW2 = innerWidth;
  $$('.sv__cta').forEach(function (a) { a.addEventListener('click', function () { pickType(a.dataset.type); }); });

  /* ---------- Before / after ---------- */
  var frame = $('#baFrame'), handle = $('#baHandle');
  if (frame) {
    var pos = 50, dragging = false;
    var setPos = function (p) {
      pos = Math.max(0, Math.min(100, p));
      frame.style.setProperty('--pos', pos + '%');
      handle.setAttribute('aria-valuenow', Math.round(pos));
      handle.setAttribute('aria-valuetext', Math.round(pos) + ' % avant');
    };
    var fromEvent = function (e) {
      var r = frame.getBoundingClientRect();
      setPos((e.clientX - r.left) / r.width * 100);
    };
    frame.addEventListener('pointerdown', function (e) {
      dragging = true; demoStop(); fromEvent(e);
      if (e.pointerType === 'mouse') frame.setPointerCapture(e.pointerId);
    });
    frame.addEventListener('pointermove', function (e) { if (dragging) fromEvent(e); });
    // touch: horizontal moves drive the slider, vertical moves keep scrolling the page
    var tx = 0, ty = 0, axis = null;
    frame.addEventListener('touchstart', function (e) { tx = e.touches[0].clientX; ty = e.touches[0].clientY; axis = null; }, { passive: true });
    frame.addEventListener('touchmove', function (e) {
      var t = e.touches[0];
      if (!axis) axis = Math.abs(t.clientX - tx) > Math.abs(t.clientY - ty) ? 'x' : 'y';
      if (axis === 'x') { dragging = true; fromEvent(t); }
      else dragging = false;
    }, { passive: true });
    ['pointerup', 'pointercancel', 'touchend'].forEach(function (ev) { frame.addEventListener(ev, function () { dragging = false; }); });
    handle.addEventListener('keydown', function (e) {
      var k = e.key, step = e.shiftKey ? 10 : 4;
      if (k === 'ArrowLeft' || k === 'ArrowDown') { setPos(pos - step); e.preventDefault(); }
      else if (k === 'ArrowRight' || k === 'ArrowUp') { setPos(pos + step); e.preventDefault(); }
      else if (k === 'Home') { setPos(0); e.preventDefault(); }
      else if (k === 'End') { setPos(100); e.preventDefault(); }
      demoStop();
    });

    // one-time demo sweep when the slider comes into view
    var demo = null;
    function demoStop() { if (demo) { demo.kill(); demo = null; } }
    if (motion && hasGsap) {
      ScrollTrigger.create({
        trigger: frame, start: 'top 70%', once: true,
        onEnter: function () {
          var o = { p: 50 };
          demo = gsap.timeline({ onUpdate: function () { setPos(o.p); } })
            .to(o, { p: 82, duration: 1.1, ease: 'power2.inOut' })
            .to(o, { p: 18, duration: 1.4, ease: 'power2.inOut' })
            .to(o, { p: 50, duration: 1, ease: 'power2.inOut' });
        }
      });
    }

    var tabs = $$('.ba__tab'), avant = $('#baAvant'), apres = $('#baApres'), desc = $('#baDesc');
    var select = function (t, focus) {
      tabs.forEach(function (x) { x.setAttribute('aria-selected', x === t ? 'true' : 'false'); x.tabIndex = x === t ? 0 : -1; });
      if (focus) t.focus();
      frame.classList.add('is-swap');
      var a = new Image(), b = new Image(), n = 0;
      var done = function () {
        if (++n < 2) return;
        avant.src = a.src; apres.src = b.src;
        avant.alt = 'Avant les travaux : ' + t.dataset.alt;
        apres.alt = 'Après les travaux : ' + t.dataset.alt;
        desc.textContent = t.dataset.desc;
        demoStop(); setPos(50);
        requestAnimationFrame(function () { frame.classList.remove('is-swap'); });
      };
      a.onload = b.onload = a.onerror = b.onerror = done;
      a.src = t.dataset.avant; b.src = t.dataset.apres;
    };
    tabs.forEach(function (t, i) {
      t.tabIndex = i === 0 ? 0 : -1;
      t.addEventListener('click', function () { select(t); });
      t.addEventListener('keydown', function (e) {
        var j = null;
        if (e.key === 'ArrowDown' || e.key === 'ArrowRight') j = (i + 1) % tabs.length;
        if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') j = (i - 1 + tabs.length) % tabs.length;
        if (j !== null) { e.preventDefault(); select(tabs[j], true); }
      });
    });
  }

  /* ---------- Gallery: reveal, filter (FLIP), lightbox ---------- */
  var items = $$('.g-item');
  var gio = new IntersectionObserver(function (en) {
    en.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-in'); gio.unobserve(e.target); } });
  }, { rootMargin: '0px 0px -6% 0px' });
  items.forEach(function (it) { gio.observe(it); });

  var moreBtn = $('#galMore'), grid = $('#galGrid'), expanded = false;
  function applyLimit() {
    var mobile = isMobile(), lim = mobile ? 5 : 9;
    var cols = getComputedStyle(grid).gridTemplateColumns.split(' ').length;
    var vis = items.filter(function (it) { return !it.classList.contains('is-hidden'); });
    items.forEach(function (it) { it.classList.remove('is-big', 'is-more'); it.style.gridColumn = ''; });
    if (!expanded) vis.slice(lim).forEach(function (it) { it.classList.add('is-more'); });
    var shown = vis.filter(function (it) { return !it.classList.contains('is-more'); });
    if (!shown.length) return;
    shown[0].classList.add('is-big');
    // cells used: big tile = 4 (2x2) on desktop, 2 (full row) on phone
    var cells = shown.length - 1 + (mobile ? 2 : 4), rest = cells % cols;
    if (rest) shown[shown.length - 1].style.gridColumn = 'span ' + (cols - rest + 1);
    moreBtn.hidden = expanded || vis.length <= lim;
  }
  applyLimit();
  moreBtn.addEventListener('click', function () {
    expanded = true; applyLimit();
    items.forEach(function (it) { it.classList.add('is-in'); });
    if (hasGsap) ScrollTrigger.refresh();
  });

  $$('.gal__filters .chip').forEach(function (chip) {
    chip.addEventListener('click', function () {
      var f = chip.dataset.filter;
      $$('.gal__filters .chip').forEach(function (c) { var on = c === chip; c.classList.toggle('is-on', on); c.setAttribute('aria-pressed', on); });
      expanded = false;
      items.forEach(function (it) { it.classList.toggle('is-hidden', f !== 'all' && it.dataset.cat !== f); });
      if (motion) grid.animate([{ opacity: 0, transform: 'translateY(14px)' }, { opacity: 1, transform: 'none' }], { duration: 600, easing: 'cubic-bezier(.16,1,.3,1)' });
      applyLimit();
      items.forEach(function (it) { it.classList.add('is-in'); });
      if (hasGsap) ScrollTrigger.refresh();
    });
  });

  var lb = $('#lb'), lbImg = $('#lbImg'), lbCap = $('#lbCap'), cur = 0, list = [];
  function show(i) {
    cur = (i + list.length) % list.length;
    var b = list[cur];
    lbImg.src = b.dataset.full; lbImg.width = b.dataset.w; lbImg.height = b.dataset.h;
    lbImg.alt = $('img', b).alt; lbCap.textContent = b.dataset.cap;
    lb.classList.remove('is-in'); void lb.offsetWidth; lb.classList.add('is-in');
  }
  $$('.g-btn').forEach(function (b) {
    b.addEventListener('click', function () {
      list = $$('.g-item:not(.is-hidden):not(.is-more) .g-btn');
      show(list.indexOf(b));
      if (lb.showModal) lb.showModal(); else lb.setAttribute('open', '');
      if (lenis) lenis.stop();
    });
  });
  lb.addEventListener('close', function () { if (lenis) lenis.start(); });
  $('.lb__close').addEventListener('click', function () { lb.close(); });
  $('.lb__prev').addEventListener('click', function () { show(cur - 1); });
  $('.lb__next').addEventListener('click', function () { show(cur + 1); });
  lb.addEventListener('click', function (e) { if (e.target === lb || e.target.classList.contains('lb__fig')) lb.close(); });
  lb.addEventListener('keydown', function (e) { if (e.key === 'ArrowLeft') show(cur - 1); if (e.key === 'ArrowRight') show(cur + 1); });
  var sx = 0;
  lb.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', function (e) { var dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 50) show(cur + (dx < 0 ? 1 : -1)); });

  /* ---------- Phone video (real site video) ---------- */
  var pv = $('.phone__vid'), pb = $('.phone__play'), userPaused = false;
  if (pv) {
    var setBtn = function () {
      var playing = !pv.paused;
      pb.innerHTML = '<svg class="ico" aria-hidden="true"><use href="#i-' + (playing ? 'pause' : 'play') + '"/></svg>';
      pb.setAttribute('aria-label', playing ? 'Mettre la vidéo en pause' : 'Lire la vidéo');
    };
    pv.addEventListener('play', setBtn); pv.addEventListener('pause', setBtn);
    pb.addEventListener('click', function () {
      if (!pv.src) pv.src = pv.dataset.src;
      if (pv.paused) { userPaused = false; pv.play(); } else { userPaused = true; pv.pause(); }
    });
    new IntersectionObserver(function (en) {
      var vis = en[0].isIntersecting;
      if (vis && !userPaused && motion) {
        if (!pv.src) pv.src = pv.dataset.src;
        var p = pv.play(); if (p && p.catch) p.catch(function () {});
      } else if (!vis && !pv.paused) pv.pause();
    }, { threshold: 0.35 }).observe(pv);
    setBtn();
  }

  /* ---------- Snow (résidences) ---------- */
  var cv = $('.res__snow');
  if (cv && motion) {
    var ctx = cv.getContext('2d'), flakes = [], running = false, W = 0, H = 0, dpr = Math.min(2, devicePixelRatio || 1);
    var size = function () {
      W = cv.offsetWidth; H = cv.offsetHeight;
      cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var n = isMobile() ? 40 : 90;
      flakes = [];
      for (var i = 0; i < n; i++) flakes.push({ x: Math.random() * W, y: Math.random() * H, r: Math.random() * 1.8 + 0.6, s: Math.random() * 0.5 + 0.25, w: Math.random() * 6.28 });
    };
    var tick = function () {
      if (!running) return;
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = 'rgba(243,244,241,.75)';
      for (var i = 0; i < flakes.length; i++) {
        var f = flakes[i];
        f.y += f.s; f.w += 0.01; f.x += Math.sin(f.w) * 0.3;
        if (f.y > H + 4) { f.y = -4; f.x = Math.random() * W; }
        ctx.beginPath(); ctx.arc(f.x, f.y, f.r, 0, 6.283); ctx.fill();
      }
      requestAnimationFrame(tick);
    };
    new IntersectionObserver(function (en) {
      if (en[0].isIntersecting) { if (!W || cv.offsetWidth !== W) size(); if (!running) { running = true; tick(); } }
      else running = false;
    }).observe(cv);
  }

  /* ---------- Steps path ---------- */
  var path = $('#stepsPath'), steps = $$('.step');
  if (hasGsap && motion) {
    var mm = gsap.matchMedia();
    mm.add('(min-width: 901px)', function () {
      gsap.set(path, { strokeDasharray: 1, strokeDashoffset: 1 });
      gsap.to(path, {
        strokeDashoffset: 0, ease: 'none',
        scrollTrigger: {
          trigger: '.steps__track', start: 'top 75%', end: 'bottom 55%', scrub: 0.6,
          onUpdate: function (s) { steps.forEach(function (st, i) { st.classList.toggle('is-lit', s.progress >= i / (steps.length - 1) - 0.02); }); }
        }
      });
    });
    mm.add('(max-width: 900px)', function () {
      steps.forEach(function (st) {
        ScrollTrigger.create({
          trigger: st, start: 'top 70%', end: 'bottom 70%',
          onUpdate: function (s) { st.style.setProperty('--p', s.progress.toFixed(3)); st.classList.toggle('is-lit', s.progress > 0); }
        });
      });
    });
  } else {
    steps.forEach(function (st) { st.classList.add('is-lit'); st.style.setProperty('--p', 1); });
  }

  /* ---------- Magnetic buttons (mouse) ---------- */
  if (fine && motion && hasGsap) {
    $$('[data-magnetic]').forEach(function (b) {
      var mx = gsap.quickTo(b, 'x', { duration: 0.5, ease: 'power3' }), my = gsap.quickTo(b, 'y', { duration: 0.5, ease: 'power3' });
      b.addEventListener('mousemove', function (e) {
        var r = b.getBoundingClientRect();
        mx((e.clientX - r.left - r.width / 2) * 0.22); my((e.clientY - r.top - r.height / 2) * 0.3);
      });
      b.addEventListener('mouseleave', function () { mx(0); my(0); });
    });
  }

  /* ---------- Mobile contact bar ---------- */
  var mbar = $('#mbar'), ctas = $('#heroCtas'), pastHero = false, inForm = false;
  var syncBar = function () { mbar.classList.toggle('is-on', pastHero && !inForm); };
  new IntersectionObserver(function (en) {
    var e = en[0];
    pastHero = !e.isIntersecting && e.boundingClientRect.top < 0; syncBar();
  }).observe(ctas);
  new IntersectionObserver(function (en) { inForm = en[0].isIntersecting; syncBar(); }, { rootMargin: '0px 0px -30% 0px' }).observe($('#devisForm'));

  /* ---------- Quote form (demo: nothing is sent) ---------- */
  var form = $('#devisForm'), ok = $('#formOk'), body = $('.form__body', form);
  var fieldOf = function (el) { return el.closest('.f'); };
  var err = function (el, bad) { var f = fieldOf(el); f.classList.toggle('is-err', bad); var i = $('input,select,textarea', f); if (i && i.type !== 'checkbox') i.setAttribute('aria-invalid', bad ? 'true' : 'false'); return bad; };
  ['nom', 'tel', 'commune', 'email'].forEach(function (id) {
    var el = $('#' + id);
    el.setAttribute('aria-describedby', 'err-' + id);
    el.addEventListener('input', function () { if (fieldOf(el).classList.contains('is-err')) validate(el); });
  });
  $$('#typeChips input').forEach(function (i) { i.addEventListener('change', function () { fieldOf(i).classList.remove('is-err'); }); });
  function validate(el) {
    var v = el.value.trim();
    if (el.id === 'nom' || el.id === 'commune') return !err(el, v.length < 2);
    if (el.id === 'tel') return !err(el, v.replace(/[^\d]/g, '').replace(/^33/, '0').length < 10);
    if (el.id === 'email') return !err(el, v !== '' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v));
    return true;
  }
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var bad = null;
    var typeOk = $$('#typeChips input:checked').length > 0;
    $('#typeChips').closest('.f').classList.toggle('is-err', !typeOk);
    if (!typeOk) bad = $('#typeChips input');
    ['commune', 'nom', 'tel', 'email'].forEach(function (id) { var el = $('#' + id); if (!validate(el) && !bad) bad = el; });
    if (bad) { bad.focus({ preventScroll: true }); goTo(fieldOf(bad)); return; }
    var prenom = $('#nom').value.trim().split(/\s+/)[0];
    $('#okTitle').textContent = 'Merci ' + prenom + ', votre demande est bien partie.';
    body.hidden = true; ok.hidden = false;
    ok.focus({ preventScroll: true });
    goTo(form);
  });
  $('#formAgain').addEventListener('click', function () {
    form.reset(); ok.hidden = true; body.hidden = false;
    // re-trigger the check animation next time
    var c = $('.form__check', ok), clone = c.cloneNode(true); c.parentNode.replaceChild(clone, c);
  });

  addEventListener('load', function () { if (hasGsap) ScrollTrigger.refresh(); });
})();

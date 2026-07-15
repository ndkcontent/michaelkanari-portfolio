document.addEventListener('DOMContentLoaded', () => {
  

  /* ── Mobile nav toggle ──────────────────── */
  const toggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (toggle && navLinks) {
    toggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      const spans = toggle.querySelectorAll('span');
      const isOpen = navLinks.classList.contains('open');
      spans[0].style.transform = isOpen ? 'rotate(45deg) translate(4px,4px)' : '';
      spans[1].style.opacity  = isOpen ? '0' : '1';
      spans[2].style.transform = isOpen ? 'rotate(-45deg) translate(4px,-4px)' : '';
    });
    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        navLinks.classList.remove('open');
        toggle.querySelectorAll('span').forEach(s => { s.style.transform=''; s.style.opacity='1'; });
      });
    });
  }

  /* ── Home: expand/collapse details ──────────── */
  const aboutToggle = document.getElementById('aboutToggle');
  const aboutDetails = document.getElementById('aboutDetails');
  if (aboutToggle && aboutDetails) {
    const toggleLabel = aboutToggle.querySelector('.about-toggle-label');
    aboutToggle.addEventListener('click', () => {
      const isOpen = aboutDetails.classList.toggle('open');
      aboutToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      toggleLabel.textContent = isOpen ? 'Collapse' : 'Expand';
    });
  }

  /* ── Lightbox (People + Films) ─────────────── */
  function initLightbox(items, type) {
    if (!items.length) return;

    const lightbox = document.getElementById('lightbox');
    const content = document.getElementById('lightboxContent');
    const closeBtn = lightbox.querySelector('.lightbox-close');
    const prevBtn = lightbox.querySelector('.lightbox-prev');
    const nextBtn = lightbox.querySelector('.lightbox-next');

    let currentIndex = 0;

    function stopCurrentVideo() {
      const existingVideo = content.querySelector('video');
      if (existingVideo) {
        existingVideo.pause();
        existingVideo.removeAttribute('src');
        existingVideo.load();
      }
    }

    function renderItem(index) {
      stopCurrentVideo();
      content.innerHTML = '';

      if (type === 'image') {
        const img = document.createElement('img');
        img.src = items[index].getAttribute('src');
        img.alt = items[index].getAttribute('alt') || '';
        img.className = 'lightbox-media';
        content.appendChild(img);
      } else {
        const sourceEl = items[index].querySelector('source');
        const video = document.createElement('video');
        video.className = 'lightbox-media';
        video.setAttribute('controls', '');
        video.setAttribute('playsinline', '');
        video.src = sourceEl ? sourceEl.getAttribute('src') : '';
        video.muted = true;
        content.appendChild(video);
        video.play().catch(() => {});
      }
    }

    function openLightbox(index) {
      currentIndex = index;
      renderItem(currentIndex);
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
      if (type === 'video') items.forEach(v => v.pause());
    }

    function closeLightbox() {
      stopCurrentVideo();
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
      content.innerHTML = '';
      if (type === 'video') items.forEach(v => v.play().catch(() => {}));
    }

    function showNext() {
      currentIndex = (currentIndex + 1) % items.length;
      renderItem(currentIndex);
    }

    function showPrev() {
      currentIndex = (currentIndex - 1 + items.length) % items.length;
      renderItem(currentIndex);
    }

    items.forEach((item, index) => {
      item.addEventListener('click', () => openLightbox(index));
    });

    closeBtn.addEventListener('click', closeLightbox);
    nextBtn.addEventListener('click', showNext);
    prevBtn.addEventListener('click', showPrev);

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('active')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') showNext();
      if (e.key === 'ArrowLeft') showPrev();
    });
  }

  /* ── Films: native controls only on hover/tap ── */
  const isTouchDevice = window.matchMedia('(hover: none)').matches;

  document.querySelectorAll('.film-feature-video, .bts-video').forEach(video => {
    video.controls = false;

    if (!isTouchDevice) {
      video.addEventListener('mouseenter', () => { video.controls = true; });
      video.addEventListener('mouseleave', () => { video.controls = false; });
    } else {
      let hideTimer;
      video.addEventListener('touchstart', () => {
        video.controls = true;
        clearTimeout(hideTimer);
        hideTimer = setTimeout(() => { video.controls = false; }, 3000);
      }, { passive: true });
    }
  });

  const galleryImages = Array.from(document.querySelectorAll('.masonry-grid img'));
  const galleryVideos = Array.from(document.querySelectorAll('.video-col video'));

  initLightbox(galleryImages, 'image');
  initLightbox(galleryVideos, 'video');

  /* ── Cookie banner ───────────────────────────── */
  if (!localStorage.getItem('mk_cookie_consent')) {
    const banner = document.createElement('div');
    banner.className = 'cookie-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-label', 'Cookie consent');
    banner.innerHTML = `
      <p>This site uses cookies to improve your browsing experience.</a></p>
      <div class="cookie-actions">
        <button class="cookie-btn cookie-btn-decline" id="cookieDecline">Decline</button>
        <button class="cookie-btn cookie-btn-accept" id="cookieAccept">Accept</button>
      </div>
    `;
    document.body.appendChild(banner);

    setTimeout(() => banner.classList.add('show'), 1200);

    function hideCookieBanner(choice) {
      localStorage.setItem('mk_cookie_consent', choice);
      banner.classList.remove('show');
      setTimeout(() => banner.remove(), 500);
    }

    document.getElementById('cookieAccept').addEventListener('click', () => hideCookieBanner('accepted'));
    document.getElementById('cookieDecline').addEventListener('click', () => hideCookieBanner('declined'));
  }

});
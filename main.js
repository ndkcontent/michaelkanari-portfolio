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
        video.muted = false;
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

  const galleryImages = Array.from(document.querySelectorAll('.masonry-grid img'));
  const galleryVideos = Array.from(document.querySelectorAll('.video-col video'));

  initLightbox(galleryImages, 'image');
  initLightbox(galleryVideos, 'video');

});
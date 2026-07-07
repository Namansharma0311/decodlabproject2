/**
 * main.js
 * ------------------------------------------------------
 * Far & Few AI — Frontend Application Logic
 * Handles: loading screen, smooth scroll (Lenis), Three.js
 * ambient background, GSAP scroll/entry animations, theme
 * toggle, API integration (fetch), forms, toasts, and modal.
 * ------------------------------------------------------
 */

const API_BASE = '/api';

/* ============================================================
   1. UTILITIES
   ============================================================ */

function qs(sel, ctx = document) { return ctx.querySelector(sel); }
function qsa(sel, ctx = document) { return Array.from(ctx.querySelectorAll(sel)); }

function showToast(message, type = 'success') {
  const container = qs('#toast-container');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  container.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('show'));
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 500);
  }, 4200);
}

function setFormResponse(el, message, ok = true) {
  el.textContent = message;
  el.className = `form-response ${ok ? 'ok' : 'err'}`;
}

async function apiRequest(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.message || 'Request failed');
    err.errors = data.errors || [];
    err.status = res.status;
    throw err;
  }
  return data;
}

/* ============================================================
   2. LOADING SCREEN
   ============================================================ */

function initLoader() {
  const loader = qs('#loader');
  const bar = qs('.loader-bar span');
  if (window.gsap) {
    gsap.to(bar, { width: '100%', duration: 1.4, ease: 'power2.inOut' });
  } else {
    bar.style.width = '100%';
  }
  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('hidden');
      document.body.style.overflow = '';
      playHeroEntry();
    }, 900);
  });
}

/* ============================================================
   3. LENIS SMOOTH SCROLL
   ============================================================ */

function initLenis() {
  if (!window.Lenis) return null;
  const lenis = new Lenis({
    duration: 1.15,
    easing: (t) => 1 - Math.pow(1 - t, 3),
    smoothWheel: true,
  });
  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);
  if (window.ScrollTrigger) {
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);
  }
  return lenis;
}

/* ============================================================
   4. THREE.JS AMBIENT BACKGROUND
   ============================================================ */

function initThreeBackground() {
  if (!window.THREE) return;
  const canvas = qs('#bg-canvas');
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.z = 18;

  const particleCount = 340;
  const positions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 60;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 40;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 40;
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const material = new THREE.PointsMaterial({
    size: 0.09,
    color: 0xc9a24b,
    transparent: true,
    opacity: 0.55,
  });
  const points = new THREE.Points(geometry, material);
  scene.add(points);

  let mouseX = 0, mouseY = 0;
  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  function animate() {
    points.rotation.y += 0.0006;
    points.rotation.x += 0.0002;
    camera.position.x += (mouseX * 1.5 - camera.position.x) * 0.02;
    camera.position.y += (-mouseY * 1.5 - camera.position.y) * 0.02;
    camera.lookAt(scene.position);
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
  animate();

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

/* ============================================================
   5. GSAP ANIMATIONS
   ============================================================ */

function playHeroEntry() {
  if (!window.gsap) return;
  const tl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 1 } });
  tl.to('.hero .reveal', { opacity: 1, y: 0, stagger: 0.12 });
  animateStats();
}

function animateStats() {
  qsa('.stat-num').forEach((el) => {
    const target = Number(el.dataset.count);
    const obj = { val: 0 };
    gsap.to(obj, {
      val: target,
      duration: 2,
      ease: 'power2.out',
      onUpdate: () => { el.textContent = Math.floor(obj.val).toLocaleString(); },
    });
  });
}

function initScrollReveals() {
  if (!window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);

  qsa('.reveal').forEach((el) => {
    if (el.closest('.hero')) return; // handled by hero entry timeline
    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 0.9,
      ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%' },
    });
  });

  // Navbar shrink on scroll
  ScrollTrigger.create({
    start: 'top -60',
    end: 99999,
    toggleClass: { targets: '#navbar', className: 'scrolled' },
  });

  // Parallax cards on scroll
  qsa('.dest-card, .pkg-card, .test-card').forEach((card, i) => {
    gsap.from(card, {
      opacity: 0,
      y: 40,
      duration: 0.8,
      ease: 'power3.out',
      delay: (i % 3) * 0.06,
      scrollTrigger: { trigger: card, start: 'top 92%' },
    });
  });
}

/* ============================================================
   6. THEME TOGGLE
   ============================================================ */

function initThemeToggle() {
  const btn = qs('#theme-toggle');
  const saved = localStorage.getItem('ff-theme');
  if (saved === 'light') document.body.classList.replace('theme-dark', 'theme-light');

  btn.addEventListener('click', () => {
    const isLight = document.body.classList.contains('theme-light');
    document.body.classList.toggle('theme-light', !isLight);
    document.body.classList.toggle('theme-dark', isLight);
    localStorage.setItem('ff-theme', isLight ? 'dark' : 'light');
  });
}

/* ============================================================
   7. MOBILE NAV
   ============================================================ */

function initMobileNav() {
  const burger = qs('#nav-burger');
  const links = qs('.nav-links');
  burger.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    links.style.cssText = open
      ? 'display:flex;flex-direction:column;position:absolute;top:100%;left:0;right:0;background:var(--ink-2);padding:20px 32px;gap:18px;border-bottom:1px solid var(--line);'
      : '';
  });
  qsa('.nav-links a').forEach((a) => a.addEventListener('click', () => {
    links.classList.remove('open');
    links.style.cssText = '';
  }));
}

/* ============================================================
   8. DESTINATIONS — FETCH, RENDER, FILTER
   ============================================================ */

let allDestinations = [];

function destinationCardHTML(d) {
  const gradient = `linear-gradient(135deg, hsl(${hashHue(d.name)}, 45%, 30%), hsl(${hashHue(d.name) + 40}, 40%, 16%))`;
  const bg = d.image
    ? `url('${d.image}'), ${gradient}`
    : gradient;
  return `
    <article class="dest-card" data-id="${d.id}">
      <div class="dest-media" style="background-image:${bg}">
        <span class="dest-badge">${d.category}</span>
      </div>
      <div class="dest-body">
        <h3>${d.name}</h3>
        <p class="dest-desc">${d.duration}</p>
        <div class="dest-meta">
          <span class="dest-price">$${d.price.toLocaleString()}</span>
          <span class="dest-rating">★ ${d.rating}</span>
        </div>
      </div>
    </article>
  `;
}

function hashHue(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  return Math.abs(hash) % 360;
}

async function loadDestinations() {
  const grid = qs('#destinations-grid');
  try {
    const { data } = await apiRequest('/destinations');
    allDestinations = data;
    renderDestinations(data);
  } catch (err) {
    grid.innerHTML = `<p class="body-text">Unable to load destinations right now.</p>`;
  }
}

function renderDestinations(list) {
  const grid = qs('#destinations-grid');
  if (!list.length) {
    grid.innerHTML = `<p class="body-text">No destinations match your search.</p>`;
    return;
  }
  grid.innerHTML = list.map(destinationCardHTML).join('');
  qsa('.dest-card', grid).forEach((card) => {
    card.addEventListener('click', () => openDestinationModal(card.dataset.id));
  });
  if (window.gsap && window.ScrollTrigger) {
    gsap.from(qsa('.dest-card', grid), {
      opacity: 0, y: 30, stagger: 0.06, duration: 0.6, ease: 'power2.out',
    });
  }
}

function applyFilters() {
  const search = qs('#filter-search').value.trim();
  const budget = qs('#filter-budget').value;
  const sort = qs('#filter-sort').value;
  const params = new URLSearchParams();
  if (search) params.set('search', search);
  if (budget) params.set('maxBudget', budget);
  if (sort) params.set('sort', sort);

  apiRequest(`/destinations?${params.toString()}`)
    .then(({ data }) => renderDestinations(data))
    .catch(() => showToast('Could not apply filters', 'error'));
}

async function openDestinationModal(id) {
  const overlay = qs('#modal-overlay');
  const modal = qs('#destination-modal');
  try {
    const { data: d } = await apiRequest(`/destination/${id}`);
    modal.innerHTML = `
      <button class="modal-close" id="modal-close">&times;</button>
      ${d.image ? `<img src="${d.image}" alt="${d.name}" style="width:100%;height:220px;object-fit:cover;border-radius:12px;margin-bottom:20px;" />` : ''}
      <p class="eyebrow">${d.category}</p>
      <h2 style="margin-bottom:10px;">${d.name}</h2>
      <p class="body-text">${d.description}</p>
      <div class="dest-meta" style="margin-top:24px;">
        <span class="dest-price">$${d.price.toLocaleString()}</span>
        <span class="dest-rating">★ ${d.rating} · ${d.duration}</span>
      </div>
    `;
    overlay.classList.add('open');
    qs('#modal-close').addEventListener('click', closeModal);
  } catch (err) {
    showToast('Destination not found', 'error');
  }
}

function closeModal() {
  qs('#modal-overlay').classList.remove('open');
}

/* ============================================================
   9. PACKAGES
   ============================================================ */

function packageCardHTML(p) {
  return `
    <div class="pkg-card ${p.popular ? 'popular' : ''}">
      <h3>${p.name}</h3>
      <div class="pkg-price">$${p.price.toLocaleString()}</div>
      <p class="body-text">${p.nights} nights</p>
      <ul class="pkg-list">
        ${p.inclusions.map((i) => `<li>${i}</li>`).join('')}
      </ul>
    </div>
  `;
}

async function loadPackages() {
  const grid = qs('#packages-grid');
  try {
    const { data } = await apiRequest('/packages');
    grid.innerHTML = data.map(packageCardHTML).join('');
  } catch (err) {
    grid.innerHTML = `<p class="body-text">Unable to load packages right now.</p>`;
  }
}

/* ============================================================
   10. TESTIMONIALS
   ============================================================ */

function testimonialCardHTML(t) {
  return `
    <div class="test-card">
      <div class="test-stars">${'★'.repeat(Math.round(t.rating))}${'☆'.repeat(5 - Math.round(t.rating))}</div>
      <p class="test-text">"${t.text}"</p>
      <div class="test-name">${t.name}</div>
      <div class="test-loc">${t.location}</div>
    </div>
  `;
}

async function loadTestimonials() {
  const grid = qs('#testimonials-grid');
  try {
    const { data } = await apiRequest('/testimonials');
    grid.innerHTML = data.map(testimonialCardHTML).join('');
  } catch (err) {
    grid.innerHTML = `<p class="body-text">Unable to load traveler stories right now.</p>`;
  }
}

/* ============================================================
   11. LIVE BOOKING TICKER
   ============================================================ */

const TICKER_NAMES = ['Aarav', 'Emma', 'Liam', 'Sofia', 'Noah', 'Mia', 'Kenji', 'Zara', 'Lucas', 'Ines'];
const TICKER_PLACES = ['Santorini', 'Kyoto', 'Maldives', 'Amalfi Coast', 'Marrakech', 'Swiss Alps'];

function initTicker() {
  const track = qs('#ticker-track');
  const items = Array.from({ length: 14 }, () => {
    const name = TICKER_NAMES[Math.floor(Math.random() * TICKER_NAMES.length)];
    const place = TICKER_PLACES[Math.floor(Math.random() * TICKER_PLACES.length)];
    return `<span><b>${name}</b> just booked ${place}</span>`;
  });
  track.innerHTML = items.concat(items).join(''); // duplicate for seamless loop

  setInterval(() => {
    const name = TICKER_NAMES[Math.floor(Math.random() * TICKER_NAMES.length)];
    const place = TICKER_PLACES[Math.floor(Math.random() * TICKER_PLACES.length)];
    showToast(`${name} just booked a trip to ${place}`, 'success');
  }, 25000);
}

/* ============================================================
   12. FORMS
   ============================================================ */

function initSearchForm() {
  qs('#search-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const dest = qs('#search-destination').value;
    qs('#filter-search').value = dest;
    document.getElementById('destinations').scrollIntoView({ behavior: 'smooth' });
    applyFilters();
  });
}

function initFilterBar() {
  qs('#filter-search').addEventListener('input', debounce(applyFilters, 350));
  qs('#filter-budget').addEventListener('change', applyFilters);
  qs('#filter-sort').addEventListener('change', applyFilters);
}

function debounce(fn, delay) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), delay);
  };
}

function initBookingForm() {
  const form = qs('#booking-form');
  const responseEl = qs('#booking-response');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const payload = {
      destination: qs('#booking-destination').value,
      email: qs('#booking-email').value,
      checkIn: qs('#booking-checkin').value,
      checkOut: qs('#booking-checkout').value,
      persons: Number(qs('#booking-persons').value),
      budget: Number(qs('#booking-budget').value),
    };
    try {
      const { data, message } = await apiRequest('/booking', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      setFormResponse(responseEl, `${message} Booking ID: ${data.id} — confirmation sent to ${data.email}`, true);
      showToast('Booking confirmed!', 'success');
      form.reset();
    } catch (err) {
      const msg = err.errors?.length ? err.errors.map((e) => e.message).join(' ') : err.message;
      setFormResponse(responseEl, msg, false);
      showToast('Booking failed — check the form', 'error');
    }
  });
}

function initContactForm() {
  const form = qs('#contact-form');
  const responseEl = qs('#contact-response');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const payload = {
      name: qs('#contact-name').value,
      email: qs('#contact-email').value,
      phone: qs('#contact-phone').value,
      message: qs('#contact-message').value,
    };
    try {
      const { message } = await apiRequest('/contact', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      setFormResponse(responseEl, message, true);
      showToast('Message sent!', 'success');
      form.reset();
    } catch (err) {
      const msg = err.errors?.length ? err.errors.map((e) => e.message).join(' ') : err.message;
      setFormResponse(responseEl, msg, false);
      showToast('Could not send message', 'error');
    }
  });
}

function initNewsletterForm() {
  const form = qs('#newsletter-form');
  const responseEl = qs('#newsletter-response');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = qs('#newsletter-email').value;
    try {
      const { message } = await apiRequest('/newsletter', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });
      setFormResponse(responseEl, message, true);
      showToast('Subscribed!', 'success');
      form.reset();
    } catch (err) {
      setFormResponse(responseEl, err.message, false);
      showToast(err.message, 'error');
    }
  });
}

function initReviewForm() {
  const form = qs('#review-form');
  const responseEl = qs('#review-response');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const payload = {
      name: qs('#review-name').value,
      rating: Number(qs('#review-rating').value),
      review: qs('#review-text').value,
    };
    try {
      const { message } = await apiRequest('/review', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      setFormResponse(responseEl, message, true);
      showToast('Review submitted — thank you!', 'success');
      form.reset();
    } catch (err) {
      const msg = err.errors?.length ? err.errors.map((e) => e.message).join(' ') : err.message;
      setFormResponse(responseEl, msg, false);
      showToast('Could not submit review', 'error');
    }
  });
}

/* ============================================================
   13. MODAL DISMISS
   ============================================================ */

function initModal() {
  qs('#modal-overlay').addEventListener('click', (e) => {
    if (e.target.id === 'modal-overlay') closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });
}

/* ============================================================
   14. INIT
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  document.body.style.overflow = 'hidden';
  initLoader();
  initLenis();
  initThreeBackground();
  initThemeToggle();
  initMobileNav();
  initSearchForm();
  initFilterBar();
  initBookingForm();
  initContactForm();
  initNewsletterForm();
  initReviewForm();
  initModal();
  initTicker();

  loadDestinations();
  loadPackages();
  loadTestimonials();

  setTimeout(initScrollReveals, 1000);
});

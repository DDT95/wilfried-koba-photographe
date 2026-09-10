document.getElementById('year').textContent = new Date().getFullYear();

// ---- Portfolio manifests (édités à la main selon les fichiers présents dans assets/images/) ----
const PORTFOLIO = {
  'gal-mariage': { count: 27, prefix: 'assets/images/photo-', pad: 2, ext: 'jpg', alt: 'Reportage de mariage' },
  'gal-corporate': { count: 23, prefix: 'assets/images/corporate/corp-', pad: 2, ext: 'jpg', alt: 'Reportage institutionnel et corporate' },
  'gal-evenement': { count: 11, prefix: 'assets/images/evenement/event-', pad: 2, ext: 'jpg', alt: 'Reportage événementiel' },
};

function pad(n, width) {
  return String(n).padStart(width, '0');
}

function buildGalleries() {
  Object.entries(PORTFOLIO).forEach(([id, cfg]) => {
    const el = document.getElementById(id);
    if (!el || cfg.count === 0) return;
    for (let i = 1; i <= cfg.count; i++) {
      const src = `${cfg.prefix}${pad(i, cfg.pad)}.${cfg.ext}`;
      const btn = document.createElement('button');
      btn.className = 'gallery-item';
      btn.dataset.full = src;
      const img = document.createElement('img');
      img.src = src;
      img.alt = cfg.alt;
      img.loading = 'lazy';
      btn.appendChild(img);
      el.appendChild(btn);
    }
  });
}
buildGalleries();

// ---- Header scroll + progress bar ----
const header = document.getElementById('siteHeader');
const progressBar = document.getElementById('progressBar');

function onScroll() {
  header.classList.toggle('scrolled', window.scrollY > 40);
  const doc = document.documentElement;
  const scrollable = doc.scrollHeight - doc.clientHeight;
  const pct = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
  progressBar.style.width = pct + '%';
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// ---- Mobile nav ----
const navToggle = document.getElementById('navToggle');
const mainNav = document.getElementById('mainNav');
navToggle.addEventListener('click', () => {
  const open = mainNav.classList.toggle('open');
  navToggle.classList.toggle('open', open);
  navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
});
mainNav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mainNav.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// ---- Gallery tabs ----
document.querySelectorAll('.gallery-tabs').forEach(wrap => {
  const buttons = wrap.querySelectorAll('.tab-btn');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      wrap.querySelectorAll('[data-portfolio-group]').forEach(g => {
        const match = g.id === btn.dataset.target;
        g.hidden = !match;
        g.classList.toggle('gallery-active', match);
      });
      refreshLightboxTargets();
    });
  });
});

// ---- Lightbox (delegated, works with dynamically built galleries) ----
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
let activeItems = [];
let currentIndex = 0;

function refreshLightboxTargets() {
  activeItems = Array.from(document.querySelectorAll('.gallery:not([hidden]) .gallery-item'));
}
refreshLightboxTargets();

function openLightboxFrom(item) {
  activeItems = Array.from(item.closest('.gallery').querySelectorAll('.gallery-item'));
  currentIndex = activeItems.indexOf(item);
  showCurrent();
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function showCurrent() {
  const item = activeItems[currentIndex];
  if (!item) return;
  lightboxImg.src = item.dataset.full;
  lightboxImg.alt = item.querySelector('img').alt;
}
function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}
function showRelative(delta) {
  if (!activeItems.length) return;
  currentIndex = (currentIndex + delta + activeItems.length) % activeItems.length;
  showCurrent();
}

document.addEventListener('click', (e) => {
  const item = e.target.closest('.gallery-item');
  if (item) openLightboxFrom(item);
});
document.getElementById('lightboxClose').addEventListener('click', closeLightbox);
document.getElementById('lightboxPrev').addEventListener('click', () => showRelative(-1));
document.getElementById('lightboxNext').addEventListener('click', () => showRelative(1));
lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', (e) => {
  if (!lightbox.classList.contains('open')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') showRelative(-1);
  if (e.key === 'ArrowRight') showRelative(1);
});

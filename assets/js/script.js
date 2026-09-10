document.getElementById('year').textContent = new Date().getFullYear();

// ---- Portfolio manifests (édités à la main selon les fichiers présents dans assets/images/) ----
const PORTFOLIO = {
  'gal-mariage':   { count: 30, featuredFrom: 27, prefix: 'assets/images/photo-',           pad: 2, ext: 'jpg', alt: 'Reportage de mariage et portrait de couple' },
  'gal-famille':   { count: 18, prefix: 'assets/images/famille/family-', pad: 2, ext: 'jpg', alt: 'Portrait, baptême et reportage de famille' },
  'gal-corporate': { count: 82, featuredFrom: 44, exclude: [10, 13, 14, 16], prefix: 'assets/images/corporate/corp-', pad: 2, ext: 'jpg', alt: 'Reportage institutionnel et mission de terrain' },
  'gal-evenement': { count: 43, featuredFrom: 28, exclude: [20, 21, 22, 23, 24, 25, 26, 27], prefix: 'assets/images/evenement/event-', pad: 2, ext: 'jpg', alt: 'Scène, spectacle et reportage événementiel' },
  'gal-graphisme': {
    files: [
      'assets/images/graphisme/affiche-fete-musique.jpg',
      'assets/images/graphisme/graphisme-02.jpg',
      'assets/images/graphisme/graphisme-03.jpg',
      'assets/images/graphisme/graphisme-04.jpg',
      'assets/images/graphisme/graphisme-05.jpg',
      'assets/images/graphisme/graphisme-06.jpg',
      'assets/images/graphisme/graphisme-07.jpg',
      'assets/images/graphisme/graphisme-08.jpg',
      'assets/images/graphisme/graphisme-09.jpg',
      'assets/images/graphisme/graphisme-10.jpg',
      'assets/images/graphisme/graphisme-11.jpg',
      'assets/images/graphisme/graphisme-12.jpg',
      'assets/images/graphisme/graphisme-13.jpg',
      'assets/images/graphisme/graphisme-14.jpg'
    ],
    alt: 'Création graphique réalisée par Wilfried Koba'
  },
};

function pad(n, width) {
  return String(n).padStart(width, '0');
}

function buildGalleries() {
  Object.entries(PORTFOLIO).forEach(([id, cfg]) => {
    const el = document.getElementById(id);
    if (!el || cfg.count === 0) return;
    if (cfg.files) {
      cfg.files.forEach(src => {
        const btn = document.createElement('button');
        btn.className = 'gallery-item';
        btn.dataset.full = src;
        const img = document.createElement('img');
        img.src = src;
        img.alt = cfg.alt;
        img.loading = 'lazy';
        btn.appendChild(img);
        el.appendChild(btn);
      });
      return;
    }
    const sequence = Array.from({ length: cfg.count }, (_, index) => index + 1)
      .filter(i => !cfg.exclude?.includes(i));
    if (cfg.featuredFrom) {
      sequence.sort((a, b) => {
        const aFeatured = a >= cfg.featuredFrom;
        const bFeatured = b >= cfg.featuredFrom;
        return aFeatured === bFeatured ? a - b : aFeatured ? -1 : 1;
      });
    }
    sequence.forEach(i => {
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
    });
  });
}
buildGalleries();

// ---- Header scroll ----
const header = document.getElementById('siteHeader');

function onScroll() {
  header.classList.toggle('scrolled', window.scrollY > 40);
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// ---- Mobile nav ----
const burger  = document.getElementById('burger');
const mainNav = document.getElementById('mainNav');

burger.addEventListener('click', () => {
  const open = mainNav.classList.toggle('open');
  burger.classList.toggle('open', open);
  burger.setAttribute('aria-expanded', open ? 'true' : 'false');
  burger.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
  document.body.classList.toggle('menu-open', open);
});
mainNav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mainNav.classList.remove('open');
    burger.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Ouvrir le menu');
    document.body.classList.remove('menu-open');
  });
});

// ---- Portfolio tabs ----
const portTabs = document.querySelector('.port-tabs');
if (portTabs) {
  const tabs = Array.from(portTabs.querySelectorAll('.ptab'));

  function activateTab(tab) {
    tabs.forEach(t => {
      const selected = t === tab;
      t.classList.toggle('active', selected);
      t.setAttribute('aria-selected', String(selected));
      t.tabIndex = selected ? 0 : -1;
    });

    document.querySelectorAll('[data-portfolio-group]').forEach(g => {
      const match = g.id === tab.dataset.target;
      g.hidden = !match;
      g.classList.toggle('active', match);
    });

    document.querySelectorAll('[data-portfolio-copy]').forEach(copy => {
      copy.hidden = copy.dataset.portfolioCopy !== tab.dataset.target;
    });

    refreshLightboxTargets();
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => activateTab(tab));
    tab.addEventListener('keydown', event => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      let nextIndex = index;
      if (event.key === 'ArrowLeft') nextIndex = (index - 1 + tabs.length) % tabs.length;
      if (event.key === 'ArrowRight') nextIndex = (index + 1) % tabs.length;
      if (event.key === 'Home') nextIndex = 0;
      if (event.key === 'End') nextIndex = tabs.length - 1;
      tabs[nextIndex].focus();
      activateTab(tabs[nextIndex]);
    });
  });

  document.querySelectorAll('[data-open-tab]').forEach(button => {
    button.addEventListener('click', () => {
      const targetTab = document.getElementById(button.dataset.openTab);
      if (!targetTab) return;
      activateTab(targetTab);
      targetTab.focus();
    });
  });
}

// ---- Lightbox (delegated, works with dynamically built galleries) ----
const lightbox    = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
let activeItems   = [];
let currentIndex  = 0;

function refreshLightboxTargets() {
  activeItems = Array.from(document.querySelectorAll('.gallery:not([hidden]) .gallery-item'));
}
refreshLightboxTargets();

function openLightboxFrom(item) {
  activeItems  = Array.from(item.closest('.gallery').querySelectorAll('.gallery-item'));
  currentIndex = activeItems.indexOf(item);
  showCurrent();
  lightbox.classList.add('open');
  lightbox.setAttribute('aria-hidden', 'false');
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
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}
function showRelative(delta) {
  if (!activeItems.length) return;
  currentIndex = (currentIndex + delta + activeItems.length) % activeItems.length;
  showCurrent();
}

document.addEventListener('click', e => {
  const item = e.target.closest('.gallery-item');
  if (item) openLightboxFrom(item);
});
document.getElementById('lightboxClose').addEventListener('click', closeLightbox);
document.getElementById('lightboxPrev').addEventListener('click', () => showRelative(-1));
document.getElementById('lightboxNext').addEventListener('click', () => showRelative(1));
lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', e => {
  if (!lightbox.classList.contains('open')) return;
  if (e.key === 'Escape')     closeLightbox();
  if (e.key === 'ArrowLeft')  showRelative(-1);
  if (e.key === 'ArrowRight') showRelative(1);
});

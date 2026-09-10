document.getElementById('year').textContent = new Date().getFullYear();

// ---- Portfolio manifests (édités à la main selon les fichiers présents dans assets/images/) ----
const PORTFOLIO = {
  'gal-mariage': {
    count: 61,
    sequence: [61, 3, 49, 16, 52, 24, 45, 14, 31, 47, 5, 57, 38, 22, 44, 35, 8, 50, 9, 34, 4, 58, 26, 40, 17, 59, 11, 48, 37, 7, 60, 18, 42, 54, 13, 51, 46, 21, 41, 55, 12, 43, 33, 23, 15, 19, 25, 27, 29, 32, 10, 6],
    prefix: 'assets/images/photo-', pad: 2, ext: 'jpg', alt: 'Reportage de mariage et portrait de couple'
  },
  'gal-famille':   { count: 23, prefix: 'assets/images/famille/family-', pad: 2, ext: 'jpg', alt: 'Portrait, baptême et reportage de famille' },
  'gal-corporate': { count: 82, featuredFrom: 44, exclude: [10, 13, 14, 16], prefix: 'assets/images/corporate/corp-', pad: 2, ext: 'jpg', alt: 'Reportage institutionnel et mission de terrain' },
  'gal-evenement': {
    count: 101,
    sequence: [52, 8, 45, 31, 51, 3, 60, 12, 76, 93, 10, 64, 29, 47, 4, 90, 36, 55, 1, 75, 56, 65, 7, 73, 80, 15, 63, 84, 6, 88, 83, 11, 85, 89, 39, 59, 81, 18, 68, 71, 38, 44, 49, 35, 62, 99, 42, 72, 79, 2, 57, 97, 41, 54, 50, 32, 100, 48, 30, 67, 91, 37, 101, 86, 28, 66, 69, 13, 82, 98, 34, 94, 78, 40, 70, 74, 5, 92, 77, 16, 87, 96, 43, 58, 46, 19, 61, 53, 14, 95, 9, 17, 33],
    prefix: 'assets/images/evenement/event-', pad: 2, ext: 'jpg', alt: 'Scène, spectacle et reportage événementiel'
  },
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
    const sequence = cfg.sequence ? [...cfg.sequence] : Array.from({ length: cfg.count }, (_, index) => index + 1)
      .filter(i => !cfg.exclude?.includes(i));
    if (!cfg.sequence && cfg.featuredFrom) {
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

// ---- Contact : ouvre un e-mail prérempli, sans collecte externe ----
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', event => {
    event.preventDefault();
    const data = new FormData(contactForm);
    const request = data.get('demande') || 'Demande de contact';
    const project = data.get('projet') || 'Non précisé';
    const subject = `${request} — Wilfried Koba`;
    const body = [
      `Nom : ${data.get('nom') || ''}`,
      `E-mail : ${data.get('email') || ''}`,
      `Téléphone : ${data.get('telephone') || 'Non renseigné'}`,
      `Demande : ${request}`,
      `Domaine : ${project}`,
      '',
      data.get('message') || ''
    ].join('\n');
    window.location.href = `mailto:koba.wilfried@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });
}

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

import gsap from 'gsap';

const DURATION = 0.45;
const EASE_IN = 'power2.in';
const EASE_OUT = 'power2.out';

let overlay;

function createOverlay() {
  overlay = document.createElement('div');
  overlay.className = 'page-transition';
  document.body.appendChild(overlay);
}

function isInternalLink(anchor) {
  if (anchor.hostname !== location.hostname) return false;
  if (anchor.target === '_blank') return false;
  const href = anchor.getAttribute('href');
  if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return false;
  if (href.endsWith('.pdf')) return false;
  return true;
}

function isCaseStudyUrl(url) {
  return url.includes('/case-study/');
}

function navigateTo(url) {
  const down = isCaseStudyUrl(url);
  sessionStorage.setItem('transition-dir', down ? 'down' : 'up');

  overlay.style.pointerEvents = 'auto';
  gsap.fromTo(
    overlay,
    { y: down ? '-100%' : '100%' },
    {
      y: '0%',
      duration: DURATION,
      ease: EASE_IN,
      onComplete: () => {
        window.location.href = url;
      },
    }
  );
}

function revealPage() {
  const dir = sessionStorage.getItem('transition-dir') || 'up';
  sessionStorage.removeItem('transition-dir');

  gsap.set(overlay, { y: '0%' });
  document.body.style.opacity = '1';

  gsap.to(overlay, {
    y: dir === 'down' ? '100%' : '-100%',
    duration: DURATION,
    ease: EASE_OUT,
    delay: 0.1,
    onComplete: () => {
      overlay.style.pointerEvents = 'none';
    },
  });
}

function interceptLinks() {
  document.addEventListener('click', (e) => {
    const anchor = e.target.closest('a[href]');
    if (!anchor) return;
    if (!isInternalLink(anchor)) return;

    e.preventDefault();
    anchor.classList.add('is-navigating');
    navigateTo(anchor.href);
  });
}

export function initTransition() {
  createOverlay();
  interceptLinks();
  revealPage();
}

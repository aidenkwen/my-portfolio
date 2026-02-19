import gsap from 'gsap';
import { Flip } from 'gsap/Flip';

gsap.registerPlugin(Flip);

export function initBento() {
  const grid = document.querySelector('.bento');
  if (!grid) return;

  const boxes = gsap.utils.toArray('.bento__box');

  // ── Entry animation ──
  gsap.to(boxes, {
    opacity: 1,
    y: 0,
    duration: 0.6,
    stagger: 0.07,
    ease: 'power3.out',
    delay: 0.1,
  });

  // ── Inject close buttons ──
  boxes.forEach((box) => {
    const close = document.createElement('button');
    close.className = 'bento__close';
    close.setAttribute('aria-label', 'Close');
    close.innerHTML = '&times;';
    box.appendChild(close);
  });

  // ── Expand / Contract ──
  grid.addEventListener('click', (e) => {
    const box = e.target.closest('.bento__box');
    if (!box) return;

    const isClose = e.target.closest('.bento__close');
    const isExpanded = box.classList.contains('is-expanded');

    // If clicking close button or clicking an expanded box, contract it
    if (isClose || isExpanded) {
      contract(box);
      return;
    }

    // Contract any currently expanded box first
    const current = grid.querySelector('.bento__box.is-expanded');
    if (current) {
      contract(current, false);
    }

    expand(box);
  });

  // Prevent the resume link from triggering expand
  grid.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', (e) => e.stopPropagation());
  });

  function expand(box) {
    const state = Flip.getState(boxes);
    box.classList.add('is-expanded');
    Flip.from(state, {
      duration: 0.6,
      ease: 'power2.inOut',
      nested: true,
      absolute: true,
      onComplete: () => {
        box.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      },
    });
  }

  function contract(box, animate = true) {
    if (!animate) {
      box.classList.remove('is-expanded');
      return;
    }
    const state = Flip.getState(boxes);
    box.classList.remove('is-expanded');
    Flip.from(state, {
      duration: 0.5,
      ease: 'power2.inOut',
      nested: true,
      absolute: true,
    });
  }
}

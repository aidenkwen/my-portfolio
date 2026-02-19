import { gsap } from 'gsap';
import { Flip } from 'gsap/Flip';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(Flip, ScrollTrigger);

export function initHeroAnimation() {
  const profile = document.querySelector('.hero__profile');
  const items = gsap.utils.toArray('.hero__item');
  const hero = document.querySelector('.hero');
  const navBar = document.querySelector('.nav-bar');
  const navInner = document.querySelector('.nav-bar__inner');
  const labels = gsap.utils.toArray('.hero__brace-label');
  const braces = gsap.utils.toArray('.hero__brace');
  const braceLines = gsap.utils.toArray('.hero__brace-line');
  if (!items.length || !navBar || !navInner || !labels.length) return;

  const originalParents = labels.map((label) => label.parentElement);

  let inNav = false;

  // ── Entry animation ──
  const entryTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  if (profile) {
    entryTl.to(profile, {
      opacity: 1,
      scale: 1,
      duration: 0.6,
      ease: 'back.out(1.4)',
    });
  }

  entryTl.to(items, {
    opacity: 1,
    y: 0,
    duration: 0.7,
    stagger: 0.1,
  }, '-=0.2');

  // ── ScrollTrigger: hero exit (desktop only) ──
  const isMobile = () => window.matchMedia('(max-width: 768px)').matches;

  ScrollTrigger.create({
    trigger: hero,
    start: 'center top',
    onEnter: () => { if (!isMobile()) moveToNav(); },
    onLeaveBack: () => { if (!isMobile()) moveToHero(); },
  });

  function moveToNav() {
    if (inNav) return;
    inNav = true;

    braces.forEach((b) => {
      b.style.minHeight = b.offsetHeight + 'px';
    });

    const state = Flip.getState(labels);
    labels.forEach((label) => navInner.appendChild(label));
    navBar.classList.add('is-visible');

    Flip.from(state, {
      duration: 0.25,
      ease: 'power2.out',
    });

    gsap.to(braceLines, { opacity: 0, duration: 0.2 });
  }

  function moveToHero() {
    if (!inNav) return;
    inNav = false;

    const state = Flip.getState(labels);
    labels.forEach((label, i) => originalParents[i].appendChild(label));
    navBar.classList.remove('is-visible');

    Flip.from(state, {
      duration: 0.25,
      ease: 'power2.out',
      onComplete: () => {
        braces.forEach((b) => { b.style.minHeight = ''; });
      },
    });

    gsap.to(braceLines, { opacity: 1, duration: 0.2 });
  }

  // ── Smooth-scroll on item, label, or brace click ──
  items.forEach((item, i) => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const href = braces[i].getAttribute('href');
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  labels.forEach((label, i) => {
    label.addEventListener('click', () => {
      const href = braces[i].getAttribute('href');
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

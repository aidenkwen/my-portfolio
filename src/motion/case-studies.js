import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initCaseStudiesAnimation() {
  const section = document.querySelector('.case-studies');
  const inner = document.querySelector('.case-studies__inner');
  if (!inner || !section) return;

  // Scroll-scrubbed expansion
  gsap.to(inner, {
    maxWidth: '100%',
    paddingInline: 0,
    borderRadius: 0,
    ease: 'none',
    scrollTrigger: {
      trigger: section,
      start: 'top 50%',
      end: 'top 5%',
      scrub: true,
      invalidateOnRefresh: true,
    },
  });

  // Refresh on resize so values stay correct
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => ScrollTrigger.refresh(), 200);
  });

  // Stagger card entrance
  const cards = inner.querySelectorAll('.case-studies__card');
  gsap.set(cards, { opacity: 0, y: 40 });

  ScrollTrigger.batch(cards, {
    start: 'top 85%',
    onEnter: (batch) =>
      gsap.to(batch, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power3.out',
        stagger: 0.15,
      }),
  });
}

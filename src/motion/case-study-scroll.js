import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initBracketScroll() {
  const svg = document.querySelector('.bracket__svg');
  if (!svg) return;

  const problemCardsContainer = document.querySelector('.problem__cards');
  const solutionCardsContainer = document.querySelector('.solution__cards');
  const problemCards = document.querySelectorAll('.problem__cards .problem__card');
  const solutionCards = document.querySelectorAll('.solution__cards .problem__card');
  const bracket = document.querySelector('.bracket');

  if (problemCards.length < 2 || solutionCards.length < 3) return;

  let lines = [];
  let tl;

  function buildPaths() {
    svg.innerHTML = '';
    if (tl) {
      tl.scrollTrigger?.kill();
      tl.kill();
    }

    const bracketRect = bracket.getBoundingClientRect();
    const bLeft = bracketRect.left;
    const bTop = bracketRect.top;
    const h = bracketRect.height;

    // Problem card bottom-center positions relative to bracket
    const p1Rect = problemCards[0].getBoundingClientRect();
    const p2Rect = problemCards[1].getBoundingClientRect();
    const p1x = p1Rect.left + p1Rect.width / 2 - bLeft;
    const p2x = p2Rect.left + p2Rect.width / 2 - bLeft;
    const p1y = p1Rect.bottom - bTop;
    const p2y = p2Rect.bottom - bTop;

    // Solution card top-center positions relative to bracket
    const s1Rect = solutionCards[0].getBoundingClientRect();
    const s2Rect = solutionCards[1].getBoundingClientRect();
    const s3Rect = solutionCards[2].getBoundingClientRect();
    const s1x = s1Rect.left + s1Rect.width / 2 - bLeft;
    const s2x = s2Rect.left + s2Rect.width / 2 - bLeft;
    const s3x = s3Rect.left + s3Rect.width / 2 - bLeft;
    const s1y = s1Rect.top - bTop;
    const s2y = s2Rect.top - bTop;
    const s3y = s3Rect.top - bTop;

    const midX = bracketRect.width / 2;
    const mergeY = h * 0.25;
    const splitY = h * 0.75;

    // Update SVG viewBox to match bracket dimensions
    svg.setAttribute('viewBox', `0 0 ${bracketRect.width} ${h}`);

    const segments = [
      // Converge: verticals down from problem cards
      { x1: p1x, y1: p1y, x2: p1x, y2: mergeY },
      { x1: p2x, y1: p2y, x2: p2x, y2: mergeY },
      // Converge: horizontals to center
      { x1: p1x, y1: mergeY, x2: midX, y2: mergeY },
      { x1: p2x, y1: mergeY, x2: midX, y2: mergeY },
      // Single vertical down center
      { x1: midX, y1: mergeY, x2: midX, y2: splitY },
      // Diverge: horizontals from center
      { x1: midX, y1: splitY, x2: s1x, y2: splitY },
      { x1: midX, y1: splitY, x2: s2x, y2: splitY },
      { x1: midX, y1: splitY, x2: s3x, y2: splitY },
      // Diverge: verticals down to solution cards
      { x1: s1x, y1: splitY, x2: s1x, y2: s1y },
      { x1: s2x, y1: splitY, x2: s2x, y2: s2y },
      { x1: s3x, y1: splitY, x2: s3x, y2: s3y },
    ];

    lines = segments.map((seg) => {
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', seg.x1);
      line.setAttribute('y1', seg.y1);
      line.setAttribute('x2', seg.x2);
      line.setAttribute('y2', seg.y2);

      const len = Math.sqrt(
        (seg.x2 - seg.x1) ** 2 + (seg.y2 - seg.y1) ** 2
      );
      line.style.strokeDasharray = len;
      line.style.strokeDashoffset = len;

      svg.appendChild(line);
      return { el: line, len };
    });

    tl = gsap.timeline({
      scrollTrigger: {
        trigger: bracket,
        start: 'top 80%',
        end: 'bottom 40%',
        scrub: true,
      },
    });

    // Phase 1: Two verticals down (simultaneous)
    tl.to([lines[0].el, lines[1].el], {
      strokeDashoffset: 0,
      duration: 0.2,
      ease: 'none',
    });

    // Phase 2: Two horizontals converge (simultaneous)
    tl.to([lines[2].el, lines[3].el], {
      strokeDashoffset: 0,
      duration: 0.2,
      ease: 'none',
    });

    // Phase 3: Center vertical down
    tl.to(lines[4].el, {
      strokeDashoffset: 0,
      duration: 0.15,
      ease: 'none',
    });

    // Phase 4: Three horizontals diverge (simultaneous)
    tl.to([lines[5].el, lines[6].el, lines[7].el], {
      strokeDashoffset: 0,
      duration: 0.2,
      ease: 'none',
    });

    // Phase 5: Three verticals down to solution cards (simultaneous)
    tl.to([lines[8].el, lines[9].el, lines[10].el], {
      strokeDashoffset: 0,
      duration: 0.2,
      ease: 'none',
    });
  }

  // Wait a frame for layout to settle
  requestAnimationFrame(() => {
    buildPaths();
  });

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      buildPaths();
      ScrollTrigger.refresh();
    }, 200);
  });
}

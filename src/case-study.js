import './styles/tokens.css';
import './styles/base.css';
import './components/case-study.css';
import './components/transition.css';
import { initTransition } from './motion/transition.js';
import { initBracketScroll, initLandscapeScroll } from './motion/case-study-scroll.js';

function initTimelineLine() {
  const timeline = document.querySelector('.timeline');
  if (!timeline) return;

  const dots = timeline.querySelectorAll('.timeline__dot');
  const line = timeline.querySelector('.timeline__line');
  if (dots.length < 2 || !line) return;

  function position() {
    const timelineRect = timeline.getBoundingClientRect();
    const firstDot = dots[0].getBoundingClientRect();
    const lastDot = dots[dots.length - 1].getBoundingClientRect();

    const top = firstDot.top + firstDot.height / 2 - timelineRect.top;
    const bottom = lastDot.top + lastDot.height / 2 - timelineRect.top;

    line.style.top = top + 'px';
    line.style.height = (bottom - top) + 'px';
  }

  requestAnimationFrame(position);
  window.addEventListener('resize', position);
}

document.addEventListener('DOMContentLoaded', () => {
  initTransition();
  initBracketScroll();
  initLandscapeScroll();
  initTimelineLine();
});

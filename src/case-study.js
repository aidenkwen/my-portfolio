import './styles/tokens.css';
import './styles/base.css';
import './components/case-study.css';
import './components/transition.css';
import { initTransition } from './motion/transition.js';
import { initBracketScroll } from './motion/case-study-scroll.js';

document.addEventListener('DOMContentLoaded', () => {
  initTransition();
  initBracketScroll();
});

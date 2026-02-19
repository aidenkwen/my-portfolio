import './styles/tokens.css';
import './styles/base.css';
import './components/case-study.css';
import './components/transition.css';
import { initTransition } from './motion/transition.js';

document.addEventListener('DOMContentLoaded', () => {
  initTransition();
});

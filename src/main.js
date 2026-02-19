import './styles/tokens.css';
import './styles/base.css';
import './components/hero.css';
import './components/marquee.css';
import './components/transition.css';
import { initHeroAnimation } from './motion/hero.js';
import { initMarquee } from './motion/marquee.js';
import { initSpotify } from './motion/spotify.js';
import { initRive } from './motion/rive.js';
import { initTransition } from './motion/transition.js';

document.addEventListener('DOMContentLoaded', () => {
  initTransition();
  initHeroAnimation();
  initMarquee();
  initSpotify();
  initRive();
});

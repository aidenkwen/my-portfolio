import './styles/tokens.css';
import './styles/base.css';
import './components/hero.css';
import './components/marquee.css';
import { initHeroAnimation } from './motion/hero.js';
import { initMarquee } from './motion/marquee.js';
import { initSpotify } from './motion/spotify.js';
import { initRive } from './motion/rive.js';

document.addEventListener('DOMContentLoaded', () => {
  document.body.style.opacity = '1';
  initHeroAnimation();
  initMarquee();
  initSpotify();
  initRive();
});

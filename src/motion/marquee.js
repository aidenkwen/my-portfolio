import gsap from 'gsap';

export function initMarquee() {
  const track = document.querySelector('.marquee__track');
  if (!track) return;

  // Duplicate children so the loop is seamless
  const items = [...track.children];
  items.forEach((item) => {
    const clone = item.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    track.appendChild(clone);
  });

  // Measure half-width (original items) for seamless loop
  const halfWidth = track.scrollWidth / 2;

  // GSAP-driven infinite scroll
  const speed = { value: 1 };
  let x = 0;

  gsap.ticker.add(() => {
    x -= 1 * speed.value;
    if (x <= -halfWidth) x += halfWidth;
    gsap.set(track, { x });
  });

  // Smooth slow-down on hover
  track.addEventListener('mouseenter', () => {
    gsap.to(speed, { value: 0, duration: 0.4, ease: 'power2.out' });
  });

  track.addEventListener('mouseleave', () => {
    gsap.to(speed, { value: 1, duration: 0.4, ease: 'power2.out' });
  });

  // Cursor label
  const label = document.createElement('div');
  label.classList.add('marquee__label');
  document.body.appendChild(label);

  track.addEventListener('mousemove', (e) => {
    const img = e.target.closest('.marquee__img');
    if (!img) {
      label.style.opacity = '0';
      return;
    }
    label.innerHTML = img.dataset.label || img.alt;
    label.style.opacity = '1';
    label.style.left = `${e.clientX + 12}px`;
    label.style.top = `${e.clientY + 12}px`;
  });

  track.addEventListener('mouseleave', () => {
    label.style.opacity = '0';
  });
}

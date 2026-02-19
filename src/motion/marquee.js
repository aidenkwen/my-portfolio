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

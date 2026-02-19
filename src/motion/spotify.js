export function initSpotify() {
  const el = document.getElementById('spotify');
  const artEl = document.getElementById('vinyl-art');
  const titleEl = document.getElementById('spotify-title');
  const artistEl = document.getElementById('spotify-artist');
  const linkEl = el?.querySelector('.vinyl__link');
  if (!el || !artEl || !titleEl || !artistEl) return;

  async function fetchNowPlaying() {
    try {
      const res = await fetch('/api/now-playing');
      const data = await res.json();

      if (data.title) {
        titleEl.textContent = data.title;
        artistEl.textContent = data.artist;
        artEl.href.baseVal = data.albumArt || '';
        if (linkEl) linkEl.href = data.url || '#';
        el.classList.toggle('vinyl--playing', !!data.isPlaying);
      } else {
        titleEl.textContent = 'Not playing';
        artistEl.textContent = '';
        artEl.href.baseVal = '';
        el.classList.remove('vinyl--playing');
      }
    } catch {
      titleEl.textContent = 'Not playing';
      artistEl.textContent = '';
      artEl.href.baseVal = '';
      el.classList.remove('vinyl--playing');
    }
  }

  fetchNowPlaying();
  // Refresh every 10 seconds
  setInterval(fetchNowPlaying, 10000);
}

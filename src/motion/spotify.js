export function initSpotify() {
  const el = document.getElementById('spotify');
  const artEl = document.getElementById('spotify-art');
  const titleEl = document.getElementById('spotify-title');
  const artistEl = document.getElementById('spotify-artist');
  const labelEl = el?.querySelector('.spotify__label');
  if (!el || !artEl || !titleEl || !artistEl) return;

  async function fetchNowPlaying() {
    try {
      const res = await fetch('/api/now-playing');
      const data = await res.json();

      if (data.title) {
        titleEl.textContent = data.title;
        artistEl.textContent = data.artist;
        artEl.src = data.albumArt || '';
        artEl.alt = data.album || '';
        el.href = data.url || '#';
        labelEl.textContent = data.isPlaying ? 'Listening to' : 'Last played';
      } else {
        titleEl.textContent = 'Not playing';
        artistEl.textContent = '';
        artEl.src = '';
        labelEl.textContent = 'Spotify';
      }
    } catch {
      titleEl.textContent = 'Not playing';
      artistEl.textContent = '';
      artEl.src = '';
    }
  }

  fetchNowPlaying();
  // Refresh every 30 seconds
  setInterval(fetchNowPlaying, 30000);
}

export function initSpotify() {
  const el = document.getElementById('spotify');
  const artEl = document.getElementById('vinyl-art');
  const placeholderEl = document.getElementById('vinyl-art-placeholder');
  const tickerEl = document.getElementById('spotify-ticker');
  if (!el || !artEl || !tickerEl) return;

  const defaultText = 'Nothing currently playing';

  function setTicker(text) {
    const segment = text + '\u00a0\u00a0\u2022\u00a0\u00a0';
    // Repeat enough times so the first half fills well beyond the container
    const repeated = segment.repeat(8);
    tickerEl.innerHTML = `<span>${repeated}</span><span>${repeated}</span>`;
  }

  async function fetchNowPlaying() {
    try {
      const res = await fetch('/api/now-playing');
      const data = await res.json();

      if (data.title) {
        const label = data.isPlaying ? 'Now Playing' : 'Last Played';
        setTicker(`${label} \u2022 ${data.title} by ${data.artist}`);
        artEl.href.baseVal = data.albumArt || '';
        if (placeholderEl) placeholderEl.style.display = data.albumArt ? 'none' : '';
        el.href = data.url || '#';
        el.classList.toggle('vinyl--playing', !!data.isPlaying);
      } else {
        setTicker(defaultText);
        artEl.href.baseVal = '';
        if (placeholderEl) placeholderEl.style.display = '';
        el.classList.remove('vinyl--playing');
      }
    } catch {
      setTicker(defaultText);
      artEl.href.baseVal = '';
      if (placeholderEl) placeholderEl.style.display = '';
      el.classList.remove('vinyl--playing');
    }
  }

  fetchNowPlaying();
  setInterval(fetchNowPlaying, 10000);
}

export function initSpotify() {
  const el = document.getElementById('spotify');
  const artEl = document.getElementById('vinyl-art');
  const placeholderEl = document.getElementById('vinyl-art-placeholder');
  const tickerEl = document.getElementById('spotify-ticker');
  const badgeEl = document.getElementById('vinyl-badge');
  if (!el || !artEl || !tickerEl) return;

  const defaultText = 'Nothing currently playing';

  function setTicker(html) {
    const segment = html + '\u00a0\u00a0\u2022\u00a0\u00a0';
    const repeated = segment.repeat(8);
    tickerEl.innerHTML = `<span>${repeated}</span><span>${repeated}</span>`;
  }

  function timeAgo(dateStr) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
  }

  async function fetchNowPlaying() {
    try {
      const res = await fetch('/api/now-playing');
      const data = await res.json();

      if (data.title) {
        const label = data.isPlaying ? 'Now Playing' : 'Last Played';
        const ticker = `<span class="vinyl__ticker-label">${label} \u2022 </span><span class="vinyl__ticker-song">${data.title} by ${data.artist}</span>`;
        setTicker(ticker);
        artEl.href.baseVal = data.albumArt || '';
        if (placeholderEl) placeholderEl.style.display = data.albumArt ? 'none' : '';
        el.href = data.url || '#';
        el.classList.toggle('vinyl--playing', !!data.isPlaying);

        if (badgeEl) {
          if (!data.isPlaying && data.playedAt) {
            badgeEl.textContent = timeAgo(data.playedAt);
            badgeEl.style.display = '';
          } else {
            badgeEl.style.display = 'none';
          }
        }
      } else {
        setTicker(defaultText);
        artEl.href.baseVal = '';
        if (placeholderEl) placeholderEl.style.display = '';
        el.classList.remove('vinyl--playing');
        if (badgeEl) badgeEl.style.display = 'none';
      }
    } catch {
      setTicker(defaultText);
      artEl.href.baseVal = '';
      if (placeholderEl) placeholderEl.style.display = '';
      el.classList.remove('vinyl--playing');
      if (badgeEl) badgeEl.style.display = 'none';
    }
  }

  fetchNowPlaying();
  setInterval(fetchNowPlaying, 10000);
}

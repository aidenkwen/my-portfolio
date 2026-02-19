const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REFRESH_TOKEN = process.env.SPOTIFY_REFRESH_TOKEN;

const TOKEN_URL = 'https://accounts.spotify.com/api/token';
const NOW_PLAYING_URL = 'https://api.spotify.com/v1/me/player/currently-playing';
const RECENTLY_PLAYED_URL = 'https://api.spotify.com/v1/me/player/recently-played?limit=1';

async function getAccessToken() {
  const params = new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: REFRESH_TOKEN,
  });

  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization:
        'Basic ' + Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64'),
    },
    body: params.toString(),
  });

  const data = await res.json();
  if (!data.access_token) {
    throw new Error('Token error: ' + JSON.stringify(data));
  }
  return data.access_token;
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=30, stale-while-revalidate=60');

  try {
    const token = await getAccessToken();

    // Try currently playing first
    const nowRes = await fetch(NOW_PLAYING_URL, {
      headers: { Authorization: 'Bearer ' + token },
    });

    if (nowRes.status === 200) {
      const data = await nowRes.json();
      if (data.is_playing && data.item) {
        return res.json({
          isPlaying: true,
          title: data.item.name,
          artist: data.item.artists.map((a) => a.name).join(', '),
          album: data.item.album.name,
          albumArt: data.item.album.images[1]?.url || data.item.album.images[0]?.url,
          url: data.item.external_urls.spotify,
        });
      }
    }

    // Fall back to recently played
    const recentRes = await fetch(RECENTLY_PLAYED_URL, {
      headers: { Authorization: 'Bearer ' + token },
    });

    if (recentRes.status === 200) {
      const data = await recentRes.json();
      const track = data.items?.[0]?.track;
      if (track) {
        return res.json({
          isPlaying: false,
          title: track.name,
          artist: track.artists.map((a) => a.name).join(', '),
          album: track.album.name,
          albumArt: track.album.images[1]?.url || track.album.images[0]?.url,
          url: track.external_urls.spotify,
        });
      }
    }

    return res.json({ isPlaying: false, title: null });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

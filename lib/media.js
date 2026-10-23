// Classifies a video URL so templates can pick a player: YouTube (click-to-load embed), a hosted file (<video>), or a plain link.
const FILE_RE = /\.(mp4|webm|m4v|mov)(\?.*)?$/i;

export function parseVideo(url) {
  if (!url) return null;
  let u;
  try {
    u = new URL(url, 'https://local.invalid');
  } catch {
    return { kind: 'link', url };
  }
  const host = u.hostname.replace(/^www\./, '');
  let id = null;
  if (host === 'youtu.be') id = u.pathname.slice(1);
  else if (host === 'youtube.com' || host === 'm.youtube.com') {
    id = u.searchParams.get('v') || u.pathname.match(/^\/(?:embed|shorts|live)\/([^/?]+)/)?.[1];
  }
  if (id && /^[\w-]{6,}$/.test(id)) return { kind: 'youtube', id, url: `https://youtu.be/${id}` }; // drops tracking params like ?si=
  if (FILE_RE.test(u.pathname)) return { kind: 'file', url };
  return { kind: 'link', url };
}

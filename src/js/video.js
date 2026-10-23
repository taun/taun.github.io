// Click-to-load YouTube: no third-party iframe (or cookies) until the viewer asks for it.
document.querySelectorAll('.video[data-yt]').forEach((box) => {
  const btn = box.querySelector('.video-play');
  btn?.addEventListener('click', () => {
    const f = document.createElement('iframe');
    f.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(box.dataset.yt)}?autoplay=1&rel=0`;
    f.title = btn.getAttribute('aria-label') || 'Video';
    f.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
    f.allowFullscreen = true;
    box.replaceChildren(f);
  });
});

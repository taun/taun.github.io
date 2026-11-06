// Header search: the icon opens the field. "searching" on <html> shows it (and on the home page hides the view and
// filter controls). Escape clears and closes; leaving it empty closes. Off the home page Enter submits to /?q=…
(() => {
  const root = document.documentElement;
  const form = document.querySelector('.site-header .search');
  const input = form.querySelector('input[name="q"]');
  const toggle = form.querySelector('.search-toggle');
  const open = () => { root.classList.add('searching'); input.focus(); };
  const close = () => root.classList.remove('searching');

  toggle.addEventListener('click', () => {
    if (!root.classList.contains('searching')) open();
    else if (!input.value) close();
    else { form.requestSubmit(); input.focus(); } // the home page cancels the submit and filters live
  });
  input.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    input.value = '';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    close();
    toggle.focus();
  });
  form.addEventListener('focusout', (e) => { if (!form.contains(e.relatedTarget) && !input.value) close(); });

  // view.js may also open it (a query with q=); keep the button's state in step with the class.
  const sync = () => toggle.setAttribute('aria-expanded', root.classList.contains('searching'));
  new MutationObserver(sync).observe(root, { attributes: true, attributeFilter: ['class'] });
  sync();
})();

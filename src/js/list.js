(() => {
  const q = document.getElementById('q');
  const items = [...document.querySelectorAll('#items li')];
  const groups = [...document.querySelectorAll('#items .group')];
  const chips = [...document.querySelectorAll('.filters button')];
  const active = new Set();
  const apply = () => {
    const text = q.value.trim().toLowerCase();
    for (const li of items) {
      const okType = !active.size || active.has(li.dataset.type);
      const okText = !text || li.dataset.text.includes(text);
      li.hidden = !(okType && okText);
    }
    for (const g of groups) g.hidden = !g.querySelector('li:not([hidden])');
  };
  q.addEventListener('input', apply);
  chips.forEach((b) => b.addEventListener('click', () => {
    const t = b.dataset.type;
    active.has(t) ? active.delete(t) : active.add(t);
    b.setAttribute('aria-pressed', active.has(t));
    apply();
  }));
})();

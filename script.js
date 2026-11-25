const search = document.querySelector('#card-search');
const cards = [...document.querySelectorAll('#card-grid .card')];
const status = document.querySelector('#search-status');
const noResults = document.querySelector('#no-results');
const exampleTrigger = document.querySelector('.example-trigger');
const exampleHint = document.querySelector('.example-hint');
const examplePopover = document.querySelector('#bandwidth-example');
let examplePinned = false;

function showExample(show) {
  examplePopover.hidden = !show;
  exampleTrigger.setAttribute('aria-expanded', String(show));
  if (show) {
    examplePopover.style.left = '';
    examplePopover.classList.remove('above', 'centered');
  }
  if (show && window.innerWidth > 580) {
    let bounds = examplePopover.getBoundingClientRect();
    if (bounds.right > window.innerWidth - 16) {
      examplePopover.style.left = `${window.innerWidth - 16 - bounds.right}px`;
    }
    if (bounds.bottom > window.innerHeight - 16) {
      examplePopover.classList.add('above');
      bounds = examplePopover.getBoundingClientRect();
      if (bounds.top < 16) {
        examplePopover.classList.remove('above');
        examplePopover.classList.add('centered');
        examplePopover.style.left = '';
      }
    }
  }
}

exampleHint.addEventListener('pointerenter', (event) => {
  if (event.pointerType === 'mouse') showExample(true);
});
exampleHint.addEventListener('pointerleave', (event) => {
  if (event.pointerType === 'mouse' && !examplePinned && document.activeElement !== exampleTrigger) showExample(false);
});
exampleTrigger.addEventListener('focus', () => showExample(true));
exampleTrigger.addEventListener('blur', () => {
  if (!examplePinned && !exampleHint.matches(':hover')) showExample(false);
});
exampleTrigger.addEventListener('click', () => {
  examplePinned = !examplePinned;
  showExample(examplePinned);
});
document.addEventListener('pointerdown', (event) => {
  if (!exampleHint.contains(event.target)) {
    examplePinned = false;
    showExample(false);
  }
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    examplePinned = false;
    showExample(false);
  }
});

search.addEventListener('input', () => {
  const query = search.value.trim().toLocaleLowerCase();
  let visible = 0;
  for (const card of cards) {
    const matches = card.textContent.toLocaleLowerCase().includes(query);
    card.hidden = !matches;
    if (matches) visible += 1;
  }
  status.textContent = query ? `${visible} of ${cards.length} cards shown` : '';
  noResults.hidden = visible !== 0;
});

// Chapter links must remain usable after the deck has been filtered.
document.addEventListener('click', (event) => {
  const link = event.target.closest('a[href^="#card-"]');
  if (!link) return;
  search.value = '';
  search.dispatchEvent(new Event('input'));
});

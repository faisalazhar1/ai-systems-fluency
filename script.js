const search = document.querySelector('#card-search');
const cards = [...document.querySelectorAll('#card-grid .card')];
const status = document.querySelector('#search-status');
const noResults = document.querySelector('#no-results');
const toggleCards = document.querySelector('#toggle-cards');

function updateToggle() {
  const visible = cards.filter((card) => !card.hidden);
  toggleCards.disabled = visible.length === 0;
  const allOpen = visible.length > 0 && visible.every((card) => card.querySelector('details').open);
  toggleCards.textContent = allOpen ? 'Collapse visible cards' : 'Expand visible cards';
}

toggleCards.hidden = false;
toggleCards.addEventListener('click', () => {
  const visible = cards.filter((card) => !card.hidden);
  const shouldOpen = visible.some((card) => !card.querySelector('details').open);
  for (const card of visible) card.querySelector('details').open = shouldOpen;
  updateToggle();
});
for (const card of cards) card.querySelector('details').addEventListener('toggle', updateToggle);

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
  updateToggle();
});

// Chapter links must remain usable after the deck has been filtered.
document.addEventListener('click', (event) => {
  const link = event.target.closest('a[href^="#card-"]');
  if (!link) return;
  search.value = '';
  search.dispatchEvent(new Event('input'));
});

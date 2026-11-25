const search = document.querySelector('#card-search');
const cards = [...document.querySelectorAll('#card-grid .card')];
const status = document.querySelector('#search-status');
const noResults = document.querySelector('#no-results');
const exampleTrigger = document.querySelector('.example-trigger');

exampleTrigger.addEventListener('click', () => exampleTrigger.focus());

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

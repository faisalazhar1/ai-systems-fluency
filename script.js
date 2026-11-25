const search = document.querySelector('#card-search');
const cards = [...document.querySelectorAll('#card-grid .card')];
const status = document.querySelector('#search-status');
const noResults = document.querySelector('#no-results');
const examples = [...document.querySelectorAll('.example-hint')].map((hint) => ({
  hint,
  trigger: hint.querySelector('.example-trigger'),
  popover: hint.querySelector('.example-popover'),
  pinned: false,
}));

function showExample(example, show) {
  example.popover.hidden = !show;
  example.trigger.setAttribute('aria-expanded', String(show));
  if (show) {
    example.popover.style.left = '';
    example.popover.classList.remove('above', 'centered');
  }
  if (show && window.innerWidth > 580) {
    let bounds = example.popover.getBoundingClientRect();
    if (bounds.right > window.innerWidth - 16) {
      example.popover.style.left = `${window.innerWidth - 16 - bounds.right}px`;
    }
    if (bounds.bottom > window.innerHeight - 16) {
      example.popover.classList.add('above');
      bounds = example.popover.getBoundingClientRect();
      if (bounds.top < 16) {
        example.popover.classList.remove('above');
        example.popover.classList.add('centered');
        example.popover.style.left = '';
      }
    }
  }
}

for (const example of examples) {
  example.hint.addEventListener('pointerenter', (event) => {
    if (event.pointerType === 'mouse') showExample(example, true);
  });
  example.hint.addEventListener('pointerleave', (event) => {
    if (event.pointerType === 'mouse' && !example.pinned && document.activeElement !== example.trigger) {
      showExample(example, false);
    }
  });
  example.trigger.addEventListener('focus', () => showExample(example, true));
  example.trigger.addEventListener('blur', () => {
    if (!example.pinned && !example.hint.matches(':hover')) showExample(example, false);
  });
  example.trigger.addEventListener('click', () => {
    example.pinned = !example.pinned;
    showExample(example, example.pinned);
  });
}

document.addEventListener('pointerdown', (event) => {
  for (const example of examples) {
    if (!example.hint.contains(event.target)) {
      example.pinned = false;
      showExample(example, false);
    }
  }
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    for (const example of examples) {
      example.pinned = false;
      showExample(example, false);
    }
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

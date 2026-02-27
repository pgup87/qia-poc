import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // Universal Editor model fields:
  // Row 0: label (single column)
  // Row 1..N: child items (value-card) — each row has cols: icon | title | description

  const rows = [...block.children];

  const labelRow = rows[0];
  const label = labelRow?.children[0]?.textContent?.trim() || 'Our values';

  const container = document.createElement('div');
  container.className = 'values-container';

  const labelEl = document.createElement('p');
  labelEl.className = 'values-label';
  labelEl.textContent = label;
  if (labelRow?.children[0]) moveInstrumentation(labelRow.children[0], labelEl);

  const grid = document.createElement('div');
  grid.className = 'values-grid';

  // Process value rows
  rows.slice(1).forEach((row) => {
    const card = document.createElement('div');
    card.className = 'values-card';
    moveInstrumentation(row, card);

    const cols = [...row.children];

    // Icon
    const iconCol = cols[0];
    const iconPicture = iconCol?.querySelector('picture');
    if (iconPicture) {
      const iconWrapper = document.createElement('div');
      iconWrapper.className = 'values-card-icon';
      iconWrapper.appendChild(iconPicture);
      card.appendChild(iconWrapper);
    }

    // Title and description
    const textWrapper = document.createElement('div');
    textWrapper.className = 'values-card-text';

    const titleCol = cols[1];
    if (titleCol) {
      const titleEl = document.createElement('h3');
      titleEl.className = 'values-card-title';
      titleEl.textContent = titleCol.textContent.trim();
      moveInstrumentation(titleCol, titleEl);
      textWrapper.appendChild(titleEl);
    }

    const descCol = cols[2];
    if (descCol) {
      const descEl = document.createElement('p');
      descEl.className = 'values-card-desc';
      descEl.textContent = descCol.textContent.trim();
      moveInstrumentation(descCol, descEl);
      textWrapper.appendChild(descEl);
    }

    card.appendChild(textWrapper);
    grid.appendChild(card);
  });

  container.appendChild(labelEl);
  container.appendChild(grid);

  block.textContent = '';
  block.appendChild(container);
}

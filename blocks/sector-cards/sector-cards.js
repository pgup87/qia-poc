import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // Expected authored structure:
  // Row 0: "OUR INVESTMENTS" label | (unused)
  // Row 1: Large heading | Description text
  // Row 2: CTA link text | CTA URL (optional)
  // Row 3..N: Sector image | Sector name | Card size (large/small)

  const rows = [...block.children];

  const labelRow = rows[0];
  const label = labelRow?.children[0]?.textContent?.trim() || '';

  const headingRow = rows[1];
  const heading = headingRow?.children[0]?.innerHTML || '';
  const description = headingRow?.children[1]?.textContent?.trim() || '';

  const ctaRow = rows[2];
  const ctaLink = ctaRow?.querySelector('a');

  // Build header
  const container = document.createElement('div');
  container.className = 'sector-cards-container';

  const header = document.createElement('div');
  header.className = 'sector-cards-header';

  const headerLeft = document.createElement('div');
  headerLeft.className = 'sector-cards-header-left';

  const labelEl = document.createElement('p');
  labelEl.className = 'sector-cards-label';
  labelEl.textContent = label;
  if (labelRow?.children[0]) moveInstrumentation(labelRow.children[0], labelEl);

  const headingEl = document.createElement('div');
  headingEl.className = 'sector-cards-heading';
  headingEl.innerHTML = heading;
  if (headingRow?.children[0]) moveInstrumentation(headingRow.children[0], headingEl);

  headerLeft.appendChild(labelEl);
  headerLeft.appendChild(headingEl);
  header.appendChild(headerLeft);

  // Subheader with description + CTA
  const subheader = document.createElement('div');
  subheader.className = 'sector-cards-subheader';

  const descEl = document.createElement('p');
  descEl.className = 'sector-cards-description';
  descEl.textContent = description;
  if (headingRow?.children[1]) moveInstrumentation(headingRow.children[1], descEl);
  subheader.appendChild(descEl);

  if (ctaLink) {
    const cta = document.createElement('a');
    cta.href = ctaLink.href;
    cta.className = 'button sector-cards-cta';
    cta.innerHTML = `${ctaLink.textContent} <span class="cta-arrow">→</span>`;
    moveInstrumentation(ctaLink, cta);
    subheader.appendChild(cta);
  }

  // Build cards grid
  const grid = document.createElement('div');
  grid.className = 'sector-cards-grid';

  const topRow = document.createElement('div');
  topRow.className = 'sector-cards-row';

  const bottomRow = document.createElement('div');
  bottomRow.className = 'sector-cards-row';

  const sectorRows = rows.slice(3);

  sectorRows.forEach((row, index) => {
    const card = document.createElement('div');
    card.className = 'sector-card';
    moveInstrumentation(row, card);

    const cols = [...row.children];

    // Background image
    const imgCol = cols[0];
    const picture = imgCol?.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        const optimized = createOptimizedPicture(img.src, img.alt, false, [{ width: '1000' }]);
        moveInstrumentation(img, optimized.querySelector('img'));
        const bgWrapper = document.createElement('div');
        bgWrapper.className = 'sector-card-bg';
        bgWrapper.appendChild(optimized);
        card.appendChild(bgWrapper);
      }
    }

    // Overlay
    const overlay = document.createElement('div');
    overlay.className = 'sector-card-overlay';
    card.appendChild(overlay);

    // Sector name
    const nameCol = cols[1];
    if (nameCol) {
      const nameEl = document.createElement('h3');
      nameEl.className = 'sector-card-name';
      nameEl.textContent = nameCol.textContent.trim();
      moveInstrumentation(nameCol, nameEl);
      card.appendChild(nameEl);
    }

    // Card sizing
    const sizeCol = cols[2];
    const size = sizeCol?.textContent?.trim()?.toLowerCase();
    if (size === 'large') {
      card.classList.add('sector-card-large');
    }

    // Place in rows (first 2 in top row, rest in bottom)
    if (index < 2) {
      topRow.appendChild(card);
    } else {
      bottomRow.appendChild(card);
    }
  });

  grid.appendChild(topRow);
  if (bottomRow.children.length > 0) {
    grid.appendChild(bottomRow);
  }

  const headerWrapper = document.createElement('div');
  headerWrapper.className = 'sector-cards-header-wrapper';
  headerWrapper.appendChild(header);
  headerWrapper.appendChild(subheader);

  container.appendChild(headerWrapper);
  container.appendChild(grid);

  block.textContent = '';
  block.appendChild(container);
}

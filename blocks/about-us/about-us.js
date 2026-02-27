import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // Universal Editor model fields (one row per field, single column):
  // Row 0: label
  // Row 1: heading (richtext)
  // Row 2: description (richtext)
  // Row 3: ctaLink
  // Row 4: ctaText

  const rows = [...block.children];

  const labelRow = rows[0];
  const label = labelRow?.children[0]?.textContent?.trim() || '';

  const headingRow = rows[1];
  const heading = headingRow?.children[0]?.innerHTML || '';

  const descRow = rows[2];
  const description = descRow?.children[0]?.innerHTML || '';

  const ctaLinkRow = rows[3];
  const ctaLink = ctaLinkRow?.querySelector('a');

  const ctaTextRow = rows[4];
  const ctaText = ctaTextRow?.children[0]?.textContent?.trim() || 'Discover more';

  // Build the block
  const container = document.createElement('div');
  container.className = 'about-us-container';

  const labelEl = document.createElement('p');
  labelEl.className = 'about-us-label';
  labelEl.textContent = label;
  if (labelRow?.children[0]) moveInstrumentation(labelRow.children[0], labelEl);

  const contentEl = document.createElement('div');
  contentEl.className = 'about-us-content';

  const headingEl = document.createElement('div');
  headingEl.className = 'about-us-heading';
  headingEl.innerHTML = heading;
  if (headingRow?.children[0]) moveInstrumentation(headingRow.children[0], headingEl);

  const rightCol = document.createElement('div');
  rightCol.className = 'about-us-right';

  const descEl = document.createElement('div');
  descEl.className = 'about-us-description';
  descEl.innerHTML = description;
  if (descRow?.children[0]) moveInstrumentation(descRow.children[0], descEl);

  rightCol.appendChild(descEl);

  if (ctaLink) {
    const cta = document.createElement('a');
    cta.href = ctaLink.href;
    cta.className = 'button about-us-cta';
    cta.innerHTML = `${ctaText} <span class="cta-arrow">→</span>`;
    moveInstrumentation(ctaLink, cta);
    rightCol.appendChild(cta);
  }

  contentEl.appendChild(headingEl);
  contentEl.appendChild(rightCol);

  container.appendChild(labelEl);
  container.appendChild(contentEl);

  block.textContent = '';
  block.appendChild(container);
}

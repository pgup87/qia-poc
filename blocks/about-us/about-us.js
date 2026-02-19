import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // Expected authored structure:
  // Row 0: Section label (e.g., "ABOUT US") | (unused)
  // Row 1: Large heading | Description text
  // Row 2: CTA link text | CTA URL

  const rows = [...block.children];

  const labelRow = rows[0];
  const label = labelRow?.children[0]?.textContent?.trim() || '';

  const contentRow = rows[1];
  const heading = contentRow?.children[0]?.innerHTML || '';
  const description = contentRow?.children[1]?.innerHTML || '';

  const ctaRow = rows[2];
  const ctaLink = ctaRow?.querySelector('a');

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
  if (contentRow?.children[0]) moveInstrumentation(contentRow.children[0], headingEl);

  const rightCol = document.createElement('div');
  rightCol.className = 'about-us-right';

  const descEl = document.createElement('div');
  descEl.className = 'about-us-description';
  descEl.innerHTML = description;
  if (contentRow?.children[1]) moveInstrumentation(contentRow.children[1], descEl);

  rightCol.appendChild(descEl);

  if (ctaLink) {
    const cta = document.createElement('a');
    cta.href = ctaLink.href;
    cta.className = 'button about-us-cta';
    cta.innerHTML = `${ctaLink.textContent} <span class="cta-arrow">→</span>`;
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

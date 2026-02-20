import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // Expected authored structure:
  // Row 0: "CEO MESSAGE" label | (unused)
  // Row 1: Quote text | CEO Photo
  // Row 2: CEO Name | CEO Title
  // Row 3: CTA link text | CTA URL

  const rows = [...block.children];

  const labelRow = rows[0];
  const label = labelRow?.children[0]?.textContent?.trim() || 'CEO MESSAGE';

  const quoteRow = rows[1];
  const quoteText = quoteRow?.children[0]?.innerHTML || '';
  const photoCol = quoteRow?.children[1];
  const photoPicture = photoCol?.querySelector('picture');

  const nameRow = rows[2];
  const ceoName = nameRow?.children[0]?.textContent?.trim() || '';
  const ceoTitle = nameRow?.children[1]?.textContent?.trim() || '';

  const ctaRow = rows[3];
  const ctaLink = ctaRow?.querySelector('a');

  // Build the block
  const container = document.createElement('div');
  container.className = 'ceo-message-container';

  // Left side - text content
  const leftCol = document.createElement('div');
  leftCol.className = 'ceo-message-text';

  const labelEl = document.createElement('p');
  labelEl.className = 'ceo-message-label';
  labelEl.textContent = label;
  if (labelRow?.children[0]) moveInstrumentation(labelRow.children[0], labelEl);

  const quoteEl = document.createElement('div');
  quoteEl.className = 'ceo-message-quote';
  quoteEl.innerHTML = quoteText;
  if (quoteRow?.children[0]) moveInstrumentation(quoteRow.children[0], quoteEl);

  const attribution = document.createElement('div');
  attribution.className = 'ceo-message-attribution';

  const nameEl = document.createElement('p');
  nameEl.className = 'ceo-message-name';
  nameEl.textContent = ceoName;
  if (nameRow?.children[0]) moveInstrumentation(nameRow.children[0], nameEl);

  const titleEl = document.createElement('p');
  titleEl.className = 'ceo-message-title';
  titleEl.textContent = ceoTitle;
  if (nameRow?.children[1]) moveInstrumentation(nameRow.children[1], titleEl);

  attribution.appendChild(nameEl);
  attribution.appendChild(titleEl);

  const ctaCol = document.createElement('div');
  ctaCol.className = 'ceo-message-left';

  ctaCol.appendChild(labelEl);

  if (ctaLink) {
    const cta = document.createElement('a');
    cta.href = ctaLink.href;
    cta.className = 'button ceo-message-cta';
    cta.innerHTML = `${ctaLink.textContent} <span class="cta-arrow">→</span>`;
    moveInstrumentation(ctaLink, cta);
    ctaCol.appendChild(cta);
  }

  // Right side with quote and photo
  const rightCol = document.createElement('div');
  rightCol.className = 'ceo-message-right';

  const quoteSection = document.createElement('div');
  quoteSection.className = 'ceo-message-quote-section';
  quoteSection.appendChild(quoteEl);
  quoteSection.appendChild(attribution);

  rightCol.appendChild(quoteSection);

  // Photo
  const photoWrapper = document.createElement('div');
  photoWrapper.className = 'ceo-message-photo';
  if (photoPicture) {
    const img = photoPicture.querySelector('img');
    if (img) {
      const optimized = createOptimizedPicture(img.src, img.alt || ceoName, false, [{ width: '600' }]);
      moveInstrumentation(img, optimized.querySelector('img'));
      photoWrapper.appendChild(optimized);
    }
  }

  container.appendChild(ctaCol);
  container.appendChild(rightCol);
  container.appendChild(photoWrapper);

  block.textContent = '';
  block.appendChild(container);
}

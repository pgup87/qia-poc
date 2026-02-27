import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // Universal Editor model fields produce one row per field:
  // Row 0: label (Section Label)
  // Row 1: quote (Quote Text - richtext)
  // Row 2: photo (CEO Photo - reference/picture)
  // Row 3: ceoName (CEO Name)
  // Row 4: ceoTitle (CEO Title)
  // Row 5: ctaLink (CTA Link)
  // Row 6: ctaText (CTA Text)

  const rows = [...block.children];

  const labelRow = rows[0];
  const label = labelRow?.children[0]?.textContent?.trim() || 'CEO MESSAGE';

  const quoteRow = rows[1];
  const quoteText = quoteRow?.children[0]?.innerHTML || '';

  const photoRow = rows[2];
  const photoPicture = photoRow?.querySelector('picture');

  const nameRow = rows[3];
  const ceoName = nameRow?.children[0]?.textContent?.trim() || '';

  const titleRow = rows[4];
  const ceoTitle = titleRow?.children[0]?.textContent?.trim() || '';

  const ctaLinkRow = rows[5];
  const ctaLink = ctaLinkRow?.querySelector('a');

  const ctaTextRow = rows[6];
  const ctaText = ctaTextRow?.children[0]?.textContent?.trim() || 'Learn more';

  // Build the block
  const container = document.createElement('div');
  container.className = 'ceo-message-container';

  // Left column - label + CTA
  const leftCol = document.createElement('div');
  leftCol.className = 'ceo-message-left';

  const labelEl = document.createElement('p');
  labelEl.className = 'ceo-message-label';
  labelEl.textContent = label;
  if (labelRow?.children[0]) moveInstrumentation(labelRow.children[0], labelEl);
  leftCol.appendChild(labelEl);

  if (ctaLink) {
    const cta = document.createElement('a');
    cta.href = ctaLink.href;
    cta.className = 'button ceo-message-cta';
    cta.innerHTML = `${ctaText} <span class="cta-arrow">→</span>`;
    moveInstrumentation(ctaLink, cta);
    leftCol.appendChild(cta);
  }

  // Right column - quote + attribution
  const rightCol = document.createElement('div');
  rightCol.className = 'ceo-message-right';

  const quoteSection = document.createElement('div');
  quoteSection.className = 'ceo-message-quote-section';

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
  if (titleRow?.children[0]) moveInstrumentation(titleRow.children[0], titleEl);

  attribution.appendChild(nameEl);
  attribution.appendChild(titleEl);

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

  container.appendChild(leftCol);
  container.appendChild(rightCol);
  container.appendChild(photoWrapper);

  block.textContent = '';
  block.appendChild(container);
}

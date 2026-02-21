import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // Universal Editor model fields (one row per field, single column):
  // Row 0: backgroundImage
  // Row 1: tab1Name
  // Row 2: tab2Name
  // Row 3: heading (richtext)
  // Row 4: description (richtext)
  // Row 5: ctaLink
  // Row 6: ctaText
  // Row 7: statValue
  // Row 8: statLabel
  // Row 9: statDescription (richtext)

  const rows = [...block.children];

  const bgRow = rows[0];
  const tab1Name = rows[1]?.children[0]?.textContent?.trim() || 'SUSTAINABILITY';
  const tab2Name = rows[2]?.children[0]?.textContent?.trim() || 'IMPACT';
  const headingRow = rows[3];
  const descRow = rows[4];
  const ctaRow = rows[5];
  const ctaTextVal = rows[6]?.children[0]?.textContent?.trim() || 'Our sustainability roadmap';
  const statValue = rows[7]?.children[0]?.textContent?.trim() || '';
  const statLabel = rows[8]?.children[0]?.textContent?.trim() || '';
  const statDescRow = rows[9];

  // Build block
  const container = document.createElement('div');
  container.className = 'esg-container';

  // Background image
  const bgPicture = bgRow?.querySelector('picture');
  if (bgPicture) {
    const bgImg = bgPicture.querySelector('img');
    if (bgImg) {
      const optimized = createOptimizedPicture(bgImg.src, bgImg.alt || '', false, [{ width: '1920' }]);
      const bgWrapper = document.createElement('div');
      bgWrapper.className = 'esg-bg';
      bgWrapper.appendChild(optimized);
      container.appendChild(bgWrapper);
    }
  }

  // Overlay
  const overlay = document.createElement('div');
  overlay.className = 'esg-overlay';
  container.appendChild(overlay);

  // Content
  const content = document.createElement('div');
  content.className = 'esg-content';

  // Tabs
  const tabs = document.createElement('div');
  tabs.className = 'esg-tabs';
  [tab1Name, tab2Name].forEach((name, i) => {
    if (name) {
      const tab = document.createElement('button');
      tab.className = `esg-tab${i === 0 ? ' active' : ''}`;
      tab.textContent = name;
      tabs.appendChild(tab);
    }
  });
  content.appendChild(tabs);

  // Heading
  if (headingRow) {
    const heading = document.createElement('div');
    heading.className = 'esg-heading';
    heading.innerHTML = headingRow.children[0]?.innerHTML || '';
    moveInstrumentation(headingRow, heading);
    content.appendChild(heading);
  }

  // Description
  if (descRow) {
    const desc = document.createElement('p');
    desc.className = 'esg-description';
    desc.textContent = descRow.children[0]?.textContent?.trim() || '';
    moveInstrumentation(descRow, desc);
    content.appendChild(desc);
  }

  // CTA
  const ctaLink = ctaRow?.querySelector('a');
  if (ctaLink) {
    const cta = document.createElement('a');
    cta.href = ctaLink.href;
    cta.className = 'button esg-cta';
    cta.innerHTML = `${ctaTextVal} <span class="cta-arrow">→</span>`;
    moveInstrumentation(ctaLink, cta);
    content.appendChild(cta);
  }

  container.appendChild(content);

  // Stat card
  if (statValue) {
    const statCard = document.createElement('div');
    statCard.className = 'esg-stat-card';

    const statValueEl = document.createElement('div');
    statValueEl.className = 'esg-stat-value';

    const valueEl = document.createElement('span');
    valueEl.className = 'esg-stat-number';
    valueEl.textContent = statValue;

    const labelEl = document.createElement('span');
    labelEl.className = 'esg-stat-label';
    labelEl.textContent = statLabel;

    statValueEl.appendChild(valueEl);
    statValueEl.appendChild(labelEl);
    statCard.appendChild(statValueEl);

    if (statDescRow) {
      const statDesc = document.createElement('p');
      statDesc.className = 'esg-stat-desc';
      statDesc.textContent = statDescRow.children[0]?.textContent?.trim() || '';
      statCard.appendChild(statDesc);
    }

    container.appendChild(statCard);
  }

  block.textContent = '';
  block.appendChild(container);
}

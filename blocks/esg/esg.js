import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // Expected authored structure:
  // Row 0: Background image
  // Row 1: Tab 1 name | Tab 2 name  (e.g. "SUSTAINABILITY" | "IMPACT")
  // Row 2: Large heading
  // Row 3: Description text
  // Row 4: CTA link
  // Row 5: Stat value (e.g. "50%") | Stat label (e.g. "Zero-carbon") | Stat description

  const rows = [...block.children];

  const bgRow = rows[0];
  const tabRow = rows[1];
  const headingRow = rows[2];
  const descRow = rows[3];
  const ctaRow = rows[4];
  const statRow = rows[5];

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
  if (tabRow) {
    const tabs = document.createElement('div');
    tabs.className = 'esg-tabs';
    const cols = [...tabRow.children];
    cols.forEach((col, i) => {
      const tabName = col.textContent.trim();
      if (tabName) {
        const tab = document.createElement('button');
        tab.className = `esg-tab${i === 0 ? ' active' : ''}`;
        tab.textContent = tabName;
        tabs.appendChild(tab);
      }
    });
    content.appendChild(tabs);
  }

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
    cta.innerHTML = `${ctaLink.textContent} <span class="cta-arrow">→</span>`;
    moveInstrumentation(ctaLink, cta);
    content.appendChild(cta);
  }

  container.appendChild(content);

  // Stat card
  if (statRow) {
    const statCols = [...statRow.children];
    const statCard = document.createElement('div');
    statCard.className = 'esg-stat-card';
    moveInstrumentation(statRow, statCard);

    const statValue = document.createElement('div');
    statValue.className = 'esg-stat-value';

    const valueEl = document.createElement('span');
    valueEl.className = 'esg-stat-number';
    valueEl.textContent = statCols[0]?.textContent?.trim() || '';

    const labelEl = document.createElement('span');
    labelEl.className = 'esg-stat-label';
    labelEl.textContent = statCols[1]?.textContent?.trim() || '';

    statValue.appendChild(valueEl);
    statValue.appendChild(labelEl);
    statCard.appendChild(statValue);

    if (statCols[2]) {
      const statDesc = document.createElement('p');
      statDesc.className = 'esg-stat-desc';
      statDesc.textContent = statCols[2].textContent.trim();
      statCard.appendChild(statDesc);
    }

    container.appendChild(statCard);
  }

  block.textContent = '';
  block.appendChild(container);
}

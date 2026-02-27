import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // Universal Editor model fields (one row per field, single column):
  // Row 0: backgroundImage
  // Row 1: heading (richtext)
  // Row 2: subtitle
  // Row 3: card1Title
  // Row 4: card1Link
  // Row 5: card2Stat
  // Row 6: card2Description

  const rows = [...block.children];

  // Extract background image from first row
  const bgRow = rows[0];
  const bgPicture = bgRow?.querySelector('picture');

  // Extract heading content — each field is its own row
  const heading = rows[1]?.children[0]?.innerHTML || '';
  const subtitle = rows[2]?.children[0]?.textContent?.trim() || '';

  // Extract feature cards — each field is its own row
  const card1Title = rows[3]?.children[0]?.innerHTML || '';
  const card1Link = rows[4]?.children[0]?.innerHTML || '';

  const card2Stat = rows[5]?.children[0]?.innerHTML || '';
  const card2Desc = rows[6]?.children[0]?.innerHTML || '';

  // Build hero DOM
  const hero = document.createElement('div');
  hero.className = 'homepage-hero-container';

  // Background layer
  const bgLayer = document.createElement('div');
  bgLayer.className = 'homepage-hero-bg';
  if (bgPicture) {
    bgLayer.appendChild(bgPicture);
  }

  // Gradient overlay
  const overlay = document.createElement('div');
  overlay.className = 'homepage-hero-overlay';
  bgLayer.appendChild(overlay);

  // Content layer
  const content = document.createElement('div');
  content.className = 'homepage-hero-content';

  const textGroup = document.createElement('div');
  textGroup.className = 'homepage-hero-text';

  const headingEl = document.createElement('div');
  headingEl.className = 'homepage-hero-heading';
  headingEl.innerHTML = `<h1>${heading}</h1>`;
  if (rows[1]?.children[0]) moveInstrumentation(rows[1].children[0], headingEl);

  const subtitleEl = document.createElement('p');
  subtitleEl.className = 'homepage-hero-subtitle';
  subtitleEl.textContent = subtitle;
  if (rows[2]?.children[0]) moveInstrumentation(rows[2].children[0], subtitleEl);

  textGroup.appendChild(headingEl);
  textGroup.appendChild(subtitleEl);
  content.appendChild(textGroup);

  // Feature cards
  const cardsContainer = document.createElement('div');
  cardsContainer.className = 'homepage-hero-cards';

  // Card 1 - highlight card with gradient
  if (card1Title) {
    const card1 = document.createElement('div');
    card1.className = 'homepage-hero-card homepage-hero-card-gold';
    if (rows[3]) moveInstrumentation(rows[3], card1);
    card1.innerHTML = `
      <div class="homepage-hero-card-content">
        <div class="homepage-hero-card-title">${card1Title}</div>
        <div class="homepage-hero-card-link">${card1Link}</div>
      </div>
    `;
    cardsContainer.appendChild(card1);
  }

  // Card 2 - stat card
  if (card2Stat) {
    const card2 = document.createElement('div');
    card2.className = 'homepage-hero-card homepage-hero-card-stat';
    if (rows[5]) moveInstrumentation(rows[5], card2);
    card2.innerHTML = `
      <div class="homepage-hero-card-content">
        <div class="homepage-hero-card-stat-value">${card2Stat}</div>
        <div class="homepage-hero-card-stat-desc">${card2Desc}</div>
      </div>
    `;
    cardsContainer.appendChild(card2);
  }

  content.appendChild(cardsContainer);
  hero.appendChild(bgLayer);
  hero.appendChild(content);

  block.textContent = '';
  block.appendChild(hero);
}

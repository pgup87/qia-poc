import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // Expected authored structure:
  // Row 0: Background image | (unused)
  // Row 1: Heading text | Subheading text
  // Row 2: Card 1 title | Card 1 link text
  // Row 3: Card 2 stat | Card 2 description

  const rows = [...block.children];

  // Extract background image from first row
  const bgRow = rows[0];
  const bgPicture = bgRow?.querySelector('picture');

  // Extract heading content
  const headingRow = rows[1];
  const heading = headingRow?.children[0]?.innerHTML || '';
  const subtitle = headingRow?.children[1]?.textContent?.trim() || '';

  // Extract feature cards
  const card1Row = rows[2];
  const card1Title = card1Row?.children[0]?.innerHTML || '';
  const card1Link = card1Row?.children[1]?.innerHTML || '';

  const card2Row = rows[3];
  const card2Stat = card2Row?.children[0]?.innerHTML || '';
  const card2Desc = card2Row?.children[1]?.innerHTML || '';

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
  if (headingRow?.children[0]) moveInstrumentation(headingRow.children[0], headingEl);

  const subtitleEl = document.createElement('p');
  subtitleEl.className = 'homepage-hero-subtitle';
  subtitleEl.textContent = subtitle;
  if (headingRow?.children[1]) moveInstrumentation(headingRow.children[1], subtitleEl);

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
    if (card1Row) moveInstrumentation(card1Row, card1);
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
    if (card2Row) moveInstrumentation(card2Row, card2);
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

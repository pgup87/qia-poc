import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // Expected authored structure:
  // Row 0: label (e.g. "FEATURED HIGHLIGHTS") | heading (e.g. "News & Insights")
  // Row 1: CTA link (view all)
  // Row 2: Featured — category | title | excerpt | tag | read time | image | CTA link
  // Row 3..N: Article — category | title | tag | read time | image

  const rows = [...block.children];

  const headerRow = rows[0];
  const ctaRow = rows[1];
  const featuredRow = rows[2];
  const articleRows = rows.slice(3);

  // Build block
  const container = document.createElement('div');
  container.className = 'news-insights-container';

  // Header
  const header = document.createElement('div');
  header.className = 'news-insights-header';

  const headerLeft = document.createElement('div');
  headerLeft.className = 'news-insights-header-left';

  if (headerRow) {
    const label = document.createElement('p');
    label.className = 'news-insights-label';
    label.textContent = headerRow.children[0]?.textContent?.trim() || '';
    moveInstrumentation(headerRow.children[0], label);
    headerLeft.appendChild(label);

    const heading = document.createElement('h2');
    heading.className = 'news-insights-heading';
    heading.textContent = headerRow.children[1]?.textContent?.trim() || '';
    if (headerRow.children[1]) moveInstrumentation(headerRow.children[1], heading);
    headerLeft.appendChild(heading);
  }

  const headerRight = document.createElement('div');
  headerRight.className = 'news-insights-header-right';

  // Filter dropdown
  const filter = document.createElement('div');
  filter.className = 'news-insights-filter';

  const filterLabel = document.createElement('p');
  filterLabel.className = 'news-insights-filter-label';
  filterLabel.textContent = 'Filter By:';
  filter.appendChild(filterLabel);

  const filterSelect = document.createElement('button');
  filterSelect.className = 'news-insights-filter-select';
  filterSelect.innerHTML = 'News <span class="filter-chevron">▼</span>';
  filter.appendChild(filterSelect);

  headerRight.appendChild(filter);

  const ctaLink = ctaRow?.querySelector('a');
  if (ctaLink) {
    const cta = document.createElement('a');
    cta.href = ctaLink.href;
    cta.className = 'button news-insights-cta';
    cta.innerHTML = `${ctaLink.textContent} <span class="cta-arrow">→</span>`;
    moveInstrumentation(ctaLink, cta);
    headerRight.appendChild(cta);
  }

  header.appendChild(headerLeft);
  header.appendChild(headerRight);
  container.appendChild(header);

  // Divider
  const divider = document.createElement('hr');
  divider.className = 'news-insights-divider';
  container.appendChild(divider);

  // Featured article
  if (featuredRow) {
    const featured = document.createElement('div');
    featured.className = 'news-insights-featured';
    moveInstrumentation(featuredRow, featured);

    const cols = [...featuredRow.children];
    const featuredText = document.createElement('div');
    featuredText.className = 'news-insights-featured-text';

    // Content group (gap-24px)
    const featuredContent = document.createElement('div');
    featuredContent.className = 'news-insights-featured-content';

    // Category
    if (cols[0]) {
      const cat = document.createElement('p');
      cat.className = 'news-insights-category';
      cat.textContent = cols[0].textContent.trim();
      featuredContent.appendChild(cat);
    }

    // Title
    if (cols[1]) {
      const title = document.createElement('h3');
      title.className = 'news-insights-featured-title';
      title.textContent = cols[1].textContent.trim();
      featuredContent.appendChild(title);
    }

    // Excerpt
    if (cols[2]) {
      const excerpt = document.createElement('p');
      excerpt.className = 'news-insights-excerpt';
      excerpt.textContent = cols[2].textContent.trim();
      featuredContent.appendChild(excerpt);
    }

    // Tags + read time
    const meta = document.createElement('div');
    meta.className = 'news-insights-meta';
    if (cols[3]) {
      const tag = document.createElement('span');
      tag.className = 'news-insights-tag';
      tag.textContent = cols[3].textContent.trim();
      meta.appendChild(tag);
    }
    if (cols[4]) {
      const time = document.createElement('span');
      time.className = 'news-insights-time';
      time.textContent = cols[4].textContent.trim();
      meta.appendChild(time);
    }
    featuredContent.appendChild(meta);

    featuredText.appendChild(featuredContent);

    // Featured CTA
    const fctaLink = cols[6]?.querySelector('a');
    if (fctaLink) {
      const fcta = document.createElement('a');
      fcta.href = fctaLink.href;
      fcta.className = 'button news-insights-featured-cta';
      fcta.innerHTML = `${fctaLink.textContent} <span class="cta-arrow">→</span>`;
      featuredText.appendChild(fcta);
    }

    featured.appendChild(featuredText);

    // Featured image
    const imgCol = cols[5];
    const picture = imgCol?.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        const optimized = createOptimizedPicture(img.src, img.alt, false, [{ width: '900' }]);
        moveInstrumentation(img, optimized.querySelector('img'));
        const imgWrapper = document.createElement('div');
        imgWrapper.className = 'news-insights-featured-img';
        imgWrapper.appendChild(optimized);
        featured.appendChild(imgWrapper);
      }
    }

    container.appendChild(featured);
  }

  // Divider
  const divider2 = document.createElement('hr');
  divider2.className = 'news-insights-divider';
  container.appendChild(divider2);

  // Article cards grid
  if (articleRows.length) {
    const grid = document.createElement('div');
    grid.className = 'news-insights-grid';

    articleRows.forEach((row) => {
      const card = document.createElement('div');
      card.className = 'news-insights-card';
      moveInstrumentation(row, card);

      const cols = [...row.children];

      // Text content
      const cardText = document.createElement('div');
      cardText.className = 'news-insights-card-text';

      if (cols[0]) {
        const cat = document.createElement('p');
        cat.className = 'news-insights-category';
        cat.textContent = cols[0].textContent.trim();
        cardText.appendChild(cat);
      }

      if (cols[1]) {
        const title = document.createElement('h4');
        title.className = 'news-insights-card-title';
        title.textContent = cols[1].textContent.trim();
        cardText.appendChild(title);
      }

      const meta = document.createElement('div');
      meta.className = 'news-insights-meta';
      if (cols[2]) {
        const tag = document.createElement('span');
        tag.className = 'news-insights-tag';
        tag.textContent = cols[2].textContent.trim();
        meta.appendChild(tag);
      }
      if (cols[3]) {
        const time = document.createElement('span');
        time.className = 'news-insights-time';
        time.textContent = cols[3].textContent.trim();
        meta.appendChild(time);
      }
      cardText.appendChild(meta);
      card.appendChild(cardText);

      // Card image
      const imgCol = cols[4];
      const picture = imgCol?.querySelector('picture');
      if (picture) {
        const img = picture.querySelector('img');
        if (img) {
          const optimized = createOptimizedPicture(img.src, img.alt, false, [{ width: '500' }]);
          moveInstrumentation(img, optimized.querySelector('img'));
          const imgWrapper = document.createElement('div');
          imgWrapper.className = 'news-insights-card-img';
          imgWrapper.appendChild(optimized);
          card.appendChild(imgWrapper);
        }
      }

      grid.appendChild(card);
    });

    container.appendChild(grid);
  }

  block.textContent = '';
  block.appendChild(container);
}

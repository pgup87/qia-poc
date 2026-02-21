import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // Universal Editor model fields (one row per field, single column):
  // Row 0: label
  // Row 1: heading (richtext)
  // Row 2: description (richtext)
  // Row 3: ctaLink
  // Row 4: ctaText
  // Row 5..N: child items (career-tab) — each row has cols: tabName | image | title | logo | description

  const rows = [...block.children];

  const label = rows[0]?.children[0]?.textContent?.trim() || '';
  const heading = rows[1]?.children[0]?.innerHTML || '';
  const description = rows[2]?.children[0]?.textContent?.trim() || '';
  const ctaLink = rows[3]?.querySelector('a');
  const ctaText = rows[4]?.children[0]?.textContent?.trim() || 'Learn more';

  const tabRows = rows.slice(5);

  // Build the block
  const container = document.createElement('div');
  container.className = 'careers-banner-container';

  // Header section
  const header = document.createElement('div');
  header.className = 'careers-banner-header';

  const headerLeft = document.createElement('div');
  headerLeft.className = 'careers-banner-header-left';

  const labelEl = document.createElement('p');
  labelEl.className = 'careers-banner-label';
  labelEl.textContent = label;
  if (rows[0]?.children[0]) moveInstrumentation(rows[0].children[0], labelEl);

  const headingEl = document.createElement('div');
  headingEl.className = 'careers-banner-heading';
  headingEl.innerHTML = heading;
  if (rows[1]?.children[0]) moveInstrumentation(rows[1].children[0], headingEl);

  headerLeft.appendChild(labelEl);
  headerLeft.appendChild(headingEl);

  const headerRight = document.createElement('div');
  headerRight.className = 'careers-banner-header-right';

  const descEl = document.createElement('p');
  descEl.className = 'careers-banner-description';
  descEl.textContent = description;
  if (rows[2]?.children[0]) moveInstrumentation(rows[2].children[0], descEl);
  headerRight.appendChild(descEl);

  if (ctaLink) {
    const cta = document.createElement('a');
    cta.href = ctaLink.href;
    cta.className = 'button careers-banner-cta';
    cta.innerHTML = `${ctaText} <span class="cta-arrow">→</span>`;
    moveInstrumentation(ctaLink, cta);
    headerRight.appendChild(cta);
  }

  header.appendChild(headerLeft);
  header.appendChild(headerRight);
  container.appendChild(header);

  // Tabs + content
  if (tabRows.length) {
    const tabsWrapper = document.createElement('div');
    tabsWrapper.className = 'careers-banner-tabs-wrapper';

    const tabsNav = document.createElement('div');
    tabsNav.className = 'careers-banner-tabs';

    const tabsContent = document.createElement('div');
    tabsContent.className = 'careers-banner-tabs-content';

    tabRows.forEach((row, i) => {
      const cols = [...row.children];
      const tabName = cols[0]?.textContent?.trim() || `Tab ${i + 1}`;

      // Tab button
      const tabBtn = document.createElement('button');
      tabBtn.className = `careers-banner-tab${i === 0 ? ' active' : ''}`;
      tabBtn.textContent = tabName;
      tabBtn.setAttribute('data-tab', i);
      tabsNav.appendChild(tabBtn);

      // Tab panel
      const panel = document.createElement('div');
      panel.className = `careers-banner-panel${i === 0 ? ' active' : ''}`;
      panel.setAttribute('data-panel', i);
      moveInstrumentation(row, panel);

      // Image (col 1)
      const imgCol = cols[1];
      const picture = imgCol?.querySelector('picture');
      if (picture) {
        const img = picture.querySelector('img');
        if (img) {
          const optimized = createOptimizedPicture(img.src, img.alt, false, [{ width: '800' }]);
          moveInstrumentation(img, optimized.querySelector('img'));
          const imgWrapper = document.createElement('div');
          imgWrapper.className = 'careers-banner-panel-img';
          imgWrapper.appendChild(optimized);
          panel.appendChild(imgWrapper);
        }
      }

      // Text content wrapper (gap-40px between content group and CTA)
      const textWrapper = document.createElement('div');
      textWrapper.className = 'careers-banner-panel-text';

      // Content group (gap-24px between title-logo and description)
      const contentGroup = document.createElement('div');
      contentGroup.className = 'careers-banner-panel-content';

      // Title + Logo group (gap-40px)
      const titleLogoGroup = document.createElement('div');
      titleLogoGroup.className = 'careers-banner-panel-title-logo';

      // Title (col 2)
      if (cols[2]) {
        const title = document.createElement('h3');
        title.className = 'careers-banner-panel-title';
        title.textContent = cols[2].textContent.trim();
        titleLogoGroup.appendChild(title);
      }

      // Logo (col 3) — optional image
      const logoCol = cols[3];
      const logoPic = logoCol?.querySelector('picture');
      if (logoPic) {
        const logoImg = logoPic.querySelector('img');
        if (logoImg) {
          const logoOpt = createOptimizedPicture(logoImg.src, logoImg.alt, false, [{ width: '300' }]);
          const logoWrap = document.createElement('div');
          logoWrap.className = 'careers-banner-panel-logo';
          logoWrap.appendChild(logoOpt);
          titleLogoGroup.appendChild(logoWrap);
        }
      }

      contentGroup.appendChild(titleLogoGroup);

      // Description (col 4)
      if (cols[4]) {
        const desc = document.createElement('p');
        desc.className = 'careers-banner-panel-desc';
        desc.textContent = cols[4].textContent.trim();
        contentGroup.appendChild(desc);
      }

      textWrapper.appendChild(contentGroup);

      // CTA (col 5)
      const panelCta = cols[5]?.querySelector('a');
      if (panelCta) {
        const ctaEl = document.createElement('a');
        ctaEl.href = panelCta.href;
        ctaEl.className = 'button careers-banner-panel-cta';
        ctaEl.innerHTML = `${panelCta.textContent} <span class="cta-arrow">→</span>`;
        textWrapper.appendChild(ctaEl);
      }

      panel.appendChild(textWrapper);
      tabsContent.appendChild(panel);
    });

    tabsWrapper.appendChild(tabsNav);
    tabsWrapper.appendChild(tabsContent);
    container.appendChild(tabsWrapper);

    // Tab switching
    tabsNav.addEventListener('click', (e) => {
      const btn = e.target.closest('.careers-banner-tab');
      if (!btn) return;
      const idx = btn.getAttribute('data-tab');
      tabsNav.querySelectorAll('.careers-banner-tab').forEach((t) => t.classList.remove('active'));
      tabsContent.querySelectorAll('.careers-banner-panel').forEach((p) => p.classList.remove('active'));
      btn.classList.add('active');
      tabsContent.querySelector(`[data-panel="${idx}"]`)?.classList.add('active');
    });
  }

  block.textContent = '';
  block.appendChild(container);
}

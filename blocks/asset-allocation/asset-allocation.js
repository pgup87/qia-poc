import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // Expected authored structure:
  // Row 0: label (e.g. "ASSET ALLOCATION")
  // Row 1: heading | description
  // Row 2: Tab 1 name | Tab 2 name  (e.g. "ASSET CLASS RANGES" | "REGIONAL OPERATING RANGES")
  // Row 3..N: asset class rows — name | percentage range | description | active ("true"/"false")
  // Last row: CTA link

  const rows = [...block.children];

  const labelRow = rows[0];
  const label = labelRow?.children[0]?.textContent?.trim() || '';

  const headingRow = rows[1];
  const heading = headingRow?.children[0]?.innerHTML || '';
  const desc = headingRow?.children[1]?.textContent?.trim() || '';

  const tabRow = rows[2];
  const tab1Name = tabRow?.children[0]?.textContent?.trim() || 'ASSET CLASS RANGES';
  const tab2Name = tabRow?.children[1]?.textContent?.trim() || 'REGIONAL OPERATING RANGES';

  // Find CTA (last row with a link)
  let ctaLink = null;
  let assetRows = rows.slice(3);
  const lastRow = assetRows[assetRows.length - 1];
  const lastLink = lastRow?.querySelector('a');
  if (lastLink) {
    ctaLink = lastLink;
    assetRows = assetRows.slice(0, -1);
  }

  // Build layout
  const container = document.createElement('div');
  container.className = 'asset-allocation-container';

  // Left panel
  const leftPanel = document.createElement('div');
  leftPanel.className = 'asset-allocation-left';

  // Text group (label+heading subgroup + description)
  const textGroup = document.createElement('div');
  textGroup.className = 'asset-allocation-text-group';

  const labelHeading = document.createElement('div');
  labelHeading.className = 'asset-allocation-label-heading';

  const labelEl = document.createElement('p');
  labelEl.className = 'asset-allocation-label';
  labelEl.textContent = label;
  if (labelRow?.children[0]) moveInstrumentation(labelRow.children[0], labelEl);

  const headingEl = document.createElement('div');
  headingEl.className = 'asset-allocation-heading';
  headingEl.innerHTML = heading;
  if (headingRow?.children[0]) moveInstrumentation(headingRow.children[0], headingEl);

  labelHeading.appendChild(labelEl);
  labelHeading.appendChild(headingEl);

  const descEl = document.createElement('p');
  descEl.className = 'asset-allocation-desc';
  descEl.textContent = desc;

  textGroup.appendChild(labelHeading);
  textGroup.appendChild(descEl);
  leftPanel.appendChild(textGroup);

  // Tabs
  const tabsContainer = document.createElement('div');
  tabsContainer.className = 'asset-allocation-tabs';

  const tab1 = document.createElement('button');
  tab1.className = 'asset-allocation-tab active';
  tab1.innerHTML = `<span>${tab1Name}</span><span class="tab-arrow">→</span>`;

  const tab2 = document.createElement('button');
  tab2.className = 'asset-allocation-tab';
  tab2.innerHTML = `<span>${tab2Name}</span>`;

  tabsContainer.appendChild(tab1);
  tabsContainer.appendChild(tab2);
  leftPanel.appendChild(tabsContainer);

  // Center-Right wrapper (wheel + KPI grouped per Figma)
  const centerRight = document.createElement('div');
  centerRight.className = 'asset-allocation-center-right';

  // Center - wheel visualization placeholder
  const centerPanel = document.createElement('div');
  centerPanel.className = 'asset-allocation-center';

  // Build wheel with labeled segments
  const wheel = document.createElement('div');
  wheel.className = 'asset-allocation-wheel';

  // Create circle labels around wheel
  const allAssets = assetRows.map((row) => {
    const cols = [...row.children];
    return {
      name: cols[0]?.textContent?.trim() || '',
      range: cols[1]?.textContent?.trim() || '',
      description: cols[2]?.textContent?.trim() || '',
      active: cols[3]?.textContent?.trim()?.toLowerCase() === 'true',
    };
  });

  const wheelInner = document.createElement('div');
  wheelInner.className = 'asset-allocation-wheel-inner';
  wheel.appendChild(wheelInner);

  // Ring of labels
  allAssets.forEach((asset) => {
    const pill = document.createElement('span');
    pill.className = `asset-allocation-pill${asset.active ? ' active' : ''}`;
    pill.textContent = asset.name;
    wheel.appendChild(pill);
  });

  centerPanel.appendChild(wheel);

  // Right panel - KPI card
  const rightPanel = document.createElement('div');
  rightPanel.className = 'asset-allocation-right';

  // Find the active asset for the KPI card
  const activeAsset = allAssets.find((a) => a.active) || allAssets[0];
  if (activeAsset) {
    const kpiCard = document.createElement('div');
    kpiCard.className = 'asset-allocation-kpi';

    const kpiTitle = document.createElement('p');
    kpiTitle.className = 'asset-allocation-kpi-title';
    kpiTitle.textContent = activeAsset.name;

    const kpiRange = document.createElement('p');
    kpiRange.className = 'asset-allocation-kpi-range';
    kpiRange.textContent = activeAsset.range;

    const kpiBar = document.createElement('div');
    kpiBar.className = 'asset-allocation-kpi-bar';
    const kpiBarFill = document.createElement('div');
    kpiBarFill.className = 'asset-allocation-kpi-bar-fill';
    kpiBar.appendChild(kpiBarFill);

    const kpiDesc = document.createElement('p');
    kpiDesc.className = 'asset-allocation-kpi-desc';
    kpiDesc.textContent = activeAsset.description;

    kpiCard.appendChild(kpiTitle);
    kpiCard.appendChild(kpiRange);
    kpiCard.appendChild(kpiBar);
    kpiCard.appendChild(kpiDesc);
    rightPanel.appendChild(kpiCard);
  }

  if (ctaLink) {
    const cta = document.createElement('a');
    cta.href = ctaLink.href;
    cta.className = 'button asset-allocation-cta';
    cta.innerHTML = `${ctaLink.textContent} <span class="cta-arrow">→</span>`;
    rightPanel.appendChild(cta);
  }

  container.appendChild(leftPanel);
  centerRight.appendChild(centerPanel);
  centerRight.appendChild(rightPanel);
  container.appendChild(centerRight);

  block.textContent = '';
  block.appendChild(container);
}

/* eslint-disable no-undef */

/**
 * Map Block — matches the design from revmedclinicaltrials.com/clinical-trials
 *
 * - Default Google Maps styling (terrain, labels, borders)
 * - All native controls: Map/Satellite, fullscreen, Street View, zoom, compass
 * - Custom SVG pin markers (dark teal)
 * - Click-to-open side panel with location details
 * - fitBounds to show all markers, maxZoom 5
 */

/* ── SVG marker as data-URI (teal map-pin style) ──────────────── */
const MARKER_SVG = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 56" width="40" height="56">
    <path d="M20 0C8.954 0 0 8.954 0 20c0 14 20 36 20 36s20-22 20-36C40 8.954 31.046 0 20 0z" fill="#234b43"/>
    <circle cx="20" cy="18" r="8" fill="#fff"/>
  </svg>`,
)}`;

/* ── helpers ────────────────────────────────────────────────────── */

/** Load Google Maps JS API. */
function loadGoogleMaps(apiKey) {
  return new Promise((resolve, reject) => {
    if (window.google?.maps) { resolve(); return; }
    window.initGoogleMap = () => resolve();
    const s = document.createElement('script');
    s.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initGoogleMap&loading=async`;
    s.async = true;
    s.defer = true;
    s.onerror = reject;
    document.head.append(s);
  });
}

/**
 * Parse authored block rows (xwalk: each model field = own row).
 *   Row 0 : apiKey
 *   Row 1 : centerLat
 *   Row 2 : centerLng
 *   Row 3 : zoom
 *   Row 4…N : map-location child items (7 cols each)
 */
function parseBlock(block) {
  const rows = [...block.children];
  if (!rows.length) return { config: {}, locations: [] };

  const val = (i) => rows[i]?.children?.[0]?.textContent?.trim() || '';

  const config = {
    apiKey: val(0),
    centerLat: parseFloat(val(1)) || 25.3548,
    centerLng: parseFloat(val(2)) || 51.1839,
    zoom: parseInt(val(3), 10) || 2,
  };

  const locations = rows.slice(4).map((row) => {
    const cols = [...row.children];
    const img = cols[5]?.querySelector('img');
    const anchor = cols[6]?.querySelector('a');
    return {
      title: cols[0]?.textContent?.trim() || '',
      lat: parseFloat(cols[1]?.textContent?.trim()) || 0,
      lng: parseFloat(cols[2]?.textContent?.trim()) || 0,
      description: cols[3]?.innerHTML || '',
      category: cols[4]?.textContent?.trim() || '',
      image: img?.src || '',
      link: anchor?.href || '',
    };
  });

  return { config, locations };
}

/** Build the side-panel HTML for a clicked marker. */
function buildPanelContent(loc) {
  const imgTag = loc.image
    ? `<img class="map-panel-img" src="${loc.image}" alt="${loc.title}">`
    : '';
  const linkTag = loc.link
    ? `<a class="map-panel-link" href="${loc.link}" target="_blank">\u2192 Learn more</a>`
    : '';
  return `
    ${imgTag}
    <h3 class="map-panel-title">${loc.title}</h3>
    ${loc.category ? `<p class="map-panel-category">${loc.category}</p>` : ''}
    <div class="map-panel-desc">${loc.description}</div>
    ${linkTag}
  `;
}

/* ── main decorate ─────────────────────────────────────────────── */
export default async function decorate(block) {
  const { config, locations } = parseBlock(block);

  /* clear authored markup, build layout */
  block.textContent = '';

  const wrapper = document.createElement('div');
  wrapper.className = 'map-wrapper';

  /* Side panel (hidden by default) */
  const panel = document.createElement('div');
  panel.className = 'map-panel';
  panel.innerHTML = '<div class="map-panel-inner"></div>';
  const panelClose = document.createElement('button');
  panelClose.className = 'map-panel-close';
  panelClose.innerHTML = '&times;';
  panelClose.setAttribute('aria-label', 'Close');
  panel.prepend(panelClose);

  /* Map container */
  const mapContainer = document.createElement('div');
  mapContainer.className = 'map-canvas';

  wrapper.append(panel, mapContainer);
  block.append(wrapper);

  if (!config.apiKey) {
    mapContainer.textContent = 'Google Maps API key is required.';
    return;
  }

  /* load Google Maps */
  try {
    await loadGoogleMaps(config.apiKey);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[Map Block] load error', err);
    mapContainer.textContent = 'Unable to load Google Maps.';
    return;
  }

  /* ── create map (default Google Maps look + all controls) ──── */
  const map = new google.maps.Map(mapContainer, {
    center: { lat: config.centerLat, lng: config.centerLng },
    zoom: config.zoom,
    maxZoom: 5,
    gestureHandling: 'greedy',
    /* Map / Satellite toggle (top-left) */
    mapTypeControl: true,
    mapTypeControlOptions: {
      style: google.maps.MapTypeControlStyle.DEFAULT,
      position: google.maps.ControlPosition.TOP_LEFT,
    },
    /* Fullscreen button (top-right) */
    fullscreenControl: true,
    fullscreenControlOptions: {
      position: google.maps.ControlPosition.TOP_RIGHT,
    },
    /* Zoom +/- (bottom-right) */
    zoomControl: true,
    zoomControlOptions: {
      position: google.maps.ControlPosition.RIGHT_BOTTOM,
    },
    /* Street View pegman (bottom-right) */
    streetViewControl: true,
    streetViewControlOptions: {
      position: google.maps.ControlPosition.RIGHT_BOTTOM,
    },
    /* Camera / compass rotation (bottom-right) */
    rotateControl: true,
    rotateControlOptions: {
      position: google.maps.ControlPosition.RIGHT_BOTTOM,
    },
    scaleControl: true,
  });

  /* ── marker icon ────────────────────────────────────────────── */
  const markerIcon = {
    url: MARKER_SVG,
    scaledSize: new google.maps.Size(36, 50),
    anchor: new google.maps.Point(18, 50),
  };

  const bounds = new google.maps.LatLngBounds();
  let activeInfoWindow = null;

  /* ── Panel show/hide ────────────────────────────────────────── */
  const panelInner = panel.querySelector('.map-panel-inner');

  function showPanel(loc) {
    panelInner.innerHTML = buildPanelContent(loc);
    panel.classList.add('open');
  }
  function hidePanel() {
    panel.classList.remove('open');
  }
  panelClose.addEventListener('click', hidePanel);

  /* ── place location markers ─────────────────────────────────── */
  locations.forEach((loc) => {
    if (!loc.lat || !loc.lng) return;

    const position = { lat: loc.lat, lng: loc.lng };
    bounds.extend(position);

    const marker = new google.maps.Marker({
      position,
      map,
      icon: markerIcon,
      title: loc.title,
    });

    marker.addListener('click', () => {
      /* close previous info window */
      if (activeInfoWindow) activeInfoWindow.close();

      /* center map on marker */
      map.panTo(position);

      /* show side panel */
      showPanel(loc);
    });
  });

  /* ── fit bounds to show all markers ─────────────────────────── */
  if (locations.length) {
    map.fitBounds(bounds);
  }

  /* close panel when clicking map background */
  map.addListener('click', hidePanel);
}

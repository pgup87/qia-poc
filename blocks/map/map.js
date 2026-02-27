/* eslint-disable no-undef */

/* ── Map Styles (original audemarsmapstyles – everything OFF) ── */
const mapStyles = [
  { featureType: 'all', elementType: 'labels', stylers: [{ visibility: 'off' }] },
  { featureType: 'administrative', elementType: 'all', stylers: [{ visibility: 'off' }] },
  { featureType: 'administrative', elementType: 'geometry.fill', stylers: [{ color: '#000000' }] },
  { featureType: 'administrative.country', elementType: 'geometry.stroke', stylers: [{ visibility: 'off' }] },
  { featureType: 'administrative.country', elementType: 'labels', stylers: [{ visibility: 'off' }] },
  { featureType: 'administrative.province', elementType: 'all', stylers: [{ visibility: 'off' }] },
  { featureType: 'administrative.locality', elementType: 'all', stylers: [{ visibility: 'off' }] },
  { featureType: 'administrative.neighborhood', elementType: 'all', stylers: [{ visibility: 'off' }] },
  { featureType: 'landscape', elementType: 'all', stylers: [{ visibility: 'on' }, { color: '#cecece' }] },
  { featureType: 'landscape', elementType: 'geometry.fill', stylers: [{ visibility: 'on' }, { color: '#c6c5c2' }] },
  { featureType: 'landscape', elementType: 'labels', stylers: [{ visibility: 'off' }] },
  { featureType: 'landscape.natural.terrain', elementType: 'geometry.fill', stylers: [{ color: '#b6a9a9' }] },
  { featureType: 'poi', elementType: 'all', stylers: [{ visibility: 'off' }] },
  { featureType: 'road', elementType: 'all', stylers: [{ visibility: 'off' }] },
  { featureType: 'transit', elementType: 'all', stylers: [{ visibility: 'off' }] },
  { featureType: 'water', elementType: 'all', stylers: [{ visibility: 'simplified' }] },
  { featureType: 'water', elementType: 'geometry.fill', stylers: [{ visibility: 'on' }, { color: '#edecea' }] },
  { featureType: 'water', elementType: 'labels', stylers: [{ visibility: 'off' }] },
];

/* ── Continent labels (rendered as invisible-icon markers) ───── */
const CONTINENTS = [
  { name: 'North America', lat: 40, lng: -100 },
  { name: 'Latin America', lat: -15, lng: -60 },
  { name: 'Europe', lat: 50, lng: 10 },
  { name: 'Africa', lat: 0, lng: 20 },
  { name: 'Asia', lat: 30, lng: 100 },
  { name: 'Oceania', lat: -20, lng: 140 },
];

/* 1×1 transparent SVG so marker has no icon, only its label text */
const EMPTY_ICON = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxIiBoZWlnaHQ9IjEiPjwvc3ZnPg==';

/* ── helpers ────────────────────────────────────────────────────── */

/** Load a classic <script> tag and resolve when ready. */
function loadScript(src) {
  return new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = src;
    s.async = true;
    s.onload = resolve;
    s.onerror = reject;
    document.head.append(s);
  });
}

/** Load Google Maps JS API. */
function loadGoogleMaps(apiKey) {
  return new Promise((resolve, reject) => {
    if (window.google?.maps) { resolve(); return; }
    window.initGoogleMap = () => resolve();
    const src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initGoogleMap&loading=async`;
    loadScript(src).catch(reject);
  });
}

/**
 * Parse authored rows (xwalk: each model field = its own row).
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
    zoom: parseInt(val(3), 10) || 3,
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

/** Build InfoBox HTML content for a location. */
function buildInfoContent(loc) {
  const imgTag = loc.image
    ? `<img src="${loc.image}" width="220" height="144">`
    : '';
  const linkTag = loc.link
    ? `<p class="carte_box_link"><a href="${loc.link}">\u2192 See more</a></p>`
    : '';
  return `<div class="myboxmap">
    ${imgTag}
    <p class="carte_box_titre">${loc.title}</p>
    <div class="carte_box_desc">${loc.description}</div>
    ${loc.category ? `<p class="carte_box_categorie">${loc.category}</p>` : ''}
    ${linkTag}
  </div>`;
}

/* ── main decorate ─────────────────────────────────────────────── */
export default async function decorate(block) {
  const { config, locations } = parseBlock(block);

  /* build container */
  block.textContent = '';
  const mapContainer = document.createElement('div');
  mapContainer.id = 'map';
  block.append(mapContainer);

  if (!config.apiKey) {
    mapContainer.textContent = 'Google Maps API key is required.';
    return;
  }

  /* load Google Maps + InfoBox + MarkerClusterer in parallel */
  try {
    await loadGoogleMaps(config.apiKey);
    const loads = [];
    if (!window.InfoBox) loads.push(loadScript('/blocks/map/infobox.js'));
    if (!window.MarkerClusterer) loads.push(loadScript('/blocks/map/markerclusterer.js'));
    await Promise.all(loads);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[Map Block] load error', err);
    mapContainer.textContent = 'Unable to load map libraries.';
    return;
  }

  /* hide map initially for smooth reveal */
  mapContainer.style.opacity = '0';

  /* ── create map ─────────────────────────────────────────────── */
  const map = new google.maps.Map(mapContainer, {
    center: { lat: config.centerLat, lng: config.centerLng },
    zoom: config.zoom,
    styles: mapStyles,
    scrollwheel: false,
    draggable: true,
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: false,
    zoomControl: false,
  });

  /* ── continent labels ───────────────────────────────────────── */
  CONTINENTS.forEach((c) => {
    new google.maps.Marker({
      position: { lat: c.lat, lng: c.lng },
      map,
      label: {
        text: c.name,
        color: '#6B7E7C',
        fontSize: '20px',
        fontFamily: 'Antarctica, sans-serif',
      },
      icon: { url: EMPTY_ICON },
    });
  });

  /* ── marker icon ────────────────────────────────────────────── */
  const pinIcon = {
    path: google.maps.SymbolPath.CIRCLE,
    fillColor: '#6B7E7C',
    fillOpacity: 1,
    strokeColor: '#6B7E7C',
    strokeWeight: 1,
    scale: 7,
  };

  /* ── InfoBox default options ────────────────────────────────── */
  const infoBoxDefaults = {
    disableAutoPan: false,
    maxWidth: 0,
    pixelOffset: new google.maps.Size(-120, -20),
    boxStyle: { opacity: 1, width: '240px' },
    closeBoxMargin: '0px',
    closeBoxURL: '',
    infoBoxClearance: new google.maps.Size(1, 1),
    alignBottom: true,
    isHidden: false,
    pane: 'floatPane',
    enableEventPropagation: false,
  };

  const bounds = new google.maps.LatLngBounds();
  const allMarkers = [];
  const allInfoBoxes = [];
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  function closeAllInfoBoxes() {
    allInfoBoxes.forEach((ib) => ib.close());
  }

  /* ── place location markers ─────────────────────────────────── */
  locations.forEach((loc, idx) => {
    if (!loc.lat || !loc.lng) return;

    const position = new google.maps.LatLng(loc.lat, loc.lng);
    bounds.extend(position);

    const ib = new InfoBox({
      ...infoBoxDefaults,
      content: buildInfoContent(loc),
    });
    allInfoBoxes[idx] = ib;

    const marker = new google.maps.Marker({
      position,
      map,
      icon: pinIcon,
      cursor: 'default',
      item: idx,
      category: loc.category ? `category_${loc.category}` : '',
    });

    if (!isTouchDevice) {
      marker.addListener('mouseover', () => {
        closeAllInfoBoxes();
        ib.open(map, marker);
      });
      marker.addListener('click', () => {
        if (loc.link) window.location.href = loc.link;
      });
    } else {
      marker.addListener('click', () => {
        closeAllInfoBoxes();
        ib.open(map, marker);
      });
    }

    allMarkers.push(marker);
  });

  /* ── marker clusterer ───────────────────────────────────────── */
  if (allMarkers.length && window.MarkerClusterer) {
    // eslint-disable-next-line no-new
    new MarkerClusterer(map, allMarkers, {
      styles: [{
        url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(
          '<svg xmlns="http://www.w3.org/2000/svg" width="56" height="56">'
          + '<circle cx="28" cy="28" r="26" fill="#6B7E7C" stroke="#fff" stroke-width="2"/>'
          + '</svg>',
        ),
        width: 56,
        height: 56,
        textColor: '#ffffff',
        textSize: 12,
      }],
    });
  }

  /* ── fit bounds ──────────────────────────────────────────────── */
  if (allMarkers.length) {
    map.fitBounds(bounds);
  }

  /* ── smooth reveal ──────────────────────────────────────────── */
  setTimeout(() => {
    mapContainer.style.transition = 'opacity 0.3s ease-in';
    mapContainer.style.opacity = '1';
  }, 500);

  /* ── custom zoom buttons ────────────────────────────────────── */
  const zoomIn = document.createElement('div');
  zoomIn.className = 'custom-zoom-button';
  zoomIn.id = 'zoom-in';
  zoomIn.innerHTML = `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#6B7E7C" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`;
  zoomIn.title = 'Zoom In';
  mapContainer.appendChild(zoomIn);

  const zoomOut = document.createElement('div');
  zoomOut.className = 'custom-zoom-button';
  zoomOut.id = 'zoom-out';
  zoomOut.innerHTML = `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#6B7E7C" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/></svg>`;
  zoomOut.title = 'Zoom Out';
  mapContainer.appendChild(zoomOut);

  zoomIn.addEventListener('click', () => map.setZoom(map.getZoom() + 1));
  zoomOut.addEventListener('click', () => map.setZoom(map.getZoom() - 1));
}

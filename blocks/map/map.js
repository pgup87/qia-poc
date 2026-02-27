/* ── Google-Maps styling (formerly mapstyles.js) ───────────────── */
const mapStyles = [
  { featureType: 'all', elementType: 'labels', stylers: [{ visibility: 'off' }] },
  // Show country names and borders
  { featureType: 'administrative.country', elementType: 'labels.text', stylers: [{ visibility: 'on' }, { color: '#6B7E7C' }] },
  { featureType: 'administrative.country', elementType: 'geometry.stroke', stylers: [{ visibility: 'on' }, { color: '#ffffff' }, { weight: 0.8 }] },
  // Continent-level labels
  { featureType: 'administrative.province', elementType: 'all', stylers: [{ visibility: 'off' }] },
  { featureType: 'administrative.locality', elementType: 'all', stylers: [{ visibility: 'off' }] },
  // Land & water
  { featureType: 'landscape', elementType: 'geometry.fill', stylers: [{ visibility: 'on' }, { color: '#c6c5c2' }] },
  { featureType: 'water', elementType: 'geometry.fill', stylers: [{ visibility: 'on' }, { color: '#edecea' }] },
  { featureType: 'water', elementType: 'labels', stylers: [{ visibility: 'off' }] },
  // Hide clutter
  { featureType: 'poi', elementType: 'all', stylers: [{ visibility: 'off' }] },
  { featureType: 'road', elementType: 'all', stylers: [{ visibility: 'off' }] },
  { featureType: 'transit', elementType: 'all', stylers: [{ visibility: 'off' }] },
];

/* ── helpers ────────────────────────────────────────────────────── */

/**
 * Load the Google Maps JS API.
 * @param {string} apiKey
 * @returns {Promise<void>}
 */
function loadGoogleMaps(apiKey) {
  return new Promise((resolve, reject) => {
    if (window.google?.maps) { resolve(); return; }
    window.initGoogleMap = () => { resolve(); };
    const src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initGoogleMap&loading=async`;
    const s = document.createElement('script');
    s.src = src;
    s.async = true;
    s.defer = true;
    s.onerror = reject;
    document.head.append(s);
  });
}

/**
 * Parse authored rows out of the block.
 *
 * In xwalk each model field becomes its own row (single-column div):
 *   Row 0 : apiKey
 *   Row 1 : centerLat
 *   Row 2 : centerLng
 *   Row 3 : zoom
 *   Row 4…N : map-location child items (each row has 7 cols):
 *             title | lat | lng | description | category | image | link
 */
function parseBlock(block) {
  const rows = [...block.children];
  if (!rows.length) return { config: {}, locations: [] };

  /* each parent-model field is its own row with a single column */
  const val = (rowIdx) => rows[rowIdx]?.children?.[0]?.textContent?.trim() || '';

  const config = {
    apiKey: val(0),
    centerLat: parseFloat(val(1)) || 25.3548,
    centerLng: parseFloat(val(2)) || 51.1839,
    zoom: parseInt(val(3), 10) || 5,
  };

  /* child-item rows start after the 4 config rows */
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
      row,
    };
  });

  return { config, locations };
}

/* ── main decorate ─────────────────────────────────────────────── */
export default async function decorate(block) {
  const { config, locations } = parseBlock(block);

  // eslint-disable-next-line no-console
  console.log('[Map Block] config:', JSON.stringify(config), '| locations:', locations.length);

  /* build container */
  block.textContent = '';

  const mapContainer = document.createElement('div');
  mapContainer.classList.add('map-container');
  block.append(mapContainer);

  if (!config.apiKey) {
    mapContainer.textContent = 'Google Maps API key is required. Add it to the first row of the Map block.';
    return;
  }

  /* load Google Maps */
  try {
    await loadGoogleMaps(config.apiKey);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Failed to load Google Maps', err);
    mapContainer.textContent = 'Unable to load Google Maps.';
    return;
  }

  /* create map */
  // eslint-disable-next-line no-undef
  const map = new google.maps.Map(mapContainer, {
    center: { lat: config.centerLat, lng: config.centerLng },
    zoom: config.zoom,
    styles: mapStyles,
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: false,
    zoomControl: true,
  });

  /* icon style */
  // eslint-disable-next-line no-undef
  const pinIcon = {
    path: google.maps.SymbolPath.CIRCLE,
    fillColor: '#6B7E7C',
    fillOpacity: 1,
    strokeColor: '#6B7E7C',
    strokeWeight: 1,
    scale: 7,
  };

  // eslint-disable-next-line no-undef
  const bounds = new google.maps.LatLngBounds();
  let openInfoWindow = null;

  /* place markers */
  locations.forEach((loc) => {
    if (!loc.lat || !loc.lng) return;

    const position = { lat: loc.lat, lng: loc.lng };
    bounds.extend(position);

    // eslint-disable-next-line no-undef
    const marker = new google.maps.Marker({
      position,
      map,
      icon: pinIcon,
      title: loc.title,
    });

    /* info window */
    const imgTag = loc.image ? `<img src="${loc.image}" width="220" height="144" style="object-fit:cover;">` : '';
    const linkTag = loc.link ? `<p><a href="${loc.link}">\u2192 See more</a></p>` : '';
    const content = `<div class="myboxmap">
      ${imgTag}
      <p class="carte_box_titre">${loc.title}</p>
      <div class="carte_box_desc">${loc.description}</div>
      ${loc.category ? `<p class="carte_box_categorie">${loc.category}</p>` : ''}
      ${linkTag}
    </div>`;

    // eslint-disable-next-line no-undef
    const infoWindow = new google.maps.InfoWindow({ content });

    marker.addListener('click', () => {
      if (openInfoWindow) openInfoWindow.close();
      infoWindow.open(map, marker);
      openInfoWindow = infoWindow;
    });
  });

  /* fit bounds if we have locations */
  if (locations.length) {
    map.fitBounds(bounds);
    /* prevent over-zoom on single marker */
    // eslint-disable-next-line no-undef
    google.maps.event.addListenerOnce(map, 'bounds_changed', () => {
      if (map.getZoom() > 15) map.setZoom(15);
    });
  }
}

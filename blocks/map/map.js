/* eslint-disable no-undef */

/**
 * Map Block
 *
 * Renders an interactive Google Map with markers driven by AEM Content
 * Fragments. Region / country data is fetched from a persisted GraphQL
 * query; clicking a marker opens a popup overlay with region details.
 *
 * Authorable fields (Universal Editor / xwalk):
 *   apiKey – Google Maps JavaScript API key (entered by the author,
 *            never hard-coded in source)
 *
 * GraphQL endpoint (persisted query):
 *   GET {ORIGIN}{GRAPHQL_PATH}/getRegionCountryData
 */

const ORIGIN = 'https://publish-p178131-e1882764.adobeaemcloud.com';
const GRAPHQL_PATH = '/graphql/execute.json/revmed-aem-core';

/** Inline SVG data-URI used for every map marker. */
const MARKER_SVG = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 56" width="40" height="56">
    <defs>
      <filter id="s" x="-20%" y="-10%" width="140%" height="130%">
        <feDropShadow dx="0" dy="1" stdDeviation="1.5" flood-color="#000" flood-opacity="0.25"/>
      </filter>
    </defs>
    <path d="M20 0C8.954 0 0 8.954 0 20c0 14 20 36 20 36s20-22 20-36C40 8.954 31.046 0 20 0z"
          fill="#fff" stroke="#1a3c3c" stroke-width="1.2" filter="url(#s)"/>
    <path d="M20 8L28 18L20 28L12 18Z" fill="#234b43"/>
    <path d="M20 11L25.5 18L20 25L14.5 18Z" fill="#4a8b7f" opacity="0.5"/>
  </svg>`,
)}`;

/* ------------------------------------------------------------------ */
/*  Helpers                                                           */
/* ------------------------------------------------------------------ */

/**
 * Load the Google Maps JavaScript API once.
 * @param {string} apiKey - author-provided API key
 */
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
 * Fetch region data from AEM Content Fragments via persisted GraphQL query.
 *
 * Each CF item contains a `countries` array inside `countryStateDetails`.
 * We flatten the structure so every country with valid coordinates becomes
 * its own marker object.
 *
 * @returns {Promise<Array<{regionName:string, countryName:string,
 *   lat:number, lng:number, states:string[], path:string}>>}
 */
async function fetchRegionData() {
  const endpoint = `${ORIGIN}${GRAPHQL_PATH}/getRegionCountryData`;
  const resp = await fetch(endpoint);

  if (!resp.ok) throw new Error(`GraphQL request failed: ${resp.status}`);

  const { data } = await resp.json();
  const items = data?.mapModelList?.items ?? [];
  const markers = [];

  items.forEach((item) => {
    const regionName = item.regionName ?? '';
    const countries = item.countryStateDetails?.countries ?? [];

    countries.forEach((country) => {
      const coords = country.coordinates || country.cordinates || '';
      if (!coords) return;

      const [rawLat, rawLng] = coords.split(',').map((v) => v.trim());
      const lat = parseFloat(rawLat) || 0;
      const lng = parseFloat(rawLng) || 0;
      if (!lat && !lng) return;

      markers.push({
        regionName,
        countryName: country.name ?? '',
        lat,
        lng,
        states: country.states ?? [],
        path: item._path ?? '',
      });
    });
  });

  return markers;
}

/**
 * Read the single authorable field from an xwalk block.
 * Row 0 = apiKey (Google Maps JavaScript API key).
 */
function parseBlock(block) {
  const rows = [...block.children];
  return { apiKey: rows[0]?.children?.[0]?.textContent?.trim() ?? '' };
}

/** Generate popup HTML for a marker. */
function buildPopupContent({ regionName, countryName, states }) {
  const pills = states.length
    ? `<ul class="map-popup-states">${states.map((s) => `<li>${s}</li>`).join('')}</ul>`
    : '';
  return `
    <button class="map-popup-close" aria-label="Close">&times;</button>
    <h3 class="map-popup-region">${regionName}</h3>
    <h4 class="map-popup-country">${countryName}</h4>
    ${pills}`;
}

/* ------------------------------------------------------------------ */
/*  Block entry point                                                 */
/* ------------------------------------------------------------------ */

export default async function decorate(block) {
  const { apiKey } = parseBlock(block);

  /* Replace authored markup with map layout */
  block.textContent = '';

  const wrapper = document.createElement('div');
  wrapper.className = 'map-wrapper';

  const popup = document.createElement('div');
  popup.className = 'map-popup';

  const mapCanvas = document.createElement('div');
  mapCanvas.className = 'map-canvas';

  wrapper.append(mapCanvas, popup);
  block.append(wrapper);

  if (!apiKey) {
    mapCanvas.textContent = 'Google Maps API key is required.';
    return;
  }

  /* Load API & data in parallel */
  let markers = [];
  try {
    [, markers] = await Promise.all([loadGoogleMaps(apiKey), fetchRegionData()]);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[Map Block]', err);
    mapCanvas.textContent = 'Unable to load map data.';
    return;
  }

  /* Compute center from data */
  const centerLat = markers.length
    ? markers.reduce((s, m) => s + m.lat, 0) / markers.length : 0;
  const centerLng = markers.length
    ? markers.reduce((s, m) => s + m.lng, 0) / markers.length : 0;

  /* Create map */
  const map = new google.maps.Map(mapCanvas, {
    center: { lat: centerLat, lng: centerLng },
    zoom: markers.length ? 2 : 1,
    maxZoom: 5,
    gestureHandling: 'greedy',
    mapTypeControl: true,
    mapTypeControlOptions: {
      style: google.maps.MapTypeControlStyle.DEFAULT,
      position: google.maps.ControlPosition.TOP_LEFT,
    },
    fullscreenControl: true,
    fullscreenControlOptions: { position: google.maps.ControlPosition.TOP_RIGHT },
    zoomControl: true,
    zoomControlOptions: { position: google.maps.ControlPosition.RIGHT_BOTTOM },
    streetViewControl: true,
    streetViewControlOptions: { position: google.maps.ControlPosition.RIGHT_BOTTOM },
    rotateControl: true,
    rotateControlOptions: { position: google.maps.ControlPosition.RIGHT_BOTTOM },
    scaleControl: true,
  });

  /* "Contact Us" button */
  const contactBtn = document.createElement('a');
  contactBtn.className = 'map-contact-btn';
  contactBtn.href = '/contact-us';
  contactBtn.innerHTML = `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
      <polyline points="22,6 12,13 2,6"/>
    </svg>
    Contact Us`;
  map.controls[google.maps.ControlPosition.TOP_RIGHT].push(contactBtn);

  /* Marker icon */
  const markerIcon = {
    url: MARKER_SVG,
    scaledSize: new google.maps.Size(36, 50),
    anchor: new google.maps.Point(18, 50),
  };

  /* Popup helpers */
  const hidePopup = () => popup.classList.remove('open');
  const showPopup = (region) => {
    popup.innerHTML = buildPopupContent(region);
    popup.classList.add('open');
    popup.querySelector('.map-popup-close')?.addEventListener('click', hidePopup);
  };

  /* Place markers */
  const bounds = new google.maps.LatLngBounds();

  markers.forEach((region) => {
    const position = { lat: region.lat, lng: region.lng };
    bounds.extend(position);

    const marker = new google.maps.Marker({
      position,
      map,
      icon: markerIcon,
      title: `${region.regionName} – ${region.countryName}`,
    });

    marker.addListener('click', () => {
      map.panTo(position);
      showPopup(region);
    });
  });

  if (markers.length) map.fitBounds(bounds);

  /* Close popup on background click */
  map.addListener('click', hidePopup);
}

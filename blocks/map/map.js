/* eslint-disable no-undef */

/**
 * Map Block — Fetches region / country / state data from AEM Content
 * Fragments via a persisted GraphQL query and renders interactive
 * markers with popup overlays.
 *
 * Block model fields (xwalk rows):
 *   Row 0 : apiKey      – Google Maps JavaScript API key
 *   Row 1 : aemHost     – AEM publish host for GraphQL
 *                          e.g. https://publish-p52710-e1559444.adobeaemcloud.com
 *
 * Persisted query path:
 *   /graphql/execute.json/revmed-aem-core/getMapRegions
 */

/* ── Custom marker SVG (white pin + teal diamond logo) ─────────── */
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

/* ── helpers ────────────────────────────────────────────────────── */

/** Dynamically load the Google Maps JavaScript API. */
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
 * Fetch region data from AEM Content Fragments via persisted GraphQL.
 *
 * Expected persisted query  : getMapRegions
 * Expected CF model         : map-model  (fields: regionName, countryStateDetails)
 *
 * The persisted query should be:
 *   query getMapRegions {
 *     mapModelList {
 *       items {
 *         _path
 *         regionName
 *         countryStateDetails
 *       }
 *     }
 *   }
 *
 * @param {string} aemHost – AEM host URL (author or publish)
 * @returns {Promise<Array>} parsed region objects
 */
async function fetchRegionData(aemHost) {
  const host = aemHost.replace(/\/+$/, '');
  const endpoint = `${host}/graphql/execute.json/revmed-aem-core/getMapRegions`;

  const resp = await fetch(endpoint, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!resp.ok) throw new Error(`GraphQL request failed: ${resp.status}`);

  const json = await resp.json();
  const items = json?.data?.mapModelList?.items || [];

  return items.map((item) => {
    let country = {};
    try {
      const parsed = JSON.parse(item.countryStateDetails);
      country = parsed.country || parsed;
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('[Map Block] Could not parse countryStateDetails', e);
    }

    /* coordinates may be stored as "coordinates" or "cordinates" (legacy typo) */
    const coords = country.coordinates || country.cordinates || '';
    let lat = 0;
    let lng = 0;
    if (coords) {
      const parts = coords.split(',').map((v) => v.trim());
      lat = parseFloat(parts[0]) || 0;
      lng = parseFloat(parts[1]) || 0;
    }

    return {
      regionName: item.regionName || '',
      countryName: country.name || '',
      lat,
      lng,
      states: country.states || [],
    };
  }).filter((r) => r.lat !== 0 && r.lng !== 0);
}

/**
 * Parse block rows delivered by xwalk (each model field = one row).
 *   Row 0 : apiKey
 *   Row 1 : aemHost
 */
function parseBlock(block) {
  const rows = [...block.children];
  const val = (i) => rows[i]?.children?.[0]?.textContent?.trim() || '';
  return {
    apiKey: val(0),
    aemHost: val(1),
  };
}

/** Build the popup overlay HTML for a region marker. */
function buildPopupContent(region) {
  const statesList = region.states.length
    ? `<ul class="map-popup-states">${region.states.map((s) => `<li>${s}</li>`).join('')}</ul>`
    : '';

  return `
    <button class="map-popup-close" aria-label="Close">&times;</button>
    <h3 class="map-popup-region">${region.regionName}</h3>
    <h4 class="map-popup-country">${region.countryName}</h4>
    ${statesList}
  `;
}

/* ── main decorate ─────────────────────────────────────────────── */
export default async function decorate(block) {
  const config = parseBlock(block);

  /* clear authored markup, build layout */
  block.textContent = '';

  const wrapper = document.createElement('div');
  wrapper.className = 'map-wrapper';

  /* Popup overlay (hidden by default) */
  const popup = document.createElement('div');
  popup.className = 'map-popup';

  /* Map canvas */
  const mapContainer = document.createElement('div');
  mapContainer.className = 'map-canvas';

  wrapper.append(mapContainer, popup);
  block.append(wrapper);

  if (!config.apiKey) {
    mapContainer.textContent = 'Google Maps API key is required.';
    return;
  }
  if (!config.aemHost) {
    mapContainer.textContent = 'AEM Host URL is required for fetching region data.';
    return;
  }

  /* Load Google Maps API + region CF data in parallel */
  let regions = [];
  try {
    const [, data] = await Promise.all([
      loadGoogleMaps(config.apiKey),
      fetchRegionData(config.aemHost),
    ]);
    regions = data;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[Map Block] load error', err);
    mapContainer.textContent = 'Unable to load map data.';
    return;
  }

  /* ── create map ──────────────────────────────────────────────── */
  const map = new google.maps.Map(mapContainer, {
    center: { lat: 20, lng: 0 },
    zoom: 2,
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
    /* Camera / compass (bottom-right) */
    rotateControl: true,
    rotateControlOptions: {
      position: google.maps.ControlPosition.RIGHT_BOTTOM,
    },
    scaleControl: true,
  });

  /* ── "Contact Us" custom control (top-right) ─────────────────── */
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

  /* ── marker icon ─────────────────────────────────────────────── */
  const markerIcon = {
    url: MARKER_SVG,
    scaledSize: new google.maps.Size(36, 50),
    anchor: new google.maps.Point(18, 50),
  };

  const bounds = new google.maps.LatLngBounds();

  /* ── popup show / hide ───────────────────────────────────────── */
  function showPopup(region) {
    popup.innerHTML = buildPopupContent(region);
    popup.classList.add('open');
    popup.querySelector('.map-popup-close')?.addEventListener('click', hidePopup);
  }

  function hidePopup() {
    popup.classList.remove('open');
  }

  /* ── place markers from Content Fragment data ─────────────── */
  regions.forEach((region) => {
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

  /* ── fit bounds to show all markers ─────────────────────────── */
  if (regions.length) {
    map.fitBounds(bounds);
  }

  /* close popup on map background click */
  map.addListener('click', hidePopup);
}

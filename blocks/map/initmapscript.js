/* eslint-disable */
/* stylelint-disable */

// Function to detect current language from URL
function getCurrentLanguage() {
    const path = window.location.pathname;
    return path.includes('/fr/') ? 'fr' : 'en';
  }
  
  // EXAMPLE: Uncomment and customize this function if you need localized URLs
  // function getLocalizedUrl(projectSlug) {
  //   const language = getCurrentLanguage();
  //   
  //   // Example project mapping - customize with your own project slugs
  //   const projectMapping = {
  //     "project-one": "projet-un",
  //     "project-two": "projet-deux",
  //     "project-three": "projet-trois"
  //   };
  //   
  //   if (language === 'fr') {
  //     const frenchSlug = projectMapping[projectSlug] || projectSlug;
  //     return `/fr/projects/${frenchSlug}`;
  //   } else {
  //     return `/en/projects/${projectSlug}`;
  //   }
  // }
  
  // Utility function to close all open InfoWindows
  function closeAllInfoWindows() {
    infoWindows.forEach((elem) => {
      if (elem) {
        elem.close();
      }
    });
  }

  // Function to create InfoBox content with localized links
  function createInfoBoxContent(imageId, imageName, partner, country, dateRange, title, category, projectSlug) {
    const language = getCurrentLanguage();
    // TODO: Customize this URL to point to your specific project page
    // Alternative: Use getLocalizedUrl(projectSlug) if you uncomment the function above
    const localizedUrl = '/';
    
    // Country name translations
    const countryTranslations = {
      "Cape Verde": "Cap-Vert",
      "Multi-country": "Multi-pays",
      "Madagascar": "Madagascar",
      "England": "Angleterre",
      "Benin": "Bénin",
      "Switzerland": "Suisse",
      "Cambodia": "Cambodge",
      "Democratic Republic of the Congo (DRC)": "République démocratique du Congo (RDC)",
      "Togo": "Togo",
      "Cameroon": "Cameroun",
      "Tanzania": "Tanzanie",
      "Senegal": "Sénégal",
      "France": "France",
      "Peru": "Pérou",
      "Italy": "Italie",
      "Uganda": "Ouganda",
      "Brazil": "Brésil",
      "Tadjikistan": "Tadjikistan",
      "Malawi": "Malawi",
      "Vietnam": "Vietnam",
      "India": "Inde",
      "Scotland": "Écosse",
      "Benin | Ghana | Côte d'Ivoire": "Bénin | Ghana | Côte d'Ivoire",
      "Indonesia": "Indonésie",
      "Mexico": "Mexique",
      "Armenia": "Arménie",
      "Colombia": "Colombie",
      "Burkina Faso": "Burkina Faso"
    };
    
    // Category translations
    const categoryTranslations = {
      "Organisational development": "Développement organisationnel",
      "Conservation/restoration": "Conservation/restauration",
      "Awareness raising": "Sensibilisation",
      "Ancestral knowledge": "Savoirs ancestraux"
    };
    
    // Note: titleTranslations and partnerTranslations removed - using direct lorem ipsum text
    
    // Translate content based on language
    let localizedCountry = country;
    let localizedTitle = "Lorem ipsum dolor sit amet consectetur adipiscing elit";
    let localizedCategory = category;
    let localizedPartner = "Lorem Ipsum Organization";
    let seeMoreText = "→ See more";
    
    if (language === 'fr') {
      localizedCountry = countryTranslations[country] || country;
      localizedTitle = "Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor";
      localizedPartner = "Organisation Lorem Ipsum";
      seeMoreText = "→ Voir en détail";
      
      // Translate category labels
      localizedCategory = category.split(' | ').map(cat => {
        return categoryTranslations[cat.trim()] || cat.trim();
      }).join(' | ');
    }
    
    return `<div class='myboxmap'><img src='https://main--map-demo--meejain.aem.page/assets/images/map/projects-listing/${imageId}/${imageName}.jpg' width='220' height='144'><p class="carte_box_partenaires">${localizedPartner}</p><p class="carte_box_pays">${localizedCountry}</p><p class="carte_box_date">${dateRange}</p><p class="carte_box_titre">${localizedTitle}</p><p class="carte_box_categorie">${localizedCategory}</p><p class="carte_box_link"><a href=${localizedUrl}>${seeMoreText}</a></p></div>`;
  }
  
  var draggable=true;
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  if (isTouchDevice) {
     // draggable=false;
  }
  
  var map;
  var markers = [];
  var bounds;
  var boundsswiss;
  var markerCluster;
  var infoWindows = []; 
  
  async function initMap() {
      
  var iconpointer = {
      path: google.maps.SymbolPath.CIRCLE,
      fillColor: '#6B7E7C',
      fillOpacity: 1,
      strokeColor: '#6B7E7C',
      strokeWeight: 1,
      scale: 7 
  };
      
  
  
  var popupoption = {
         content: ''
        ,disableAutoPan: false
        ,maxWidth: 0
        ,pixelOffset: new google.maps.Size(-120, -20)
        ,zIndex: null
        ,boxStyle: { 
              opacity: 1
          ,width: "240px"
         }
         
        ,closeBoxMargin: "0px 0px 0px 0px"
                  ,closeBoxURL: "/icons/btn_arbres_close.svg"
                  
        ,infoBoxClearance: new google.maps.Size(1, 1)
        ,alignBottom: true
        ,isHidden: false
        ,pane: "floatPane"
        ,enableEventPropagation: false
      };
  
  
  
  
    // Load InfoBox script and wait for it to complete
    await new Promise((resolve, reject) => {
      if (window.InfoBox) {
        resolve(); // Already loaded
        return;
      }
      var s = document.createElement("script");
      s.type = "text/javascript";
      s.src = '/blocks/map/infobox.js';
      s.setAttribute("nonce", "3b3df148715c7bed4d9747306613a38e");
      s.onload = resolve;
      s.onerror = reject;
      document.head.append(s);
    });
      
    bounds = new google.maps.LatLngBounds();
  
    map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 46.77448320376698, lng: 8.009033203125},
      //zoom: 9, // Zoom will be set dynamically after fitBounds
      mapId: 'bf63d7e16622e43524258229',
      draggable: draggable,
      scrollwheel: false,
      mapTypeControl: false, // Désactiver le contrôle du type de carte (plan/satellite)
      streetViewControl: false, // Désactiver le contrôle de Street View
      fullscreenControl: false,
      zoomControl: false,
      //minZoom: 3, 
     // maxZoom: 16,
      styles: audemarsmapstyles
    });
      
          var continents = [
          { name: 'North America', position: { lat: 40, lng: -100 } },
          { name: 'Latin America', position: { lat: -15, lng: -60 } },
          { name: 'Europe', position: { lat: 50, lng: 10 } },
          { name: 'Africa', position: { lat: 0, lng: 20 } },
          { name: 'Asia', position: { lat: 30, lng: 100 } },
          { name: 'Oceania', position: { lat: -20, lng: 140 } }
      ];
  
      // Ajout des marqueurs pour chaque continent
      continents.forEach(function(continent) {
          new google.maps.Marker({
              position: continent.position,
              map: map,
              label: {
                  text: continent.name,
                  color: '#6B7E7C',      
                  fontSize: '20px',   
                  fontFamily: 'Antarctica, sans-serif'
                  
              },
              icon: {                    
              url: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxIiBoZWlnaHQ9IjEiIHZpZXdCb3g9IjAgMCAxMCAxMCI+PHBhdGggZD0iTTEwIDBoLTkiIHdpZHRoPSI5IiBoZWlnaHQ9IjkiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLXdpZHRoPSIxIiBzdHJva2UtbGluZS1jYXRjaGluZz0ib3BhcXVldSIgLz48L3N2Zz4="
          }  // Aucune icône spécifiée pour que la définition par défaut s'applique
          });
      });
  
      
      
  
  
      
    
    var myOptions = popupoption;
    myOptions.content=createInfoBoxContent(1162, "adobe-logo", "Associa\u00e7\u00e3o Projecto Vit\u00f3", "Cape Verde", "2025 \u2192 2027", "Implementing an organisational development action plan", "Organisational development", "implementing-an-organisational-development-action-plan");
  
    infoWindows[99]= new InfoBox(myOptions);
  
    var markerLatLng= new google.maps.LatLng (14.902685483576084,-24.4936212786621);
    var marker = new google.maps.Marker({
      position: markerLatLng,
      map: map,
      cursor: 'default',
      item: 99,
    icon: iconpointer,
      category: "category_10 "
    });
  
       marker.addListener('mouseout', function() {
    });
    
    if(!isTouchDevice){
      
     marker.addListener('mouseover', function() {
      closeAllInfoWindows();
      infoWindows[this.item].open(map, this);
      });  
      
     marker.addListener('click', function() {
     // TODO: Customize this URL to point to your specific project page
     // Alternative: Use getLocalizedUrl("your-project-slug") if you uncomment the function above
     window.location.href = '/';
       
    });
    } else {
      
      
    marker.addListener('click', function() {
      closeAllInfoWindows();
      infoWindows[this.item].open(map, this);
    });  
      
      
    }
  
  
    markers.push(marker);
    bounds.extend(markerLatLng);
      
    
    var myOptions = popupoption;
    myOptions.content=createInfoBoxContent(855, "adobe-logo", "Comit\u00e9 fran\u00e7ais de l\u2019UICN", "Multi-country", "2025 \u2192 2027", "Support programme for biodiversity NGOs working in developing countries (ProBioDev)", "Conservation\/restoration | Awareness raising | Organisational development", "support-programme-for-biodiversity-ngos-working-in-developin");
  
    infoWindows[70]= new InfoBox(myOptions);
  
    var markerLatLng= new google.maps.LatLng (48.85445918664122,2.4176469555908264);
    var marker = new google.maps.Marker({
      position: markerLatLng,
      map: map,
      cursor: 'default',
      item: 70,
    icon: iconpointer,
      category: "category_3 category_4 category_10 "
    });
  
       marker.addListener('mouseout', function() {
    });
    
    if(!isTouchDevice){
      
     marker.addListener('mouseover', function() {
      closeAllInfoWindows();
      infoWindows[this.item].open(map, this);
      });  
      
     marker.addListener('click', function() {
     // TODO: Customize this URL to point to your specific project page
     // Alternative: Use getLocalizedUrl("your-project-slug") if you uncomment the function above
     window.location.href = '/';
       
    });
    } else {
      
      
    marker.addListener('click', function() {
      closeAllInfoWindows();
      infoWindows[this.item].open(map, this);
    });  
      
      
    }
  
  
    markers.push(marker);
    bounds.extend(markerLatLng);
      
    
    var myOptions = popupoption;
    myOptions.content=createInfoBoxContent(861, "adobe-logo", "Helpsimus (Association fran\u00e7aise pour la sauvegarde du grand hapal\u00e9mur)", "Madagascar", "2024 \u2192 2027", "Stepping up protection for a thousand hectares of forest fragments housing the largest population of greater bamboo lemurs in the wild", "Conservation\/restoration | Awareness raising", "stepping-up-protection-for-a-thousand-hectares-of-forest-fra");
  
    infoWindows[71]= new InfoBox(myOptions);
  
    var markerLatLng= new google.maps.LatLng (-21.176557816179585,47.574459623437505);
    var marker = new google.maps.Marker({
      position: markerLatLng,
      map: map,
      cursor: 'default',
      item: 71,
    icon: iconpointer,
      category: "category_3 category_4 "
    });
  
       marker.addListener('mouseout', function() {
    });
    
    if(!isTouchDevice){
      
     marker.addListener('mouseover', function() {
      closeAllInfoWindows();
      infoWindows[this.item].open(map, this);
      });  
      
     marker.addListener('click', function() {
     // TODO: Customize this URL to point to your specific project page
     // Alternative: Use getLocalizedUrl("your-project-slug") if you uncomment the function above
     window.location.href = '/';
       
    });
    } else {
      
      
    marker.addListener('click', function() {
      closeAllInfoWindows();
      infoWindows[this.item].open(map, this);
    });  
      
      
    }
  
  
    markers.push(marker);
    bounds.extend(markerLatLng);
      
    
    var myOptions = popupoption;
    myOptions.content=createInfoBoxContent(869, "adobe-logo", "The National Forest Company", "England", "2024 \u2192 2027", "Creating a forest for learning III", "Awareness raising", "creating-a-forest-for-learning-iii");
  
    infoWindows[72]= new InfoBox(myOptions);
  
    var markerLatLng= new google.maps.LatLng (52.73671439092728,-1.5423235186523376);
    var marker = new google.maps.Marker({
      position: markerLatLng,
      map: map,
      cursor: 'default',
      item: 72,
    icon: iconpointer,
      category: "category_4 "
    });
  
       marker.addListener('mouseout', function() {
    });
    
    if(!isTouchDevice){
      
     marker.addListener('mouseover', function() {
      closeAllInfoWindows();
      infoWindows[this.item].open(map, this);
      });  
      
     marker.addListener('click', function() {
     // TODO: Customize this URL to point to your specific project page
     // Alternative: Use getLocalizedUrl("your-project-slug") if you uncomment the function above
     window.location.href = '/';
       
    });
    } else {
      
      
    marker.addListener('click', function() {
      closeAllInfoWindows();
      infoWindows[this.item].open(map, this);
    });  
      
      
    }
  
  
    markers.push(marker);
    bounds.extend(markerLatLng);
      
    
    var myOptions = popupoption;
    myOptions.content=createInfoBoxContent(811, "adobe-logo", "Centre R\u00e9gional de Recherche et d\u2019\u00c9ducation pour le D\u00e9veloppement Int\u00e9gr\u00e9 (CREDI-ONG)", "Benin", "2023 \u2192 2026", "Resilience and adaptation to climate change in the Sitatunga Valley", "Conservation\/restoration | Awareness raising", "resilience-and-adaptation-to-climate-change-in-the-sitatunga");
  
    infoWindows[15]= new InfoBox(myOptions);
  
    var markerLatLng= new google.maps.LatLng (6.6254021370220935,2.3562780133300842);
    var marker = new google.maps.Marker({
      position: markerLatLng,
      map: map,
      cursor: 'default',
      item: 15,
    icon: iconpointer,
      category: "category_3 category_4 "
    });
  
       marker.addListener('mouseout', function() {
    });
    
    if(!isTouchDevice){
      
     marker.addListener('mouseover', function() {
      closeAllInfoWindows();
      infoWindows[this.item].open(map, this);
      });  
      
     marker.addListener('click', function() {
     // TODO: Customize this URL to point to your specific project page
     // Alternative: Use getLocalizedUrl("your-project-slug") if you uncomment the function above
     window.location.href = '/';
       
    });
    } else {
      
      
    marker.addListener('click', function() {
      closeAllInfoWindows();
      infoWindows[this.item].open(map, this);
    });  
      
      
    }
  
  
    markers.push(marker);
    bounds.extend(markerLatLng);
      
    
    var myOptions = popupoption;
    myOptions.content=createInfoBoxContent(159, "adobe-logo", "Alpes vivantes", "Switzerland", "2023 \u2192 2026", "Sustainable protection of biodiversity in the Vaud Alps", "Conservation\/restoration | Awareness raising", "sustainable-protection-of-biodiversity-in-the-vaud-alps");
  
    infoWindows[5]= new InfoBox(myOptions);
  
    var markerLatLng= new google.maps.LatLng (46.31599933571462,7.057568143945319);
    var marker = new google.maps.Marker({
      position: markerLatLng,
      map: map,
      cursor: 'default',
      item: 5,
    icon: iconpointer,
      category: "category_3 category_4 "
    });
  
       marker.addListener('mouseout', function() {
    });
    
    if(!isTouchDevice){
      
     marker.addListener('mouseover', function() {
      closeAllInfoWindows();
      infoWindows[this.item].open(map, this);
      });  
      
     marker.addListener('click', function() {
     // TODO: Customize this URL to point to your specific project page
     // Alternative: Use getLocalizedUrl("your-project-slug") if you uncomment the function above
     window.location.href = '/';
       
    });
    } else {
      
      
    marker.addListener('click', function() {
      closeAllInfoWindows();
      infoWindows[this.item].open(map, this);
    });  
      
      
    }
  
  
    markers.push(marker);
    bounds.extend(markerLatLng);
      
    
    var myOptions = popupoption;
    myOptions.content=createInfoBoxContent(201, "adobe-logo", "EPER", "Cambodia", "2023 \u2192 2026", "Green Cashew - Sustainable cashew cultivation to fight climate change", "Conservation\/restoration | Ancestral knowledge", "green-cashew-sustainable-cashew-cultivation-to-fight-climate");
  
    infoWindows[12]= new InfoBox(myOptions);
  
    var markerLatLng= new google.maps.LatLng (12.541337455583687,107.18078286562505);
    var marker = new google.maps.Marker({
      position: markerLatLng,
      map: map,
      cursor: 'default',
      item: 12,
    icon: iconpointer,
      category: "category_3 category_5 "
    });
  
       marker.addListener('mouseout', function() {
    });
    
    if(!isTouchDevice){
      
     marker.addListener('mouseover', function() {
      closeAllInfoWindows();
      infoWindows[this.item].open(map, this);
      });  
      
     marker.addListener('click', function() {
     // TODO: Customize this URL to point to your specific project page
     // Alternative: Use getLocalizedUrl("your-project-slug") if you uncomment the function above
     window.location.href = '/';
       
    });
    } else {
      
      
    marker.addListener('click', function() {
      closeAllInfoWindows();
      infoWindows[this.item].open(map, this);
    });  
      
      
    }
  
  
    markers.push(marker);
    bounds.extend(markerLatLng);
      
    
    var myOptions = popupoption;
    myOptions.content=createInfoBoxContent(222, "adobe-logo", "For\u00eatxcellence", "Switzerland", "2022 \u2192 2027", "For\u00eatxcellence", "Ancestral knowledge", "foretxcellence");
  
    infoWindows[16]= new InfoBox(myOptions);
  
    var markerLatLng= new google.maps.LatLng (47.05887503590964,6.9005408993774475);
    var marker = new google.maps.Marker({
      position: markerLatLng,
      map: map,
      cursor: 'default',
      item: 16,
    icon: iconpointer,
      category: "category_5 "
    });
  
       marker.addListener('mouseout', function() {
    });
    
    if(!isTouchDevice){
      
     marker.addListener('mouseover', function() {
      closeAllInfoWindows();
      infoWindows[this.item].open(map, this);
      });  
      
     marker.addListener('click', function() {
     // TODO: Customize this URL to point to your specific project page
     // Alternative: Use getLocalizedUrl("your-project-slug") if you uncomment the function above
     window.location.href = '/';
       
    });
    } else {
      
      
    marker.addListener('click', function() {
      closeAllInfoWindows();
      infoWindows[this.item].open(map, this);
    });  
      
      
    }
  
  
    markers.push(marker);
    bounds.extend(markerLatLng);
      
    
    var myOptions = popupoption;
    myOptions.content=createInfoBoxContent(827, "adobe-logo", "Association Sentier didactique du bois de r\u00e9sonance du Risoud", "Switzerland", "2022 \u2192 2023", "Risoud resonance wood learning trail", "Awareness raising | Ancestral knowledge", "risoud-resonance-wood-learning-trail");
  
    infoWindows[67]= new InfoBox(myOptions);
  
    var markerLatLng= new google.maps.LatLng (46.606710680069476,6.229473661523444);
    var marker = new google.maps.Marker({
      position: markerLatLng,
      map: map,
      cursor: 'default',
      item: 67,
    icon: iconpointer,
      category: "category_4 category_5 "
    });
  
       marker.addListener('mouseout', function() {
    });
    
    if(!isTouchDevice){
      
     marker.addListener('mouseover', function() {
      closeAllInfoWindows();
      infoWindows[this.item].open(map, this);
      });  
      
     marker.addListener('click', function() {
     // TODO: Customize this URL to point to your specific project page
     // Alternative: Use getLocalizedUrl("your-project-slug") if you uncomment the function above
     window.location.href = '/';
       
    });
    } else {
      
      
    marker.addListener('click', function() {
      closeAllInfoWindows();
      infoWindows[this.item].open(map, this);
    });  
      
      
    }
  
  
    markers.push(marker);
    bounds.extend(markerLatLng);
      
    
    var myOptions = popupoption;
    myOptions.content=createInfoBoxContent(428, "adobe-logo", "Mbou-Mon-Tour (MMT)", "Democratic Republic of the Congo (DRC)", "2022 \u2192 2024", "Support for sustainable development through the conservation and enhancement of local biodiversity", "Conservation\/restoration | Awareness raising", "support-for-sustainable-development-through-the-conservation");
  
    infoWindows[50]= new InfoBox(myOptions);
  
    var markerLatLng= new google.maps.LatLng (-1.9234361411993575,17.699886869531255);
    var marker = new google.maps.Marker({
      position: markerLatLng,
      map: map,
      cursor: 'default',
      item: 50,
    icon: iconpointer,
      category: "category_3 category_4 "
    });
  
       marker.addListener('mouseout', function() {
    });
    
    if(!isTouchDevice){
      
     marker.addListener('mouseover', function() {
      closeAllInfoWindows();
      infoWindows[this.item].open(map, this);
      });  
      
     marker.addListener('click', function() {
     // TODO: Customize this URL to point to your specific project page
     // Alternative: Use getLocalizedUrl("your-project-slug") if you uncomment the function above
     window.location.href = '/';
       
    });
    } else {
      
      
    marker.addListener('click', function() {
      closeAllInfoWindows();
      infoWindows[this.item].open(map, this);
    });  
      
      
    }
  
  
    markers.push(marker);
    bounds.extend(markerLatLng);
      
    
    var myOptions = popupoption;
    myOptions.content=createInfoBoxContent(234, "adobe-logo", "Association Morija", "Togo", "2022 \u2192 2025", "Agroforestry and green entrepreneurship", "Conservation\/restoration | Awareness raising", "agroforestry-and-green-entrepreneurship");
  
    infoWindows[18]= new InfoBox(myOptions);
  
    var markerLatLng= new google.maps.LatLng (6.9606891717042565,0.6573453656250061);
    var marker = new google.maps.Marker({
      position: markerLatLng,
      map: map,
      cursor: 'default',
      item: 18,
    icon: iconpointer,
      category: "category_3 category_4 "
    });
  
       marker.addListener('mouseout', function() {
    });
    
    if(!isTouchDevice){
      
     marker.addListener('mouseover', function() {
      closeAllInfoWindows();
      infoWindows[this.item].open(map, this);
      });  
      
     marker.addListener('click', function() {
     // TODO: Customize this URL to point to your specific project page
     // Alternative: Use getLocalizedUrl("your-project-slug") if you uncomment the function above
     window.location.href = '/';
       
    });
    } else {
      
      
    marker.addListener('click', function() {
      closeAllInfoWindows();
      infoWindows[this.item].open(map, this);
    });  
      
      
    }
  
  
    markers.push(marker);
    bounds.extend(markerLatLng);
      
    
    var myOptions = popupoption;
    myOptions.content=createInfoBoxContent(335, "adobe-logo", "Association pour la sauvegarde de Morges (ASM)", "Switzerland", "2022 \u2192 2023", "Sentier de la Morges trail", "Awareness raising", "sentier-de-la-morges-trail");
  
    infoWindows[35]= new InfoBox(myOptions);
  
    var markerLatLng= new google.maps.LatLng (46.516727822257195,6.481794427972418);
    var marker = new google.maps.Marker({
      position: markerLatLng,
      map: map,
      cursor: 'default',
      item: 35,
    icon: iconpointer,
      category: "category_4 "
    });
  
       marker.addListener('mouseout', function() {
    });
    
    if(!isTouchDevice){
      
     marker.addListener('mouseover', function() {
      closeAllInfoWindows();
      infoWindows[this.item].open(map, this);
      });  
      
     marker.addListener('click', function() {
     // TODO: Customize this URL to point to your specific project page
     // Alternative: Use getLocalizedUrl("your-project-slug") if you uncomment the function above
     window.location.href = '/';
       
    });
    } else {
      
      
    marker.addListener('click', function() {
      closeAllInfoWindows();
      infoWindows[this.item].open(map, this);
    });  
      
      
    }
  
  
    markers.push(marker);
    bounds.extend(markerLatLng);
      
    
    var myOptions = popupoption;
    myOptions.content=createInfoBoxContent(258, "adobe-logo", "Association du Parc naturel r\u00e9gional Jura vaudois", "Switzerland", "2022 \u2192 2026", "Toile verte", "Conservation\/restoration | Awareness raising", "toile-verte");
  
    infoWindows[23]= new InfoBox(myOptions);
  
    var markerLatLng= new google.maps.LatLng (46.69249698268536,6.3405385724121155);
    var marker = new google.maps.Marker({
      position: markerLatLng,
      map: map,
      cursor: 'default',
      item: 23,
    icon: iconpointer,
      category: "category_3 category_4 "
    });
  
       marker.addListener('mouseout', function() {
    });
    
    if(!isTouchDevice){
      
     marker.addListener('mouseover', function() {
      closeAllInfoWindows();
      infoWindows[this.item].open(map, this);
      });  
      
     marker.addListener('click', function() {
     // TODO: Customize this URL to point to your specific project page
     // Alternative: Use getLocalizedUrl("your-project-slug") if you uncomment the function above
     window.location.href = '/';
       
    });
    } else {
      
      
    marker.addListener('click', function() {
      closeAllInfoWindows();
      infoWindows[this.item].open(map, this);
    });  
      
      
    }
  
  
    markers.push(marker);
    bounds.extend(markerLatLng);
      
    
    var myOptions = popupoption;
    myOptions.content=createInfoBoxContent(303, "adobe-logo", "Appui aux Initiatives de D\u00e9veloppement (AIDE)", "Cameroon", "2022 \u2192 2024", "Integrated management of mangrove landscapes in Douala-Ed\u00e9a National Park", "Conservation\/restoration | Awareness raising", "integrated-management-of-mangrove-landscape-in-the-douala-ed");
  
    infoWindows[29]= new InfoBox(myOptions);
  
    var markerLatLng= new google.maps.LatLng (3.9125631949334667,9.73891885195313);
    var marker = new google.maps.Marker({
      position: markerLatLng,
      map: map,
      cursor: 'default',
      item: 29,
    icon: iconpointer,
      category: "category_3 category_4 "
    });
  
       marker.addListener('mouseout', function() {
    });
    
    if(!isTouchDevice){
      
     marker.addListener('mouseover', function() {
      closeAllInfoWindows();
      infoWindows[this.item].open(map, this);
      });  
      
     marker.addListener('click', function() {
     // TODO: Customize this URL to point to your specific project page
     // Alternative: Use getLocalizedUrl("your-project-slug") if you uncomment the function above
     window.location.href = '/';
       
    });
    } else {
      
      
    marker.addListener('click', function() {
      closeAllInfoWindows();
      infoWindows[this.item].open(map, this);
    });  
      
      
    }
  
  
    markers.push(marker);
    bounds.extend(markerLatLng);
      
    
    var myOptions = popupoption;
    myOptions.content=createInfoBoxContent(274, "adobe-logo", "Associa\u00e7\u00e3o Projecto Vit\u00f3", "Cape Verde", "2022 \u2192 2025", "Time for conservation of endemic threatened flora in Cape Verde's islands", "Conservation\/restoration | Awareness raising", "time-for-conservation-of-endemic-threatened-flora-in-cape-ve");
  
    infoWindows[25]= new InfoBox(myOptions);
  
    var markerLatLng= new google.maps.LatLng (14.90269585153705,-24.4936212786621);
    var marker = new google.maps.Marker({
      position: markerLatLng,
      map: map,
      cursor: 'default',
      item: 25,
    icon: iconpointer,
      category: "category_3 category_4 "
    });
  
       marker.addListener('mouseout', function() {
    });
    
    if(!isTouchDevice){
      
     marker.addListener('mouseover', function() {
      closeAllInfoWindows();
      infoWindows[this.item].open(map, this);
      });  
      
     marker.addListener('click', function() {
     // TODO: Customize this URL to point to your specific project page
     // Alternative: Use getLocalizedUrl("your-project-slug") if you uncomment the function above
     window.location.href = '/';
       
    });
    } else {
      
      
    marker.addListener('click', function() {
      closeAllInfoWindows();
      infoWindows[this.item].open(map, this);
    });  
      
      
    }
  
  
    markers.push(marker);
    bounds.extend(markerLatLng);
      
    
    var myOptions = popupoption;
    myOptions.content=createInfoBoxContent(172, "adobe-logo", "Association de l\u2019Arboretum national du Vallon de l\u2019Aubonne", "Switzerland", "2022 \u2192 2026", "Improving mediation and conservation", "Awareness raising", "improving-mediation-and-conservation");
  
    infoWindows[7]= new InfoBox(myOptions);
  
    var markerLatLng= new google.maps.LatLng (46.51167763546902,6.366244863610846);
    var marker = new google.maps.Marker({
      position: markerLatLng,
      map: map,
      cursor: 'default',
      item: 7,
    icon: iconpointer,
      category: "category_4 "
    });
  
       marker.addListener('mouseout', function() {
    });
    
    if(!isTouchDevice){
      
     marker.addListener('mouseover', function() {
      closeAllInfoWindows();
      infoWindows[this.item].open(map, this);
      });  
      
     marker.addListener('click', function() {
     // TODO: Customize this URL to point to your specific project page
     // Alternative: Use getLocalizedUrl("your-project-slug") if you uncomment the function above
     window.location.href = '/';
       
    });
    } else {
      
      
    marker.addListener('click', function() {
      closeAllInfoWindows();
      infoWindows[this.item].open(map, this);
    });  
      
      
    }
  
  
    markers.push(marker);
    bounds.extend(markerLatLng);
      
    
    var myOptions = popupoption;
    myOptions.content=createInfoBoxContent(155, "adobe-logo", "Actions Communautaires pour la Protection de l\u2019Environnement (ACPE)", "Democratic Republic of the Congo (DRC)", "2022 \u2192 2025", "Supporting the reconstitution of forest cover through agro-ecological practices", "Conservation\/restoration", "supporting-the-reconstitution-of-forest-cover-through-agro-e");
  
    infoWindows[4]= new InfoBox(myOptions);
  
    var markerLatLng= new google.maps.LatLng (-4.583086856506642,15.162045072656255);
    var marker = new google.maps.Marker({
      position: markerLatLng,
      map: map,
      cursor: 'default',
      item: 4,
    icon: iconpointer,
      category: "category_3 "
    });
  
       marker.addListener('mouseout', function() {
    });
    
    if(!isTouchDevice){
      
     marker.addListener('mouseover', function() {
      closeAllInfoWindows();
      infoWindows[this.item].open(map, this);
      });  
      
     marker.addListener('click', function() {
     // TODO: Customize this URL to point to your specific project page
     // Alternative: Use getLocalizedUrl("your-project-slug") if you uncomment the function above
     window.location.href = '/';
       
    });
    } else {
      
      
    marker.addListener('click', function() {
      closeAllInfoWindows();
      infoWindows[this.item].open(map, this);
    });  
      
      
    }
  
  
    markers.push(marker);
    bounds.extend(markerLatLng);
      
    
    var myOptions = popupoption;
    myOptions.content=createInfoBoxContent(355, "adobe-logo", "Blue Ventures", "Madagascar", "2022 \u2192 2023", "Blue forests", "Conservation\/restoration | Awareness raising", "blue-forests");
  
    infoWindows[38]= new InfoBox(myOptions);
  
    var markerLatLng= new google.maps.LatLng (-20.749521620858758,44.03136880312496);
    var marker = new google.maps.Marker({
      position: markerLatLng,
      map: map,
      cursor: 'default',
      item: 38,
    icon: iconpointer,
      category: "category_3 category_4 "
    });
  
       marker.addListener('mouseout', function() {
    });
    
    if(!isTouchDevice){
      
     marker.addListener('mouseover', function() {
      closeAllInfoWindows();
      infoWindows[this.item].open(map, this);
      });  
      
     marker.addListener('click', function() {
     // TODO: Customize this URL to point to your specific project page
     // Alternative: Use getLocalizedUrl("your-project-slug") if you uncomment the function above
     window.location.href = '/';
       
    });
    } else {
      
      
    marker.addListener('click', function() {
      closeAllInfoWindows();
      infoWindows[this.item].open(map, this);
    });  
      
      
    }
  
  
    markers.push(marker);
    bounds.extend(markerLatLng);
      
    
    var myOptions = popupoption;
    myOptions.content=createInfoBoxContent(316, "adobe-logo", "Aquaverde", "Brazil", "2022 \u2192 2022", "Reforestation and Brazil nuts", "Conservation\/restoration", "reforestation-and-brazil-nuts");
  
    infoWindows[31]= new InfoBox(myOptions);
  
    var markerLatLng= new google.maps.LatLng (-11.004376596548237,-61.179202485937495);
    var marker = new google.maps.Marker({
      position: markerLatLng,
      map: map,
      cursor: 'default',
      item: 31,
    icon: iconpointer,
      category: "category_3 "
    });
  
       marker.addListener('mouseout', function() {
    });
    
    if(!isTouchDevice){
      
     marker.addListener('mouseover', function() {
      closeAllInfoWindows();
      infoWindows[this.item].open(map, this);
      });  
      
     marker.addListener('click', function() {
     // TODO: Customize this URL to point to your specific project page
     // Alternative: Use getLocalizedUrl("your-project-slug") if you uncomment the function above
     window.location.href = '/';
       
    });
    } else {
      
      
    marker.addListener('click', function() {
      closeAllInfoWindows();
      infoWindows[this.item].open(map, this);
    });  
      
      
    }
  
  
    markers.push(marker);
    bounds.extend(markerLatLng);
      
    
    var myOptions = popupoption;
    myOptions.content=createInfoBoxContent(301, "adobe-logo", "Alternatives Durables pour le D\u00e9veloppement (ADD)", "Cameroon", "2022 \u2192 2023", "Awareness raising and environmental education for young people in vocational schools and communities", "Awareness raising", "awareness-raising-and-environmental-education-for-young-peop");
  
    infoWindows[28]= new InfoBox(myOptions);
  
    var markerLatLng= new google.maps.LatLng (3.4937283965298485,11.327129911523484);
    var marker = new google.maps.Marker({
      position: markerLatLng,
      map: map,
      cursor: 'default',
      item: 28,
    icon: iconpointer,
      category: "category_4 "
    });
  
       marker.addListener('mouseout', function() {
    });
    
    if(!isTouchDevice){
      
     marker.addListener('mouseover', function() {
      closeAllInfoWindows();
      infoWindows[this.item].open(map, this);
      });  
      
     marker.addListener('click', function() {
     // TODO: Customize this URL to point to your specific project page
     // Alternative: Use getLocalizedUrl("your-project-slug") if you uncomment the function above
     window.location.href = '/';
       
    });
    } else {
      
      
    marker.addListener('click', function() {
      closeAllInfoWindows();
      infoWindows[this.item].open(map, this);
    });  
      
      
    }
  
  
    markers.push(marker);
    bounds.extend(markerLatLng);
      
    
    var myOptions = popupoption;
    myOptions.content=createInfoBoxContent(150, "adobe-logo", "Action Lutte Contre la Pauvret\u00e9 (ALCP)", "Burkina Faso", "2022 \u2192 2025", "Agro-ecological restoration and agroforestry in the green belt of the city of Ouagadougou", "Conservation\/restoration | Awareness raising", "agro-ecological-restoration-and-agroforestry-in-the-green-be");
  
    infoWindows[3]= new InfoBox(myOptions);
  
    var markerLatLng= new google.maps.LatLng (12.384448611097222,-1.5179476031249939);
    var marker = new google.maps.Marker({
      position: markerLatLng,
      map: map,
      cursor: 'default',
      item: 3,
    icon: iconpointer,
      category: "category_3 category_4 "
    });
  
       marker.addListener('mouseout', function() {
    });
    
    if(!isTouchDevice){
      
     marker.addListener('mouseover', function() {
      closeAllInfoWindows();
      infoWindows[this.item].open(map, this);
      });  
      
     marker.addListener('click', function() {
     // TODO: Customize this URL to point to your specific project page
     // Alternative: Use getLocalizedUrl("your-project-slug") if you uncomment the function above
     window.location.href = '/';
       
    });
    } else {
      
      
    marker.addListener('click', function() {
      closeAllInfoWindows();
      infoWindows[this.item].open(map, this);
    });  
      
      
    }
  
  
    markers.push(marker);
    bounds.extend(markerLatLng);
      
    
    var myOptions = popupoption;
    myOptions.content=createInfoBoxContent(181, "adobe-logo", "C\u0153ur de For\u00eat", "Indonesia", "2022 \u2192 2025", "Forest restoration and preservation on the island of Flores, Indonesia", "Conservation\/restoration | Awareness raising", "forest-restoration-and-preservation-on-the-island-of-flores");
  
    infoWindows[8]= new InfoBox(myOptions);
  
    var markerLatLng= new google.maps.LatLng (-8.617502106958613,121.1004606);
    var marker = new google.maps.Marker({
      position: markerLatLng,
      map: map,
      cursor: 'default',
      item: 8,
    icon: iconpointer,
      category: "category_3 category_4 "
    });
  
       marker.addListener('mouseout', function() {
    });
    
    if(!isTouchDevice){
      
     marker.addListener('mouseover', function() {
      closeAllInfoWindows();
      infoWindows[this.item].open(map, this);
      });  
      
     marker.addListener('click', function() {
     // TODO: Customize this URL to point to your specific project page
     // Alternative: Use getLocalizedUrl("your-project-slug") if you uncomment the function above
     window.location.href = '/';
       
    });
    } else {
      
      
    marker.addListener('click', function() {
      closeAllInfoWindows();
      infoWindows[this.item].open(map, this);
    });  
      
      
    }
  
  
    markers.push(marker);
    bounds.extend(markerLatLng);
      
    
    var myOptions = popupoption;
    myOptions.content=createInfoBoxContent(244, "adobe-logo", "Istituto Oikos", "Tanzania", "2022 \u2192 2024", "Mountain farmers and savannah pastoralists: conserving sustainable livelihoods in East Africa", "Conservation\/restoration | Awareness raising", "mountain-farmers-and-savannah-pastoralists-conserving-sustai");
  
    infoWindows[21]= new InfoBox(myOptions);
  
    var markerLatLng= new google.maps.LatLng (-3.3309162453255636,36.68151528749996);
    var marker = new google.maps.Marker({
      position: markerLatLng,
      map: map,
      cursor: 'default',
      item: 21,
    icon: iconpointer,
      category: "category_3 category_4 "
    });
  
       marker.addListener('mouseout', function() {
    });
    
    if(!isTouchDevice){
      
     marker.addListener('mouseover', function() {
      closeAllInfoWindows();
      infoWindows[this.item].open(map, this);
      });  
      
     marker.addListener('click', function() {
     // TODO: Customize this URL to point to your specific project page
     // Alternative: Use getLocalizedUrl("your-project-slug") if you uncomment the function above
     window.location.href = '/';
       
    });
    } else {
      
      
    marker.addListener('click', function() {
      closeAllInfoWindows();
      infoWindows[this.item].open(map, this);
    });  
      
      
    }
  
  
    markers.push(marker);
    bounds.extend(markerLatLng);
      
    
    var myOptions = popupoption;
    myOptions.content=createInfoBoxContent(406, "adobe-logo", "Alliance internationale pour la gestion de l\u2019eau de pluie (IRHA)", "Senegal", "2021 \u2192 2024", "Sea forest", "Conservation\/restoration | Awareness raising", "sea-forest");
  
    infoWindows[48]= new InfoBox(myOptions);
  
    var markerLatLng= new google.maps.LatLng (14.240602259753809,-16.63925497617187);
    var marker = new google.maps.Marker({
      position: markerLatLng,
      map: map,
      cursor: 'default',
      item: 48,
    icon: iconpointer,
      category: "category_3 category_4 "
    });
  
       marker.addListener('mouseout', function() {
    });
    
    if(!isTouchDevice){
      
     marker.addListener('mouseover', function() {
      closeAllInfoWindows();
      infoWindows[this.item].open(map, this);
      });  
      
     marker.addListener('click', function() {
     // TODO: Customize this URL to point to your specific project page
     // Alternative: Use getLocalizedUrl("your-project-slug") if you uncomment the function above
     window.location.href = '/';
       
    });
    } else {
      
      
    marker.addListener('click', function() {
      closeAllInfoWindows();
      infoWindows[this.item].open(map, this);
    });  
      
      
    }
  
  
    markers.push(marker);
    bounds.extend(markerLatLng);
      
    
    var myOptions = popupoption;
    myOptions.content=createInfoBoxContent(454, "adobe-logo", "Robin du Bois", "France", "2021 \u2192 2023", "Save the Pilat forests", "Conservation\/restoration", "save-the-pilat-forests");
  
    infoWindows[56]= new InfoBox(myOptions);
  
    var markerLatLng= new google.maps.LatLng (45.51128729285539,4.711300443750006);
    var marker = new google.maps.Marker({
      position: markerLatLng,
      map: map,
      cursor: 'default',
      item: 56,
    icon: iconpointer,
      category: "category_3 "
    });
  
       marker.addListener('mouseout', function() {
    });
    
    if(!isTouchDevice){
      
     marker.addListener('mouseover', function() {
      closeAllInfoWindows();
      infoWindows[this.item].open(map, this);
      });  
      
     marker.addListener('click', function() {
     // TODO: Customize this URL to point to your specific project page
     // Alternative: Use getLocalizedUrl("your-project-slug") if you uncomment the function above
     window.location.href = '/';
       
    });
    } else {
      
      
    marker.addListener('click', function() {
      closeAllInfoWindows();
      infoWindows[this.item].open(map, this);
    });  
      
      
    }
  
  
    markers.push(marker);
    bounds.extend(markerLatLng);
      
    
    var myOptions = popupoption;
    myOptions.content=createInfoBoxContent(288, "adobe-logo", "V\u00e9t\u00e9rinaires Sans Fronti\u00e8res Suisse (VSF-Suisse)", "Togo", "2021 \u2192 2024", "MiKaGo", "Conservation\/restoration | Awareness raising | Ancestral knowledge", "mikago");
  
    infoWindows[27]= new InfoBox(myOptions);
  
    var markerLatLng= new google.maps.LatLng (8.482061487647467,0.9896817914062561);
    var marker = new google.maps.Marker({
      position: markerLatLng,
      map: map,
      cursor: 'default',
      item: 27,
    icon: iconpointer,
      category: "category_3 category_4 category_5 "
    });
  
       marker.addListener('mouseout', function() {
    });
    
    if(!isTouchDevice){
      
     marker.addListener('mouseover', function() {
      closeAllInfoWindows();
      infoWindows[this.item].open(map, this);
      });  
      
     marker.addListener('click', function() {
     // TODO: Customize this URL to point to your specific project page
     // Alternative: Use getLocalizedUrl("your-project-slug") if you uncomment the function above
     window.location.href = '/';
       
    });
    } else {
      
      
    marker.addListener('click', function() {
      closeAllInfoWindows();
      infoWindows[this.item].open(map, this);
    });  
      
      
    }
  
  
    markers.push(marker);
    bounds.extend(markerLatLng);
      
    
    var myOptions = popupoption;
    myOptions.content=createInfoBoxContent(269, "adobe-logo", "Parc naturel du Jorat", "Switzerland", "2021 \u2192 2025", "Reception infrastructure at the Parc naturel du Jorat", "Awareness raising", "reception-infrastructure-at-the-parc-naturel-du-jorat");
  
    infoWindows[24]= new InfoBox(myOptions);
  
    var markerLatLng= new google.maps.LatLng (46.57267667663095,6.675793241601569);
    var marker = new google.maps.Marker({
      position: markerLatLng,
      map: map,
      cursor: 'default',
      item: 24,
    icon: iconpointer,
      category: "category_4 "
    });
  
       marker.addListener('mouseout', function() {
    });
    
    if(!isTouchDevice){
      
     marker.addListener('mouseover', function() {
      closeAllInfoWindows();
      infoWindows[this.item].open(map, this);
      });  
      
     marker.addListener('click', function() {
     // TODO: Customize this URL to point to your specific project page
     // Alternative: Use getLocalizedUrl("your-project-slug") if you uncomment the function above
     window.location.href = '/';
       
    });
    } else {
      
      
    marker.addListener('click', function() {
      closeAllInfoWindows();
      infoWindows[this.item].open(map, this);
    });  
      
      
    }
  
  
    markers.push(marker);
    bounds.extend(markerLatLng);
      
    
    var myOptions = popupoption;
    myOptions.content=createInfoBoxContent(239, "adobe-logo", "Nouvelle Plan\u00e8te", "Peru", "2021 \u2192 2024", "Protection of the forest through the official establishment of indigenous communities", "Conservation\/restoration", "protection-de-la-foret-par-la-titularisation-fonciere-de-com");
  
    infoWindows[20]= new InfoBox(myOptions);
  
    var markerLatLng= new google.maps.LatLng (-9.121577297887972,-74.05929892148437);
    var marker = new google.maps.Marker({
      position: markerLatLng,
      map: map,
      cursor: 'default',
      item: 20,
    icon: iconpointer,
      category: "category_3 "
    });
  
       marker.addListener('mouseout', function() {
    });
    
    if(!isTouchDevice){
      
     marker.addListener('mouseover', function() {
      closeAllInfoWindows();
      infoWindows[this.item].open(map, this);
      });  
      
     marker.addListener('click', function() {
     // TODO: Customize this URL to point to your specific project page
     // Alternative: Use getLocalizedUrl("your-project-slug") if you uncomment the function above
     window.location.href = '/';
       
    });
    } else {
      
      
    marker.addListener('click', function() {
      closeAllInfoWindows();
      infoWindows[this.item].open(map, this);
    });  
      
      
    }
  
  
    markers.push(marker);
    bounds.extend(markerLatLng);
      
    
    var myOptions = popupoption;
    myOptions.content=createInfoBoxContent(422, "adobe-logo", "Jardin Botanique de l\u2019Universit\u00e9 de Fribourg", "Italy", "2021 \u2192 2024", "Conservation of threatened woody species", "Conservation\/restoration | Awareness raising", "conservation-of-threatened-woody-species");
  
    infoWindows[49]= new InfoBox(myOptions);
  
    var markerLatLng= new google.maps.LatLng (38.001176887326,12.837406705957036);
    var marker = new google.maps.Marker({
      position: markerLatLng,
      map: map,
      cursor: 'default',
      item: 49,
    icon: iconpointer,
      category: "category_3 category_4 "
    });
  
       marker.addListener('mouseout', function() {
    });
    
    if(!isTouchDevice){
      
     marker.addListener('mouseover', function() {
      closeAllInfoWindows();
      infoWindows[this.item].open(map, this);
      });  
      
     marker.addListener('click', function() {
     // TODO: Customize this URL to point to your specific project page
     // Alternative: Use getLocalizedUrl("your-project-slug") if you uncomment the function above
     window.location.href = '/';
       
    });
    } else {
      
      
    marker.addListener('click', function() {
      closeAllInfoWindows();
      infoWindows[this.item].open(map, this);
    });  
      
      
    }
  
  
    markers.push(marker);
    bounds.extend(markerLatLng);
      
    
    var myOptions = popupoption;
    myOptions.content=createInfoBoxContent(346, "adobe-logo", "Fondation Biovision", "Uganda", "2021 \u2192 2024", "Mpigi forest school", "Conservation\/restoration | Awareness raising | Ancestral knowledge", "mpigi-forest-school");
  
    infoWindows[36]= new InfoBox(myOptions);
  
    var markerLatLng= new google.maps.LatLng (0.22334242022110062,32.326466154199224);
    var marker = new google.maps.Marker({
      position: markerLatLng,
      map: map,
      cursor: 'default',
      item: 36,
    icon: iconpointer,
      category: "category_3 category_4 category_5 "
    });
  
       marker.addListener('mouseout', function() {
    });
    
    if(!isTouchDevice){
      
     marker.addListener('mouseover', function() {
      closeAllInfoWindows();
      infoWindows[this.item].open(map, this);
      });  
      
     marker.addListener('click', function() {
     // TODO: Customize this URL to point to your specific project page
     // Alternative: Use getLocalizedUrl("your-project-slug") if you uncomment the function above
     window.location.href = '/';
       
    });
    } else {
      
      
    marker.addListener('click', function() {
      closeAllInfoWindows();
      infoWindows[this.item].open(map, this);
    });  
      
      
    }
  
  
    markers.push(marker);
    bounds.extend(markerLatLng);
      
    
    var myOptions = popupoption;
    myOptions.content=createInfoBoxContent(207, "adobe-logo", "Association des Amis de l\u2019ESEP (\u00c9tablissement scolaire Elisabeth de Portes)", "Switzerland", "2021 \u2192 2027", "", "Conservation\/restoration | Awareness raising", "13");
  
    infoWindows[13]= new InfoBox(myOptions);
  
    var markerLatLng= new google.maps.LatLng (46.379031187688376,6.171913456063849);
    var marker = new google.maps.Marker({
      position: markerLatLng,
      map: map,
      cursor: 'default',
      item: 13,
    icon: iconpointer,
      category: "category_3 category_4 "
    });
  
       marker.addListener('mouseout', function() {
    });
    
    if(!isTouchDevice){
      
     marker.addListener('mouseover', function() {
      closeAllInfoWindows();
      infoWindows[this.item].open(map, this);
      });  
      
     marker.addListener('click', function() {
     // TODO: Customize this URL to point to your specific project page
     // Alternative: Use getLocalizedUrl("your-project-slug") if you uncomment the function above
     window.location.href = '/';
       
    });
    } else {
      
      
    marker.addListener('click', function() {
      closeAllInfoWindows();
      infoWindows[this.item].open(map, this);
    });  
      
      
    }
  
  
    markers.push(marker);
    bounds.extend(markerLatLng);
      
    
    var myOptions = popupoption;
    myOptions.content=createInfoBoxContent(210, "adobe-logo", "Commune de Burtigny", "Switzerland", "2021 \u2192 2024", "Fruit-producing edges of the Grandes Tattes forest", "Conservation\/restoration", "fruit-producing-edges-of-the-grandes-tattes-forest-14");
  
    infoWindows[14]= new InfoBox(myOptions);
  
    var markerLatLng= new google.maps.LatLng (46.46778623607813,6.258226942163092);
    var marker = new google.maps.Marker({
      position: markerLatLng,
      map: map,
      cursor: 'default',
      item: 14,
    icon: iconpointer,
      category: "category_3 "
    });
  
       marker.addListener('mouseout', function() {
    });
    
    if(!isTouchDevice){
      
     marker.addListener('mouseover', function() {
      closeAllInfoWindows();
      infoWindows[this.item].open(map, this);
      });  
      
     marker.addListener('click', function() {
     // TODO: Customize this URL to point to your specific project page
     // Alternative: Use getLocalizedUrl("your-project-slug") if you uncomment the function above
     window.location.href = '/';
       
    });
    } else {
      
      
    marker.addListener('click', function() {
      closeAllInfoWindows();
      infoWindows[this.item].open(map, this);
    });  
      
      
    }
  
  
    markers.push(marker);
    bounds.extend(markerLatLng);
      
    
    var myOptions = popupoption;
    myOptions.content=createInfoBoxContent(309, "adobe-logo", "Aquaverde", "Brazil", "2021 \u2192 2022", "Reinforcing the traditional medicinal plant culture and reforestation of the Surui territory", "Conservation\/restoration | Ancestral knowledge", "reinforcing-the-traditional-medicinal-plant-culture-and-refo");
  
    infoWindows[30]= new InfoBox(myOptions);
  
    var markerLatLng= new google.maps.LatLng (-28.138443394923552,-54.45968954648437);
    var marker = new google.maps.Marker({
      position: markerLatLng,
      map: map,
      cursor: 'default',
      item: 30,
    icon: iconpointer,
      category: "category_3 category_5 "
    });
  
       marker.addListener('mouseout', function() {
    });
    
    if(!isTouchDevice){
      
     marker.addListener('mouseover', function() {
      closeAllInfoWindows();
      infoWindows[this.item].open(map, this);
      });  
      
     marker.addListener('click', function() {
     // TODO: Customize this URL to point to your specific project page
     // Alternative: Use getLocalizedUrl("your-project-slug") if you uncomment the function above
     window.location.href = '/';
       
    });
    } else {
      
      
    marker.addListener('click', function() {
      closeAllInfoWindows();
      infoWindows[this.item].open(map, this);
    });  
      
      
    }
  
  
    markers.push(marker);
    bounds.extend(markerLatLng);
      
    
    var myOptions = popupoption;
    myOptions.content=createInfoBoxContent(462, "adobe-logo", "Secodev", "Democratic Republic of the Congo (DRC)", "2021 \u2192 2023", "Reforestation and agroforestry on the Bat\u00e9k\u00e9 plateau", "Conservation\/restoration | Awareness raising", "reforestation-and-agroforestry-on-the-bateke-plateau");
  
    infoWindows[57]= new InfoBox(myOptions);
  
    var markerLatLng= new google.maps.LatLng (-4.124363138066986,15.72372109804688);
    var marker = new google.maps.Marker({
      position: markerLatLng,
      map: map,
      cursor: 'default',
      item: 57,
    icon: iconpointer,
      category: "category_3 category_4 "
    });
  
       marker.addListener('mouseout', function() {
    });
    
    if(!isTouchDevice){
      
     marker.addListener('mouseover', function() {
      closeAllInfoWindows();
      infoWindows[this.item].open(map, this);
      });  
      
     marker.addListener('click', function() {
     // TODO: Customize this URL to point to your specific project page
     // Alternative: Use getLocalizedUrl("your-project-slug") if you uncomment the function above
     window.location.href = '/';
       
    });
    } else {
      
      
    marker.addListener('click', function() {
      closeAllInfoWindows();
      infoWindows[this.item].open(map, this);
    });  
      
      
    }
  
  
    markers.push(marker);
    bounds.extend(markerLatLng);
      
    
    var myOptions = popupoption;
    myOptions.content=createInfoBoxContent(383, "adobe-logo", "Fauna & Flora International (FFI)", "Tadjikistan", "2020 \u2192 2024", "Supporting local communities through the conservation of ancient fruit and nut forests", "Conservation\/restoration", "supporting-local-communities-through-the-conservation-of-anc");
  
    infoWindows[43]= new InfoBox(myOptions);
  
    var markerLatLng= new google.maps.LatLng (37.63395496487682,70.08819253359376);
    var marker = new google.maps.Marker({
      position: markerLatLng,
      map: map,
      cursor: 'default',
      item: 43,
    icon: iconpointer,
      category: "category_3 "
    });
  
       marker.addListener('mouseout', function() {
    });
    
    if(!isTouchDevice){
      
     marker.addListener('mouseover', function() {
      closeAllInfoWindows();
      infoWindows[this.item].open(map, this);
      });  
      
     marker.addListener('click', function() {
     // TODO: Customize this URL to point to your specific project page
     // Alternative: Use getLocalizedUrl("your-project-slug") if you uncomment the function above
     window.location.href = '/';
       
    });
    } else {
      
      
    marker.addListener('click', function() {
      closeAllInfoWindows();
      infoWindows[this.item].open(map, this);
    });  
      
      
    }
  
  
    markers.push(marker);
    bounds.extend(markerLatLng);
      
    
    var myOptions = popupoption;
    myOptions.content=createInfoBoxContent(402, "adobe-logo", "Inter Aide", "Malawi", "2020 \u2192 2024", "Improving the lives of rural communities through the planting of agroforestry groves and by adopting agro-ecological practices", "Conservation\/restoration | Awareness raising", "improving-the-lives-of-rural-communities-through-the-plantin");
  
    infoWindows[47]= new InfoBox(myOptions);
  
    var markerLatLng= new google.maps.LatLng (-14.023175094263374,33.759152006250005);
    var marker = new google.maps.Marker({
      position: markerLatLng,
      map: map,
      cursor: 'default',
      item: 47,
    icon: iconpointer,
      category: "category_3 category_4 "
    });
  
       marker.addListener('mouseout', function() {
    });
    
    if(!isTouchDevice){
      
     marker.addListener('mouseover', function() {
      closeAllInfoWindows();
      infoWindows[this.item].open(map, this);
      });  
      
     marker.addListener('click', function() {
     // TODO: Customize this URL to point to your specific project page
     // Alternative: Use getLocalizedUrl("your-project-slug") if you uncomment the function above
     window.location.href = '/';
       
    });
    } else {
      
      
    marker.addListener('click', function() {
      closeAllInfoWindows();
      infoWindows[this.item].open(map, this);
    });  
      
      
    }
  
  
    markers.push(marker);
    bounds.extend(markerLatLng);
      
    
    var myOptions = popupoption;
    myOptions.content=createInfoBoxContent(374, "adobe-logo", "Fairventures Worldwide", "Uganda", "2020 \u2192 2023", "Sustainable mass timber construction for resilient rural economies", "Conservation\/restoration", "sustainable-mass-timber-construction-for-resilient-rural-eco");
  
    infoWindows[41]= new InfoBox(myOptions);
  
    var markerLatLng= new google.maps.LatLng (1.1577887202339086,31.784359525781216);
    var marker = new google.maps.Marker({
      position: markerLatLng,
      map: map,
      cursor: 'default',
      item: 41,
    icon: iconpointer,
      category: "category_3 "
    });
  
       marker.addListener('mouseout', function() {
    });
    
    if(!isTouchDevice){
      
     marker.addListener('mouseover', function() {
      closeAllInfoWindows();
      infoWindows[this.item].open(map, this);
      });  
      
     marker.addListener('click', function() {
     // TODO: Customize this URL to point to your specific project page
     // Alternative: Use getLocalizedUrl("your-project-slug") if you uncomment the function above
     window.location.href = '/';
       
    });
    } else {
      
      
    marker.addListener('click', function() {
      closeAllInfoWindows();
      infoWindows[this.item].open(map, this);
    });  
      
      
    }
  
  
    markers.push(marker);
    bounds.extend(markerLatLng);
      
    
    var myOptions = popupoption;
    myOptions.content=createInfoBoxContent(396, "adobe-logo", "Itombwe G\u00e9n\u00e9ration pour l\u2019Humanit\u00e9 (IGH)", "Democratic Republic of the Congo (DRC)", "2020 \u2192 2023", "Itombwe forest conservation", "Conservation\/restoration | Awareness raising", "itombwe-forest-conservation");
  
    infoWindows[46]= new InfoBox(myOptions);
  
    var markerLatLng= new google.maps.LatLng (-3.572176858726391,28.606564115625005);
    var marker = new google.maps.Marker({
      position: markerLatLng,
      map: map,
      cursor: 'default',
      item: 46,
    icon: iconpointer,
      category: "category_3 category_4 "
    });
  
       marker.addListener('mouseout', function() {
    });
    
    if(!isTouchDevice){
      
     marker.addListener('mouseover', function() {
      closeAllInfoWindows();
      infoWindows[this.item].open(map, this);
      });  
      
     marker.addListener('click', function() {
     // TODO: Customize this URL to point to your specific project page
     // Alternative: Use getLocalizedUrl("your-project-slug") if you uncomment the function above
     window.location.href = '/';
       
    });
    } else {
      
      
    marker.addListener('click', function() {
      closeAllInfoWindows();
      infoWindows[this.item].open(map, this);
    });  
      
      
    }
  
  
    markers.push(marker);
    bounds.extend(markerLatLng);
      
    
    var myOptions = popupoption;
    myOptions.content=createInfoBoxContent(228, "adobe-logo", "Gret", "Vietnam", "2020 \u2192 2024", "Empowering ethnic minority women through sustainable forest management in nature reserves", "Conservation\/restoration | Awareness raising", "empowering-ethnic-minority-women-for-sustainable-forest-mana");
  
    infoWindows[17]= new InfoBox(myOptions);
  
    var markerLatLng= new google.maps.LatLng (20.463214410750734,105.20822198305665);
    var marker = new google.maps.Marker({
      position: markerLatLng,
      map: map,
      cursor: 'default',
      item: 17,
    icon: iconpointer,
      category: "category_3 category_4 "
    });
  
       marker.addListener('mouseout', function() {
    });
    
    if(!isTouchDevice){
      
     marker.addListener('mouseover', function() {
      closeAllInfoWindows();
      infoWindows[this.item].open(map, this);
      });  
      
     marker.addListener('click', function() {
     // TODO: Customize this URL to point to your specific project page
     // Alternative: Use getLocalizedUrl("your-project-slug") if you uncomment the function above
     window.location.href = '/';
       
    });
    } else {
      
      
    marker.addListener('click', function() {
      closeAllInfoWindows();
      infoWindows[this.item].open(map, this);
    });  
      
      
    }
  
  
    markers.push(marker);
    bounds.extend(markerLatLng);
      
    
    var myOptions = popupoption;
    myOptions.content=createInfoBoxContent(368, "adobe-logo", "Experts-Solidaires", "Benin", "2020 \u2192 2022", "Integrated forest resource management", "Conservation\/restoration | Awareness raising", "integrated-forest-resource-management");
  
    infoWindows[40]= new InfoBox(myOptions);
  
    var markerLatLng= new google.maps.LatLng (7.967619048184017,2.2400632611328186);
    var marker = new google.maps.Marker({
      position: markerLatLng,
      map: map,
      cursor: 'default',
      item: 40,
    icon: iconpointer,
      category: "category_3 category_4 "
    });
  
       marker.addListener('mouseout', function() {
    });
    
    if(!isTouchDevice){
      
     marker.addListener('mouseover', function() {
      closeAllInfoWindows();
      infoWindows[this.item].open(map, this);
      });  
      
     marker.addListener('click', function() {
     // TODO: Customize this URL to point to your specific project page
     // Alternative: Use getLocalizedUrl("your-project-slug") if you uncomment the function above
     window.location.href = '/';
       
    });
    } else {
      
      
    marker.addListener('click', function() {
      closeAllInfoWindows();
      infoWindows[this.item].open(map, this);
    });  
      
      
    }
  
  
    markers.push(marker);
    bounds.extend(markerLatLng);
      
    
    var myOptions = popupoption;
    myOptions.content=createInfoBoxContent(438, "adobe-logo", "Pragya", "India", "2020 \u2192 2024", "Ancestral knowledge preservation, conservation and cultivation of endangered medicinal and aromatic plants in the Himalayas", "Conservation\/restoration | Awareness raising | Ancestral knowledge", "ancestral-knowledge-preservation-conservation-and-cultivatio");
  
    infoWindows[53]= new InfoBox(myOptions);
  
    var markerLatLng= new google.maps.LatLng (32.554202411153724,76.12517983828126);
    var marker = new google.maps.Marker({
      position: markerLatLng,
      map: map,
      cursor: 'default',
      item: 53,
    icon: iconpointer,
      category: "category_3 category_4 category_5 "
    });
  
       marker.addListener('mouseout', function() {
    });
    
    if(!isTouchDevice){
      
     marker.addListener('mouseover', function() {
      closeAllInfoWindows();
      infoWindows[this.item].open(map, this);
      });  
      
     marker.addListener('click', function() {
     // TODO: Customize this URL to point to your specific project page
     // Alternative: Use getLocalizedUrl("your-project-slug") if you uncomment the function above
     window.location.href = '/';
       
    });
    } else {
      
      
    marker.addListener('click', function() {
      closeAllInfoWindows();
      infoWindows[this.item].open(map, this);
    });  
      
      
    }
  
  
    markers.push(marker);
    bounds.extend(markerLatLng);
      
    
    var myOptions = popupoption;
    myOptions.content=createInfoBoxContent(280, "adobe-logo", "The National Forest Company", "England", "2020 \u2192 2024", "Creating a forest for learning II", "Awareness raising", "creating-a-forest-for-learning-ii");
  
    infoWindows[26]= new InfoBox(myOptions);
  
    var markerLatLng= new google.maps.LatLng (52.736844312334966,-1.5430101641601501);
    var marker = new google.maps.Marker({
      position: markerLatLng,
      map: map,
      cursor: 'default',
      item: 26,
    icon: iconpointer,
      category: "category_4 "
    });
  
       marker.addListener('mouseout', function() {
    });
    
    if(!isTouchDevice){
      
     marker.addListener('mouseover', function() {
      closeAllInfoWindows();
      infoWindows[this.item].open(map, this);
      });  
      
     marker.addListener('click', function() {
     // TODO: Customize this URL to point to your specific project page
     // Alternative: Use getLocalizedUrl("your-project-slug") if you uncomment the function above
     window.location.href = '/';
       
    });
    } else {
      
      
    marker.addListener('click', function() {
      closeAllInfoWindows();
      infoWindows[this.item].open(map, this);
    });  
      
      
    }
  
  
    markers.push(marker);
    bounds.extend(markerLatLng);
      
    
    var myOptions = popupoption;
    myOptions.content=createInfoBoxContent(188, "adobe-logo", "Conservatoire et Jardin botaniques de la Ville de Gen\u00e8ve (CJBG)", "Benin | Ghana | C\u00f4te d\u2019Ivoire", "2020 \u2192 2027", "Multipalms", "Conservation\/restoration | Awareness raising", "multipalms");
  
    infoWindows[10]= new InfoBox(myOptions);
  
    var markerLatLng= new google.maps.LatLng (6.4260302562071105,2.332760404687506);
    var marker = new google.maps.Marker({
      position: markerLatLng,
      map: map,
      cursor: 'default',
      item: 10,
    icon: iconpointer,
      category: "category_3 category_4 "
    });
  
       marker.addListener('mouseout', function() {
    });
    
    if(!isTouchDevice){
      
     marker.addListener('mouseover', function() {
      closeAllInfoWindows();
      infoWindows[this.item].open(map, this);
      });  
      
     marker.addListener('click', function() {
     // TODO: Customize this URL to point to your specific project page
     // Alternative: Use getLocalizedUrl("your-project-slug") if you uncomment the function above
     window.location.href = '/';
       
    });
    } else {
      
      
    marker.addListener('click', function() {
      closeAllInfoWindows();
      infoWindows[this.item].open(map, this);
    });  
      
      
    }
  
  
    markers.push(marker);
    bounds.extend(markerLatLng);
      
    
    var myOptions = popupoption;
    myOptions.content=createInfoBoxContent(480, "adobe-logo", "Trees for Life", "Scotland", "2020 \u2192 2023", "Dundreggan Rewilding Centre", "Awareness raising | Ancestral knowledge", "dundreggan-rewilding-centre");
  
    infoWindows[60]= new InfoBox(myOptions);
  
    var markerLatLng= new google.maps.LatLng (57.19217530540564,-4.764160800833124);
    var marker = new google.maps.Marker({
      position: markerLatLng,
      map: map,
      cursor: 'default',
      item: 60,
    icon: iconpointer,
      category: "category_4 category_5 "
    });
  
       marker.addListener('mouseout', function() {
    });
    
    if(!isTouchDevice){
      
     marker.addListener('mouseover', function() {
      closeAllInfoWindows();
      infoWindows[this.item].open(map, this);
      });  
      
     marker.addListener('click', function() {
     // TODO: Customize this URL to point to your specific project page
     // Alternative: Use getLocalizedUrl("your-project-slug") if you uncomment the function above
     window.location.href = '/';
       
    });
    } else {
      
      
    marker.addListener('click', function() {
      closeAllInfoWindows();
      infoWindows[this.item].open(map, this);
    });  
      
      
    }
  
  
    markers.push(marker);
    bounds.extend(markerLatLng);
      
    
    var myOptions = popupoption;
    myOptions.content=createInfoBoxContent(433, "adobe-logo", "Fondation PanEco", "Indonesia", "2020 \u2192 2023", "Environmental education centres", "Conservation\/restoration | Awareness raising", "environmental-education-centres");
  
    infoWindows[52]= new InfoBox(myOptions);
  
    var markerLatLng= new google.maps.LatLng (3.524569509450483,98.18778664980474);
    var marker = new google.maps.Marker({
      position: markerLatLng,
      map: map,
      cursor: 'default',
      item: 52,
    icon: iconpointer,
      category: "category_3 category_4 "
    });
  
       marker.addListener('mouseout', function() {
    });
    
    if(!isTouchDevice){
      
     marker.addListener('mouseover', function() {
      closeAllInfoWindows();
      infoWindows[this.item].open(map, this);
      });  
      
     marker.addListener('click', function() {
     // TODO: Customize this URL to point to your specific project page
     // Alternative: Use getLocalizedUrl("your-project-slug") if you uncomment the function above
     window.location.href = '/';
       
    });
    } else {
      
      
    marker.addListener('click', function() {
      closeAllInfoWindows();
      infoWindows[this.item].open(map, this);
    });  
      
      
    }
  
  
    markers.push(marker);
    bounds.extend(markerLatLng);
      
    
    var myOptions = popupoption;
    myOptions.content=createInfoBoxContent(322, "adobe-logo", "Arutam Z\u00e9ro D\u00e9forestation", "Mexico", "2020 \u2192 2022", "Support for traditional Mayan agriculture and raising awareness of family nutrition", "Conservation\/restoration | Awareness raising | Ancestral knowledge", "support-for-traditional-mayan-agriculture-and-raising-awaren");
  
    infoWindows[32]= new InfoBox(myOptions);
  
    var markerLatLng= new google.maps.LatLng (20.78453404669676,-88.02017538632812);
    var marker = new google.maps.Marker({
      position: markerLatLng,
      map: map,
      cursor: 'default',
      item: 32,
    icon: iconpointer,
      category: "category_3 category_4 category_5 "
    });
  
       marker.addListener('mouseout', function() {
    });
    
    if(!isTouchDevice){
      
     marker.addListener('mouseover', function() {
      closeAllInfoWindows();
      infoWindows[this.item].open(map, this);
      });  
      
     marker.addListener('click', function() {
     // TODO: Customize this URL to point to your specific project page
     // Alternative: Use getLocalizedUrl("your-project-slug") if you uncomment the function above
     window.location.href = '/';
       
    });
    } else {
      
      
    marker.addListener('click', function() {
      closeAllInfoWindows();
      infoWindows[this.item].open(map, this);
    });  
      
      
    }
  
  
    markers.push(marker);
    bounds.extend(markerLatLng);
      
    
    var myOptions = popupoption;
    myOptions.content=createInfoBoxContent(467, "adobe-logo", "SHEN", "Armenia", "2019 \u2192 2023", "Afforestation of Chambarak and Ttujur communities", "Conservation\/restoration | Awareness raising", "afforestation-of-chambarak-and-ttujur-communities");
  
    infoWindows[58]= new InfoBox(myOptions);
  
    var markerLatLng= new google.maps.LatLng (40.57133613137613,44.45846230898438);
    var marker = new google.maps.Marker({
      position: markerLatLng,
      map: map,
      cursor: 'default',
      item: 58,
    icon: iconpointer,
      category: "category_3 category_4 "
    });
  
       marker.addListener('mouseout', function() {
    });
    
    if(!isTouchDevice){
      
     marker.addListener('mouseover', function() {
      closeAllInfoWindows();
      infoWindows[this.item].open(map, this);
      });  
      
     marker.addListener('click', function() {
     // TODO: Customize this URL to point to your specific project page
     // Alternative: Use getLocalizedUrl("your-project-slug") if you uncomment the function above
     window.location.href = '/';
       
    });
    } else {
      
      
    marker.addListener('click', function() {
      closeAllInfoWindows();
      infoWindows[this.item].open(map, this);
    });  
      
      
    }
  
  
    markers.push(marker);
    bounds.extend(markerLatLng);
      
    
    var myOptions = popupoption;
    myOptions.content=createInfoBoxContent(472, "adobe-logo", "Fondation Silviva", "Switzerland", "2019 \u2192 2022", "The Forester\u2019s world", "Awareness raising", "the-foresters-world");
  
    infoWindows[59]= new InfoBox(myOptions);
  
    var markerLatLng= new google.maps.LatLng (47.133349901575436,7.245091434460265);
    var marker = new google.maps.Marker({
      position: markerLatLng,
      map: map,
      cursor: 'default',
      item: 59,
    icon: iconpointer,
      category: "category_4 "
    });
  
       marker.addListener('mouseout', function() {
    });
    
    if(!isTouchDevice){
      
     marker.addListener('mouseover', function() {
      closeAllInfoWindows();
      infoWindows[this.item].open(map, this);
      });  
      
     marker.addListener('click', function() {
     // TODO: Customize this URL to point to your specific project page
     // Alternative: Use getLocalizedUrl("your-project-slug") if you uncomment the function above
     window.location.href = '/';
       
    });
    } else {
      
      
    marker.addListener('click', function() {
      closeAllInfoWindows();
      infoWindows[this.item].open(map, this);
    });  
      
      
    }
  
  
    markers.push(marker);
    bounds.extend(markerLatLng);
      
    
    var myOptions = popupoption;
    myOptions.content=createInfoBoxContent(823, "adobe-logo", "Helpsimus (Association fran\u00e7aise pour la sauvegarde du grand hapal\u00e9mur)", "Madagascar", "2019 \u2192 2023", "Stepping up protection for Madagascar\u2019s largest wild population of greater bamboo lemurs", "Conservation\/restoration | Awareness raising", "stepping-up-protection-for-madagascars-largest-wild-populati");
  
    infoWindows[45]= new InfoBox(myOptions);
  
    var markerLatLng= new google.maps.LatLng (-21.177838365615315,47.56845147524407);
    var marker = new google.maps.Marker({
      position: markerLatLng,
      map: map,
      cursor: 'default',
      item: 45,
    icon: iconpointer,
      category: "category_3 category_4 "
    });
  
       marker.addListener('mouseout', function() {
    });
    
    if(!isTouchDevice){
      
     marker.addListener('mouseover', function() {
      closeAllInfoWindows();
      infoWindows[this.item].open(map, this);
      });  
      
     marker.addListener('click', function() {
     // TODO: Customize this URL to point to your specific project page
     // Alternative: Use getLocalizedUrl("your-project-slug") if you uncomment the function above
     window.location.href = '/';
       
    });
    } else {
      
      
    marker.addListener('click', function() {
      closeAllInfoWindows();
      infoWindows[this.item].open(map, this);
    });  
      
      
    }
  
  
    markers.push(marker);
    bounds.extend(markerLatLng);
      
    
    var myOptions = popupoption;
    myOptions.content=createInfoBoxContent(447, "adobe-logo", "R\u00e9seau \u00e9cologique La Fronti\u00e8re", "Switzerland", "2019 \u2192 2022", "Landscape and biodiversity", "Conservation\/restoration | Awareness raising", "landscape-and-biodiversity");
  
    infoWindows[55]= new InfoBox(myOptions);
  
    var markerLatLng= new google.maps.LatLng (46.410530954566774,6.17188126955567);
    var marker = new google.maps.Marker({
      position: markerLatLng,
      map: map,
      cursor: 'default',
      item: 55,
    icon: iconpointer,
      category: "category_3 category_4 "
    });
  
       marker.addListener('mouseout', function() {
    });
    
    if(!isTouchDevice){
      
     marker.addListener('mouseover', function() {
      closeAllInfoWindows();
      infoWindows[this.item].open(map, this);
      });  
      
     marker.addListener('click', function() {
     // TODO: Customize this URL to point to your specific project page
     // Alternative: Use getLocalizedUrl("your-project-slug") if you uncomment the function above
     window.location.href = '/';
       
    });
    } else {
      
      
    marker.addListener('click', function() {
      closeAllInfoWindows();
      infoWindows[this.item].open(map, this);
    });  
      
      
    }
  
  
    markers.push(marker);
    bounds.extend(markerLatLng);
      
    
    var myOptions = popupoption;
    myOptions.content=createInfoBoxContent(193, "adobe-logo", "Envol Vert", "Colombia", "2019 \u2192 2025", "Preserving the last dry forests through agroforestry", "Conservation\/restoration | Awareness raising", "preserver-les-dernieres-forets-seches-par-lagroforesterie");
  
    infoWindows[11]= new InfoBox(myOptions);
  
    var markerLatLng= new google.maps.LatLng (10.62918702242603,-75.22380678739017);
    var marker = new google.maps.Marker({
      position: markerLatLng,
      map: map,
      cursor: 'default',
      item: 11,
    icon: iconpointer,
      category: "category_3 category_4 "
    });
  
       marker.addListener('mouseout', function() {
    });
    
    if(!isTouchDevice){
      
     marker.addListener('mouseover', function() {
      closeAllInfoWindows();
      infoWindows[this.item].open(map, this);
      });  
      
     marker.addListener('click', function() {
     // TODO: Customize this URL to point to your specific project page
     // Alternative: Use getLocalizedUrl("your-project-slug") if you uncomment the function above
     window.location.href = '/';
       
    });
    } else {
      
      
    marker.addListener('click', function() {
      closeAllInfoWindows();
      infoWindows[this.item].open(map, this);
    });  
      
      
    }
  
  
    markers.push(marker);
    bounds.extend(markerLatLng);
      
    
    
     markerCluster = new MarkerClusterer(map, markers, {
              imagePath: '/assets/images/',
              styles:[
                  {
                      url: 'https://main--map-demo--meejain.aem.page/assets/images/closter1.png',
                      width: 56,
                      height: 56,
                      textColor: '#ffffff',
                      textSize: 12
                  }
              ]
          });
  
          map.fitBounds(bounds);
          
          // Hide map initially to prevent seeing zoom transition
          document.getElementById('map').style.opacity = '0';
          
          // Use timeout to ensure map is fully loaded before showing
          setTimeout(() => {
              
              // Show map after it's fully loaded
              document.getElementById('map').style.opacity = '1';
              document.getElementById('map').style.transition = 'opacity 0.3s ease-in';
          }, 500);
         //$(window).trigger("resize");
        //google.maps.event.addDomListener(window,"resize",function(){ google.maps.event.trigger(map,"resize"); map.fitBounds(bounds, {bottom:1, left:1, right:1, top:99});});
      
      
     // Crée les boutons de zoom personnalisés
        var zoomInButton = document.createElement('div');
        zoomInButton.className = 'custom-zoom-button';
        zoomInButton.id = 'zoom-in';
        zoomInButton.innerHTML = '<img src="/icons/btn_arbres_plus.svg" alt="Zoom In" style="width: 24px; height: 24px;">';
        zoomInButton.title = 'Zoom In';
        document.getElementById('map').appendChild(zoomInButton);
  
        var zoomOutButton = document.createElement('div');
        zoomOutButton.className = 'custom-zoom-button';
        zoomOutButton.id = 'zoom-out';
        zoomOutButton.innerHTML = '<img src="/icons/btn_arbres_moins.svg" alt="Zoom Out" style="width: 24px; height: 24px;">';
        zoomOutButton.title = 'Zoom Out';
        document.getElementById('map').appendChild(zoomOutButton);
  
        // Ajoute des écouteurs d'événements pour les boutons de zoom
        zoomInButton.addEventListener('click', function() {
          console.log('Zoom In clicked - Current zoom:', map.getZoom());
          map.setZoom(map.getZoom() + 1);
          console.log('Zoom In clicked - New zoom:', map.getZoom());
        });
  
        zoomOutButton.addEventListener('click', function() {
          console.log('Zoom Out clicked - Current zoom:', map.getZoom());
          map.setZoom(map.getZoom() - 1);
          console.log('Zoom Out clicked - New zoom:', map.getZoom());
        });  
      
      
      
      
  }
   
  document.addEventListener('DOMContentLoaded', function(){
          
          // Debug: Check if category links exist
          setTimeout(() => {
              const categoryLinks = document.querySelectorAll('a.works_categorylink');
              console.log('Found category links:', categoryLinks.length);
              categoryLinks.forEach((link, index) => {
                  console.log(`Link ${index}:`, link, 'data-categoryid:', link.getAttribute('data-categoryid'));
              });
              
              if (categoryLinks.length === 0) {
                  console.log('No category links found! Checking for cards...');
                  const cards = document.querySelectorAll('.cards.map-category');
                  console.log('Found map-category cards:', cards.length);
                  const allAnchors = document.querySelectorAll('.cards.map-category a');
                  console.log('Found anchors in map-category cards:', allAnchors.length);
              }
          }, 2000); // Wait 2 seconds for cards to load
  
                     // Vanilla JS event handler for category filtering
          document.addEventListener('click', function(e) {
              console.log('Document click detected on:', e.target);
              
              // Check for various possible targets
              const clickedAnchor = e.target.closest('a.works_categorylink') || 
                                   e.target.closest('a[data-categoryid]') ||
                                   (e.target.tagName === 'A' && e.target.classList.contains('works_categorylink'));
              
              if (clickedAnchor) {
                  console.log('Vanilla JS: Category link clicked!', clickedAnchor);
                  e.preventDefault();
                  // Don't stop propagation - we want this to work
                  
                  const clickedLink = clickedAnchor; // Use the found anchor
                  const myslectcat = clickedLink.getAttribute('data-categoryid');
                  console.log('Vanilla JS: Selected category:', myslectcat);
                  
                  // Remove active class from all
                  document.querySelectorAll('a.works_categorylink').forEach(link => {
                      link.classList.remove('active');
                  });
                  
                  // Add active class to clicked
                  clickedLink.classList.add('active');
                  console.log('Vanilla JS: Active class updated');
                  
                                    // Use the shared filtering function
                  if (window.filterMapByCategory) {
                      window.filterMapByCategory(myslectcat);
                      console.log('Vanilla JS: Map filtering completed');
                  }
              }
          });
  
  });
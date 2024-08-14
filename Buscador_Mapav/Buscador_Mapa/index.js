function initMap() {
    var myLatLng = { lat: 41.38620, lng: 2.16662 };
    var mapOptions = {
        zoom: 13,
        center: myLatLng,
        minZoom: 2,
        maxZoom: 18,
        zoomControl: true, // Habilita el control de zoom
        mapTypeControl: false, // Deshabilita el control de tipo de mapa
        scaleControl: false, // Deshabilita el control de escala
        streetViewControl: false, // Deshabilita el control de Street View
        rotateControl: false, // Deshabilita el control de rotación
        fullscreenControl: false,
        // disableDefaultUI: true,
        mapId: '949d446c3f6ca3ee' // Utiliza el ID del estilo de Cloud-based Maps Styling
    };
    var map = new google.maps.Map(document.getElementById('map'), mapOptions);
   
    loadPOI(map, myLatLng);
    loadmarkers(map);
    
  // Add listeners for map events
  map.addListener('idle', function() {
    if (map.getZoom() !== 13 || !map.getCenter().equals(myLatLng)) {
        // Only show loader if zoom or center has changed
        showLoader();
        loadPOI(map);
        setTimeout(hideLoader, 1000); // Hide loader after 1 second (adjust as needed)
    } else {
        hideLoader();
    }
});

map.addListener('zoom_changed', function() {
    showLoader();
    loadPOI(map);
});

map.addListener('dragstart', function() {
    showLoader();
});

map.addListener('dragend', function() {
    setTimeout(hideLoader, 1000); // Hide loader after 1 second (adjust as needed)
});
}

function showLoader() {
document.getElementById('loader').style.display = 'flex'; // Show loader
}

function hideLoader() {
document.getElementById('loader').style.display = 'none'; // Hide loader

}

function loadmarkers(map) {
    // Crear los marcadores
    markersData.forEach(data => {
        // Crear el elemento de ícono SVG
        const svgIcon = document.createElement('div');
        svgIcon.className = 'marker-icon';
        svgIcon.style.width = '21.289px';
        svgIcon.style.height = '27.029px';
        svgIcon.style.flexShrink = '0';
        svgIcon.style.display = 'flex';
        svgIcon.style.alignItems = 'center';
        svgIcon.style.justifyContent = 'center'; // Centrar el SVG dentro del contenedor

        svgIcon.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="28" viewBox="0 0 22 28" fill="none">
                <!-- Definición del filtro para la sombra -->
                <defs>
                    <filter id="shadow" x="0" y="0" width="150%" height="150%">
                        <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="rgba(24, 28, 22, 0.10)" />
                    </filter>
                </defs>
                <path d="M10.9998 27.5289C7.47484 24.4116 4.81959 21.5044 3.03409 18.8071C1.24834 16.1101 0.355469 13.6559 0.355469 11.4444C0.355469 8.27112 1.38872 5.65375 3.45522 3.59225C5.52147 1.53075 8.03634 0.5 10.9998 0.5C13.9633 0.5 16.4782 1.53075 18.5445 3.59225C20.611 5.65375 21.6442 8.27112 21.6442 11.4444C21.6442 13.6559 20.7513 16.1101 18.9656 18.8071C17.1801 21.5044 14.5248 24.4116 10.9998 27.5289Z" fill="#F9FBF9" filter="url(#shadow)"/>
                <path d="M17.6865 18.0282C16.048 20.5657 13.8191 23.0615 10.9998 25.5155C8.18059 23.0615 5.95172 20.5657 4.31322 18.0282C2.67472 15.4907 1.85547 13.2961 1.85547 11.4444C1.85547 8.70012 2.72422 6.43513 4.46172 4.64938C6.19922 2.86388 8.37859 2 10.9998 2C13.6211 2 15.8005 2.86388 17.538 4.64938C19.2755 6.43513 20.1442 8.70012 20.1442 11.4444C20.1442 13.2961 19.325 15.4907 17.6865 18.0282Z" fill="#6F8C6E" filter="url(#shadow)"/>
            </svg>`;

        const advancedMarker = new google.maps.marker.AdvancedMarkerElement({
            position: { lat: parseFloat(data.lat), lng: parseFloat(data.lng) },
            content: svgIcon,
        });
        advancedMarker.map = map;
    });
}





function loadPOI(map){
    var center = map.getCenter();
    var service = new google.maps.places.PlacesService(map);
    var request = {
        location: center,
        radius: '5000',
        type: ['supermarket']
    };

    service.nearbySearch(request, function(results, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          clearPOIMarkers(); // Clear existing POI markers
          results.forEach(place => createPOIMarker(place, map));
        }
      });
}


let poiMarkers = [];

function createPOIMarker(place, map) {
 // Crear el elemento de marcador avanzado
 const markerElement = document.createElement('div');
 markerElement.className = 'custom-POI';

 // Crear el icono SVG
 const svgIcon = document.createElement('div');
 svgIcon.className = 'POI-icon';
 svgIcon.innerHTML = '<img src="img/supermarket.svg" width="9" height="8.03" alt="Supermarket Icon">';

 // Crear el elemento de texto
 const textElement = document.createElement('h1');
 textElement.className = 'POI-text';
 textElement.textContent = place.name;

 // Añadir el icono y el texto al elemento de marcador
 markerElement.appendChild(svgIcon);
 markerElement.appendChild(textElement);

 const advancedMarker = new google.maps.marker.AdvancedMarkerElement({
     position: place.geometry.location,
     content: markerElement,
    // map: map // Asigna el mapa directamente al marcador avanzado
   // collisionBehavior: 'none'
 });
 advancedMarker.map = map;
 poiMarkers.push(advancedMarker);
}

function clearPOIMarkers() {
    poiMarkers.forEach(marker => marker.map = null);
    poiMarkers = [];
  }


window.initMap = initMap;


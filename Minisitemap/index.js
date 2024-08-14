let map;
let poiMarkers = []; // Variable global para almacenar los POIs
let isPOIVisible = false; // Variable para rastrear el estado de visibilidad de los POIs
const myLatLng = { lat: 41.384651618810466, lng: 2.1782556116678764 }; // Definir myLatLng aquí

function initMap() {
    let collisionBehavior = google.maps.CollisionBehavior.REQUIRED;
    var myLatLng = { lat: 41.384651618810466, lng: 2.1782556116678764 };
    var mapOptions = {
        zoom: 15,
        center: myLatLng,
        minZoom: 2,
        maxZoom: 18,
        zoomControl: true,
        mapTypeControl: false,
        scaleControl: false,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: false,
        mapId: '949d446c3f6ca3ee'
    };
    map = new google.maps.Map(document.getElementById('map'), mapOptions);

    // Cargar los POIs al inicializar el mapa
    loadPOIs();
    loadMarker();
}


function loadMarker(){

            // Crear el elemento SVG para el marcador
            const svgIcon = document.createElement('div');
            svgIcon.className = 'marker-icon';
            svgIcon.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" fill="none">
  <circle cx="20" cy="20" r="19.375" fill="#A24436" stroke="white" stroke-width="1.25"/>
</svg>`;

            // Crear el marcador avanzado
            const advancedMarker = new google.maps.marker.AdvancedMarkerElement({
                position: myLatLng,
                content: svgIcon,
               
            });
            advancedMarker.map = map; // Añadir el marcador al mapa
}


function loadPOIs() {
    if (!map) {
        console.error("El objeto 'map' no está inicializado.");
        return;
    }

    var center = map.getCenter();
    var service = new google.maps.places.PlacesService(map);
    var request = {
        location: center,
        radius: '5000',
        type: ['restaurant', 'cafe', 'bar', 'fast_food', 'pizzeria', 'bakery'] // Múltiples tipos de lugares para comer
    };

    service.nearbySearch(request, function(results, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            clearPOIMarkers(); // Limpiar los POIs existentes
            results.forEach(place => createPOIMarker(place));
        }
    });
}

function createPOIMarker(place) {
    const markerElement = document.createElement('div');
    markerElement.className = 'custom-POI';

    const svgIcon = document.createElement('div');
    svgIcon.className = 'POI-icon';
    svgIcon.innerHTML = '<img src="img/restaurante.svg" width="9" height="8.03" alt="Supermarket Icon">';

    const textElement = document.createElement('h1');
    textElement.className = 'POI-text';
    textElement.textContent = place.name;

    markerElement.appendChild(svgIcon);
    markerElement.appendChild(textElement);

    const advancedMarker = new google.maps.marker.AdvancedMarkerElement({
        position: place.geometry.location,
        content: markerElement,
        collisionBehavior: collisionBehavior,
    });
    advancedMarker.map = map; // Añadir el marcador al mapa
    poiMarkers.push(advancedMarker);
}

function clearPOIMarkers() {
    poiMarkers.forEach(marker => marker.map = null);
    poiMarkers = [];
}

function togglePOIs() {
    const filterElements = document.querySelectorAll('.filtro');

    if (isPOIVisible) {
        // Ocultar POIs
        clearPOIMarkers();
        filterElements.forEach(el => el.classList.remove('active'));
        isPOIVisible = false;
    } else {
        // Mostrar POIs
        loadPOIs();
        filterElements.forEach(el => el.classList.add('active'));
        isPOIVisible = true;
    }
}

// Asigna la función de alternar POIs al clic en el div
document.querySelector('.filtro').addEventListener('click', togglePOIs);

window.initMap = initMap;

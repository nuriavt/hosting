
let map;
let currentMarkers = [];
const fehMarker = 'img/marker.svg';

function initMap() {

    // Create the map with no initial style specified.
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 41.38620, lng: 2.16662 },
        zoom: 13,
        minZoom:2,
        maxZoom:18,
        mapTypeControl: false,
        disableDefaultUI: true,
        styles: styles.custom
    });

    //Carga los marcadores parkings
    addIllustrations();
    loadMarkers(markers_parkings);
    
}


function loadMarkers(markers) {
    clearMarkers();
    const bounds = new google.maps.LatLngBounds();

    markers.forEach((markerData) => {
        const marker = new google.maps.Marker({
            position: { lat: markerData.lat, lng: markerData.lng },
            map: map,
            // title: markerData.locationName,
            icon: fehMarker
        });

        //tootltip
        // Mostrar el tooltip personalizado al hacer hover
        marker.addListener('mouseover', (event) => {
            const tooltip = document.getElementById('custom-tooltip');
            tooltip.innerHTML = `
            <span class="tooltip-location-name">${markerData.locationName}</span><br>
            <span class="tooltip-location-type">${markerData.locationType}</span>
        `;

            // Obtener la posición del marcador en píxeles
            const markerPosition = map.getProjection().fromLatLngToPoint(marker.getPosition());

            // Ajuste de posición del tooltip
            const offsetX = 25; // Ajuste horizontal del tooltip
            const offsetY = -30; // Ajuste vertical del tooltip

            // Calcular la posición del tooltip en píxeles
            const tooltipPosition = new google.maps.Point(
                markerPosition.x + offsetX,
                markerPosition.y + offsetY
            );

            // Convertir la posición del tooltip de píxeles a coordenadas latlng
            const tooltipLatLng = map.getProjection().fromPointToLatLng(tooltipPosition);

            // Posicionar el tooltip
            tooltip.style.left = tooltipPosition.x + 'px';
            tooltip.style.top = tooltipPosition.y + 'px';

            // Mostrar el tooltip
            tooltip.style.display = 'block';
        });

        // Ocultar el tooltip personalizado al salir del hover
        marker.addListener('mouseout', () => {
            const tooltip = document.getElementById('custom-tooltip');
            tooltip.style.display = 'none';
         
        });
        //

        currentMarkers.push(marker);
        // Extend the bounds to include each marker's position
        bounds.extend(marker.getPosition());
    });
}

function clearMarkers() {
    currentMarkers.forEach(marker => marker.setMap(null));
    currentMarkers = [];
}

function addIllustrations() {
    //const currentZoom = map.getZoom();

    // Verificar que el zoom sea igual a 10
    // if (currentZoom === 10){
    const bounds = new google.maps.LatLngBounds();

    ilustrations.forEach((illustration) => {
        const image = {
            url: illustration.imagen,
            size: new google.maps.Size(100, 100),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(50, 50),
            scaledSize: new google.maps.Size(100, 100)
           
        };

        const marker = new google.maps.Marker({
            position: { lat: parseFloat(illustration.lat), lng: parseFloat(illustration.lng) },
            map: map,
            title: illustration.name,
            icon: image,
          //  size: "small"
          size: new google.maps.Size(100, 100),
        });

        // Extend the bounds to include each illustration's position
        bounds.extend(marker.getPosition());
    });

    // Fit the map to the bounds of the illustrations

}

function toggleOption(optionIndex) {
    const options = document.querySelectorAll('.toggle-option');
    options.forEach((option, index) => {
        if (index === optionIndex) {
            option.classList.add('active');
        } else {
            option.classList.remove('active');
        }
    });

    let map_markers;
    if (optionIndex === 0) {
        map_markers = markers_parkings;
    } else if (optionIndex === 1) {
        map_markers = markers_garajes;
    }

    loadMarkers(map_markers);

    map.setZoom(13);
    map.setCenter({ lat: 41.38620, lng: 2.16662 });
}

const styles = {
    custom: [
        //Color de todos los elementos geometricos del mapa (zonas "habitables")
        {
            elementType: "geometry",
            stylers: [{ color: "#CAD8D7" }],
        },
        {
            elementType: "labels.icon",
            stylers: [{ visibility: "off" }],
        },
        {
            elementType: "labels.text.fill",
            stylers: [{ color: "#00352B" }],
            //stylers: [{ visibility: "off" }],
        },
        {
            elementType: "labels.text.stroke",
            stylers: [{ color: "#f5f5f5" }],
            //stylers: [{ visibility: "off" }],
        },
        {
            featureType: "administrative.land_parcel",
            elementType: "labels.text.fill",
            stylers: [{ color: "#00352B" }],
        },
        {
            featureType: "administrative",
            elementType: "labels.text.stroke",
           // stylers: [{ color: "#f5f5f5", visibility: "on" }],
           stylers: [{ visibility: "off" }],
        },
        //Colores para las zonas de los puntos de interés
        {
            featureType: "poi",
            elementType: "geometry",
            stylers: [{ color: "#CAD8D7" }],

        },
        {
            featureType: "poi",
            elementType: "labels.text.fill",
           // stylers: [{ color: "#757575" }],
           stylers: [{ visibility: "off" }],
        },
        {
            featureType: "poi",
            elementType: "labels.text.stroke",
           stylers: [{ visibility: "off" }],
        },
        {
            featureType: "poi.park",
            elementType: "geometry",
            stylers: [{ color: "#c4d4d4" }],
        },

        //Color de los textos de parques
        {
            featureType: "poi.park",
            elementType: "labels.text.fill",
           // stylers: [{ color: "#00352B" }],
            stylers: [{ visibility: "off" }],
        },

        //Color de las carreteras
        {
            featureType: "road",
            elementType: "geometry",
            stylers: [{ color: "#DAE4E3" }],
        },
        //Color del texto de las carreteras arteriales
        {
            featureType: "road.arterial",
            elementType: "labels.text.fill",
            stylers: [{ color: "#00352B" }],
          // stylers: [{ visibility: "off" }],
        },
        //Color de las autopistas
        {
            featureType: "road.highway",
            elementType: "geometry",
            stylers: [{ color: "#DAE4E3" }],
        },
        //Color del texto de las autopistas
        {
            featureType: "road.highway",
            elementType: "labels.text.fill",
           // stylers: [{ color: "#00352B" }],
            stylers: [{ visibility: "off" }],
        },
                //Color del stroke de las autopistas
                {
                    featureType: "road.highway",
                    elementType: "labels.text.stroke",
                   
                    stylers: [{ visibility: "off" }],
                },
        //Color del texto de las carreteras locales
        {
            featureType: "road.local",
            elementType: "labels.text.fill",
           // stylers: [{ color: "#00352B" }],
           stylers: [{ visibility: "off" }],
        },
        {
            featureType: "road.local",
            elementType: "labels.text.stroke",
           stylers: [{ visibility: "off" }],
        },
        //Color de las lineas de transporte publico
        {
            featureType: "transit.line",
            elementType: "geometry",
            stylers: [{ color: "#DAE4E3" }],
        },
        {
            featureType: "transit.station",
            elementType: "geometry",
            stylers: [{ color: "#DAE4E3" }],
        },

        //Color del agua
        {
            featureType: "water",
            elementType: "geometry",
            stylers: [{ color: "#D3E0E2" }],
        },
        {
            featureType: "water",
            elementType: "labels.text.fill",
            stylers: [{ color: "#00352B" }],
        },
            // Ocultar textos de los barrios (administrative.neighborhood)
    {
        featureType: "administrative.neighborhood",
        elementType: "labels.text.fill",
       // stylers: [{ visibility: "off" }],
       stylers: [{ color: "#67807F" }],
    },
    {
        featureType: "administrative.neighborhood",
        elementType: "labels.text.stroke",
        stylers: [{ visibility: "off" }],
    },
   /* {
        featureType: "administrative.district",
        elementType: "labels.text.fill",
        stylers: [{ color: "#9DB4B3" }],
    },*/
    ],
};

window.initMap = initMap;
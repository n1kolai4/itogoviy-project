let map;
let isMapReady = false;

function initMap() {
    const mapContainer = document.getElementById('club-map');
    if (!mapContainer) {
        console.error('Контейнер #club-map не найден');
        return;
    }
    
    if (typeof L === 'undefined') {
        console.error('Библиотека Leaflet не подключена!');
        return;
    }
    
    map = L.map('club-map', {
        minZoom: 2,
        maxZoom: 18
    }).setView([55.751244, 37.618423], 11);
    
    map.attributionControl.remove();
    
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        subdomains: 'abcd',
        maxZoom: 19,
        minZoom: 1
    }).addTo(map);
    
    isMapReady = true;
    console.log('✅ Карта инициализирована');
    
    loadMarkersFromClubs();
}

function addMarkerToMap(club) {
    if (!map || !isMapReady) {
        console.log('Карта ещё не готова');
        return false;
    }
    
    if (!club.coords) {
        console.log(`Нет координат для клуба: ${club.name}`);
        return false;
    }
    
    const marker = L.marker([club.coords.lat, club.coords.lng]).addTo(map);
    
    marker.bindPopup(`
        <div class="club-popup">
            <strong>${escapeHtml(club.name)}</strong><br>
            📍 ${escapeHtml(club.address)}<br>
            🏙️ ${escapeHtml(club.city || 'Не указан')}<br>
            💰 ${club.price} ₽/мес<br>
            <a href="${club.site || '#'}" target="_blank" rel="noopener noreferrer">🌐 Сайт клуба</a>
        </div>
    `);
    
    club.marker = marker;
    console.log(`✅ Маркер добавлен: ${club.name}`);
    return true;
}

function loadMarkersFromClubs() {
    if (!map || !isMapReady) {
        console.log('Карта не готова, ждём...');
        return;
    }
    
    map.eachLayer(layer => {
        if (layer instanceof L.Marker) {
            map.removeLayer(layer);
        }
    });
    
    if (window.clubs && window.clubs.length > 0) {
        let addedCount = 0;
        window.clubs.forEach(club => {
            if (club.coords) {
                addMarkerToMap(club);
                addedCount++;
            }
        });
        console.log(`✅ Добавлено маркеров: ${addedCount}`);
    } else {
        console.log('⚠️ Нет клубов для отображения на карте');
    }
}

function refreshMap() {
    if (map && isMapReady) {
        loadMarkersFromClubs();
    }
}

function removeMarkerFromMap(clubId) {
    if (!map || !isMapReady) return;
    
    const club = window.clubs?.find(c => c.id === clubId);
    if (club && club.marker) {
        map.removeLayer(club.marker);
        club.marker = null;
        console.log(`🗑️ Маркер удалён: ${club.name}`);
    }
}

function centerMapOnClub(club) {
    if (!map || !isMapReady || !club.coords) return;
    map.setView([club.coords.lat, club.coords.lng], 14);
    console.log(`🎯 Карта сцентрирована на: ${club.name}`);
}

function askForCoordinates(clubName) {
    const lat = parseFloat(prompt(`Введите широту для клуба "${clubName}"\n(например, 55.751244 для Москвы):`));
    const lng = parseFloat(prompt(`Введите долготу для клуба "${clubName}"\n(например, 37.618423 для Москвы):`));
    
    if (!isNaN(lat) && !isNaN(lng)) {
        return { lat, lng };
    }
    return null;
}

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

window.mapAPI = {
    initMap: initMap,
    addMarkerToMap: addMarkerToMap,
    loadMarkersFromClubs: loadMarkersFromClubs,
    removeMarkerFromMap: removeMarkerFromMap,
    centerMapOnClub: centerMapOnClub,
    askForCoordinates: askForCoordinates,
    refreshMap: refreshMap
};

document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('club-map')) {
        setTimeout(() => {
            initMap();
        }, 300);
    }
});
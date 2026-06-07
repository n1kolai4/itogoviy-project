const addClubForm = document.getElementById('add-club-form');
const clubsContainer = document.getElementById('clubs-list');

window.clubs = [];

const initialClubs = [
    {
        id: 1,
        name: "Gracie Barra Moscow",
        address: "ул. Тверская, 15, Москва",
        city: "Москва",
        price: 5000,
        hasChildGroup: true,
        coords: { lat: 55.764, lng: 37.606 },
        site: "https://graciebarra.ru/moscow"
    },
    {
        id: 2,
        name: "CheckMat Russia",
        address: "ул. Ленина, 10, Санкт-Петербург",
        city: "Санкт-Петербург",
        price: 4500,
        hasChildGroup: true,
        coords: { lat: 59.931, lng: 30.360 },
        site: "https://checkmat.ru"
    },
    {
        id: 3,
        name: "Atos Moscow",
        address: "пр. Мира, 25, Москва",
        city: "Москва",
        price: 5500,
        hasChildGroup: false,
        coords: { lat: 55.780, lng: 37.630 },
        site: "https://atosbjj.ru"
    },
    {
        id: 4,
        name: "GOJIRA JJ",
        address: "Ленинградское шоссе, 25А, стр. 1",
        city: "Москва",
        price: 10000,
        hasChildGroup: true,
        coords: { lat: 55.828, lng: 37.489 },
        site: "https://gojirajj.ru/#branches"
    }
];

function displayClub(club) {
    const clubCard = document.createElement('div');
    clubCard.className = 'club-card';
    clubCard.setAttribute('data-id', club.id);
    clubCard.setAttribute('data-name', club.name.toLowerCase());
    clubCard.setAttribute('data-city', (club.city || '').toLowerCase());
    clubCard.setAttribute('data-child', club.hasChildGroup);

    clubCard.innerHTML = `
        <h3>${escapeHtml(club.name)}</h3>
        <p>📍 ${escapeHtml(club.address)}</p>
        <p>🏙️ ${escapeHtml(club.city || 'Не указан')}</p>
        <p>💰 ${club.price} ₽/мес</p>
        <p>👶 ${club.hasChildGroup ? 'Есть детские группы ✅' : 'Нет детских групп ❌'}</p>
        <p>🗺️ ${club.coords ? '📍 Отмечен на карте' : '❌ Нет на карте'}</p>
        <button class="delete-club-btn" data-id="${club.id}">🗑 Удалить</button>
    `;

    const deleteBtn = clubCard.querySelector('.delete-club-btn');
    deleteBtn.addEventListener('click', () => deleteClub(club.id));

    clubsContainer.appendChild(clubCard);
}

function deleteClub(clubId) {
    if (window.mapAPI) window.mapAPI.removeMarkerFromMap(clubId);

    window.clubs = window.clubs.filter(club => club.id !== clubId);

    const clubElement = document.querySelector(`.club-card[data-id="${clubId}"]`);
    if (clubElement) clubElement.remove();

    localStorage.setItem('clubs', JSON.stringify(window.clubs));

    if (window.clubs.length === 0) {
        clubsContainer.innerHTML = '<div class="info-message">Добавьте первый клуб через форму выше</div>';
    }
}

function filterClubs() {
    const searchName = document.getElementById('search-club')?.value.toLowerCase() || '';
    const searchCity = document.getElementById('search-city')?.value.toLowerCase() || '';
    const childFilter = document.getElementById('filter-child')?.value || 'all';

    const allCards = document.querySelectorAll('.club-card');

    allCards.forEach(card => {
        const name = card.getAttribute('data-name') || '';
        const city = card.getAttribute('data-city') || '';
        const hasChild = card.getAttribute('data-child') === 'true';

        const matchesName = name.includes(searchName);
        const matchesCity = city.includes(searchCity);
        const matchesChild = childFilter === 'all' || (childFilter === 'yes' && hasChild);

        // Показываем карточку, если все условия совпадают
        const show = matchesName && matchesCity && matchesChild;
        card.style.display = show ? 'block' : 'none';
    });
}

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

if (addClubForm) {
    addClubForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const name = document.getElementById('club-name').value;
        const address = document.getElementById('club-address').value;
        const price = parseInt(document.getElementById('club-price').value) || 3000;
        const hasChildGroup = document.getElementById('club-child').checked;

        if (!name || !address) {
            alert('Пожалуйста, заполните название и адрес клуба');
            return;
        }

        let city = "Не указан";
        if (address.includes("Москва")) city = "Москва";
        else if (address.includes("Санкт-Петербург") || address.includes("СПб")) city = "Санкт-Петербург";
        else if (address.includes("Новосибирск")) city = "Новосибирск";
        else if (address.includes("Екатеринбург")) city = "Екатеринбург";

        let coords = null;
        let site = null;

        if (window.mapAPI) {
            coords = window.mapAPI.askForCoordinates(name);
        }
        site = prompt("Введите сайт клуба (необязательно):", "https://");
        if (site && !site.startsWith('http')) {
            site = 'https://' + site;
        }

        const newClub = {
            id: Date.now(),
            name: name,
            address: address,
            city: city,
            price: price,
            hasChildGroup: hasChildGroup,
            coords: coords,
            site: site || null
        };

        window.clubs.push(newClub);

        if (clubsContainer.querySelector('.info-message')) {
            clubsContainer.innerHTML = '';
        }

        displayClub(newClub);

        if (window.mapAPI && newClub.coords) {
            window.mapAPI.addMarkerToMap(newClub);
            window.mapAPI.centerMapOnClub(newClub);
        }
        localStorage.setItem('clubs', JSON.stringify(window.clubs));


        addClubForm.reset();

        alert(`Клуб "${name}" успешно добавлен!`);
    });
}

function loadSavedClubs() {
    const savedClubs = localStorage.getItem('clubs');
    if (savedClubs && JSON.parse(savedClubs).length > 0) {
        window.clubs = JSON.parse(savedClubs);
        if (clubsContainer.querySelector('.info-message')) {
            clubsContainer.innerHTML = '';
        }
        window.clubs.forEach(club => displayClub(club));
    } else {
        window.clubs = [...initialClubs];
        window.clubs.forEach(club => displayClub(club));
        localStorage.setItem('clubs', JSON.stringify(window.clubs));
    }

    setTimeout(() => {
        if (window.mapAPI) window.mapAPI.refreshMap();
    }, 500);
}

loadSavedClubs();

const searchNameInput = document.getElementById('search-club');
const searchCityInput = document.getElementById('search-city');
const filterSelect = document.getElementById('filter-child');

if (searchNameInput) searchNameInput.addEventListener('input', filterClubs);
if (searchCityInput) searchCityInput.addEventListener('input', filterClubs);
if (filterSelect) filterSelect.addEventListener('change', filterClubs);
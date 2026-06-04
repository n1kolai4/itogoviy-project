const addClubForm = document.getElementById('add-club-form');
const clubsContainer = document.getElementById('clubs-list');
let clubs = [];

const initialClubs = [
    { id: 1, name: "Gracie Barra Moscow", address: "ул. Тверская, 15, Москва", price: 5000, hasChildGroup: true },
    { id: 2, name: "CheckMat Russia", address: "ул. Ленина, 10, Санкт-Петербург", price: 4500, hasChildGroup: true },
    { id: 3, name: "Atos Moscow", address: "пр. Мира, 25, Москва", price: 5500, hasChildGroup: false }
];

function displayClub(club) {
    const clubCard = document.createElement('div');
    clubCard.className = 'club-card';
    clubCard.setAttribute('data-id', club.id);
    clubCard.setAttribute('data-name', club.name.toLowerCase());
    clubCard.setAttribute('data-child', club.hasChildGroup);
    
    clubCard.innerHTML = `
        <h3>${escapeHtml(club.name)}</h3>
        <p>📍 ${escapeHtml(club.address)}</p>
        <p>💰 ${club.price} ₽/мес</p>
        <p>👶 ${club.hasChildGroup ? 'Есть детские группы ✅' : 'Нет детских групп ❌'}</p>
        <button class="delete-club-btn" data-id="${club.id}">🗑 Удалить</button>
    `;
    
    const deleteBtn = clubCard.querySelector('.delete-club-btn');
    deleteBtn.addEventListener('click', () => deleteClub(club.id));
    
    clubsContainer.appendChild(clubCard);
}

function deleteClub(clubId) {
    clubs = clubs.filter(club => club.id !== clubId);
    const clubElement = document.querySelector(`.club-card[data-id="${clubId}"]`);
    if (clubElement) clubElement.remove();
    localStorage.setItem('clubs', JSON.stringify(clubs));
}

function filterClubs() {
    const searchText = document.getElementById('search-club')?.value.toLowerCase() || '';
    const childFilter = document.getElementById('filter-child')?.value || 'all';
    
    const allCards = document.querySelectorAll('.club-card');
    
    allCards.forEach(card => {
        const name = card.getAttribute('data-name') || '';
        const hasChild = card.getAttribute('data-child') === 'true';
        
        const matchesSearch = name.includes(searchText);
        const matchesChild = childFilter === 'all' || (childFilter === 'yes' && hasChild);
        
        card.style.display = matchesSearch && matchesChild ? 'block' : 'none';
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
        
        const newClub = {
            id: Date.now(),
            name: name,
            address: address,
            price: price,
            hasChildGroup: hasChildGroup
        };
        
        clubs.push(newClub);
        
        if (clubsContainer.querySelector('.info-message')) {
            clubsContainer.innerHTML = '';
        }
        
        displayClub(newClub);
        localStorage.setItem('clubs', JSON.stringify(clubs));
        addClubForm.reset();
    });
}

function loadSavedClubs() {
    const savedClubs = localStorage.getItem('clubs');
    if (savedClubs && JSON.parse(savedClubs).length > 0) {
        clubs = JSON.parse(savedClubs);
        if (clubsContainer.querySelector('.info-message')) {
            clubsContainer.innerHTML = '';
        }
        clubs.forEach(club => displayClub(club));
    } else {
        clubs = [...initialClubs];
        clubs.forEach(club => displayClub(club));
        localStorage.setItem('clubs', JSON.stringify(clubs));
    }
}

loadSavedClubs();

const searchInput = document.getElementById('search-club');
const filterSelect = document.getElementById('filter-child');

if (searchInput) searchInput.addEventListener('input', filterClubs);
if (filterSelect) filterSelect.addEventListener('change', filterClubs);
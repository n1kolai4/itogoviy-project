const addClubForm = document.getElementById('add-club-form');
const clubsContainer = document.getElementById('clubs-list');
let clubs = [];

function displayClub(club) {
    const clubCard = document.createElement('div');
    clubCard.className = 'club-card';
    clubCard.setAttribute('data-id', club.id);
    
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
    
    if (clubs.length === 0) {
        clubsContainer.innerHTML = '<div class="info-message">Добавьте первый клуб через форму выше</div>';
    }
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
    if (savedClubs) {
        clubs = JSON.parse(savedClubs);
        if (clubsContainer.querySelector('.info-message')) {
            clubsContainer.innerHTML = '';
        }
        clubs.forEach(club => displayClub(club));
    }
}

loadSavedClubs();
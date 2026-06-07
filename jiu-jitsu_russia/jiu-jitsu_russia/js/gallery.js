// ========== ГАЛЕРЕЯ (ССЫЛКИ НА ВНЕШНИЕ САЙТЫ) ==========

const galleryLinks = [
    // Турниры
    { title: "Открытый кубок Москвы 2025", category: "tournament", icon: "🏆", link: "https://vk.com/wall-172715980_682" },
    { title: "Чемпионат России 2025", category: "tournament", icon: "🏆", link: "https://vk.com/wall-172715980_1197" },
    { title: "Кубок Санкт-Петербурга", category: "tournament", icon: "🏆", link: "https://vk.com/wall-172715980_724" },
    
    // Тренировки
    { title: "Подготовка к Чемпионату и Первенству Европы", category: "training", icon: "🥋", link: "https://vk.com/wall-172715980_1344" },
    { title: "Активная подготовка к Чемпионату и Первенству мира в Тайланде", category: "training", icon: "🥋", link: "https://vk.com/wall-172715980_873" },
    { title: "Георгий Владимирович Куковеров: работа над мастерством в Сибири ", category: "training", icon: "🥋", link: "https://vk.com/wall-172715980_860" },
    
    // Награды
    { title: "Церемония награждения", category: "award", icon: "🏅", link: "https://vk.com/wall-172715980_846" },
    { title: "Вручение чёрных поясов", category: "award", icon: "🏅", link: "https://rutube.ru/video/2c7f5cbaea48edd45d2184a461777069/?r=plwd" },
    { title: "Лучшие моменты с прошедших турниров лиги spc", category: "award", icon: "🏅", link: "https://spcbjj.com/#photo" }
];

function displayGalleryLinks() {
    const container = document.getElementById('gallery-links');
    if (!container) return;
    
    let html = '';
    
    galleryLinks.forEach(link => {
        const categoryText = getCategoryText(link.category);
        html += `
            <a href="${link.link}" target="_blank" rel="noopener noreferrer" class="gallery-link-card" data-category="${link.category}">
                <div class="gallery-icon">${link.icon}</div>
                <div class="gallery-info">
                    <span class="gallery-title">${link.title}</span>
                    <span class="gallery-category">${categoryText}</span>
                </div>
                <div class="gallery-arrow">→</div>
            </a>
        `;
    });
    
    container.innerHTML = html;
}

function getCategoryText(category) {
    switch(category) {
        case 'tournament': return '🏆 Турнир';
        case 'training': return '🥋 Тренировка';
        case 'award': return '🏅 Награждение';
        default: return '📸 Фото';
    }
}

function initFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-link-card');
    
    if (!filterBtns.length) return;
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filter = btn.getAttribute('data-filter');
            
            galleryItems.forEach(item => {
                if (filter === 'all' || item.getAttribute('data-category') === filter) {
                    item.style.display = 'flex';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    displayGalleryLinks();
    initFilters();
});
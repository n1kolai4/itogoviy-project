const NEWS_API_URL = 'https://gnews.io/api/v4/search?q=jiu-jitsu%20BJJ&lang=en&max=6';

async function fetchNews() {
    const container = document.getElementById('news-container');
    container.innerHTML = '<div class="loading">⏳ Загрузка новостей...</div>';
    
    try {
        const response = await fetch(NEWS_API_URL);
        
        if (!response.ok) throw new Error(`HTTP ошибка: ${response.status}`);
        
        const data = await response.json();
        
        if (data.articles && data.articles.length > 0) {
            displayNews(data.articles);
            localStorage.setItem('lastNews', JSON.stringify(data.articles));
        } else {
            showFallbackNews();
        }
    } catch (error) {
        console.error('Ошибка загрузки новостей:', error);
        const cachedNews = localStorage.getItem('lastNews');
        if (cachedNews) {
            displayNews(JSON.parse(cachedNews));
            showError('Показаны сохранённые новости');
        } else {
            showFallbackNews();
        }
    }
}

function displayNews(articles) {
    const container = document.getElementById('news-container');
    
    const newsHTML = articles.slice(0, 6).map(article => `
        <div class="news-card">
            <h3 class="news-card__title">${escapeHtml(article.title || 'Новость')}</h3>
            <p class="news-card__date">${article.publishedAt ? new Date(article.publishedAt).toLocaleDateString('ru-RU') : 'Недавно'}</p>
            <p class="news-card__content">${escapeHtml((article.description || '').slice(0, 120))}...</p>
            <a href="${article.url}" target="_blank" class="btn btn-outline">Читать →</a>
        </div>
    `).join('');
    
    container.innerHTML = newsHTML;
}

function showFallbackNews() {
    const fallbackNews = [
        { title: "Российский джиу-джитсу развивается", description: "Количество клубов выросло в 3 раза за 5 лет", url: "#", publishedAt: null },
        { title: "Чемпионат России 2026", description: "Соревнования пройдут в Москве", url: "#", publishedAt: null },
        { title: "Интервью с чемпионом", description: "О пути в спорте и планах на будущее", url: "#", publishedAt: null }
    ];
    displayNews(fallbackNews);
}

function showError(message) {
    const container = document.getElementById('news-container');
    container.innerHTML = `<div class="error-message">⚠️ ${message}</div>`;
}

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

const loadNewsBtn = document.getElementById('load-news-btn');
if (loadNewsBtn) {
    loadNewsBtn.addEventListener('click', fetchNews);
}
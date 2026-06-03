const themeToggle = document.getElementById('theme-toggle');
const themeLink = document.getElementById('theme-style');

function toggleTheme() {
    const currentTheme = themeLink.getAttribute('href');
    
    if (currentTheme === 'css/light-theme.css') {
        themeLink.setAttribute('href', 'css/dark-theme.css');
        localStorage.setItem('theme', 'dark');
        themeToggle.textContent = '☀️';
    } else {
        themeLink.setAttribute('href', 'css/light-theme.css');
        localStorage.setItem('theme', 'light');
        themeToggle.textContent = '🌙';
    }
}

function loadSavedTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        themeLink.setAttribute('href', 'css/dark-theme.css');
        themeToggle.textContent = '☀️';
    } else {
        themeLink.setAttribute('href', 'css/light-theme.css');
        themeToggle.textContent = '🌙';
    }
}

themeToggle.addEventListener('click', toggleTheme);
loadSavedTheme();
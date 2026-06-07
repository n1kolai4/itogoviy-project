const socialLinks = [
    { name: "📘 ВКонтакте", url: "https://vk.com/rjfjiujitsu", icon: "📘" },
    { name: "🎥 RuTube", url: "https://rutube.ru/channel/13330175/", icon: "🎥" },
];

function displaySocialLinks() {
    const container = document.getElementById('social-icons');
    if (!container) return;
    
    let html = '';
    socialLinks.forEach(link => {
        html += `
            <a href="${link.url}" target="_blank" rel="noopener noreferrer" class="social-icon">
                ${link.name}
            </a>
        `;
    });
    
    container.innerHTML = html;
}

function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    const contactResult = document.getElementById('contact-result');
    
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('contact-name').value.trim();
        const email = document.getElementById('contact-email').value.trim();
        const subject = document.getElementById('contact-subject').value;
        const message = document.getElementById('contact-message').value.trim();
        
        if (!name) {
            alert('Пожалуйста, введите ваше имя');
            return;
        }
        
        if (!email) {
            alert('Пожалуйста, введите ваш email');
            return;
        }
        
        if (!isValidEmail(email)) {
            alert('Пожалуйста, введите корректный email');
            return;
        }
        
        if (!message) {
            alert('Пожалуйста, введите сообщение');
            return;
        }
        
        // Отображаем результат
        contactResult.style.display = 'block';
        contactResult.innerHTML = `
            <strong>✅ Спасибо, ${name}!</strong><br>
            Ваше сообщение отправлено.<br>
            Мы свяжемся с вами по адресу ${email}
        `;
        
        contactForm.reset();
        
        setTimeout(() => {
            contactResult.style.display = 'none';
        }, 5000);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    displaySocialLinks();
    initContactForm();
});
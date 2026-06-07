const registrationForm = document.getElementById('reg-form');
const pricePreview = document.getElementById('price-preview');
const resultDiv = document.getElementById('registration-result');
const BASE_PRICE = 3000;

function calculatePrice(isEarly, isChild, isMember) {
    let price = BASE_PRICE;
    if (isEarly) price *= 0.7;
    if (isChild) price *= 0.5;
    if (isMember) price *= 0.9;
    return Math.round(price);
}

function updatePricePreview() {
    const isEarly = document.getElementById('early-reg').checked;
    const isChild = document.getElementById('is-child').checked;
    const isMember = document.getElementById('is-member').checked;
    const finalPrice = calculatePrice(isEarly, isChild, isMember);
    
    let breakdown = `Базовая цена: ${BASE_PRICE} ₽<br>`;
    if (isEarly) breakdown += `Ранняя регистрация: -30%<br>`;
    if (isChild) breakdown += `Детская категория: -50%<br>`;
    if (isMember) breakdown += `Член клуба: -10%<br>`;
    breakdown += `<strong>Итого: ${finalPrice} ₽</strong>`;
    
    pricePreview.innerHTML = breakdown;
}

function validateForm(name) {
    if (!name || name.trim() === '') {
        alert('Пожалуйста, введите имя спортсмена');
        return false;
    }
    return true;
}

function saveRegistrationToStorage(data) {
    let registrations = JSON.parse(localStorage.getItem('registrations')) || [];
    registrations.push({ ...data, timestamp: new Date().toISOString() });
    localStorage.setItem('registrations', JSON.stringify(registrations));
}

if (registrationForm) {
    registrationForm.addEventListener('submit', (event) => {
        event.preventDefault();
        
        const name = document.getElementById('fighter-name').value;
        const belt = document.getElementById('fighter-belt').value;
        const isEarly = document.getElementById('early-reg').checked;
        const isChild = document.getElementById('is-child').checked;
        const isMember = document.getElementById('is-member').checked;
        
        if (!validateForm(name)) return;
        
        const finalPrice = calculatePrice(isEarly, isChild, isMember);
        
        const registrationData = {
            name: name,
            belt: belt,
            isEarly: isEarly,
            isChild: isChild,
            isMember: isMember,
            price: finalPrice,
            tournament: "Открытый кубок Москвы",
            date: "10 июня 2026"
        };
        
        saveRegistrationToStorage(registrationData);
        
        resultDiv.style.display = 'block';
        resultDiv.innerHTML = `
            <div class="success-message">
                <h3>✅ Заявка подана!</h3>
                <p>Спортсмен: ${name}</p>
                <p>Сумма к оплате: ${finalPrice} ₽</p>
                <p>Данные сохранены в localStorage</p>
            </div>
        `;
        
        registrationForm.reset();
        updatePricePreview();
        
        setTimeout(() => {
            resultDiv.style.display = 'none';
        }, 5000);
    });
    
    document.getElementById('early-reg').addEventListener('change', updatePricePreview);
    document.getElementById('is-child').addEventListener('change', updatePricePreview);
    document.getElementById('is-member').addEventListener('change', updatePricePreview);
}

updatePricePreview();
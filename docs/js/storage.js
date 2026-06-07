class Club {
    constructor(name, address, price, hasChildGroup) {
        this.name = name;
        this.address = address;
        this.price = price;
        this.hasChildGroup = hasChildGroup;
        this.rating = 0;
        this.id = Date.now();
    }

    getInfo() {
        return `${this.name}, ${this.address}, ${this.price} ₽`;
    }

    addRating(points) {
        this.rating = (this.rating + points) / 2;
    }

    toHTML() {
        return `
            <div class="club-card" data-id="${this.id}">
                <h3>${this.escapeHtml(this.name)}</h3>
                <p>📍 ${this.escapeHtml(this.address)}</p>
                <p>💰 ${this.price} ₽/мес</p>
                <p>👶 ${this.hasChildGroup ? 'Есть детские группы ✅' : 'Нет детских групп ❌'}</p>
                <button class="delete-club-btn" data-id="${this.id}">🗑 Удалить</button>
            </div>
        `;
    }
    
    escapeHtml(str) {
        if (!str) return '';
        return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }
}

class Tournament {
    constructor(name, date, location, basePrice) {
        this.name = name;
        this.date = new Date(date);
        this.location = location;
        this.basePrice = basePrice;
        this.participants = [];
    }

    addParticipant(name, belt) {
        this.participants.push({ name, belt, registeredAt: new Date() });
    }

    getParticipantCount() {
        return this.participants.length;
    }

    calculatePrice(isEarly, isChild, isMember) {
        let price = this.basePrice;
        if (isEarly) price *= 0.7;
        if (isChild) price *= 0.5;
        if (isMember) price *= 0.9;
        return Math.round(price);
    }
}
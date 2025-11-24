// --- КОНСТАНТИ ---
const catalog = document.getElementById('catalog');
const SHOP_URLS = {
    'jabko': 'https://jabko.ua',
    'rozetka': 'https://rozetka.com.ua',
    'allo': 'https://allo.ua',
};
const PAGE = 12;
let offset = 0;

// Оновлено згідно з останнім списком файлів
const MODELS = {
    'iPhone': [
        {
            model: 'iPhone 17 Pro Max', mem: '512GB', color: 'Aero Blue', base: 1499, shop: 'jabko',
            img_card: 'iphone 17.png', 
            img_large: 'iphone 17.png',
        },
        {
            model: 'iPhone 16 Pro Max', mem: '1TB', color: 'Titanium', base: 1999, shop: 'rozetka',
            img_card: '16pro.png', 
            img_large: '16pro.png',
        },
        {
            model: 'iPhone 15 Pro Max', mem: '256GB', color: 'Cosmic Black', base: 1399, shop: 'jabko',
            img_card: 'Apple-iPhone-1....png', // Зберігаємо скорочене ім'я, щоб уникнути помилок, якщо повне ім'я невідоме
            img_large: 'Apple-iPhone-1....png',
        },
    ],
    'Watch': [
        {
            model: 'Apple Watch X (2025)', mem: '', color: 'Silver', base: 599, shop: 'rozetka',
            img_card: 'apple_watch.jp...', // Зберігаємо скорочене ім'я
            img_large: 'apple_watch.jp...',
        },
        {
            model: 'Watch Ultra 3', mem: '', color: 'Titanium', base: 799, shop: 'jabko',
            img_card: 'ultra3.webp', // ВИПРАВЛЕНО на ultra3.webp
            img_large: 'ultra3.webp',
        },
    ],
    'Аксесуари': [
        {
            model: 'AirPods Pro (3rd gen)', mem: '', color: 'White', base: 279, shop: 'rozetka',
            img_card: 'MQD83 (1)-1397x1397.jpg.webp', // ВИПРАВЛЕНО: повне ім'я файлу
            img_large: 'MQD83 (1)-1397x1397.jpg.webp',
        },
        {
            model: 'MagSafe Duo 2.0', mem: '', color: 'White', base: 129, shop: 'jabko',
            img_card: 'magsafe.jpeg', 
            img_large: 'magsafe.jpeg',
        },
        {
            model: 'Bio-Fibre Case', mem: '', color: 'Green', base: 69, shop: 'allo',
            img_card: 'beo_fibra.jpg', // ВИПРАВЛЕНО на beo_fibra.jpg
            img_large: 'beo_fibra.jpg',
        },
        {
            model: 'Silicone Case', mem: '', color: 'Starlight', base: 49, shop: 'rozetka',
            img_card: 'caseforiphone.jpg', // ВИПРАВЛЕНО: найбільш імовірне ім'я
            img_large: 'caseforiphone.jpg',
        }
    ]
};

// --- ФУНКЦІЇ КАТАЛОГУ (незмінні) ---

function makeProduct(id) {
    const categories = Object.keys(MODELS);
    const cat = categories[id % categories.length];
    const list = MODELS[cat];
    const item = list[id % list.length];

    const shopKey = item.shop || 'jabko'; 
    const shopUrl = SHOP_URLS[shopKey] || SHOP_URLS['jabko'];
    
    const img = item.img_card || '';
    const imgLarge = item.img_large || img;

    const title = `${item.model}`;
    const specs = item.mem ? `${item.mem} · ${item.color}` : `${item.color}`;
    const price = (item.base + (id % 5) * 25);
    const desc_text = `Новий рівень інновацій. ${cat} — ${item.model}. Офіційна гарантія.`;

    return {
        id, title, model: item.model, category: cat,
        price: price.toFixed(2) + ' $',
        img, imgLarge, desc: desc_text, specs, shopUrl 
    };
}

function renderProduct(p) {
    if (!catalog) return;
    const card = document.createElement('article');
    card.className = 'card neumorphic-card';
    card.dataset.id = p.id;
    card.innerHTML = `
        <img loading="lazy" src="${p.img}" alt="${p.title}">
        <div class="card-body">
            <h3 class="card-title">${p.title}</h3>
            <p class="muted">${p.category}</p>
            <p class="muted small">${p.specs}</p>
            <p class="price">${p.price}</p>
            <div class="card-actions">
                <button class="btn view primary-neumorphic" data-id="${p.id}">Переглянути</button>
                <a class="btn primary-neumorphic" href="${p.shopUrl}" target="_blank" rel="noopener">Купити</a>
            </div>
        </div>`;
    catalog.appendChild(card);
}

function loadPage() {
    if (!catalog) return;
    for (let i = offset; i < offset + PAGE; i++) {
        renderProduct(makeProduct(i));
    }
    offset += PAGE;
}

// --- КЕРУВАННЯ ІНТЕРФЕЙСОМ ТА ПОДІЯМИ (незмінні) ---

function showTab(idBtn, idPanel) {
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.panel').forEach(p => p.classList.add('hidden'));
    const btn = document.getElementById(idBtn);
    const panel = document.getElementById(idPanel);
    if (btn) btn.classList.add('active');
    if (panel) panel.classList.remove('hidden');
}

function filterCatalog() {
    const searchEl = document.getElementById('search');
    const categoryEl = document.getElementById('category');
    const q = searchEl ? searchEl.value.trim().toLowerCase() : '';
    const cat = categoryEl ? categoryEl.value : '';
    document.querySelectorAll('#catalog .card').forEach(card => {
        const title = (card.querySelector('.card-title')?.textContent || '').toLowerCase();
        const specs = (card.querySelector('.small')?.textContent || '').toLowerCase();
        const c = (card.querySelector('.muted')?.textContent || '');
        const matches = (!q || title.includes(q) || specs.includes(q)) && (!cat || c === cat);
        card.style.display = matches ? '' : 'none';
    });
}

const homeBtn = document.getElementById('homeBtn');
if (homeBtn) homeBtn.onclick = () => showTab('homeBtn', 'main');

const shopsBtn = document.getElementById('shopsBtn');
if (shopsBtn) shopsBtn.onclick = () => showTab('shopsBtn', 'shops');

const contactsBtn = document.getElementById('contactsBtn');
if (contactsBtn) contactsBtn.onclick = () => showTab('contactsBtn', 'contacts');

const regBtn = document.getElementById('regBtn');
if (regBtn) regBtn.onclick = () => {
    showTab('regBtn', 'registration');
    const searchEl = document.getElementById('search');
    const categoryEl = document.getElementById('category');
    if (searchEl) searchEl.value = '';
    if (categoryEl) categoryEl.value = '';
    filterCatalog();
};

const loadMoreBtn = document.getElementById('loadMore');
if (loadMoreBtn) loadMoreBtn.addEventListener('click', loadPage);

const searchEl = document.getElementById('search');
if (searchEl) searchEl.addEventListener('input', filterCatalog);

const categoryEl = document.getElementById('category');
if (categoryEl) categoryEl.addEventListener('change', filterCatalog);

// Dark Mode Toggle
const themeToggle = document.getElementById('themeToggle');
if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        themeToggle.textContent = newTheme === 'dark' ? '☀️' : '🌙';
    });
}


// Логіка модального вікна
const modal = document.getElementById('modal');
const modalImg = document.getElementById('modalImg');
const closeModal = document.getElementById('closeModal');
const modalShop = document.getElementById('modalShop');
const modalTitle = document.getElementById('modalTitle');
const modalDesc = document.getElementById('modalDesc');
const modalPrice = document.getElementById('modalPrice');
const modalSpecs = document.getElementById('modalSpecs');

if (catalog && modal) {
    catalog.addEventListener('click', (e) => {
        const btn = e.target.closest('.view');
        if (!btn) return;
        
        const id = Number(btn.dataset.id);
        const p = makeProduct(id);

        if (modalImg) modalImg.src = p.imgLarge;
        if (modalTitle) modalTitle.textContent = p.title;
        if (modalDesc) modalDesc.textContent = p.desc;
        if (modalPrice) modalPrice.textContent = p.price;
        if (modalSpecs) modalSpecs.textContent = p.specs;
        if (modalShop) modalShop.href = p.shopUrl;
        
        modal.classList.remove('hidden');
        modal.setAttribute('aria-hidden', 'false');
    });
}

if (closeModal && modal) {
    closeModal.addEventListener('click', () => {
        modal.classList.add('hidden');
        modal.setAttribute('aria-hidden', 'true');
        if (modalImg) modalImg.src = '';
    });
}

if (modal && closeModal) {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) { closeModal.click(); }
    });
}

window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && closeModal) closeModal.click();
});


// --- ВАЛІДАЦІЯ ФОРМИ РЕЄСТРАЦІЇ (незмінна) ---

const form = document.getElementById('registrationForm');
const submitMessage = document.getElementById('submit-message');

function displayError(fieldId, message) {
    const input = document.getElementById(fieldId);
    const error = document.getElementById(fieldId + 'Error');
    if (input) input.classList.add('input-error');

    if (fieldId === 'gender') {
         const genderError = document.getElementById('genderError');
         if (genderError) genderError.textContent = message;
    } else {
         if (error) error.textContent = message;
    }
}

function validateForm() {
    let isValid = true;
    const fields = ['name', 'email', 'password', 'confirmPassword', 'age', 'dob', 'country'];
    
    fields.forEach(id => {
        const input = document.getElementById(id);
        const error = document.getElementById(id + 'Error');
        if (input) input.classList.remove('input-error');
        if (error) error.textContent = '';
    });
    const genderErrorEl = document.getElementById('genderError');
    if (genderErrorEl) genderErrorEl.textContent = '';

    fields.forEach(id => {
        const input = document.getElementById(id);
        if (input && input.value.trim() === '') {
            displayError(id, "Це поле є обов'язковим.");
            isValid = false;
        }
    });

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const emailInput = document.getElementById('email');
    if (emailInput && emailInput.value.trim() !== '' && !emailRegex.test(emailInput.value)) {
        displayError('email', "Введіть коректний email.");
        isValid = false;
    }

    const passwordInput = document.getElementById('password');
    const password = passwordInput ? passwordInput.value : '';
    const passwordRegex = /^(?=.*\d)(?=.*[A-Z]).{8,}$/;
    if (passwordInput && password.trim() !== '' && !passwordRegex.test(password)) {
        displayError('password', "Пароль: мін. 8 симв., 1 цифра, 1 велика літера.");
        isValid = false;
    }
    
    const confirmEl = document.getElementById('confirmPassword');
    const confirmPassword = confirmEl ? confirmEl.value : '';
    if (password !== confirmPassword) {
        displayError('confirmPassword', "Паролі не співпадають.");
        isValid = false;
    }

    const ageInput = document.getElementById('age');
    const age = ageInput ? parseInt(ageInput.value || '0') : NaN;
    if (!isNaN(age) && age < 18) {
        displayError('age', "Вік не може бути менше 18 років.");
        isValid = false;
    }

    const genderChecked = form ? form.querySelector('input[name="gender"]:checked') : null;
    if (!genderChecked) {
        displayError('gender', "Оберіть вашу стать.");
        isValid = false;
    }
    
    const countryEl = document.getElementById('country');
    if (!countryEl || countryEl.value === '') {
        displayError('country', "Оберіть країну.");
        isValid = false;
    }

    const dobEl = document.getElementById('dob');
    const dobInput = dobEl ? dobEl.value : '';
    if (dobInput) {
        const birthDate = new Date(dobInput);
        const today = new Date();
        const minAgeDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
        
        if (birthDate > minAgeDate) {
            displayError('dob', "Вам повинно бути не менше 18 років.");
            isValid = false;
        }
    }
    return isValid;
}

if (form) {
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateForm()) {
            if (submitMessage) {
                submitMessage.textContent = 'Реєстрація успішна!';
                submitMessage.className = 'success';
                submitMessage.style.display = 'block';
            }
            form.reset();
            setTimeout(() => {
                if (submitMessage) submitMessage.style.display = 'none';
            }, 5000);
        } else {
            if (submitMessage) submitMessage.style.display = 'none';
        }
    });
}

// --- ІНІЦІАЛІЗАЦІЯ ---
loadPage();
let wishes = [];
let currentGender = null;
let selectedWishId = null;

// 🌐 Địa chỉ API backend trên Render
const API_BASE = 'https://two010-1.onrender.com/api';

// ✅ Khởi động trang
async function init() {
    await loadWishes();
    createPetals();
    setupEventListeners();
    updateStats();
    renderFlowers();
    renderLeaderboard();
}

// 🌸 Lấy dữ liệu từ SQL Server (qua API Node)
async function loadWishes() {
    const res = await fetch(`${API_BASE}/wishes`);
    wishes = await res.json();
}

// 🌸 Gửi lời chúc mới
async function submitWish() {
    const nickname = document.getElementById('nicknameInput').value.trim();
    const wishText = document.getElementById('wishInput').value.trim();

    if (!nickname || !wishText) {
        alert('⚠️ Vui lòng nhập đầy đủ thông tin!');
        return;
    }

    await fetch(`${API_BASE}/wishes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nickname, wishText })
    });

    closeWishForm();
    alert('🌸 Lời chúc của bạn đã nở hoa!');
    await loadWishes();
    updateStats();
    renderFlowers();
    renderLeaderboard();
}

// ❤️ Thả tim
async function likeCurrentWish() {
    if (!selectedWishId) return;
    await fetch(`${API_BASE}/wishes/${selectedWishId}/heart`, { method: 'PUT' });
    await loadWishes();
    updateStats();
    renderLeaderboard();
    createFloatingHeart();
}

// ========================
// GIAO DIỆN
// ========================

function setupEventListeners() {
    document.getElementById('musicBtn').addEventListener('click', toggleMusic);
    document.getElementById('resetBtn').addEventListener('click', () => location.reload());
}

function selectGender(gender) {
    currentGender = gender;
    document.getElementById('genderPopup').style.display = 'none';
    if (gender === 'male') {
        document.getElementById('waterBtnContainer').style.display = 'block';
    }
}

function showWishForm() {
    document.getElementById('wishFormPopup').style.display = 'flex';
}

function closeWishForm() {
    document.getElementById('wishFormPopup').style.display = 'none';
}

function showWishCard(id) {
    const wish = wishes.find(w => w.Id === id);
    if (!wish) return;
    selectedWishId = id;
    document.getElementById('cardNickname').textContent = wish.Nickname;
    document.getElementById('cardText').textContent = wish.WishText;
    document.getElementById('cardHearts').textContent = wish.Hearts;
    document.getElementById('wishCardPopup').style.display = 'flex';
}

function closeWishCard() {
    document.getElementById('wishCardPopup').style.display = 'none';
    selectedWishId = null;
}

function updateStats() {
    const totalHearts = wishes.reduce((sum, w) => sum + w.Hearts, 0);
    document.getElementById('totalWishes').textContent = wishes.length;
    document.getElementById('totalHearts').textContent = totalHearts;
}

function renderFlowers() {
    const container = document.getElementById('flowersContainer');
    container.innerHTML = '';
    const positions = [
        { x: 380, y: 150 }, { x: 320, y: 250 }, { x: 460, y: 250 },
        { x: 300, y: 180 }, { x: 470, y: 180 }, { x: 330, y: 220 },
        { x: 450, y: 220 }, { x: 360, y: 280 }, { x: 410, y: 280 }
    ];
    wishes.slice(0, 30).forEach((wish, i) => {
        const pos = positions[i % positions.length];
        const flower = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        flower.setAttribute('x', pos.x);
        flower.setAttribute('y', pos.y);
        flower.setAttribute('font-size', '32');
        flower.setAttribute('cursor', 'pointer');
        flower.setAttribute('class', 'flower flower-bloom');
        flower.textContent = '🌸';
        flower.addEventListener('click', () => showWishCard(wish.Id));
        container.appendChild(flower);
    });
}

function renderLeaderboard() {
    const list = document.getElementById('leaderboardList');
    list.innerHTML = '';
    const topWishes = [...wishes].sort((a, b) => b.Hearts - a.Hearts).slice(0, 10);
    topWishes.forEach((w, i) => {
        const div = document.createElement('div');
        div.className = 'leaderboard-item';
        div.innerHTML = `
            <div class="rank">${i + 1}.</div>
            <div class="wish-info">
                <div class="wish-nickname">${w.Nickname}</div>
                <div class="wish-preview">${w.WishText}</div>
            </div>
            <div class="hearts-badge">
                <span>❤️</span><span class="hearts-count">${w.Hearts}</span>
            </div>
        `;
        list.appendChild(div);
    });
}

function createPetals() {
    const container = document.getElementById('petalsContainer');
    for (let i = 0; i < 15; i++) {
        const petal = document.createElement('div');
        petal.className = 'petal';
        petal.textContent = '🌸';
        petal.style.left = Math.random() * 100 + '%';
        petal.style.animationDelay = Math.random() * 5 + 's';
        petal.style.animationDuration = (8 + Math.random() * 4) + 's';
        container.appendChild(petal);
    }
}

function createFloatingHeart() {
    const container = document.getElementById('floatingHeartsContainer');
    const heart = document.createElement('div');
    heart.className = 'floating-heart';
    heart.textContent = '❤️';
    heart.style.left = (Math.random() * 80 + 10) + '%';
    container.appendChild(heart);
    setTimeout(() => heart.remove(), 2000);
}

function toggleMusic() {
    alert('🎵 Tùy chọn thêm nhạc nền sau này!');
}

window.addEventListener('DOMContentLoaded', init);

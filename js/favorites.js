// Favorites State (Session only)
let favorites = JSON.parse(sessionStorage.getItem('sublirium_favorites')) || [];

document.addEventListener('DOMContentLoaded', () => {
    initFavorites();
    updateFavoritesUI();
});

function initFavorites() {
    // Inject Favorites Icon in Header
    const nav = document.querySelector('.nav-container');
    if (nav && !document.querySelector('.favorites-icon-container')) {
        const favIcon = document.createElement('div');
        favIcon.className = 'favorites-icon-container';
        favIcon.innerHTML = `
            <i class="far fa-heart"></i>
            <span id="fav-count">0</span>
        `;
        favIcon.onclick = toggleFavorites;
        // Insert before cart icon
        const cartIcon = document.querySelector('.cart-icon-container');
        if (cartIcon) {
            nav.insertBefore(favIcon, cartIcon);
        } else {
            nav.appendChild(favIcon);
        }
    }

    // Inject Favorites Drawer
    if (!document.querySelector('.fav-drawer')) {
        const drawer = document.createElement('div');
        drawer.className = 'fav-drawer';
        drawer.id = 'fav-drawer';
        drawer.innerHTML = `
            <div class="fav-header">
                <h3>❤️ Mis Favoritos</h3>
                <button class="close-fav" onclick="toggleFavorites()">&times;</button>
            </div>
            <div class="fav-items-list" id="fav-items-list">
                <!-- Favorites injected here -->
            </div>
        `;
        document.body.appendChild(drawer);

        const overlay = document.createElement('div');
        overlay.className = 'fav-overlay';
        overlay.id = 'fav-overlay';
        overlay.onclick = toggleFavorites;
        document.body.appendChild(overlay);
    }

    // Add heart icons to all product cards
    renderFavoriteButtons();
}

function toggleFavorites() {
    document.getElementById('fav-drawer').classList.toggle('open');
    document.getElementById('fav-overlay').classList.toggle('active');
}

function renderFavoriteButtons() {
    const cards = document.querySelectorAll('.producto-card, .producto-item');
    cards.forEach(card => {
        if (!card.querySelector('.btn-fav-toggle')) {
            const name = card.querySelector('h3')?.innerText;
            const price = card.querySelector('.producto-price-tag')?.innerText || card.querySelector('p strong')?.innerText;
            const image = card.querySelector('img')?.src;

            if (name) {
                const btn = document.createElement('button');
                btn.className = 'btn-fav-toggle';
                const isFav = favorites.some(f => f.name === name);
                btn.innerHTML = `<i class="${isFav ? 'fas' : 'far'} fa-heart"></i>`;
                btn.onclick = (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleProductFavorite({ name, price, image }, btn);
                };
                
                const imgContainer = card.querySelector('.producto-image');
                if (imgContainer) imgContainer.appendChild(btn);
            }
        }
    });
}

function toggleProductFavorite(product, btn) {
    const index = favorites.findIndex(f => f.name === product.name);
    if (index > -1) {
        favorites.splice(index, 1);
        btn.innerHTML = '<i class="far fa-heart"></i>';
        showToast('💔 Eliminado de favoritos');
    } else {
        favorites.push(product);
        btn.innerHTML = '<i class="fas fa-heart"></i>';
        showToast('❤️ Añadido a favoritos');
    }
    saveFavorites();
    updateFavoritesUI();
}

function saveFavorites() {
    sessionStorage.setItem('sublirium_favorites', JSON.stringify(favorites));
}

function updateFavoritesUI() {
    const list = document.getElementById('fav-items-list');
    const count = document.getElementById('fav-count');
    
    if (!list) return;

    if (favorites.length === 0) {
        list.innerHTML = '<div class="empty-fav">No tienes favoritos aún</div>';
    } else {
        list.innerHTML = favorites.map(item => `
            <div class="fav-item">
                <div class="fav-item-img">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="fav-item-info">
                    <h4>${item.name}</h4>
                    <span class="fav-item-price">${item.price}</span>
                    <button class="remove-fav" onclick="removeFromFavorites('${item.name}')">Eliminar</button>
                </div>
            </div>
        `).join('');
    }

    if (count) count.innerText = favorites.length;
    
    // Update all hearts on page
    const buttons = document.querySelectorAll('.btn-fav-toggle');
    buttons.forEach(btn => {
        const card = btn.closest('.producto-card, .producto-item');
        const name = card.querySelector('h3')?.innerText;
        const isFav = favorites.some(f => f.name === name);
        btn.querySelector('i').className = isFav ? 'fas fa-heart' : 'far fa-heart';
    });
}

function removeFromFavorites(name) {
    favorites = favorites.filter(f => f.name !== name);
    saveFavorites();
    updateFavoritesUI();
}

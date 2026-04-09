// Inyecta el drawer de carrito en todas las páginas
document.addEventListener('DOMContentLoaded', function() {
    injectCartDrawer();
    injectCartIcon();
});

function injectCartDrawer() {
    // Solo inyecta si no existe ya
    if (document.getElementById('cart-drawer')) return;
    
    const drawer = document.createElement('div');
    drawer.id = 'cart-drawer';
    drawer.className = 'cart-drawer';
    drawer.innerHTML = `
        <div class="cart-header">
            <h3>🛒 Mi Carrito</h3>
            <button class="close-cart" id="close-cart">&times;</button>
        </div>
        <div id="cart-items" class="cart-items-list"></div>
        <div class="cart-footer">
            <div class="cart-summary">
                <div class="cart-total-row">
                    <span class="cart-total-label">Total:</span>
                    <span class="cart-total-amount" id="cart-total">$0.00</span>
                </div>
            </div>
            <button class="cta-button" onclick="checkout()" style="width: 100%; margin-bottom: 1rem;">Ir al Checkout</button>
            <button class="btn-secondary" id="clear-cart-button" style="width: 100%; color: white; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2);">Vaciar Carrito</button>
        </div>
    `;
    document.body.appendChild(drawer);
    
    // Agregar overlay
    const overlay = document.createElement('div');
    overlay.className = 'cart-overlay';
    overlay.id = 'cart-overlay';
    document.body.appendChild(overlay);
    
    // Add CSS for drawer and overlay if not already there
    if (!document.querySelector('link[href*="cart.css"]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'css/cart.css';
        document.head.appendChild(link);
    }
}

function injectCartIcon() {
    // Solo inyecta si no existe ya
    if (document.querySelector('.cart-icon-container')) return;
    
    const navContainer = document.querySelector('.nav-container');
    if (!navContainer) return;
    
    const cartIconContainer = document.createElement('div');
    cartIconContainer.className = 'cart-icon-container';
    cartIconContainer.id = 'cart-icon-container';
    cartIconContainer.style.cursor = 'pointer';
    cartIconContainer.style.margin = '0 1rem';
    cartIconContainer.innerHTML = `
        <i class="fas fa-shopping-cart" id="cart-icon" style="font-size: 1.2rem; color: white;"></i>
        <span id="cart-count" class="badge">0</span>
    `;
    
    const hamburger = navContainer.querySelector('.hamburger');
    if (hamburger) {
        navContainer.insertBefore(cartIconContainer, hamburger);
    } else {
        navContainer.appendChild(cartIconContainer);
    }
}

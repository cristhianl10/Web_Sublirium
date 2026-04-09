// Global cart variable
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function updateCartDisplay() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalSpan = document.getElementById('cart-total');
    const cartCountSpan = document.getElementById('cart-count');
    
    if (!cartItemsContainer) return;

    cartItemsContainer.innerHTML = '';
    let total = 0;
    let itemCount = 0;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<div class="empty-cart">Tu carrito está vacío.</div>';
    } else {
        cart.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.classList.add('cart-item');
            itemElement.innerHTML = `
                <div class="cart-item-img">
                    <img src="${item.image}" alt="${item.name}" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22><rect fill=%22%23ccc%22 width=%22100%22 height=%22100%22/></svg>'">
                </div>
                <div class="cart-item-info">
                    <div class="cart-item-header">
                        <h4>${item.name}</h4>
                        <button class="remove-item" data-id="${item.id}">&times;</button>
                    </div>
                    <span class="cart-item-price">$${item.price.toFixed(2)}</span>
                    <div class="cart-item-qty">
                        <button class="qty-btn" onclick="changeQty('${item.id}', -1)">−</button>
                        <span class="qty-num">${item.quantity}</span>
                        <button class="qty-btn" onclick="changeQty('${item.id}', 1)">+</button>
                    </div>
                </div>
            `;
            cartItemsContainer.appendChild(itemElement);

            total += item.price * item.quantity;
            itemCount += item.quantity;
        });
    }

    if (cartTotalSpan) cartTotalSpan.textContent = '$' + total.toFixed(2);
    if (cartCountSpan) cartCountSpan.textContent = itemCount;
    saveCart();
}

function addItemToCart(id, name, price, image) {
    const existingItem = cart.find(item => item.id === id);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ id, name, price, image, quantity: 1 });
    }
    updateCartDisplay();
}

function removeItemFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCartDisplay();
}

function changeQty(id, change) {
    const item = cart.find(item => item.id === id);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeItemFromCart(id);
        } else {
            updateCartDisplay();
        }
    }
}

// Initialize cart on page load
document.addEventListener('DOMContentLoaded', function() {
    // Wait for cart elements to be injected if necessary
    setTimeout(() => {
        setupCartUI();
        setupAddToCartListeners();
        updateCartDisplay();
    }, 100);
});

function setupCartUI() {
    const cartIcon = document.getElementById('cart-icon') || document.querySelector('#cart-icon-container i');
    const cartDrawer = document.getElementById('cart-drawer');
    const cartOverlay = document.getElementById('cart-overlay');
    const closeButton = document.getElementById('close-cart');
    const clearCartButton = document.getElementById('clear-cart-button');

    if (!cartDrawer || !cartIcon) {
        console.warn('Cart elements not found, will retry...');
        return;
    }

    // Toggle cart drawer
    const iconContainer = cartIcon.closest('.cart-icon-container') || cartIcon.parentElement;
    if (iconContainer) {
        iconContainer.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            cartDrawer.classList.toggle('open');
            if (cartOverlay) cartOverlay.classList.toggle('active');
        });
    }

    // Close button
    if (closeButton) {
        closeButton.addEventListener('click', () => {
            cartDrawer.classList.remove('open');
            if (cartOverlay) cartOverlay.classList.remove('active');
        });
    }

    // Overlay click
    if (cartOverlay) {
        cartOverlay.addEventListener('click', () => {
            cartDrawer.classList.remove('open');
            cartOverlay.classList.remove('active');
        });
    }

    // Clear cart button
    if (clearCartButton) {
        clearCartButton.addEventListener('click', () => {
            if (confirm('¿Estás seguro de que deseas vaciar el carrito?')) {
                cart = [];
                updateCartDisplay();
                if (typeof showToast === 'function') {
                    showToast('🗑️ Carrito vaciado');
                }
            }
        });
    }

    // Remove item buttons (delegated)
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-item')) {
            const id = e.target.dataset.id;
            removeItemFromCart(id);
        }
    });
}

function setupAddToCartListeners() {
    // Delegated event listener for Add to Cart buttons
    document.addEventListener('click', (e) => {
        // Find button even if clicking on child elements (icon, text, etc.)
        const button = e.target.closest('.btn-add-cart');
        if (!button) return;
        
        e.preventDefault();
        e.stopPropagation();

        const productCard = button.closest('.producto-card');
        if (!productCard) return;

        const name = productCard.querySelector('h3')?.textContent.trim();
        let price = 0;

        // Get price from element (producto-price or precio-text class)
        const priceElement = productCard.querySelector('.producto-price .precio-text, .producto-price strong');
        if (priceElement) {
            const priceText = priceElement.textContent;
            price = parseFloat(priceText.replace(/[^0-9.]/g, '')) || 0;
        }

        // Fallback to products.js function if price not found
        if (price === 0 && typeof getPriceByName === 'function' && name) {
            price = getPriceByName(name);
        }

        // If still no price, use default price of 0 but continue
        const image = productCard.querySelector('.producto-image img')?.src || 
                      productCard.querySelector('.producto-icon img')?.src ||
                      'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22><rect fill=%22%23ccc%22 width=%22100%22 height=%22100%22/></svg>';
        const id = name?.replace(/\s+/g, '-').toLowerCase() || 'product-' + Date.now();

        if (name) {
            // Allow adding to cart even without price
            addItemToCart(id, name, price, image);

            // Open cart drawer
            const cartDrawer = document.getElementById('cart-drawer');
            const cartOverlay = document.getElementById('cart-overlay');
            if (cartDrawer) cartDrawer.classList.add('open');
            if (cartOverlay) cartOverlay.classList.add('active');

            // Show notification
            if (typeof showToast === 'function') {
                showToast('✅ ' + name + ' agregado al carrito');
            }
        }
    });
}

// Checkout function
function checkout() {
    if (cart.length === 0) {
        if (typeof showToast === 'function') {
            showToast('El carrito está vacío');
        }
        return;
    }

    let message = '🛒 *PEDIDO DE PERSONALIZACIÓN* 🛒\n\nHola, me interesa personalizar los siguientes productos:\n\n';
    let total = 0;

    cart.forEach((item, index) => {
        message += `${index + 1}. *${item.name}*\n   📦 Cantidad: ${item.quantity}\n   💰 Precio unitario: $${item.price.toFixed(2)}\n   💵 Subtotal: $${(item.price * item.quantity).toFixed(2)}\n\n`;
        total += item.price * item.quantity;
    });

    message += `━━━━━━━━━━━━━━━━━━━━━━\n*TOTAL: $${total.toFixed(2)}*\n━━━━━━━━━━━━━━━━━━━━━━\n\nPor favor, ayúdame a:\n✏️ Personalizar estos productos\n🎨 Crear mis diseños\n📅 Coordinar la entrega\n\n¡Gracias! 😊`;

    const whatsappUrl = `https://api.whatsapp.com/send/?phone=593991075732&text=${encodeURIComponent(message)}&type=phone_number&app_absent=0`;

    // Close cart drawer
    const cartDrawer = document.getElementById('cart-drawer');
    const cartOverlay = document.getElementById('cart-overlay');
    if (cartDrawer) cartDrawer.classList.remove('open');
    if (cartOverlay) cartOverlay.classList.remove('active');

    window.open(whatsappUrl, '_blank');
}

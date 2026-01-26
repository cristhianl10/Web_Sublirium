document.addEventListener('DOMContentLoaded', function() {
    const cartIcon = document.getElementById('cart-icon');
    const cartModal = document.getElementById('cart-modal');
    const closeButton = document.querySelector('.cart-modal .close-button');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalSpan = document.getElementById('cart-total');
    const cartCountSpan = document.getElementById('cart-count');
    const clearCartButton = document.getElementById('clear-cart-button');
    const addToCartButtons = document.querySelectorAll('.btn-add-cart');

    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    function updateCartDisplay() {
        cartItemsContainer.innerHTML = '';
        let total = 0;
        let itemCount = 0;

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p>Tu carrito está vacío.</p>';
        } else {
            cart.forEach(item => {
                const itemElement = document.createElement('div');
                itemElement.classList.add('cart-item');
                itemElement.innerHTML = `
                    <div class="cart-item-info">
                        <img src="${item.image}" alt="${item.name}">
                        <div class="cart-item-details">
                            <h4>${item.name}</h4>
                            <p>$${item.price.toFixed(2)} x ${item.quantity}</p>
                        </div>
                    </div>
                    <div class="cart-item-actions">
                        <input type="number" value="${item.quantity}" min="1" data-id="${item.id}">
                        <button class="remove-item" data-id="${item.id}">X</button>
                    </div>
                `;
                cartItemsContainer.appendChild(itemElement);

                total += item.price * item.quantity;
                itemCount += item.quantity;
            });
        }

        cartTotalSpan.textContent = `$${total.toFixed(2)}`;
        cartCountSpan.textContent = itemCount;
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

    function updateItemQuantity(id, quantity) {
        const item = cart.find(item => item.id === id);
        if (item) {
            item.quantity = parseInt(quantity);
            if (item.quantity <= 0) {
                removeItemFromCart(id);
            }
        }
        updateCartDisplay();
    }

    // Event Listeners
    cartIcon.addEventListener('click', function() {
        cartModal.style.display = 'block';
    });

    closeButton.addEventListener('click', function() {
        cartModal.style.display = 'none';
    });

    window.addEventListener('click', function(event) {
        if (event.target == cartModal) {
            cartModal.style.display = 'none';
        }
    });

    clearCartButton.addEventListener('click', function() {
        cart = [];
        updateCartDisplay();
    });

    cartItemsContainer.addEventListener('change', function(event) {
        if (event.target.tagName === 'INPUT' && event.target.type === 'number') {
            const id = event.target.dataset.id;
            const quantity = event.target.value;
            updateItemQuantity(id, quantity);
        }
    });

    cartItemsContainer.addEventListener('click', function(event) {
        if (event.target.classList.contains('remove-item')) {
            const id = event.target.dataset.id;
            removeItemFromCart(id);
        }
    });

    addToCartButtons.forEach(button => {
        button.addEventListener('click', function(event) {
            const productCard = event.target.closest('.producto-card');
            const id = productCard.querySelector('h3').textContent.replace(/\s/g, ''); // Simple ID from product name
            const name = productCard.querySelector('h3').textContent;
            const price = parseFloat(productCard.querySelector('.producto-price').textContent.replace('$', ''));
            const image = productCard.querySelector('.producto-image img').src;
            addItemToCart(id, name, price, image);
        });
    });

    // Initial display update
    updateCartDisplay();
});
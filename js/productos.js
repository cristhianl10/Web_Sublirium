document.addEventListener('DOMContentLoaded', function() {
    // Product filtering functionality
    const filtroButtons = document.querySelectorAll('.filtro-btn');
    const productCards = document.querySelectorAll('.producto-card');

    filtroButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Update active button
            filtroButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter products
            productCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                if (filter === 'todos' || (category && category.includes(filter))) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 100);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // Product card interactions
    productCards.forEach(card => {
        // Hover effects
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });

        // Personalizar button
        const personalizarBtn = card.querySelector('.btn-personalizar');
        if (personalizarBtn) {
            personalizarBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                const productName = card.querySelector('h3').textContent;
                console.log(`Personalizar: ${productName}`);
                
                // Add loading state
                this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Cargando...';
                this.disabled = true;
                
                // Simulate loading
                setTimeout(() => {
                    this.innerHTML = 'Personalizar';
                    this.disabled = false;
                    // Here you would redirect to personalization page
                    // window.location.href = `/personalizar?producto=${encodeURIComponent(productName)}`;
                }, 1500);
            });
        }

        // Add to cart button
        const addCartBtn = card.querySelector('.btn-add-cart');
        if (addCartBtn) {
            addCartBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                const productName = card.querySelector('h3').textContent;
                
                // Add to cart animation
                this.innerHTML = '<i class="fas fa-check"></i> Agregado';
                this.style.background = '#27ae60';
                this.disabled = true;
                
                // Show notification
                showNotification(`${productName} agregado al carrito`, 'success');
                
                // Reset button after 2 seconds
                setTimeout(() => {
                    this.innerHTML = 'Agregar al Carrito';
                    this.style.background = '';
                    this.disabled = false;
                }, 2000);
            });
        }

        // Quick view functionality
        const quickViewBtn = card.querySelector('.btn-quick-view');
        if (quickViewBtn) {
            quickViewBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                const productName = card.querySelector('h3').textContent;
                showQuickView(productName, card);
            });
        }
    });

    // Size selection for clothing items
    const tallas = document.querySelectorAll('.talla');
    tallas.forEach(talla => {
        talla.addEventListener('click', function() {
            // Remove selected class from all sizes
            tallas.forEach(t => t.classList.remove('selected'));
            // Add selected class to clicked size
            this.classList.add('selected');
            
            console.log(`Talla seleccionada: ${this.textContent}`);
        });
    });

    // Color selection functionality
    const colorOptions = document.querySelectorAll('.color-option');
    colorOptions.forEach(color => {
        color.addEventListener('click', function() {
            colorOptions.forEach(c => c.classList.remove('selected'));
            this.classList.add('selected');
            
            // Add selection ring
            this.style.boxShadow = '0 0 0 3px var(--gradient-primary)';
            
            // Remove ring from others
            colorOptions.forEach(c => {
                if (c !== this) {
                    c.style.boxShadow = '';
                }
            });
        });
    });

    // Capacity indicator functionality
    const capacityCards = document.querySelectorAll('[data-capacity]');
    capacityCards.forEach(card => {
        const capacity = card.getAttribute('data-capacity');
        const indicator = document.createElement('div');
        indicator.className = 'capacity-indicator';
        indicator.textContent = capacity;
        indicator.style.cssText = `
            position: absolute;
            top: 10px;
            left: 10px;
            background: rgba(0, 0, 0, 0.7);
            color: white;
            padding: 0.25rem 0.5rem;
            border-radius: 4px;
            font-size: 0.8rem;
            font-weight: 600;
        `;
        
        const productImage = card.querySelector('.producto-image');
        if (productImage) {
            productImage.style.position = 'relative';
            productImage.appendChild(indicator);
        }
    });

    // Search functionality
    const searchInput = document.querySelector('#product-search');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            
            productCards.forEach(card => {
                const productName = card.querySelector('h3').textContent.toLowerCase();
                const productDesc = card.querySelector('.producto-descripcion')?.textContent.toLowerCase() || '';
                
                if (productName.includes(searchTerm) || productDesc.includes(searchTerm)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }

    // Price formatting
    const precios = document.querySelectorAll('.precio-actual');
    precios.forEach(precio => {
        const value = precio.textContent;
        if (value.includes('$')) {
            precio.style.fontWeight = '700';
            precio.style.color = 'var(--color-black)';
        }
    });

    // Wishlist functionality
    productCards.forEach(card => {
        const wishlistBtn = document.createElement('button');
        wishlistBtn.className = 'wishlist-btn';
        wishlistBtn.innerHTML = '<i class="far fa-heart"></i>';
        wishlistBtn.style.cssText = `
            position: absolute;
            top: 1rem;
            left: 1rem;
            background: rgba(255, 255, 255, 0.9);
            border: none;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            cursor: pointer;
            transition: var(--transition);
            z-index: 3;
        `;
        
        wishlistBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            const icon = this.querySelector('i');
            
            if (icon.classList.contains('far')) {
                icon.classList.remove('far');
                icon.classList.add('fas');
                this.style.color = '#e74c3c';
                showNotification('Agregado a favoritos', 'success');
            } else {
                icon.classList.remove('fas');
                icon.classList.add('far');
                this.style.color = '';
                showNotification('Removido de favoritos', 'info');
            }
        });
        
        const productImage = card.querySelector('.producto-image');
        if (productImage) {
            productImage.style.position = 'relative';
            productImage.appendChild(wishlistBtn);
        }
    });
});

// Quick view modal functionality
function showQuickView(productName, card) {
    const modal = document.createElement('div');
    modal.className = 'quick-view-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;
    
    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
        background: white;
        border-radius: var(--border-radius);
        padding: 2rem;
        max-width: 500px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
        transform: scale(0.8);
        transition: transform 0.3s ease;
    `;
    
    modalContent.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
            <h2>${productName}</h2>
            <button class="close-modal" style="background: none; border: none; font-size: 1.5rem; cursor: pointer;">&times;</button>
        </div>
        <div style="text-align: center; margin-bottom: 1rem;">
            <div style="width: 200px; height: 200px; background: var(--gradient-primary); border-radius: var(--border-radius); margin: 0 auto; display: flex; align-items: center; justify-content: center; font-size: 3rem; color: white;">
                ${card.querySelector('.producto-icon')?.textContent || '📦'}
            </div>
        </div>
        <p style="color: var(--color-gray); margin-bottom: 1rem;">
            ${card.querySelector('.producto-descripcion')?.textContent || 'Descripción del producto no disponible.'}
        </p>
        <div style="display: flex; gap: 1rem; justify-content: center;">
            <button class="btn-personalizar">Personalizar</button>
            <button class="btn-add-cart">Agregar al Carrito</button>
        </div>
    `;
    
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    
    // Show modal with animation
    setTimeout(() => {
        modal.style.opacity = '1';
        modalContent.style.transform = 'scale(1)';
    }, 10);
    
    // Close modal functionality
    const closeModal = () => {
        modal.style.opacity = '0';
        modalContent.style.transform = 'scale(0.8)';
        setTimeout(() => {
            document.body.removeChild(modal);
        }, 300);
    };
    
    modal.querySelector('.close-modal').addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
    
    // Add functionality to modal buttons
    modalContent.querySelector('.btn-personalizar').addEventListener('click', () => {
        console.log(`Personalizar desde modal: ${productName}`);
        closeModal();
    });
    
    modalContent.querySelector('.btn-add-cart').addEventListener('click', () => {
        showNotification(`${productName} agregado al carrito`, 'success');
        closeModal();
    });
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 2rem;
        right: 2rem;
        background: ${type === 'success' ? '#27ae60' : type === 'error' ? '#e74c3c' : '#3498db'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: var(--border-radius);
        box-shadow: var(--shadow-strong);
        z-index: 10001;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 10);
    
    // Hide notification after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Product comparison functionality
let comparisonList = [];

function addToComparison(productCard) {
    const productName = productCard.querySelector('h3').textContent;
    
    if (comparisonList.length >= 3) {
        showNotification('Máximo 3 productos para comparar', 'error');
        return;
    }
    
    if (comparisonList.find(p => p.name === productName)) {
        showNotification('Producto ya está en comparación', 'error');
        return;
    }
    
    comparisonList.push({
        name: productName,
        element: productCard
    });
    
    showNotification(`${productName} agregado a comparación (${comparisonList.length}/3)`, 'success');
    updateComparisonUI();
}

function updateComparisonUI() {
    let comparisonBar = document.querySelector('.comparison-bar');
    
    if (comparisonList.length === 0) {
        if (comparisonBar) {
            comparisonBar.remove();
        }
        return;
    }
    
    if (!comparisonBar) {
        comparisonBar = document.createElement('div');
        comparisonBar.className = 'comparison-bar';
        comparisonBar.style.cssText = `
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            background: var(--color-black);
            color: white;
            padding: 1rem;
            display: flex;
            align-items: center;
            justify-content: space-between;
            z-index: 1000;
            transform: translateY(100%);
            transition: transform 0.3s ease;
        `;
        document.body.appendChild(comparisonBar);
    }
    
    comparisonBar.innerHTML = `
        <div>
            <strong>Comparar productos (${comparisonList.length}/3)</strong>
            <div style="display: flex; gap: 1rem; margin-top: 0.5rem;">
                ${comparisonList.map(p => `<span>${p.name}</span>`).join('')}
            </div>
        </div>
        <div style="display: flex; gap: 1rem;">
            <button onclick="showComparison()" class="btn-primary" style="padding: 0.5rem 1rem;">Comparar</button>
            <button onclick="clearComparison()" style="background: #e74c3c; color: white; border: none; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer;">Limpiar</button>
        </div>
    `;
    
    comparisonBar.style.transform = 'translateY(0)';
}

function clearComparison() {
    comparisonList = [];
    updateComparisonUI();
    showNotification('Comparación limpiada', 'info');
}

function showComparison() {
    if (comparisonList.length < 2) {
        showNotification('Necesitas al menos 2 productos para comparar', 'error');
        return;
    }
    
    console.log('Mostrar comparación:', comparisonList);
    showNotification('Función de comparación en desarrollo', 'info');
}
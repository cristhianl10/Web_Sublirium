/**
 * Sublirium Catalog Details Handler
 * Fetches product descriptions and specs from category pages and displays them in a modal.
 */

document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('product-modal');
    const modalBody = document.getElementById('modal-product-details');
    const closeBtn = document.querySelector('.close-modal');
    const modalLoader = document.getElementById('modal-loader');
    
    // Mapping of section IDs in catalog.html to their respective source HTML files
    const categoryMap = {
        'tazas': 'tazas-jarros.html',
        'termos': 'termos.html',
        'vasos': 'vasos-termicos.html',
        'tomatodos': 'tomatodos.html',
        'camisetas': 'camisetas.html',
        'gorras': 'gorras.html',
        'mousepad': 'mousepad.html',
        'lamina': 'lamina-aluminio.html',
        'bolsos': 'bolsos.html',
        'reloj': 'reloj.html',
        'portarretrato-reloj': 'portarretrato-reloj.html',
        'libretas': 'libretas.html',
        'llaveros': 'llaveros.html',
        'bambu': 'portarretrato-bambu.html',
        'forro': 'forro-almohada.html',
        'platos': 'platos.html'
    };

    // Cache for fetched documents
    const docCache = {};

    // Open Modal
    const openProductDetails = async (card) => {
        const productName = card.querySelector('.producto-name').textContent.trim();
        const categorySection = card.closest('section.category');
        const categoryId = categorySection ? categorySection.id : null;
        const sourceFile = categoryMap[categoryId];

        if (!sourceFile) {
            console.warn(`No source file mapped for category: ${categoryId}`);
            return;
        }

        // Show modal and loader
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scroll
        modalLoader.style.display = 'flex';
        modalBody.style.opacity = '0';

        try {
            let doc;
            if (docCache[sourceFile]) {
                doc = docCache[sourceFile];
            } else {
                const response = await fetch(sourceFile);
                if (!response.ok) throw new Error('Network response was not ok');
                const html = await response.text();
                const parser = new DOMParser();
                doc = parser.parseFromString(html, 'text/html');
                docCache[sourceFile] = doc;
            }

            // Find the product in the source document
            const sourceCards = Array.from(doc.querySelectorAll('.producto-card'));
            const sourceCard = sourceCards.find(c => {
                const name = c.querySelector('h3')?.textContent.trim();
                return name === productName;
            });

            if (sourceCard) {
                const description = sourceCard.querySelector('.producto-descripcion')?.innerHTML || 'No hay descripción disponible.';
                const specs = sourceCard.querySelector('.producto-specs')?.innerHTML || '';
                const imageSrc = card.querySelector('img')?.src;
                const badge = card.querySelector('.producto-badge')?.textContent;

                // Update Modal Content
                modalBody.innerHTML = `
                    <div class="modal-product-container">
                        <div class="modal-product-image">
                            ${badge ? `<span class="modal-badge">${badge}</span>` : ''}
                            <img src="${imageSrc}" alt="${productName}">
                        </div>
                        <div class="modal-product-info">
                            <h2 class="modal-product-title">${productName}</h2>
                            <div class="modal-product-description">
                                <h3>Descripción</h3>
                                <p>${description}</p>
                            </div>
                            ${specs ? `
                                <div class="modal-product-specs">
                                    <h3>Características</h3>
                                    <div class="specs-grid">${specs}</div>
                                </div>
                            ` : ''}
                            <div class="modal-actions">
                                <button class="btn-add-to-cart-modal" onclick="handleModalAddToCart('${productName}')">
                                    <i class="fas fa-shopping-cart"></i> Agregar al Carrito
                                </button>
                                <button class="btn-whatsapp-modal" onclick="handleModalWhatsapp('${productName}')">
                                    <i class="fab fa-whatsapp"></i> Consultar por WhatsApp
                                </button>
                            </div>
                        </div>
                    </div>
                `;
            } else {
                modalBody.innerHTML = `
                    <div class="modal-error">
                        <i class="fas fa-exclamation-circle"></i>
                        <p>Lo sentimos, no pudimos encontrar los detalles de este producto.</p>
                    </div>
                `;
            }
        } catch (error) {
            console.error('Error fetching product details:', error);
            modalBody.innerHTML = `
                <div class="modal-error">
                    <i class="fas fa-wifi-slash"></i>
                    <p>Error al cargar la información. Por favor, intenta de nuevo.</p>
                </div>
            `;
        } finally {
            modalLoader.style.display = 'none';
            modalBody.style.opacity = '1';
        }
    };

    // Close Modal
    const closeModal = () => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    };

    // Event Listeners
    document.querySelectorAll('.producto-card').forEach(card => {
        card.style.cursor = 'pointer';
        card.addEventListener('click', () => openProductDetails(card));
    });

    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    // Handle Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
});

// Global functions for modal actions (called via onclick in template literal)
window.handleModalAddToCart = (name) => {
    if (typeof addItemToCart === 'function') {
        const modal = document.getElementById('product-modal');
        const image = modal.querySelector('.modal-product-image img')?.src;
        const id = name.replace(/\s+/g, '-').toLowerCase();
        
        // Try to get price from products.js or default to 0
        let price = 0;
        if (typeof getPriceByName === 'function') {
            price = getPriceByName(name);
        }
        
        addItemToCart(id, name, price, image);

        // Open cart drawer
        const cartDrawer = document.getElementById('cart-drawer');
        const cartOverlay = document.getElementById('cart-overlay');
        if (cartDrawer) cartDrawer.classList.add('open');
        if (cartOverlay) cartOverlay.classList.add('active');

        // Show toast if available
        if (typeof showToast === 'function') {
            showToast('✅ ' + name + ' agregado al carrito');
        }
        
        // Close modal after adding
        document.getElementById('product-modal').classList.remove('active');
        document.body.style.overflow = '';
    } else {
        alert(`Producto "${name}" agregado al carrito (Simulado)`);
    }
};

window.handleModalWhatsapp = (name) => {
    const message = encodeURIComponent(`Hola, me interesa obtener más información sobre el producto: ${name}`);
    window.open(`https://api.whatsapp.com/send/?phone=593991075732&text=${message}`, '_blank');
};

// Page Setup for Product Pages
document.addEventListener('DOMContentLoaded', function() {
    // Add prices to product cards
    initializePrices();
});

function initializePrices() {
    // Find all product cards and add prices
    const productCards = document.querySelectorAll('.producto-card');
    productCards.forEach(card => {
        const name = card.querySelector('h3')?.textContent.trim();
        if (name) {
            const price = getPriceByName(name);
            
            // Remove existing price if any
            const existingPrice = card.querySelector('.producto-price');
            if (existingPrice) {
                existingPrice.remove();
            }
            
            // Add price before description
            const description = card.querySelector('.producto-descripcion');
            if (description && price > 0) {
                const priceElement = document.createElement('div');
                priceElement.className = 'producto-price';
                priceElement.innerHTML = `<strong class="precio-text">${formatPrice(price)}</strong>`;
                priceElement.style.cssText = `
                    font-size: 1.3rem;
                    font-weight: 700;
                    color: #00D4FF;
                    margin: 0.5rem 0 1rem;
                `;
                description.parentNode.insertBefore(priceElement, description);
            }
        }
    });
}

// Re-run on dynamic content changes
const observer = new MutationObserver(() => {
    initializePrices();
});

observer.observe(document.body, { childList: true, subtree: true });

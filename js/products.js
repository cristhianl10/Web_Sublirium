// Productos y sus precios (en USD)
const PRODUCT_PRICES = {
    'Gorra sublimable': 12.99,
    'Camiseta blanca sublimada': 15.99,
    'Taza blanca sublimable': 8.99,
    'Jarro mágico': 9.99,
    'Termo aluminio 500ml': 19.99,
    'Vaso térmico': 14.99,
    'Tomatodos': 16.99,
    'Mousepad rectangular': 11.99,
    'Lámina de aluminio A4': 7.99,
    'Bolso personalizable': 24.99,
    'Reloj alarma': 18.99,
    'Portarretrato con reloj': 22.99,
    'Libreta A5': 6.99,
    'Llavero metal': 4.99,
    'Portarretrato bambú': 13.99,
    'Forro de almohada': 17.99,
    'Plato decorativo': 10.99,
    'Vasos térmicos - Set': 34.99
};

// Get price for a product
function getPriceByName(productName) {
    return PRODUCT_PRICES[productName] || 0;
}

// Format price as currency
function formatPrice(price) {
    return `$${price.toFixed(2)}`;
}

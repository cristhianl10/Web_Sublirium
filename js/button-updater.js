// Script to update all "Personalizar" buttons to "Agregar al Carrito"
// This runs after the page loads to convert any old WhatsApp buttons

document.addEventListener('DOMContentLoaded', function() {
    updateAllButtons();
});

function updateAllButtons() {
    // Find all links and buttons with class btn-add-cart that link to WhatsApp
    const buttons = document.querySelectorAll('a.btn-add-cart[href*="api.whatsapp.com"]');
    
    buttons.forEach(link => {
        // Create a new button element
        const button = document.createElement('button');
        button.className = 'btn-add-cart';
        button.type = 'button';
        
        // Copy the child elements (icon and text)
        button.innerHTML = '<i class="fas fa-shopping-cart"></i> Agregar al Carrito';
        
        // Replace the link with the button
        link.parentNode.replaceChild(button, link);
    });
    
    // Also update any buttons that still have the old WhatsApp icon
    const oldButtons = document.querySelectorAll('.btn-add-cart i.fa-whatsapp');
    oldButtons.forEach(icon => {
        icon.className = 'fas fa-shopping-cart';
        const textNode = icon.nextSibling;
        if (textNode && textNode.nodeType === Node.TEXT_NODE) {
            textNode.textContent = ' Agregar al Carrito';
        }
    });
}

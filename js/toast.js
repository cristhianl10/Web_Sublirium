// Toast Notification System
function showToast(message, duration = 3000) {
    // Create toast container if it doesn't exist
    let toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toast-container';
        toastContainer.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            display: flex;
            flex-direction: column;
            gap: 10px;
        `;
        document.body.appendChild(toastContainer);
    }

    // Create toast element
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    toast.style.cssText = `
        background: rgba(0, 0, 0, 0.9);
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        font-size: 0.95rem;
        min-width: 250px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.3);
        animation: slideIn 0.3s ease-out;
        border-left: 4px solid var(--gradient-primary, #00D4FF);
    `;

    toastContainer.appendChild(toast);

    // Remove toast after duration
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

// Checkout function
function checkout() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (cart.length === 0) {
        showToast('El carrito está vacío');
        return;
    }

    // Generate WhatsApp message
    let message = 'Hola, me interesa personalizar los siguientes productos:\n\n';
    let total = 0;

    cart.forEach((item, index) => {
        message += `${index + 1}. ${item.name} - Cantidad: ${item.quantity} - Precio: $${item.price.toFixed(2)}\n`;
        total += item.price * item.quantity;
    });

    message += `\nTotal: $${total.toFixed(2)}\n\nQuiero personalizar estos productos.`;
    
    // Encode message for WhatsApp
    const whatsappUrl = `https://api.whatsapp.com/send/?phone=593991075732&text=${encodeURIComponent(message)}&type=phone_number&app_absent=0`;
    
    // Close cart modal
    const cartModal = document.getElementById('cart-modal');
    if (cartModal) {
        cartModal.style.display = 'none';
    }
    
    window.open(whatsappUrl, '_blank');
}

// Inject toast styles into the document
document.addEventListener('DOMContentLoaded', () => {
    if (!document.querySelector('style[data-toast]')) {
        const style = document.createElement('style');
        style.setAttribute('data-toast', 'true');
        style.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(400px);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }

            @keyframes slideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(400px);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
});

document.addEventListener('DOMContentLoaded', function() {
    // Floating products animation enhancement
    const floatingElements = document.querySelectorAll('.product-card');
    floatingElements.forEach((element, index) => {
        element.style.animationDelay = `${index * 1.5}s`;
        
        // Add hover pause effect
        element.addEventListener('mouseenter', () => {
            element.style.animationPlayState = 'paused';
        });
        
        element.addEventListener('mouseleave', () => {
            element.style.animationPlayState = 'running';
        });
    });

    // Hero CTA button enhancement
    const ctaButton = document.querySelector('.cta-button');
    if (ctaButton) {
        ctaButton.addEventListener('click', function(e) {
            // Add ripple effect
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
            `;
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    }

    // Testimonials carousel functionality
    const testimoniosGrid = document.querySelector('.testimonios-grid');
    if (testimoniosGrid && window.innerWidth <= 768) {
        let currentTestimonio = 0;
        const testimonios = document.querySelectorAll('.testimonio');
        
        if (testimonios.length > 1) {
            // Hide all except first
            testimonios.forEach((testimonio, index) => {
                if (index !== 0) {
                    testimonio.style.display = 'none';
                }
            });
            
            // Create navigation dots
            const dotsContainer = document.createElement('div');
            dotsContainer.className = 'testimonios-dots';
            dotsContainer.style.cssText = `
                display: flex;
                justify-content: center;
                gap: 0.5rem;
                margin-top: 2rem;
            `;
            
            testimonios.forEach((_, index) => {
                const dot = document.createElement('button');
                dot.className = `dot ${index === 0 ? 'active' : ''}`;
                dot.style.cssText = `
                    width: 12px;
                    height: 12px;
                    border-radius: 50%;
                    border: none;
                    background: ${index === 0 ? 'var(--gradient-primary)' : 'var(--color-light-gray)'};
                    cursor: pointer;
                    transition: var(--transition);
                `;
                
                dot.addEventListener('click', () => {
                    showTestimonio(index);
                });
                
                dotsContainer.appendChild(dot);
            });
            
            testimoniosGrid.parentNode.appendChild(dotsContainer);
            
            function showTestimonio(index) {
                testimonios[currentTestimonio].style.display = 'none';
                testimonios[index].style.display = 'block';
                
                // Update dots
                document.querySelectorAll('.dot').forEach((dot, i) => {
                    dot.style.background = i === index ? 'var(--gradient-primary)' : 'var(--color-light-gray)';
                    dot.classList.toggle('active', i === index);
                });
                
                currentTestimonio = index;
            }
            
            // Auto-rotate testimonials
            setInterval(() => {
                const nextIndex = (currentTestimonio + 1) % testimonios.length;
                showTestimonio(nextIndex);
            }, 5000);
        }
    }

    // Parallax effect for hero section
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const heroGradient = document.querySelector('.hero-bg-gradient');
        if (heroGradient) {
            heroGradient.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    });

    // Dynamic gradient animation
    const gradientElements = document.querySelectorAll('.gradient-text, .cta-button');
    let gradientPosition = 0;

    setInterval(() => {
        gradientPosition += 1;
        gradientElements.forEach(element => {
            element.style.backgroundPosition = `${gradientPosition}% 50%`;
        });
    }, 50);

    // Products hover effect enhancement
    document.querySelectorAll('.producto-item').forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Steps animation on scroll
    const pasos = document.querySelectorAll('.paso');
    const pasosObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 200);
            }
        });
    }, { threshold: 0.3 });

    pasos.forEach(paso => {
        paso.style.opacity = '0';
        paso.style.transform = 'translateY(50px)';
        paso.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        pasosObserver.observe(paso);
    });
});

// Add ripple animation CSS
const rippleCSS = `
@keyframes ripple {
    to {
        transform: scale(4);
        opacity: 0;
    }
}
`;

const style = document.createElement('style');
style.textContent = rippleCSS;
document.head.appendChild(style);
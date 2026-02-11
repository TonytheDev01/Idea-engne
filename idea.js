// 1. SMOOTH SCROLL NAVIGATION

document.addEventListener('DOMContentLoaded', () => {
    // Smooth scroll for all anchor links
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            
            // Skip if it's just "#"
            if (targetId === '#') return;
            
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});


// 2. SCROLL-TRIGGERED FADE-IN ANIMATIONS

const observerOptions = {
    threshold: 0.20,  // Trigger when 15% of element is visible
    rootMargin: '0px 0px -50px 0px'  // Trigger slightly before element enters viewport
};

const fadeInObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-visible');
            // Stop observing after animation (performance optimization)
            fadeInObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe elements when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Select elements to animate
    const animatedElements = document.querySelectorAll(
        '.card, .comments, .how-header, .rate-header, .left-content, .right-content'
    );
    
    animatedElements.forEach(el => {
        el.classList.add('fade-in');
        fadeInObserver.observe(el);
    });
});


// 3. TYPING EFFECT ON HERO TITLE

class TypingEffect {
    constructor(element, words, typingSpeed = 100, deletingSpeed = 50, pauseDuration = 2000) {
        this.element = element;
        this.words = words;
        this.typingSpeed = typingSpeed;
        this.deletingSpeed = deletingSpeed;
        this.pauseDuration = pauseDuration;
        this.currentWordIndex = 0;
        this.currentText = '';
        this.isDeleting = false;
    }

    type() {
        const currentWord = this.words[this.currentWordIndex];
        
        if (this.isDeleting) {
            // Remove character
            this.currentText = currentWord.substring(0, this.currentText.length - 1);
        } else {
            // Add character
            this.currentText = currentWord.substring(0, this.currentText.length + 1);
        }

        // Update element
        this.element.textContent = this.currentText;

        // Determine speed
        let speed = this.isDeleting ? this.deletingSpeed : this.typingSpeed;

        // If word is complete
        if (!this.isDeleting && this.currentText === currentWord) {
            speed = this.pauseDuration;
            this.isDeleting = true;
        } else if (this.isDeleting && this.currentText === '') {
            this.isDeleting = false;
            this.currentWordIndex = (this.currentWordIndex + 1) % this.words.length;
            speed = 500; // Pause before starting new word
        }

        setTimeout(() => this.type(), speed);
    }

    start() {
        this.type();
    }
}

// Initialize typing effect when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const heroTitle = document.querySelector('.left-content h2');
    
    if (heroTitle) {
        // Extract the highlight spans to preserve them
        const brilliantSpan = heroTitle.querySelector('.highlight:nth-of-type(1)');
        const ideasSpan = heroTitle.querySelector('.highlight:nth-of-type(2)');
        
        // Store original HTML structure
        const originalHTML = heroTitle.innerHTML;
        
        // Create a container for the typing effect on "Brilliant"
        if (brilliantSpan) {
            const words = ['Brilliant', 'Creative', 'Engaging', 'Viral', 'Unique'];
            
            // Start typing effect after a short delay
            setTimeout(() => {
                const typingEffect = new TypingEffect(brilliantSpan, words, 80, 40, 2000);
                typingEffect.start();
            }, 500);
        }
    }
});


// 4. TESTIMONIAL CAROUSEL

class TestimonialCarousel {
    constructor(wrapperSelector, autoPlayInterval = 5000) {
        this.wrapper = document.querySelector(wrapperSelector);
        if (!this.wrapper) return;
        
        this.testimonials = this.wrapper.querySelectorAll('.comments');
        this.currentIndex = 0;
        this.autoPlayInterval = autoPlayInterval;
        this.autoPlayTimer = 0.5;
        this.isPaused = false;

        this.init();
    }

    init() {
        if (this.testimonials.length === 0) return;

        // Add carousel controls
        this.createControls();
        
        // Add indicators
        this.createIndicators();
        
        // Show first testimonial
        this.showTestimonial(0);
        
        // Start autoplay
        this.startAutoPlay();
        
        // Pause on hover
        this.wrapper.addEventListener('mouseenter', () => this.pauseAutoPlay());
        this.wrapper.addEventListener('mouseleave', () => this.resumeAutoPlay());
    }

    createControls() {
        const controlsHTML = `
            <button class="carousel-btn carousel-btn-prev" aria-label="Previous testimonial">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
            </button>
            <button class="carousel-btn carousel-btn-next" aria-label="Next testimonial">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
            </button>
        `;
        
        this.wrapper.insertAdjacentHTML('beforeend', controlsHTML);
        
        // Event listeners
        this.wrapper.querySelector('.carousel-btn-prev').addEventListener('click', () => this.prev());
        this.wrapper.querySelector('.carousel-btn-next').addEventListener('click', () => this.next());
    }

    createIndicators() {
        const indicatorsHTML = `
            <div class="carousel-indicators">
                ${Array.from(this.testimonials).map((_, index) => 
                    `<button class="carousel-indicator ${index === 0 ? 'active' : ''}" 
                            aria-label="Go to testimonial ${index + 1}"
                            data-index="${index}"></button>`
                ).join('')}
            </div>
        `;
        
        this.wrapper.insertAdjacentHTML('beforeend', indicatorsHTML);
        
        // Event listeners for indicators
        this.wrapper.querySelectorAll('.carousel-indicator').forEach(indicator => {
            indicator.addEventListener('click', (e) => {
                const index = parseInt(e.target.dataset.index);
                this.showTestimonial(index);
            });
        });
    }

    showTestimonial(index) {
        // Hide all testimonials
        this.testimonials.forEach(testimonial => {
            testimonial.classList.remove('active');
            testimonial.style.display = 'none';
        });

        // Show current testimonial
        this.testimonials[index].classList.add('active');
        this.testimonials[index].style.display = 'flex';

        // Update indicators
        const indicators = this.wrapper.querySelectorAll('.carousel-indicator');
        indicators.forEach((indicator, i) => {
            indicator.classList.toggle('active', i === index);
        });

        this.currentIndex = index;
    }

    next() {
        const nextIndex = (this.currentIndex + 1) % this.testimonials.length;
        this.showTestimonial(nextIndex);
        this.resetAutoPlay();
    }

    prev() {
        const prevIndex = (this.currentIndex - 1 + this.testimonials.length) % this.testimonials.length;
        this.showTestimonial(prevIndex);
        this.resetAutoPlay();
    }

    startAutoPlay() {
        this.autoPlayTimer = setInterval(() => {
            if (!this.isPaused) {
                this.next();
            }
        }, this.autoPlayInterval);
    }

    pauseAutoPlay() {
        this.isPaused = true;
    }

    resumeAutoPlay() {
        this.isPaused = false;
    }

    resetAutoPlay() {
        clearInterval(this.autoPlayTimer);
        this.startAutoPlay();
    }
}

// Initialize carousel when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new TestimonialCarousel('.comments-wrapper', 5000);
});


// 5. CTA MODAL

class CTAModal {
    constructor() {
        this.modal = null;
        this.createModal();
        this.attachEventListeners();
    }

    createModal() {
        const modalHTML = `
            <div class="cta-modal" id="ctaModal" role="dialog" aria-labelledby="modalTitle" aria-modal="true">
                <div class="cta-modal-overlay" aria-hidden="true"></div>
                <div class="cta-modal-content">
                    <button class="cta-modal-close" aria-label="Close modal">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                    
                    <div class="cta-modal-header">
                        <h2 id="modalTitle">Start Generating Ideas Today! 🚀</h2>
                        <p>Join thousands of content creators who never run out of brilliant ideas.</p>
                    </div>
                    
                    <form class="cta-modal-form" id="ctaForm">
                        <div class="form-group">
                            <label for="modalEmail">Email Address</label>
                            <input 
                                type="email" 
                                id="modalEmail" 
                                name="email" 
                                placeholder="you@example.com" 
                                required
                                aria-required="true"
                            >
                            <span class="form-error" id="emailError"></span>
                        </div>
                        
                        <div class="form-group">
                            <label for="modalNiche">Your Niche (Optional)</label>
                            <input 
                                type="text" 
                                id="modalNiche" 
                                name="niche" 
                                placeholder="e.g., Fitness, Tech, Fashion"
                            >
                        </div>
                        
                        <button type="submit" class="cta-modal-submit">
                            Get Started
                        </button>
                        
                        <p class="cta-modal-note">
                            No credit card required. Start with 10 free ideas.
                        </p>
                    </form>
                    
                    <div class="cta-modal-success" id="modalSuccess" style="display: none;">
                        <div class="success-icon">✓</div>
                        <h3>Welcome Aboard! 🎉</h3>
                        <p>Check your email for your first 10 AI-generated ideas.</p>
                        <button class="cta-modal-submit" onclick="document.getElementById('ctaModal').classList.remove('active')">
                            Got it!
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        this.modal = document.getElementById('ctaModal');
    }

    attachEventListeners() {
        // Open modal buttons
        const openButtons = document.querySelectorAll('.start, .tony, .started, .login-btn, .signup-btn');
        openButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.open();
            });
        });

        // Close modal
        const closeBtn = this.modal.querySelector('.cta-modal-close');
        const overlay = this.modal.querySelector('.cta-modal-overlay');
        
        closeBtn.addEventListener('click', () => this.close());
        overlay.addEventListener('click', () => this.close());

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.classList.contains('active')) {
                this.close();
            }
        });

        // Form submission
        const form = document.getElementById('ctaForm');
        form.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    open() {
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scroll
        
        // Focus first input
        setTimeout(() => {
            document.getElementById('modalEmail').focus();
        }, 100);
    }

    close() {
        this.modal.classList.remove('active');
        document.body.style.overflow = ''; // Restore scroll
        
        // Reset form after animation
        setTimeout(() => {
            document.getElementById('ctaForm').reset();
            document.getElementById('ctaForm').style.display = 'block';
            document.getElementById('modalSuccess').style.display = 'none';
        }, 300);
    }

    handleSubmit(e) {
        e.preventDefault();
        
        const email = document.getElementById('modalEmail').value;
        const niche = document.getElementById('modalNiche').value;
        
        // Simple email validation
        if (!this.validateEmail(email)) {
            this.showError('Please enter a valid email address');
            return;
        }

        // Simulate API call
        this.showLoading();
        
        setTimeout(() => {
            // Hide form, show success
            document.getElementById('ctaForm').style.display = 'none';
            document.getElementById('modalSuccess').style.display = 'flex';
            
            // In production, you'd send data to your backend here:
            console.log('Form submitted:', { email, niche });
        }, 1500);
    }

    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    showError(message) {
        const errorEl = document.getElementById('emailError');
        errorEl.textContent = message;
        errorEl.style.display = 'block';
        
        setTimeout(() => {
            errorEl.style.display = 'none';
        }, 3000);
    }

    showLoading() {
        const submitBtn = this.modal.querySelector('.cta-modal-submit');
        submitBtn.textContent = 'Processing...';
        submitBtn.disabled = true;
    }
}

// Initialize modal when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new CTAModal();
});


//  PERFORMANCE OPTIMIZATIONS 

// Debounce function for scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Lazy load images (if you add more images later)
if ('loading' in HTMLImageElement.prototype) {
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
        img.src = img.dataset.src || img.src;
    });
} else {
    // Fallback for browsers that don't support lazy loading
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
    document.body.appendChild(script);
}


//  ACCESSIBILITY ENHANCEMENTS

// Skip to main content link
document.addEventListener('DOMContentLoaded', () => {
    const skipLink = document.createElement('a');
    skipLink.href = '#main-section';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link';
    document.body.insertBefore(skipLink, document.body.firstChild);
});

// Announce dynamic content changes to screen readers
function announceToScreenReader(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', 'polite');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    document.body.appendChild(announcement);
    
    setTimeout(() => {
        document.body.removeChild(announcement);
    }, 1000);
}


//  CONSOLE BRANDING (PROFESSIONAL TOUCH)
console.log('%c🚀 Idea Engne', 'font-size: 20px; font-weight: bold; color: #4f39f6;');
console.log('%cBuilt by TonyDev', 'font-size: 12px; color: #666;');
console.log('%cInterested in how this works? Let\'s connect!', 'font-size: 12px; color: #4f39f6;');

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initNavigation();
    initScrollAnimations();
    initFAQ();
    initContactForm();
    initScrollToTop();
    initSmoothScrolling();
    initCounterAnimations();

    // Initialize image functionality
    detectWebPSupport();
    initLazyLoading();
    initImageErrorHandling();
    initResponsiveImages();
});

// Navigation functionality
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Navbar scroll effect
    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;

        if (currentScrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Hide/show navbar on scroll
        if (currentScrollY > lastScrollY && currentScrollY > 200) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }

        lastScrollY = currentScrollY;
    });

    // Mobile menu toggle
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');

        // Prevent body scroll when menu is open
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close mobile menu when clicking on nav links
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navbar.contains(e.target) && navMenu.classList.contains('active')) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // Highlight active nav link based on scroll position
    window.addEventListener('scroll', () => {
        const sections = document.querySelectorAll('section');
        const scrollPos = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });
}

// Smooth scrolling for anchor links
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();

            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                const navbarHeight = document.getElementById('navbar').offsetHeight;
                const targetPosition = targetSection.offsetTop - navbarHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Scroll animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');

                // Trigger counter animations if element has counters
                if (entry.target.classList.contains('hero-stats')) {
                    animateCounters();
                }
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.service-card, .testimonial, .step, .hero-stats, .about-content, .section-header');
    animateElements.forEach(el => {
        observer.observe(el);
    });

    // Add animation CSS
    const style = document.createElement('style');
    style.textContent = `
        .service-card, .testimonial, .step, .hero-stats, .about-content, .section-header {
            opacity: 0;
            transform: translateY(30px);
            transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .animate-in {
            opacity: 1;
            transform: translateY(0);
        }

        .step:nth-child(2).animate-in { transition-delay: 0.1s; }
        .step:nth-child(3).animate-in { transition-delay: 0.2s; }
        .step:nth-child(4).animate-in { transition-delay: 0.3s; }
        .step:nth-child(5).animate-in { transition-delay: 0.4s; }
    `;
    document.head.appendChild(style);
}

// Counter animations
function initCounterAnimations() {
    let countersAnimated = false;

    window.animateCounters = function() {
        if (countersAnimated) return;
        countersAnimated = true;

        const counters = document.querySelectorAll('.stat .number');

        counters.forEach(counter => {
            const target = parseInt(counter.textContent.replace(/\D/g, ''));
            const suffix = counter.textContent.replace(/\d/g, '');
            let current = 0;
            const increment = target / 100;
            const duration = 2000; // 2 seconds
            const stepTime = duration / 100;

            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                counter.textContent = Math.floor(current) + suffix;
            }, stepTime);
        });
    };
}

// FAQ functionality
function initFAQ() {
    const faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const faqItem = question.parentElement;
            const faqAnswer = faqItem.querySelector('.faq-answer');
            const isActive = question.classList.contains('active');

            // Close all other FAQ items
            faqQuestions.forEach(q => {
                q.classList.remove('active');
                q.parentElement.querySelector('.faq-answer').classList.remove('active');
            });

            // Toggle current item
            if (!isActive) {
                question.classList.add('active');
                faqAnswer.classList.add('active');
            }
        });
    });
}

// Contact form functionality
function initContactForm() {
    const form = document.getElementById('appointmentForm');

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            // Get form data
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);

            // Validate form
            if (validateForm(data)) {
                // Simulate form submission
                showFormSubmissionFeedback(true);
                form.reset();
            } else {
                showFormSubmissionFeedback(false);
            }
        });

        // Real-time form validation
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                validateField(input);
            });

            input.addEventListener('input', () => {
                clearFieldError(input);
            });
        });
    }
}

// Form validation
function validateForm(data) {
    let isValid = true;

    // Required fields validation
    const requiredFields = ['name', 'email', 'phone', 'service', 'preferred-date'];

    requiredFields.forEach(field => {
        if (!data[field] || data[field].trim() === '') {
            showFieldError(field, 'This field is required');
            isValid = false;
        }
    });

    // Email validation
    if (data.email && !isValidEmail(data.email)) {
        showFieldError('email', 'Please enter a valid email address');
        isValid = false;
    }

    // Phone validation
    if (data.phone && !isValidPhone(data.phone)) {
        showFieldError('phone', 'Please enter a valid phone number');
        isValid = false;
    }

    // Date validation (must be in the future)
    if (data['preferred-date']) {
        const selectedDate = new Date(data['preferred-date']);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (selectedDate < today) {
            showFieldError('preferred-date', 'Please select a future date');
            isValid = false;
        }
    }

    return isValid;
}

function validateField(input) {
    const value = input.value.trim();
    const fieldName = input.name;

    clearFieldError(input);

    if (input.hasAttribute('required') && !value) {
        showFieldError(fieldName, 'This field is required');
        return false;
    }

    if (fieldName === 'email' && value && !isValidEmail(value)) {
        showFieldError(fieldName, 'Please enter a valid email address');
        return false;
    }

    if (fieldName === 'phone' && value && !isValidPhone(value)) {
        showFieldError(fieldName, 'Please enter a valid phone number');
        return false;
    }

    return true;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    const phoneRegex = /^[\+]?[\d\s\-\(\)]{10,}$/;
    return phoneRegex.test(phone);
}

function showFieldError(fieldName, message) {
    const field = document.querySelector(`[name="${fieldName}"]`);
    if (field) {
        field.classList.add('error');

        // Remove existing error message
        const existingError = field.parentNode.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }

        // Add error message
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.textContent = message;
        field.parentNode.appendChild(errorElement);
    }
}

function clearFieldError(input) {
    input.classList.remove('error');
    const errorMessage = input.parentNode.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.remove();
    }
}

function showFormSubmissionFeedback(success) {
    const form = document.getElementById('appointmentForm');
    const feedback = document.createElement('div');
    feedback.className = `form-feedback ${success ? 'success' : 'error'}`;

    if (success) {
        feedback.innerHTML = `
            <div class="feedback-content">
                <i class="fas fa-check-circle"></i>
                <h3>Appointment Request Sent!</h3>
                <p>Thank you for your request. We'll contact you within 24 hours to confirm your appointment.</p>
            </div>
        `;
    } else {
        feedback.innerHTML = `
            <div class="feedback-content">
                <i class="fas fa-exclamation-circle"></i>
                <h3>Please Check Your Information</h3>
                <p>There are some errors in your form. Please correct them and try again.</p>
            </div>
        `;
    }

    form.parentNode.insertBefore(feedback, form);

    // Add feedback styles
    if (!document.querySelector('#feedback-styles')) {
        const style = document.createElement('style');
        style.id = 'feedback-styles';
        style.textContent = `
            .form-feedback {
                padding: 2rem;
                border-radius: 10px;
                margin-bottom: 2rem;
                text-align: center;
                animation: slideInDown 0.5s ease;
            }

            .form-feedback.success {
                background: linear-gradient(135deg, #d4edda, #c3e6cb);
                border: 2px solid #28a745;
                color: #155724;
            }

            .form-feedback.error {
                background: linear-gradient(135deg, #f8d7da, #f1b0b7);
                border: 2px solid #dc3545;
                color: #721c24;
            }

            .feedback-content i {
                font-size: 3rem;
                margin-bottom: 1rem;
            }

            .feedback-content h3 {
                margin-bottom: 0.5rem;
                color: inherit;
            }

            .form-group input.error,
            .form-group select.error,
            .form-group textarea.error {
                border-color: #dc3545;
                box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.1);
            }

            .error-message {
                color: #dc3545;
                font-size: 0.875rem;
                margin-top: 0.5rem;
                display: flex;
                align-items: center;
                gap: 0.25rem;
            }

            .error-message::before {
                content: "⚠";
                font-size: 1rem;
            }

            @keyframes slideInDown {
                from {
                    opacity: 0;
                    transform: translateY(-30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Remove feedback after 5 seconds
    setTimeout(() => {
        feedback.style.animation = 'fadeOut 0.5s ease';
        setTimeout(() => {
            if (feedback.parentNode) {
                feedback.remove();
            }
        }, 500);
    }, 5000);
}

// Scroll to top functionality
function initScrollToTop() {
    const scrollTopBtn = document.getElementById('scrollTop');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    });

    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Parallax effect for hero section
function initParallaxEffect() {
    const hero = document.querySelector('.hero');

    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;

        if (hero) {
            hero.style.transform = `translate3d(0, ${rate}px, 0)`;
        }
    });
}

// Enhanced lazy loading for images
function initLazyLoading() {
    // Modern browsers with native lazy loading support
    if ('loading' in HTMLImageElement.prototype) {
        const images = document.querySelectorAll('img[loading="lazy"]');
        images.forEach(img => {
            img.addEventListener('load', () => {
                img.classList.add('loaded');
            });
        });
    } else {
        // Fallback for older browsers
        const images = document.querySelectorAll('img[loading="lazy"]');

        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;

                    // Add loading state
                    img.parentElement.classList.add('image-loading');

                    // Create new image to preload
                    const newImg = new Image();
                    newImg.onload = () => {
                        img.src = newImg.src;
                        img.classList.add('loaded');
                        img.parentElement.classList.remove('image-loading');
                    };

                    newImg.onerror = () => {
                        img.parentElement.classList.remove('image-loading');
                        console.error('Failed to load image:', img.src);
                    };

                    newImg.src = img.src;
                    imageObserver.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px'
        });

        images.forEach(img => imageObserver.observe(img));
    }
}

// WebP support detection
function detectWebPSupport() {
    const webP = new Image();
    webP.onload = webP.onerror = function () {
        if (webP.height === 2) {
            document.documentElement.classList.add('webp');
        } else {
            document.documentElement.classList.add('no-webp');
        }
    };
    webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
}

// Image error handling
function initImageErrorHandling() {
    const images = document.querySelectorAll('img');

    images.forEach(img => {
        img.addEventListener('error', function() {
            // Replace broken image with placeholder
            this.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTgiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIiBmaWxsPSIjOTk5Ij5JbWFnZSBub3QgZm91bmQ8L3RleHQ+PC9zdmc+';
            this.alt = 'Image not available';
            this.classList.add('image-error');
        });
    });
}

// Responsive image srcset generation
function initResponsiveImages() {
    const highDPRImages = document.querySelectorAll('.doctor-photo img, .clinic-image img');

    highDPRImages.forEach(img => {
        const src = img.src;
        const baseName = src.replace(/\.[^/.]+$/, '');
        const extension = src.split('.').pop();

        // Generate srcset for different screen densities
        img.srcset = `
            ${baseName}.${extension} 1x,
            ${baseName}@2x.${extension} 2x,
            ${baseName}@3x.${extension} 3x
        `;
    });
}

// Keyboard navigation support
document.addEventListener('keydown', (e) => {
    // Close mobile menu with Escape key
    if (e.key === 'Escape') {
        const hamburger = document.getElementById('hamburger');
        const navMenu = document.getElementById('nav-menu');

        if (navMenu.classList.contains('active')) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
});

// Performance optimizations
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

// Optimize scroll events
const optimizedScrollHandler = debounce(() => {
    // Scroll-based animations and effects go here
}, 16); // ~60fps

window.addEventListener('scroll', optimizedScrollHandler);

// Preload critical resources
function preloadResources() {
    const criticalImages = [
        '/images/doctor-photo.jpg',
        '/images/clinic-interior.jpg'
    ];

    criticalImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
    });
}

// Initialize performance optimizations
document.addEventListener('DOMContentLoaded', () => {
    preloadResources();

    // Enable parallax only on desktop
    if (window.innerWidth > 768) {
        initParallaxEffect();
    }

    initLazyLoading();
});

// Service Worker registration (for PWA capabilities)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Google Analytics (placeholder - replace with actual tracking ID)
function initAnalytics() {
    // Google Analytics 4
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'GA_MEASUREMENT_ID');

    // Track form submissions
    const form = document.getElementById('appointmentForm');
    if (form) {
        form.addEventListener('submit', () => {
            gtag('event', 'form_submit', {
                form_name: 'appointment_request',
                page_title: document.title,
                page_location: window.location.href
            });
        });
    }

    // Track button clicks
    const ctaButtons = document.querySelectorAll('.btn-primary');
    ctaButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            gtag('event', 'click', {
                event_category: 'CTA',
                event_label: e.target.textContent.trim(),
                page_title: document.title
            });
        });
    });
}

// Initialize analytics after consent (implement cookie consent banner)
// initAnalytics();

// Print optimization
window.addEventListener('beforeprint', () => {
    document.body.classList.add('printing');
});

window.addEventListener('afterprint', () => {
    document.body.classList.remove('printing');
});

// Error handling
window.addEventListener('error', (e) => {
    console.error('Global error:', e.error);
    // You can send errors to your analytics or error tracking service
});

// Unhandled promise rejection handling
window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
    // You can send errors to your analytics or error tracking service
});

// Page visibility API for performance monitoring
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Page is hidden, pause animations or heavy processes
        console.log('Page hidden');
    } else {
        // Page is visible, resume animations
        console.log('Page visible');
    }
});
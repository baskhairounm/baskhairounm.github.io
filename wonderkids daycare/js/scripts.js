/**
 * Wonderkids Daycare - Main JavaScript
 * Interactive features and form validation
 */

// ============================
// MOBILE NAVIGATION TOGGLE
// ============================

document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle mobile menu
    if (navToggle) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking a nav link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            if (navToggle) {
                navToggle.classList.remove('active');
            }
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        const isClickInsideNav = navMenu.contains(event.target);
        const isClickOnToggle = navToggle && navToggle.contains(event.target);

        if (!isClickInsideNav && !isClickOnToggle && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            if (navToggle) {
                navToggle.classList.remove('active');
            }
        }
    });
});

// ============================
// STICKY HEADER ON SCROLL
// ============================

window.addEventListener('scroll', function() {
    const header = document.getElementById('header');
    if (header) {
        if (window.scrollY > 100) {
            header.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.08)';
        }
    }
});

// ============================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ============================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');

        // Only prevent default if it's not just "#"
        if (href !== '#' && href.length > 1) {
            e.preventDefault();
            const target = document.querySelector(href);

            if (target) {
                const headerHeight = document.getElementById('header').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        }
    });
});

// ============================
// FORM VALIDATION - WAITLIST FORM
// ============================

const waitlistForm = document.getElementById('waitlistForm');

if (waitlistForm) {
    waitlistForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Clear previous errors
        clearErrors();

        // Validate form
        let isValid = true;

        // Parent name
        const parentName = document.getElementById('parentName');
        if (!validateRequired(parentName)) {
            showError(parentName, 'Please enter your name');
            isValid = false;
        }

        // Email
        const email = document.getElementById('email');
        if (!validateEmail(email)) {
            showError(email, 'Please enter a valid email address');
            isValid = false;
        }

        // Phone
        const phone = document.getElementById('phone');
        if (!validateRequired(phone)) {
            showError(phone, 'Please enter your phone number');
            isValid = false;
        }

        // Child name
        const childName = document.getElementById('childName');
        if (!validateRequired(childName)) {
            showError(childName, 'Please enter your child\'s name');
            isValid = false;
        }

        // Child age/DOB
        const childAge = document.getElementById('childAge');
        if (!validateRequired(childAge)) {
            showError(childAge, 'Please enter your child\'s date of birth');
            isValid = false;
        }

        // Program
        const program = document.getElementById('program');
        if (!validateRequired(program)) {
            showError(program, 'Please select a program');
            isValid = false;
        }

        // Start date
        const startDate = document.getElementById('startDate');
        if (!validateRequired(startDate)) {
            showError(startDate, 'Please select a start date');
            isValid = false;
        }

        // Schedule
        const schedule = document.getElementById('schedule');
        if (!validateRequired(schedule)) {
            showError(schedule, 'Please select a schedule');
            isValid = false;
        }

        // Consent checkbox
        const consent = document.getElementById('consent');
        if (!consent.checked) {
            showError(consent, 'Please provide your consent to continue');
            isValid = false;
        }

        // If form is valid, show success message
        if (isValid) {
            // In a real application, you would send the form data to a server here
            // For now, we'll just show the success message

            waitlistForm.style.display = 'none';
            document.getElementById('successMessage').style.display = 'block';

            // Scroll to success message
            document.getElementById('successMessage').scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });

            // IMPORTANT: Add your form submission logic here
            // Example:
            // fetch('/api/waitlist', {
            //     method: 'POST',
            //     body: new FormData(waitlistForm)
            // }).then(response => { ... });
        } else {
            // Scroll to first error
            const firstError = document.querySelector('.form-group.error');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    });
}

// ============================
// FORM VALIDATION - CONTACT FORM
// ============================

const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Clear previous errors
        clearErrors();

        // Validate form
        let isValid = true;

        // Name
        const contactName = document.getElementById('contactName');
        if (!validateRequired(contactName)) {
            showError(contactName, 'Please enter your name');
            isValid = false;
        }

        // Email
        const contactEmail = document.getElementById('contactEmail');
        if (!validateEmail(contactEmail)) {
            showError(contactEmail, 'Please enter a valid email address');
            isValid = false;
        }

        // Subject
        const contactSubject = document.getElementById('contactSubject');
        if (!validateRequired(contactSubject)) {
            showError(contactSubject, 'Please select a subject');
            isValid = false;
        }

        // Message
        const contactMessage = document.getElementById('contactMessage');
        if (!validateRequired(contactMessage)) {
            showError(contactMessage, 'Please enter your message');
            isValid = false;
        }

        // If form is valid, show success message
        if (isValid) {
            // In a real application, you would send the form data to a server here

            contactForm.style.display = 'none';
            document.getElementById('contactSuccessMessage').style.display = 'block';

            // Scroll to success message
            document.getElementById('contactSuccessMessage').scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });

            // IMPORTANT: Add your form submission logic here
            // Example:
            // fetch('/api/contact', {
            //     method: 'POST',
            //     body: new FormData(contactForm)
            // }).then(response => { ... });
        } else {
            // Scroll to first error
            const firstError = document.querySelector('.form-group.error');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    });
}

// ============================
// VALIDATION HELPER FUNCTIONS
// ============================

function validateRequired(field) {
    const value = field.value.trim();
    return value !== '';
}

function validateEmail(field) {
    const value = field.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
}

function showError(field, message) {
    const formGroup = field.closest('.form-group');
    formGroup.classList.add('error');

    const errorMessage = formGroup.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.textContent = message;
    }

    field.classList.add('error');
}

function clearErrors() {
    // Remove error classes from all form groups
    document.querySelectorAll('.form-group.error').forEach(group => {
        group.classList.remove('error');
    });

    // Remove error classes from all inputs
    document.querySelectorAll('.form-input.error').forEach(input => {
        input.classList.remove('error');
    });
}

// Real-time validation - remove error when user starts typing
document.querySelectorAll('.form-input').forEach(input => {
    input.addEventListener('input', function() {
        const formGroup = this.closest('.form-group');
        if (formGroup.classList.contains('error')) {
            formGroup.classList.remove('error');
            this.classList.remove('error');
        }
    });

    // Also clear error on change (for select elements)
    input.addEventListener('change', function() {
        const formGroup = this.closest('.form-group');
        if (formGroup.classList.contains('error')) {
            formGroup.classList.remove('error');
            this.classList.remove('error');
        }
    });
});

// ============================
// INTERSECTION OBSERVER FOR ANIMATIONS
// ============================

// Fade in elements as they come into view
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', function() {
    // Add initial styles for animation
    const animatedElements = document.querySelectorAll(
        '.feature-card, .program-card, .testimonial-card, .team-card, .step-card, .curriculum-card, .faq-item'
    );

    animatedElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        el.style.transitionDelay = `${index * 0.1}s`;

        observer.observe(el);
    });
});

// ============================
// PHONE NUMBER FORMATTING
// ============================

const phoneInputs = document.querySelectorAll('input[type="tel"]');

phoneInputs.forEach(input => {
    input.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, ''); // Remove non-digits

        if (value.length > 0) {
            if (value.length <= 3) {
                value = `(${value}`;
            } else if (value.length <= 6) {
                value = `(${value.slice(0, 3)}) ${value.slice(3)}`;
            } else {
                value = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6, 10)}`;
            }
        }

        e.target.value = value;
    });
});

// ============================
// DATE INPUT MIN DATE (TODAY)
// ============================

document.addEventListener('DOMContentLoaded', function() {
    const today = new Date().toISOString().split('T')[0];
    const startDateInput = document.getElementById('startDate');

    if (startDateInput) {
        startDateInput.setAttribute('min', today);
    }
});

// ============================
// ACTIVE PAGE NAVIGATION HIGHLIGHT
// ============================

document.addEventListener('DOMContentLoaded', function() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage) {
            link.classList.add('active');
        }
    });
});

// ============================
// SCROLL TO TOP BUTTON (OPTIONAL)
// ============================

// Uncomment this section if you want to add a scroll-to-top button

/*
// Create scroll to top button
const scrollTopBtn = document.createElement('button');
scrollTopBtn.innerHTML = '↑';
scrollTopBtn.className = 'scroll-top-btn';
scrollTopBtn.setAttribute('aria-label', 'Scroll to top');
document.body.appendChild(scrollTopBtn);

// Add styles dynamically
const style = document.createElement('style');
style.textContent = `
    .scroll-top-btn {
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: linear-gradient(135deg, var(--primary), var(--primary-light));
        color: white;
        border: none;
        font-size: 24px;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 1000;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
    }

    .scroll-top-btn.visible {
        opacity: 1;
        visibility: visible;
    }

    .scroll-top-btn:hover {
        transform: translateY(-5px);
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
    }
`;
document.head.appendChild(style);

// Show/hide scroll to top button
window.addEventListener('scroll', function() {
    if (window.pageYOffset > 300) {
        scrollTopBtn.classList.add('visible');
    } else {
        scrollTopBtn.classList.remove('visible');
    }
});

// Scroll to top when clicked
scrollTopBtn.addEventListener('click', function() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});
*/

// ============================
// FORM FIELD ENHANCEMENTS
// ============================

// Auto-grow textarea as user types
const textareas = document.querySelectorAll('.form-textarea');

textareas.forEach(textarea => {
    textarea.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
    });
});

// ============================
// KEYBOARD ACCESSIBILITY
// ============================

// Trap focus in mobile menu when open
document.addEventListener('keydown', function(e) {
    const navMenu = document.getElementById('nav-menu');

    if (navMenu && navMenu.classList.contains('active')) {
        const focusableElements = navMenu.querySelectorAll(
            'a[href], button:not([disabled]), input:not([disabled])'
        );

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        // Tab key
        if (e.key === 'Tab') {
            if (e.shiftKey) {
                // Shift + Tab
                if (document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                }
            } else {
                // Tab
                if (document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
        }

        // Escape key - close menu
        if (e.key === 'Escape') {
            navMenu.classList.remove('active');
            const navToggle = document.getElementById('nav-toggle');
            if (navToggle) {
                navToggle.classList.remove('active');
                navToggle.focus();
            }
        }
    }
});

// ============================
// CONSOLE MESSAGE
// ============================

console.log('%cWonderkids Daycare - Milton, ON', 'font-size: 24px; font-weight: bold; color: #FF9A8B;');
console.log('%cWebsite built with ❤️ for families and early learners', 'font-size: 14px; color: #666;');
console.log('%cNeed to customize? Update colors in css/style.css (lines 7-20)', 'font-size: 12px; color: #999;');

// ============================
// EXPORT FOR TESTING (OPTIONAL)
// ============================

// Uncomment if you need to test functions in browser console
/*
window.wonderkids = {
    validateRequired,
    validateEmail,
    showError,
    clearErrors
};
*/

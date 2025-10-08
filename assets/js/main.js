// Madurai Catering - Main JavaScript File
class MaduraiCatering {
    constructor() {
        this.init();
    }

    init() {
        this.setupNavbar();
        this.setupScrollAnimations();
        this.setupFormValidation();
        this.setupLightbox();
        this.setupDatePicker();
        this.preventPastDates();
    }

    // Navbar scroll effects
    setupNavbar() {
        const navbar = document.getElementById('mainNavbar');
        let lastScrollY = window.scrollY;

        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;
            
            if (currentScrollY > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }

            // Hide navbar on scroll down, show on scroll up
            if (currentScrollY > lastScrollY && currentScrollY > 200) {
                navbar.style.transform = 'translateY(-100%)';
            } else {
                navbar.style.transform = 'translateY(0)';
            }

            lastScrollY = currentScrollY;
        });
    }

    // Scroll animations for elements
    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in-up');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe elements for animation
        const animateElements = document.querySelectorAll('.dish-card, .event-card, .testimonial-card');
        animateElements.forEach(el => observer.observe(el));
    }

    // Form validation setup
    setupFormValidation() {
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.validateForm(form);
            });
        });
    }

    validateForm(form) {
        const formData = new FormData(form);
        const errors = [];

        // Phone validation
        const phone = form.querySelector('input[type="tel"]');
        if (phone && phone.value) {
            const phoneRegex = /^[6-9]\d{9}$/;
            if (!phoneRegex.test(phone.value)) {
                errors.push('Please enter a valid 10-digit mobile number');
                phone.classList.add('is-invalid');
            } else {
                phone.classList.remove('is-invalid');
            }
        }

        // Email validation
        const email = form.querySelector('input[type="email"]');
        if (email && email.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email.value)) {
                errors.push('Please enter a valid email address');
                email.classList.add('is-invalid');
            } else {
                email.classList.remove('is-invalid');
            }
        }

        // Date validation (not in past)
        const dateInput = form.querySelector('input[type="date"]');
        if (dateInput && dateInput.value) {
            const selectedDate = new Date(dateInput.value);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            if (selectedDate < today) {
                errors.push('Event date cannot be in the past');
                dateInput.classList.add('is-invalid');
            } else {
                dateInput.classList.remove('is-invalid');
            }
        }

        if (errors.length > 0) {
            this.showErrors(errors);
            return false;
        }

        // If validation passes, proceed with form submission
        if (form.id === 'bookingForm') {
            this.submitBookingForm(form);
        } else if (form.classList.contains('newsletter-form')) {
            this.submitNewsletterForm(form);
        } else {
            this.submitContactForm(form);
        }

        return true;
    }

    showErrors(errors) {
        const errorMessage = errors.join('\n');
        alert(errorMessage); // In production, use a proper toast/modal system
    }

    // Date picker setup
    setupDatePicker() {
        const dateInputs = document.querySelectorAll('input[type="date"]');
        const today = new Date().toISOString().split('T')[0];
        
        dateInputs.forEach(input => {
            input.min = today;
        });
    }

    preventPastDates() {
        const dateInput = document.getElementById('eventDate');
        if (dateInput) {
            const today = new Date().toISOString().split('T')[0];
            dateInput.min = today;
            
            dateInput.addEventListener('change', function() {
                const selectedDate = new Date(this.value);
                const currentDate = new Date();
                currentDate.setHours(0, 0, 0, 0);
                
                if (selectedDate < currentDate) {
                    alert('Please select a future date for your event.');
                    this.value = '';
                }
            });
        }
    }

    // Gallery lightbox setup
    setupLightbox() {
        // Create lightbox HTML if it doesn't exist
        if (!document.getElementById('lightbox')) {
            const lightboxHTML = `
                <div id="lightbox" class="lightbox" onclick="closeLightbox()">
                    <div class="lightbox-content" onclick="event.stopPropagation()">
                        <span class="lightbox-close" onclick="closeLightbox()">&times;</span>
                        <button class="lightbox-nav lightbox-prev" onclick="changeLightboxMedia(-1)">&#10094;</button>
                        <button class="lightbox-nav lightbox-next" onclick="changeLightboxMedia(1)">&#10095;</button>
                        <img id="lightbox-img" style="display: none;" alt="Gallery image">
                        <video id="lightbox-video" style="display: none;" controls>
                            Your browser does not support the video tag.
                        </video>
                        <div class="lightbox-caption"></div>
                    </div>
                </div>
            `;
            document.body.insertAdjacentHTML('beforeend', lightboxHTML);
        }

        // Add click listeners to gallery items
        document.addEventListener('click', (e) => {
            const galleryItem = e.target.closest('.gallery-item');
            if (galleryItem) {
                e.preventDefault();
                this.openLightbox(galleryItem);
            }
        });

        // Keyboard navigation for lightbox
        document.addEventListener('keydown', (e) => {
            const lightbox = document.getElementById('lightbox');
            if (lightbox && lightbox.style.display === 'block') {
                switch(e.key) {
                    case 'Escape':
                        this.closeLightbox();
                        break;
                    case 'ArrowLeft':
                        this.changeLightboxMedia(-1);
                        break;
                    case 'ArrowRight':
                        this.changeLightboxMedia(1);
                        break;
                }
            }
        });
    }

    openLightbox(galleryItem) {
        const lightbox = document.getElementById('lightbox');
        const lightboxImg = document.getElementById('lightbox-img');
        const lightboxVideo = document.getElementById('lightbox-video');
        const img = galleryItem.querySelector('img');
        const video = galleryItem.querySelector('video');

        if (img) {
            lightboxImg.src = img.src;
            lightboxImg.alt = img.alt;
            lightboxImg.style.display = 'block';
            lightboxVideo.style.display = 'none';
        } else if (video) {
            lightboxVideo.src = video.src;
            lightboxVideo.style.display = 'block';
            lightboxImg.style.display = 'none';
        }

        lightbox.style.display = 'block';
        document.body.style.overflow = 'hidden';

        // Store current gallery items for navigation
        this.currentGalleryItems = Array.from(document.querySelectorAll('.gallery-item'));
        this.currentLightboxIndex = this.currentGalleryItems.indexOf(galleryItem);
    }

    closeLightbox() {
        const lightbox = document.getElementById('lightbox');
        const lightboxVideo = document.getElementById('lightbox-video');
        
        lightbox.style.display = 'none';
        lightboxVideo.pause();
        document.body.style.overflow = '';
    }

    changeLightboxMedia(direction) {
        this.currentLightboxIndex += direction;
        
        if (this.currentLightboxIndex < 0) {
            this.currentLightboxIndex = this.currentGalleryItems.length - 1;
        } else if (this.currentLightboxIndex >= this.currentGalleryItems.length) {
            this.currentLightboxIndex = 0;
        }

        this.openLightbox(this.currentGalleryItems[this.currentLightboxIndex]);
    }
}

// Booking Modal Functions
function openBookingModal(selectedDish = '') {
    const modal = new bootstrap.Modal(document.getElementById('bookingModal'));
    
    if (selectedDish) {
        const dishSelect = document.getElementById('selectedDishes');
        const option = dishSelect.querySelector(`option[value="${selectedDish}"]`);
        if (option) {
            option.selected = true;
        }
    }
    
    modal.show();
}

// Dish Modal Functions
function openDishModal(dishId) {
    const modal = new bootstrap.Modal(document.getElementById('dishModal'));
    const modalLabel = document.getElementById('dishModalLabel');
    const modalContent = document.getElementById('dishModalContent');
    
    // Dish details data
    const dishData = {
        'kari-dosa': {
            name: 'Kari Dosa',
            image: 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=800&h=600&fit=crop',
            description: 'The legendary Madurai street food - thin, crispy dosa generously filled with slow-cooked mutton curry. Our secret lies in the perfect balance of spices in the kari (curry) that has been simmered for hours to achieve the authentic taste.',
            ingredients: 'Rice batter, mutton, onions, tomatoes, curry leaves, mustard seeds, fennel seeds, coriander seeds, red chilies, turmeric, garam masala',
            allergens: 'Contains gluten (if made with wheat). May contain traces of nuts.',
            portionSize: '2 pieces per plate',
            servingSuggestion: 'Best served hot with coconut chutney and sambar',
            price: 'From ₹200 per plate'
        },
        'mutton-sukka': {
            name: 'Mutton Sukka',
            image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=800&h=600&fit=crop',
            description: 'Tender mutton pieces tossed in aromatic roasted coconut and authentic Chettinad spices. This dry preparation showcases the robust flavors of South Indian cuisine with every bite packed with rich, complex tastes.',
            ingredients: 'Mutton, coconut, dry red chilies, coriander seeds, fennel seeds, black pepper, cinnamon, cardamom, curry leaves, ginger-garlic paste',
            allergens: 'Contains coconut. May contain traces of nuts.',
            portionSize: '250g per plate',
            servingSuggestion: 'Perfect with rice, roti, or parotta',
            price: 'From ₹280 per plate'
        },
        'chicken-chettinad': {
            name: 'Chicken Chettinad',
            image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=800&h=600&fit=crop',
            description: 'Classic Chettinad chicken preparation featuring farm-fresh chicken cooked in traditional roasted spice paste. The signature black pepper and fennel combination creates an unforgettable flavor profile.',
            ingredients: 'Chicken, coconut, black pepper, fennel seeds, dry red chilies, coriander seeds, poppy seeds, curry leaves, onions, tomatoes',
            allergens: 'Contains coconut. May contain traces of nuts and sesame.',
            portionSize: '300g per plate',
            servingSuggestion: 'Traditionally served with steamed rice or appam',
            price: 'From ₹250 per plate'
        },
        'mutton-biryani': {
            name: 'Mutton Biryani (Seeraga Samba)',
            image: 'https://images.unsplash.com/photo-1563379091339-03246963d84a?w=800&h=600&fit=crop',
            description: 'Aromatic biryani made with premium seeraga samba rice and tender mutton pieces. Each grain is infused with saffron and traditional spices, creating layers of incredible flavor in every spoonful.',
            ingredients: 'Seeraga samba rice, mutton, yogurt, onions, saffron, cardamom, cinnamon, cloves, bay leaves, mint, coriander leaves, ghee',
            allergens: 'Contains dairy (yogurt, ghee). May contain nuts.',
            portionSize: '400g per plate',
            servingSuggestion: 'Served with boiled egg, raita, and pickle',
            price: 'From ₹320 per plate'
        },
        'vanjaram-fish': {
            name: 'Vanjaram Meen Varuval (Seer Fish Fry)',
            image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop',
            description: 'Fresh seer fish marinated in authentic Chettinad spices and shallow-fried to perfection. The crispy exterior gives way to tender, flaky fish that melts in your mouth.',
            ingredients: 'Seer fish, turmeric, red chili powder, coriander powder, ginger-garlic paste, curry leaves, mustard oil, lemon juice',
            allergens: 'Contains fish. Prepared in facility that processes other seafood.',
            portionSize: '200g per plate',
            servingSuggestion: 'Best enjoyed with steamed rice and rasam',
            price: 'From ₹350 per plate'
        },
        'parotta-salna': {
            name: 'Parotta with Salna',
            image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=600&fit=crop',
            description: 'Flaky, layered parotta paired with rich, spicy salna curry. The perfect combination of textures and flavors that represents the heart of Madurai street food culture.',
            ingredients: 'Wheat flour, oil, salt (parotta); mixed vegetables/meat, coconut milk, spices, curry leaves (salna)',
            allergens: 'Contains gluten. May contain dairy and nuts.',
            portionSize: '2 parottas with 200ml salna',
            servingSuggestion: 'Tear the parotta and dip in the flavorful salna',
            price: 'From ₹180 per plate'
        }
    };
    
    const dish = dishData[dishId];
    if (!dish) return;
    
    modalLabel.textContent = dish.name;
    modalContent.innerHTML = `
        <div class="row g-4">
            <div class="col-md-6">
                <img src="${dish.image}" alt="${dish.name}" class="img-fluid rounded-3 mb-3">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <span class="h4 text-brand-gold mb-0">${dish.price}</span>
                    <button class="btn bg-brand-green text-white px-4 py-2 font-semibold" onclick="openBookingModal('${dishId}'); bootstrap.Modal.getInstance(document.getElementById('dishModal')).hide();">
                        Book This Dish
                    </button>
                </div>
            </div>
            <div class="col-md-6">
                <h6 class="text-brand-maroon mb-2">Description</h6>
                <p class="mb-3">${dish.description}</p>
                
                <h6 class="text-brand-maroon mb-2">Ingredients</h6>
                <p class="mb-3 small">${dish.ingredients}</p>
                
                <h6 class="text-brand-maroon mb-2">Portion Size</h6>
                <p class="mb-3">${dish.portionSize}</p>
                
                <h6 class="text-brand-maroon mb-2">Serving Suggestion</h6>
                <p class="mb-3">${dish.servingSuggestion}</p>
                
                <h6 class="text-brand-maroon mb-2">Allergen Information</h6>
                <p class="mb-0 small text-muted">${dish.allergens}</p>
            </div>
        </div>
    `;
    
    modal.show();
}

// Form Submission Functions
async function submitBooking(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    
    // Collect selected dishes
    const selectedDishes = Array.from(document.getElementById('selectedDishes').selectedOptions)
                                .map(option => option.text);
    
    const bookingData = {
        name: formData.get('customerName') || document.getElementById('customerName').value,
        phone: formData.get('customerPhone') || document.getElementById('customerPhone').value,
        email: formData.get('customerEmail') || document.getElementById('customerEmail').value,
        eventType: formData.get('eventType') || document.getElementById('eventType').value,
        eventDate: formData.get('eventDate') || document.getElementById('eventDate').value,
        guestCount: formData.get('guestCount') || document.getElementById('guestCount').value,
        location: formData.get('eventLocation') || document.getElementById('eventLocation').value,
        dishes: selectedDishes,
        specialRequests: formData.get('specialRequests') || document.getElementById('specialRequests').value,
        timestamp: new Date().toISOString()
    };
    
    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Submitting...';
    submitBtn.disabled = true;
    
    try {
        // Attempt to send to API endpoint
        const response = await fetch('/api/book', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(bookingData)
        });
        
        if (response.ok) {
            showSuccessToast('Booking request submitted successfully! We will contact you soon.');
            form.reset();
            bootstrap.Modal.getInstance(document.getElementById('bookingModal')).hide();
        } else {
            throw new Error('API request failed');
        }
    } catch (error) {
        // Fallback to email if API fails
        console.log('API not available, using email fallback');
        
        const subject = `Catering Booking Request - ${bookingData.eventType}`;
        const body = `
Name: ${bookingData.name}
Phone: ${bookingData.phone}
Email: ${bookingData.email}
Event Type: ${bookingData.eventType}
Event Date: ${bookingData.eventDate}
Guest Count: ${bookingData.guestCount}
Location: ${bookingData.location}
Selected Dishes: ${bookingData.dishes.join(', ')}
Special Requests: ${bookingData.specialRequests}
        `.trim();
        
        const mailtoLink = `mailto:info@maduraicatering.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        
        // Store booking data locally for admin reference
        localStorage.setItem('lastBooking', JSON.stringify(bookingData));
        
        window.location.href = mailtoLink;
        showSuccessToast('Opening email client... If it doesn\'t work, please call us at +91 98765 43210');
        
        setTimeout(() => {
            form.reset();
            bootstrap.Modal.getInstance(document.getElementById('bookingModal')).hide();
        }, 2000);
    } finally {
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
}

function subscribeNewsletter(event) {
    event.preventDefault();
    
    const form = event.target;
    const email = form.querySelector('input[type="email"]').value;
    
    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Please enter a valid email address');
        return;
    }
    
    // In production, this would send to your newsletter API
    console.log('Newsletter subscription:', email);
    
    showSuccessToast('Successfully subscribed to newsletter!');
    form.reset();
}

// Toast Functions
function showSuccessToast(message) {
    const toast = document.getElementById('successToast');
    const messageElement = document.getElementById('toastMessage');
    
    messageElement.textContent = message;
    
    const bsToast = new bootstrap.Toast(toast);
    bsToast.show();
}

// Global lightbox functions (for backwards compatibility)
function closeLightbox() {
    const catering = window.maduraiCatering;
    if (catering) {
        catering.closeLightbox();
    }
}

function changeLightboxMedia(direction) {
    const catering = window.maduraiCatering;
    if (catering) {
        catering.changeLightboxMedia(direction);
    }
}

// Utility Functions
function smoothScrollTo(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Print functionality for booking summaries
function printBookingDetails() {
    const lastBooking = localStorage.getItem('lastBooking');
    if (!lastBooking) {
        alert('No booking details found');
        return;
    }
    
    const booking = JSON.parse(lastBooking);
    const printWindow = window.open('', '_blank');
    
    printWindow.document.write(`
        <html>
        <head>
            <title>Booking Summary - Madurai Catering</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 40px; }
                .header { text-align: center; margin-bottom: 30px; }
                .booking-details { line-height: 1.8; }
                .label { font-weight: bold; }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>Madurai Catering</h1>
                <h2>Booking Summary</h2>
            </div>
            <div class="booking-details">
                <p><span class="label">Name:</span> ${booking.name}</p>
                <p><span class="label">Phone:</span> ${booking.phone}</p>
                <p><span class="label">Email:</span> ${booking.email}</p>
                <p><span class="label">Event Type:</span> ${booking.eventType}</p>
                <p><span class="label">Event Date:</span> ${booking.eventDate}</p>
                <p><span class="label">Guest Count:</span> ${booking.guestCount}</p>
                <p><span class="label">Location:</span> ${booking.location}</p>
                <p><span class="label">Selected Dishes:</span> ${booking.dishes.join(', ')}</p>
                <p><span class="label">Special Requests:</span> ${booking.specialRequests}</p>
                <p><span class="label">Booking Date:</span> ${new Date(booking.timestamp).toLocaleString()}</p>
            </div>
        </body>
        </html>
    `);
    
    printWindow.document.close();
    printWindow.print();
}

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.maduraiCatering = new MaduraiCatering();
    
    // Set minimum date for date inputs
    const today = new Date().toISOString().split('T')[0];
    document.querySelectorAll('input[type="date"]').forEach(input => {
        input.min = today;
    });
    
    // Initialize Bootstrap tooltips if needed
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
});

// Service Worker Registration (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful');
            }, function(err) {
                console.log('ServiceWorker registration failed');
            });
    });
}

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MaduraiCatering;
}
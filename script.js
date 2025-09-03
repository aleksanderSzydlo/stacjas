// Nawigacja mobilna
document.addEventListener('DOMContentLoaded', function() {
    // Rejestracja Service Worker
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', function() {
            navigator.serviceWorker.register('/sw.js')
                .then(function(registration) {
                    console.log('ServiceWorker registration successful:', registration.scope);
                })
                .catch(function(err) {
                    console.log('ServiceWorker registration failed:', err);
                });
        });
    }

    // Inicjalizacja AOS
    AOS.init({
        duration: 800,
        once: true,
        offset: 100
    });

    // Wymuszenie odtwarzania wideo
    const heroVideo = document.querySelector('.hero-video');
    const aboutVideo = document.querySelector('.about-video');
    
    if (heroVideo) {
        heroVideo.play().catch(function(error) {
            console.log('Autoplay was prevented:', error);
        });
    }
    
    if (aboutVideo) {
        aboutVideo.play().catch(function(error) {
            console.log('Autoplay was prevented:', error);
        });
    }

    // Loader
    const loader = document.getElementById('loader');
    setTimeout(() => {
        loader.classList.add('hidden');
    }, 1500);

    // Scroll to top button
    const scrollButton = document.getElementById('scrollToTop');
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollButton.classList.add('visible');
        } else {
            scrollButton.classList.remove('visible');
        }
    });

    scrollButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Animacja liczników
    const animateCounters = () => {
        const counters = document.querySelectorAll('[data-count]');
        
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-count'));
            const duration = 3000; // 3 sekundy - dłuższa animacja
            const step = target / (duration / 16); // 60fps
            let current = 0;
            
            const updateCounter = () => {
                current += step;
                if (current < target) {
                    const value = Math.floor(current);
                    if (target >= 100000) {
                        counter.textContent = value.toLocaleString('pl-PL') + '+';
                    } else if (target >= 1000) {
                        counter.textContent = value + '+';
                    } else {
                        counter.textContent = value;
                    }
                    requestAnimationFrame(updateCounter);
                } else {
                    if (target >= 100000) {
                        counter.textContent = target.toLocaleString('pl-PL') + '+';
                    } else if (target >= 1000) {
                        counter.textContent = target + '+';
                    } else {
                        counter.textContent = target;
                    }
                }
            };
            
            // Uruchom animację gdy element jest widoczny
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        updateCounter();
                        observer.unobserve(entry.target);
                    }
                });
            });
            
            observer.observe(counter);
        });
    };

    animateCounters();

    // Hamburgr menu
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    hamburger.addEventListener('click', function() {
        const isActive = navMenu.classList.contains('active');
        
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
        
        // Ustaw aria-expanded dla dostępności
        hamburger.setAttribute('aria-expanded', !isActive);
        
        // Focusuj pierwszy link po otwarciu menu
        if (!isActive) {
            const firstLink = navMenu.querySelector('a');
            if (firstLink) {
                setTimeout(() => firstLink.focus(), 100);
            }
        }
    });

    // Obsługa ESC dla zamknięcia menu
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
            hamburger.focus();
        }
    });

    // Zamknij menu po kliknięciu w link
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
        });
    });

    // Filtrowanie lokalizacji
    const filterButtons = document.querySelectorAll('.filter-btn');
    const locationCards = document.querySelectorAll('.location-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Usuń aktywną klasę z wszystkich przycisków
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Dodaj aktywną klasę do klikniętego przycisku
            button.classList.add('active');

            const filter = button.getAttribute('data-filter');

            locationCards.forEach(card => {
                if (filter === 'all') {
                    card.classList.remove('hidden');
                } else {
                    const categories = card.getAttribute('data-category');
                    if (categories && categories.includes(filter)) {
                        card.classList.remove('hidden');
                    } else {
                        card.classList.add('hidden');
                    }
                }
            });
        });
    });
});

// Płynne przewijanie
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// FAQ accordion
document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', function() {
        const faqItem = this.parentElement;
        const isActive = faqItem.classList.contains('active');
        
        // Zamknij wszystkie inne FAQ
        document.querySelectorAll('.faq-item').forEach(item => {
            item.classList.remove('active');
        });
        
        // Otwórz kliknięte FAQ jeśli nie było aktywne
        if (!isActive) {
            faqItem.classList.add('active');
        }
    });
});

// Mapa Leaflet
function initMap() {
    // Współrzędne centrum mapy (między wszystkimi stacjami)
    const map = L.map('map').setView([50.32, 19.12], 11);

    // Dodaj kafelki mapy
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Dane stacji z dokładnymi współrzędnymi
    const stations = [
        {
            name: 'Stacja S - Dąbrowa Górnicza',
            address: 'ul. Porozumienia Dąbrowskiego 1980 2B, Dąbrowa Górnicza',
            coords: [50.31692947366358, 19.203630915278197], // Dokładne współrzędne
            features: ['☕ Kawa', '🌭 Hotdogi', '⛽ Wszystkie paliwa', '🔥 Butle gazowe'],
            hours: '24/7',
            googleMaps: 'https://maps.app.goo.gl/wxtDZscz4fHRNeLo9',
            rating: 4.2,
            reviews: 87
        },
        {
            name: 'Stacja S - Sosnowiec Orląt Lwowskich',
            address: 'ul. Orląt Lwowskich 46, Sosnowiec',
            coords: [50.28529134844678, 19.149529982398295], // Dokładne współrzędne
            features: ['☕ Kawa', '🌭 Hotdogi', '⛽ Wszystkie paliwa', '🔥 Butle gazowe'],
            hours: '6:00 - 22:00',
            googleMaps: 'https://maps.app.goo.gl/nAjbCEeqTMsLXbF68',
            rating: 4.1,
            reviews: 124
        },
        {
            name: 'Stacja S - Sosnowiec Narutowicza',
            address: 'ul. Narutowicza 55, Sosnowiec',
            coords: [50.23916009552177, 19.154755899847597], // Dokładne współrzędne
            features: ['☕ Kawa', '⛽ Wszystkie paliwa', '🔥 Butle gazowe'],
            hours: '6:00 - 22:00',
            googleMaps: 'https://maps.app.goo.gl/TUrNenBvsXCo3QwR7',
            rating: 4.3,
            reviews: 96
        }
    ];

    // Dodaj markery dla każdej stacji
    stations.forEach(station => {
        const marker = L.marker(station.coords).addTo(map);
        
        const popupContent = `
            <div style="font-family: 'Inter', sans-serif; max-width: 280px;">
                <h3 style="margin: 0 0 10px 0; color: #1e293b; font-size: 1.1rem;">${station.name}</h3>
                <p style="margin: 0 0 10px 0; color: #64748b; font-size: 0.9rem;">${station.address}</p>
                <div style="margin-bottom: 10px; display: flex; align-items: center; gap: 10px;">
                    <div style="display: flex; align-items: center; gap: 3px;">
                        <span style="color: #fbbf24;">⭐</span>
                        <span style="font-weight: 600; color: #1e293b;">${station.rating}</span>
                        <span style="color: #64748b; font-size: 0.8rem;">(${station.reviews} opinii)</span>
                    </div>
                </div>
                <div style="margin-bottom: 10px;">
                    ${station.features.map(feature => 
                        `<span style="background: #dc2626; color: white; padding: 3px 8px; border-radius: 12px; font-size: 0.8rem; margin-right: 5px; margin-bottom: 5px; display: inline-block;">${feature}</span>`
                    ).join('')}
                </div>
                <p style="margin: 0 0 10px 0; color: #dc2626; font-weight: 600; font-size: 0.9rem;">Godziny: ${station.hours}</p>
                <div style="display: flex; gap: 5px;">
                    <a href="${station.googleMaps}" target="_blank" style="background: #dc2626; color: white; padding: 5px 10px; border-radius: 15px; text-decoration: none; font-size: 0.8rem; font-weight: 500;">📍 Google Maps</a>
                </div>
            </div>
        `;
        
        marker.bindPopup(popupContent);
    });

    // Dostosuj widok mapy do wszystkich markerów
    const group = new L.featureGroup(stations.map(station => L.marker(station.coords)));
    map.fitBounds(group.getBounds().pad(0.1));
}

// Inicjalizuj mapę po załadowaniu strony
document.addEventListener('DOMContentLoaded', function() {
    // Sprawdź czy element mapy istnieje
    if (document.getElementById('map')) {
        initMap();
    }
});

// Toast Notifications
function showToast(type, title, message) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icon = type === 'success' ? '✅' : '❌';
    
    // Bezpieczne tworzenie elementów zamiast innerHTML
    const iconDiv = document.createElement('div');
    iconDiv.className = 'toast-icon';
    iconDiv.textContent = icon;
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'toast-content';
    
    const titleDiv = document.createElement('div');
    titleDiv.className = 'toast-title';
    titleDiv.textContent = title;
    
    const messageDiv = document.createElement('div');
    messageDiv.className = 'toast-message';
    messageDiv.textContent = message;
    
    contentDiv.appendChild(titleDiv);
    contentDiv.appendChild(messageDiv);
    toast.appendChild(iconDiv);
    toast.appendChild(contentDiv);
    
    container.appendChild(toast);
    
    // Pokaż toast
    setTimeout(() => {
        toast.classList.add('show');
    }, 100);
    
    // Usuń toast po 4 sekundach
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            if (container.contains(toast)) {
                container.removeChild(toast);
            }
        }, 300);
    }, 4000);
}

// Formularz kontaktowy z EmailJS
document.addEventListener('DOMContentLoaded', function() {
    // Inicjalizacja EmailJS z publicznym kluczem
    emailjs.init("3qSdcdYGB_F2FxHQv"); // Publiczny klucz EmailJS
    
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Sprawdź czy EmailJS jest dostępne
            if (typeof emailjs === 'undefined') {
                showToast('error', 'Błąd systemu', 'System wysyłania emaili nie jest dostępny. Spróbuj ponownie za chwilę.');
                return;
            }
            
            // Pobierz dane z formularza
            const name = this.querySelector('input[name="name"]').value.trim();
            const email = this.querySelector('input[name="email"]').value.trim();
            const phone = this.querySelector('input[name="phone"]').value.trim();
            const service = this.querySelector('select[name="service"]').value;
            const message = this.querySelector('textarea[name="message"]').value.trim();
            
            // Prosta walidacja
            if (!name || !email || !service || !message) {
                showToast('error', 'Błąd walidacji', 'Proszę wypełnić wszystkie wymagane pola.');
                return;
            }
            
            // Walidacja długości pól
            if (name.length < 2) {
                showToast('error', 'Błąd walidacji', 'Imię musi mieć co najmniej 2 znaki.');
                return;
            }
            
            if (message.length < 10) {
                showToast('error', 'Błąd walidacji', 'Wiadomość musi mieć co najmniej 10 znaków.');
                return;
            }
            
            // Walidacja email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showToast('error', 'Nieprawidłowy email', 'Proszę podać prawidłowy adres email.');
                return;
            }
            
            // Walidacja telefonu (jeśli podany)
            if (phone && phone.length > 0) {
                const phoneRegex = /^[+]?[0-9\s\-()]{9,15}$/;
                if (!phoneRegex.test(phone)) {
                    showToast('error', 'Nieprawidłowy telefon', 'Proszę podać prawidłowy numer telefonu.');
                    return;
                }
            }
            
            // Pokaż komunikat ładowania
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Wysyłanie...';
            submitBtn.disabled = true;
            
            // Parametry dla EmailJS
            const templateParams = {
                from_name: name,
                from_email: email,
                phone: phone || 'Nie podano',
                service: service,
                message: message,
                subject: `Wiadomość ze strony`,
                reply_to: email,
                web: 'Stacja S'
            };
            
            // Wyślij email przez EmailJS
            emailjs.send('service_wvhublc', 'template_ypn9c6y', templateParams)
                .then(function(response) {
                    showToast('success', 'Wiadomość wysłana!', 'Dziękujemy za kontakt. Odpowiemy najszybciej jak to możliwe.');
                    contactForm.reset();
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                }, function(error) {
                    console.error('EmailJS error:', error);
                    showToast('error', 'Błąd wysyłania', 'Wystąpił problem podczas wysyłania wiadomości. Spróbuj ponownie lub skontaktuj się telefonicznie.');
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                });
        });
    }
});

// Animacje przy przewijaniu
function animateOnScroll() {
    const elements = document.querySelectorAll('.service-card, .location-card, .faq-item, .review-slide');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
}

// Ustaw początkowy stan animowanych elementów
document.addEventListener('DOMContentLoaded', function() {
    const elements = document.querySelectorAll('.service-card, .location-card, .faq-item, .review-slide');
    elements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
    
    // Uruchom animacje dla elementów już widocznych
    animateOnScroll();
});

window.addEventListener('scroll', animateOnScroll);

// Navbar przezroczystość przy przewijaniu
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.backdropFilter = 'blur(10px)';
    } else {
        header.style.background = 'var(--background-white)';
        header.style.backdropFilter = 'none';
    }
});

// NOWY MECHANIZM LIGHTBOX GALERII
class GalleryLightbox {
    constructor() {
        this.lightbox = null;
        this.lightboxImg = null;
        this.lightboxCaption = null;
        this.currentImageIndex = 0;
        this.images = [];
        this.isOpen = false;
        
        this.init();
    }
    
    init() {
        // Tworzenie struktury lightbox
        this.createLightboxHTML();
        
        // Pobranie wszystkich zdjęć galerii
        this.images = Array.from(document.querySelectorAll('.gallery-item img'));
        
        // Dodanie event listenerów do zdjęć
        this.bindEvents();
        
        console.log(`Gallery Lightbox initialized with ${this.images.length} images`);
    }
    
    createLightboxHTML() {
        // Usuń istniejący lightbox jeśli istnieje
        const existingLightbox = document.getElementById('lightbox');
        if (existingLightbox) {
            existingLightbox.remove();
        }
        
        // Tworzenie nowego lightbox
        const lightboxHTML = `
            <div id="lightbox" class="lightbox">
                <div class="lightbox-content-wrapper">
                    <button class="lightbox-close" aria-label="Zamknij galerię">&times;</button>
                    <button class="lightbox-prev" aria-label="Poprzednie zdjęcie">‹</button>
                    <button class="lightbox-next" aria-label="Następne zdjęcie">›</button>
                    <img class="lightbox-image" id="lightbox-img" alt="">
                    <div class="lightbox-caption" id="lightbox-caption"></div>
                    <div class="lightbox-counter" id="lightbox-counter"></div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', lightboxHTML);
        
        // Pobranie referencji do elementów
        this.lightbox = document.getElementById('lightbox');
        this.lightboxImg = document.getElementById('lightbox-img');
        this.lightboxCaption = document.getElementById('lightbox-caption');
        this.lightboxCounter = document.getElementById('lightbox-counter');
    }
    
    bindEvents() {
        // Event listenery dla zdjęć galerii
        this.images.forEach((img, index) => {
            img.addEventListener('click', (e) => {
                e.preventDefault();
                this.open(index);
            });
            
            // Dodaj cursor pointer
            img.style.cursor = 'pointer';
            
            // Dodaj hover effect
            img.addEventListener('mouseenter', function() {
                this.style.transform = 'scale(1.05)';
                this.style.transition = 'transform 0.3s ease';
            });
            
            img.addEventListener('mouseleave', function() {
                this.style.transform = 'scale(1)';
            });
        });
        
        // Event listenery dla lightbox
        if (this.lightbox) {
            // Zamknięcie przez kliknięcie tła
            this.lightbox.addEventListener('click', (e) => {
                if (e.target === this.lightbox) {
                    this.close();
                }
            });
            
            // Przycisk zamknij
            const closeBtn = this.lightbox.querySelector('.lightbox-close');
            closeBtn.addEventListener('click', () => this.close());
            
            // Przyciski nawigacji
            const prevBtn = this.lightbox.querySelector('.lightbox-prev');
            const nextBtn = this.lightbox.querySelector('.lightbox-next');
            
            prevBtn.addEventListener('click', () => this.prev());
            nextBtn.addEventListener('click', () => this.next());
        }
        
        // Klawisze klawiatury
        document.addEventListener('keydown', (e) => {
            if (!this.isOpen) return;
            
            switch(e.key) {
                case 'Escape':
                    this.close();
                    break;
                case 'ArrowLeft':
                    this.prev();
                    break;
                case 'ArrowRight':
                    this.next();
                    break;
            }
        });
        
        // Zapobieganie scroll podczas świpowania na mobile
        let touchStartY = 0;
        this.lightbox.addEventListener('touchstart', (e) => {
            touchStartY = e.touches[0].clientY;
        });
        
        this.lightbox.addEventListener('touchmove', (e) => {
            const touchY = e.touches[0].clientY;
            const touchDiff = touchStartY - touchY;
            
            // Zapobiegaj scrollowaniu jeśli ruch jest pionowy
            if (Math.abs(touchDiff) > 5) {
                e.preventDefault();
            }
        }, { passive: false });
    }
    
    open(imageIndex = 0) {
        this.currentImageIndex = imageIndex;
        this.isOpen = true;
        
        this.updateImage();
        
        // Zablokuj scroll strony
        document.body.style.overflow = 'hidden';
        document.body.style.paddingRight = this.getScrollbarWidth() + 'px';
        
        // Pokaż lightbox z animacją
        this.lightbox.style.display = 'flex';
        this.lightbox.style.opacity = '0';
        
        // Force reflow
        this.lightbox.offsetHeight;
        
        this.lightbox.style.opacity = '1';
        this.lightboxImg.style.transform = 'scale(0.8)';
        
        setTimeout(() => {
            this.lightboxImg.style.transform = 'scale(1)';
        }, 50);
    }
    
    close() {
        if (!this.isOpen) return;
        
        this.isOpen = false;
        
        // Animacja zamknięcia
        this.lightbox.style.opacity = '0';
        this.lightboxImg.style.transform = 'scale(0.8)';
        
        setTimeout(() => {
            this.lightbox.style.display = 'none';
            
            // Przywróć scroll strony
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';
        }, 300);
    }
    
    prev() {
        if (this.images.length <= 1) return;
        
        this.currentImageIndex = this.currentImageIndex > 0 
            ? this.currentImageIndex - 1 
            : this.images.length - 1;
            
        this.updateImage();
    }
    
    next() {
        if (this.images.length <= 1) return;
        
        this.currentImageIndex = this.currentImageIndex < this.images.length - 1 
            ? this.currentImageIndex + 1 
            : 0;
            
        this.updateImage();
    }
    
    updateImage() {
        if (!this.images[this.currentImageIndex]) return;
        
        const currentImg = this.images[this.currentImageIndex];
        
        // Animacja wymiany zdjęcia
        this.lightboxImg.style.opacity = '0';
        this.lightboxImg.style.transform = 'scale(0.9)';
        
        setTimeout(() => {
            this.lightboxImg.src = currentImg.src;
            this.lightboxImg.alt = currentImg.alt;
            this.lightboxCaption.textContent = currentImg.alt;
            this.lightboxCounter.textContent = `${this.currentImageIndex + 1} / ${this.images.length}`;
            
            this.lightboxImg.style.opacity = '1';
            this.lightboxImg.style.transform = 'scale(1)';
        }, 150);
        
        // Ukryj/pokaż przyciski nawigacji
        const prevBtn = this.lightbox.querySelector('.lightbox-prev');
        const nextBtn = this.lightbox.querySelector('.lightbox-next');
        
        if (this.images.length <= 1) {
            prevBtn.style.display = 'none';
            nextBtn.style.display = 'none';
        } else {
            prevBtn.style.display = 'block';
            nextBtn.style.display = 'block';
        }
    }
    
    getScrollbarWidth() {
        // Oblicz szerokość scrollbara
        const scrollDiv = document.createElement('div');
        scrollDiv.style.width = '100px';
        scrollDiv.style.height = '100px';
        scrollDiv.style.overflow = 'scroll';
        scrollDiv.style.position = 'absolute';
        scrollDiv.style.top = '-9999px';
        document.body.appendChild(scrollDiv);
        
        const scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
        document.body.removeChild(scrollDiv);
        
        return scrollbarWidth;
    }
}

// Inicjalizacja nowego lightbox
document.addEventListener('DOMContentLoaded', function() {
    const galleryLightbox = new GalleryLightbox();
});

// Dodaj transition do lightbox
document.addEventListener('DOMContentLoaded', function() {
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
        lightbox.style.transition = 'opacity 0.3s ease';
    }
});

// Reviews Horizontal Slider
document.addEventListener('DOMContentLoaded', function() {
    const slider = document.querySelector('.reviews-slider');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    if (!slider || !prevBtn || !nextBtn) return;
    
    const cardWidth = 280 + 30; // updated card width + gap
    let currentIndex = 0;
    
    function updateSlider() {
        const scrollLeft = currentIndex * cardWidth;
        slider.scrollTo({
            left: scrollLeft,
            behavior: 'smooth'
        });
    }
    
    prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateSlider();
        } else {
            // Go to last slide
            currentIndex = slider.children.length - Math.floor(slider.offsetWidth / cardWidth);
            updateSlider();
        }
    });
    
    nextBtn.addEventListener('click', () => {
        const maxIndex = Math.max(0, slider.children.length - Math.floor(slider.offsetWidth / cardWidth));
        if (currentIndex < maxIndex) {
            currentIndex++;
            updateSlider();
        } else {
            // Go back to first slide
            currentIndex = 0;
            updateSlider();
        }
    });
    
    // Touch/swipe support
    let startX = 0;
    let scrollStart = 0;
    
    slider.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        scrollStart = slider.scrollLeft;
    });
    
    slider.addEventListener('touchmove', (e) => {
        if (!startX) return;
        
        const currentX = e.touches[0].clientX;
        const diff = startX - currentX;
        slider.scrollLeft = scrollStart + diff;
    });
    
    slider.addEventListener('touchend', () => {
        startX = 0;
        scrollStart = 0;
        
        // Snap to closest card
        const scrollPosition = slider.scrollLeft;
        currentIndex = Math.round(scrollPosition / cardWidth);
        updateSlider();
    });
    
    // Auto-scroll every 5 seconds
    setInterval(() => {
        const maxIndex = Math.max(0, slider.children.length - Math.floor(slider.offsetWidth / cardWidth));
        currentIndex = currentIndex >= maxIndex ? 0 : currentIndex + 1;
        updateSlider();
    }, 5000);
    
    // Handle expand/collapse functionality
    const expandBtns = document.querySelectorAll('.expand-btn');
    
    expandBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const reviewText = this.parentElement;
            const isCollapsed = reviewText.classList.contains('collapsed');
            
            if (isCollapsed) {
                reviewText.classList.remove('collapsed');
                reviewText.classList.add('expanded');
                this.textContent = '... mniej';
            } else {
                reviewText.classList.remove('expanded');
                reviewText.classList.add('collapsed');
                this.textContent = '... więcej';
            }
        });
    });
});

// Navigation highlighting podczas scroll
document.addEventListener('DOMContentLoaded', function() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Usuń active z wszystkich linków
                navLinks.forEach(link => link.classList.remove('active'));
                
                // Dodaj active do odpowiedniego linka
                const activeLink = document.querySelector(`.nav-menu a[href="#${entry.target.id}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }, {
        rootMargin: '-60px 0px -60% 0px',
        threshold: 0.2
    });

    sections.forEach(section => {
        observer.observe(section);
    });
});

// Nawigacja mobilna
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    hamburger.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    // Zamknij menu po kliknięciu w link
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
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
            googleMaps: 'https://maps.google.com/maps?q=50.31692947366358,19.203630915278197',
            rating: 4.2,
            reviews: 87
        },
        {
            name: 'Stacja S - Sosnowiec Orląt Lwowskich',
            address: 'ul. Orląt Lwowskich 46, Sosnowiec',
            coords: [50.28529134844678, 19.149529982398295], // Dokładne współrzędne
            features: ['☕ Kawa', '🌭 Hotdogi', '⛽ Wszystkie paliwa', '🔥 Butle gazowe'],
            hours: '6:00 - 22:00',
            googleMaps: 'https://maps.google.com/maps?q=50.28529134844678,19.149529982398295',
            rating: 4.1,
            reviews: 124
        },
        {
            name: 'Stacja S - Sosnowiec Narutowicza',
            address: 'ul. Narutowicza 55, Sosnowiec',
            coords: [50.23916009552177, 19.154755899847597], // Dokładne współrzędne
            features: ['☕ Kawa', '⛽ Wszystkie paliwa', '🔥 Butle gazowe'],
            hours: '6:00 - 22:00',
            googleMaps: 'https://maps.google.com/maps?q=50.23916009552177,19.154755899847597',
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

// Formularz kontaktowy
document.querySelector('.contact-form form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Pobierz dane z formularza
    const formData = new FormData(this);
    const name = this.querySelector('input[type="text"]').value;
    const email = this.querySelector('input[type="email"]').value;
    const message = this.querySelector('textarea').value;
    
    // Prosta walidacja
    if (!name || !email || !message) {
        alert('Proszę wypełnić wszystkie pola.');
        return;
    }
    
    // Symulacja wysyłania (w rzeczywistej aplikacji wysłałbyś dane na serwer)
    alert('Dziękujemy za wiadomość! Skontaktujemy się z Tobą wkrótce.');
    this.reset();
});

// Animacje przy przewijaniu
function animateOnScroll() {
    const elements = document.querySelectorAll('.service-card, .location-card, .faq-item, .review-card');
    
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
    const elements = document.querySelectorAll('.service-card, .location-card, .faq-item, .review-card');
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

document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.querySelector('#mobile-menu');
    const navLinks = document.querySelector('#nav-links');
    const body = document.body;

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            const isActive = menuToggle.classList.toggle('is-active');
            navLinks.classList.toggle('active');
            body.classList.toggle('menu-open');
            menuToggle.setAttribute('aria-expanded', isActive ? 'true' : 'false');
            menuToggle.setAttribute('aria-label', isActive ? 'Lukk navigasjonsmeny' : 'Åpne navigasjonsmeny');
        });

        // Lukk menyen når man trykker på en link
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('is-active');
                navLinks.classList.remove('active');
                body.classList.remove('menu-open');
                menuToggle.setAttribute('aria-expanded', 'false');
                menuToggle.setAttribute('aria-label', 'Åpne navigasjonsmeny');
            });
        });
    }

    // --- TEAM CAROUSEL ---
    const carousel = document.querySelector('.team-carousel');
    if (carousel) {
        const track = carousel.querySelector('.team-carousel-track');
        const cards = Array.from(track.querySelectorAll('.team-card'));
        const prevButton = document.querySelector('.carousel-prev');
        const nextButton = document.querySelector('.carousel-next');
        const dotsContainer = document.querySelector('.carousel-dots');
        
        let currentIndex = 0;
        let cardsPerView = 3;
        let autoplayInterval;
        let isDragging = false;
        let startX = 0;
        let currentTranslate = 0;
        let prevTranslate = 0;

        // Responsive cards per view
        function updateCardsPerView() {
            if (window.innerWidth <= 600) {
                cardsPerView = 1;
            } else if (window.innerWidth <= 1024) {
                cardsPerView = 2;
            } else {
                cardsPerView = 3;
            }
        }

        // Create dots
        function createDots() {
            dotsContainer.innerHTML = '';
            const totalDots = Math.ceil(cards.length / cardsPerView);
            
            for (let i = 0; i < totalDots; i++) {
                const dot = document.createElement('button');
                dot.classList.add('carousel-dot');
                dot.setAttribute('aria-label', `Gå til slide ${i + 1}`);
                if (i === 0) dot.classList.add('active');
                
                dot.addEventListener('click', () => {
                    goToSlide(i);
                    resetAutoplay();
                });
                
                dotsContainer.appendChild(dot);
            }
        }

        // Update dots
        function updateDots() {
            const dots = dotsContainer.querySelectorAll('.carousel-dot');
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });
        }

        // Move to slide
        function goToSlide(index) {
            const maxIndex = Math.ceil(cards.length / cardsPerView) - 1;
            currentIndex = Math.max(0, Math.min(index, maxIndex));
            
            const cardWidth = cards[0].offsetWidth;
            const gap = 35;
            // Move one card at a time to show all team members
            const offset = -(currentIndex * (cardWidth + gap));
            
            track.style.transform = `translateX(${offset}px)`;
            prevTranslate = offset;
            updateDots();
        }

        // Next slide
        function nextSlide() {
            const maxIndex = Math.ceil(cards.length / cardsPerView) - 1;
            if (currentIndex < maxIndex) {
                goToSlide(currentIndex + 1);
            } else {
                goToSlide(0);
            }
        }

        // Previous slide
        function prevSlide() {
            if (currentIndex > 0) {
                goToSlide(currentIndex - 1);
            } else {
                goToSlide(Math.ceil(cards.length / cardsPerView) - 1);
            }
        }

        // Touch/Mouse drag handlers
        function getPositionX(event) {
            return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
        }

        function touchStart(event) {
            isDragging = true;
            startX = getPositionX(event);
            track.style.transition = 'none';
        }

        function touchMove(event) {
            if (!isDragging) return;
            
            const currentX = getPositionX(event);
            const diff = currentX - startX;
            currentTranslate = prevTranslate + diff;
            
            // Add resistance at edges
            const maxTranslate = 0;
            const minTranslate = -(cards.length - cardsPerView) * (cards[0].offsetWidth + 35);
            
            if (currentTranslate > maxTranslate) {
                currentTranslate = maxTranslate + (currentTranslate - maxTranslate) * 0.3;
            } else if (currentTranslate < minTranslate) {
                currentTranslate = minTranslate + (currentTranslate - minTranslate) * 0.3;
            }
            
            track.style.transform = `translateX(${currentTranslate}px)`;
        }

        function touchEnd() {
            if (!isDragging) return;
            isDragging = false;
            
            const movedBy = currentTranslate - prevTranslate;
            const threshold = 50;
            
            track.style.transition = 'transform 0.6s cubic-bezier(0.19, 1, 0.22, 1)';
            
            if (movedBy < -threshold && currentIndex < Math.ceil(cards.length / cardsPerView) - 1) {
                nextSlide();
            } else if (movedBy > threshold && currentIndex > 0) {
                prevSlide();
            } else {
                goToSlide(currentIndex);
            }
            
            prevTranslate = -(currentIndex * cardsPerView * (cards[0].offsetWidth + 35));
            resetAutoplay();
        }

        // Autoplay
        function startAutoplay() {
            autoplayInterval = setInterval(() => {
                nextSlide();
            }, 8000);
        }

        function resetAutoplay() {
            clearInterval(autoplayInterval);
            startAutoplay();
        }

        // Event listeners
        if (prevButton) {
            prevButton.addEventListener('click', () => {
                prevSlide();
                resetAutoplay();
            });
        }

        if (nextButton) {
            nextButton.addEventListener('click', () => {
                nextSlide();
                resetAutoplay();
            });
        }

        // Touch events
        track.addEventListener('touchstart', touchStart);
        track.addEventListener('touchmove', touchMove);
        track.addEventListener('touchend', touchEnd);
        
        // Mouse events
        track.addEventListener('mousedown', touchStart);
        track.addEventListener('mousemove', touchMove);
        track.addEventListener('mouseup', touchEnd);
        track.addEventListener('mouseleave', () => {
            if (isDragging) {
                isDragging = false;
                track.style.transition = 'transform 0.6s cubic-bezier(0.19, 1, 0.22, 1)';
                goToSlide(currentIndex);
            }
        });

        // Prevent context menu on long press
        track.addEventListener('contextmenu', (e) => e.preventDefault());

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (!carousel.closest('.team-section')) return;
            
            if (e.key === 'ArrowLeft') {
                prevSlide();
                resetAutoplay();
            } else if (e.key === 'ArrowRight') {
                nextSlide();
                resetAutoplay();
            }
        });

        // Window resize handler
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                const oldCardsPerView = cardsPerView;
                updateCardsPerView();
                
                if (oldCardsPerView !== cardsPerView) {
                    currentIndex = 0;
                    createDots();
                    goToSlide(0);
                } else {
                    goToSlide(currentIndex);
                }
            }, 250);
        });

        // Initialize
        updateCardsPerView();
        createDots();
        goToSlide(0);
        startAutoplay();

        // Pause on hover (only on desktop)
        if (window.innerWidth > 768) {
            carousel.addEventListener('mouseenter', () => {
                clearInterval(autoplayInterval);
            });

            carousel.addEventListener('mouseleave', () => {
                if (!isDragging) {
                    startAutoplay();
                }
            });
        }
    }

    // --- PREMIUM PARALLAX ENGINE (scroll-driven, passive) ---
    const parallaxElements = document.querySelectorAll('.hero, .products-section');

    function updateParallax() {
        parallaxElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.bottom > 0 && rect.top < window.innerHeight) {
                const speed = 0.4;
                const yPos = -(rect.top * speed);
                el.style.setProperty('--parallax-y', `${yPos}px`);
            }
        });
    }

    if (parallaxElements.length > 0) {
        window.addEventListener('scroll', updateParallax, { passive: true });
        updateParallax();
    }

    // --- SCROLL TO TOP BUTTON ---
    const scrollToTopBtn = document.getElementById('scrollToTop');
    
    if (scrollToTopBtn) {
        // Show/hide button based on scroll position
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                scrollToTopBtn.classList.add('visible');
            } else {
                scrollToTopBtn.classList.remove('visible');
            }
        });

        // Smooth scroll to top
        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // --- SMOOTH SCROLL FOR ANCHOR LINKS ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            
            // Skip if it's just '#' or empty
            if (href === '#' || href === '') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Close mobile menu if open
                if (navLinks && navLinks.classList.contains('active')) {
                    menuToggle.classList.remove('is-active');
                    navLinks.classList.remove('active');
                    body.classList.remove('menu-open');
                }
            }
        });
    });

    // --- LAZY LOADING IMAGES (Performance boost) ---
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    observer.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }

    // --- PERFORMANCE: Reduce animations on low-end devices ---
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.documentElement.style.scrollBehavior = 'auto';
    }

    // --- SCROLL ANIMATIONS ---
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                scrollObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe sections for scroll animations
    document.querySelectorAll('section:not(.hero):not(.team-section)').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        scrollObserver.observe(section);
    });
});
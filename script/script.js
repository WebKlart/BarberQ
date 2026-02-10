document.addEventListener('DOMContentLoaded', () => {
    // checkStatus(); // Deaktivert da status-boksen er fjernet

    const menuToggle = document.querySelector('#mobile-menu');
    const navLinks = document.querySelector('#nav-links');
    const body = document.body;

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('is-active');
            navLinks.classList.toggle('active');
            body.classList.toggle('menu-open');
        });

        // Lukk menyen når man trykker på en link
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('is-active');
                navLinks.classList.remove('active');
                body.classList.remove('menu-open');
            });
        });
    }

    // --- PREMIUM JS PARALLAX ENGINE ---
    const parallaxElements = document.querySelectorAll('.hero, .products-section');

    function updateParallax() {
        const scrolled = window.pageYOffset;

        parallaxElements.forEach(el => {
            const speed = 0.4; // Juster for "dybde"
            const rect = el.getBoundingClientRect();
            const offset = rect.top;

            // Vi regner bare ut hvis elementet er synlig på skjermen
            if (offset < window.innerHeight && rect.bottom > 0) {
                // Beregn forskyvning basert på hvor elementet er i viewporten
                const yPos = -(offset * speed);
                el.style.setProperty('--parallax-y', `${yPos}px`);
            }
        });

        requestAnimationFrame(updateParallax);
    }

    // Start parallaks-motoren
    if (parallaxElements.length > 0) {
        requestAnimationFrame(updateParallax);
    }
});

function checkStatus() {
    /* 
    Status-sjekk er deaktivert da elementene er fjernet fra forsiden.
    */
}
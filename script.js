// --- Combined & Refined JavaScript ---
document.addEventListener('DOMContentLoaded', function() {

    // --- Mobile Menu Toggle ---
    const menuToggle = document.getElementById('mobile-menu');
    const navMenuList = document.getElementById('nav-menu-list');
    if (menuToggle && navMenuList) {
        menuToggle.addEventListener('click', () => {
            navMenuList.classList.toggle('active');
            const icon = menuToggle.querySelector('i');
            const isExpanded = navMenuList.classList.contains('active');
            icon.className = isExpanded ? 'fas fa-times' : 'fas fa-bars';
            menuToggle.setAttribute('aria-expanded', isExpanded);
        });
        // Close menu if clicking outside of it (optional)
        document.addEventListener('click', (event) => {
            if (navMenuList.classList.contains('active') && !menuToggle.contains(event.target) && !navMenuList.contains(event.target)) {
                navMenuList.classList.remove('active');
                menuToggle.querySelector('i').className = 'fas fa-bars';
                menuToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // --- Hero Section Background Slider ---
    const heroSection = document.getElementById('hero');
    if (heroSection) {
        const backgroundImages = [ 'hero-bg-1.jpg', 'hero-bg-2.jpg', 'hero-bg-3.jpg' ]; // Ensure paths are correct
        let currentHeroImageIndex = 0;
        let heroIntervalId = null;
        const heroSlideInterval = 3000; // Use a separate interval variable

        function changeHeroBackgroundImage() {
            currentHeroImageIndex = (currentHeroImageIndex + 1) % backgroundImages.length;
            const nextImageUrl = backgroundImages[currentHeroImageIndex];
            const tempImg = new Image();
            tempImg.onload = () => { heroSection.style.backgroundImage = `url('${nextImageUrl}')`; };
            tempImg.onerror = () => { console.error(`Hero BG Error: Failed to load ${nextImageUrl}`); };
            tempImg.src = nextImageUrl;
        }

        function startHeroSlider() {
            clearInterval(heroIntervalId); // Clear previous timer before starting
            if (backgroundImages.length > 1) {
                heroSection.style.backgroundImage = `url('${backgroundImages[currentHeroImageIndex]}')`;
                heroIntervalId = setInterval(changeHeroBackgroundImage, heroSlideInterval);
            } else if (backgroundImages.length === 1) {
                heroSection.style.backgroundImage = `url('${backgroundImages[0]}')`;
            }
        }

        const heroPrevButton = heroSection.querySelector('.slider-arrow.prev');
        const heroNextButton = heroSection.querySelector('.slider-arrow.next');

        function showHeroImage(index) {
            if (backgroundImages.length <= 1) return; // Don't navigate if only one image
            currentHeroImageIndex = (index + backgroundImages.length) % backgroundImages.length;
            const imageUrl = backgroundImages[currentHeroImageIndex];
            const tempImg = new Image();
            tempImg.onload = () => { heroSection.style.backgroundImage = `url('${imageUrl}')`; };
            tempImg.onerror = () => { console.error(`Hero BG Error: Failed to load ${imageUrl}`); };
            tempImg.src = imageUrl;
            startHeroSlider(); // Reset timer on manual navigation
        }

        if (heroPrevButton) {
            heroPrevButton.addEventListener('click', () => showHeroImage(currentHeroImageIndex - 1));
        }
        if (heroNextButton) {
            heroNextButton.addEventListener('click', () => showHeroImage(currentHeroImageIndex + 1));
        }

        startHeroSlider();
    }

    // --- Stats Counter Animation ---
    const counters = document.querySelectorAll('.counter');
    if (counters.length > 0) {
        const speed = 200;
        const animateCounter = (counter) => {
            const target = +counter.getAttribute('data-target');
            let current = 0;
            counter.innerText = current;
            const updateCount = () => {
                const increment = Math.ceil(target / speed);
                current += increment;
                if (current < target) {
                    counter.innerText = current;
                    setTimeout(updateCount, 15);
                } else {
                    counter.innerText = target;
                    if (counter.parentElement) counter.parentElement.classList.add('counted');
                }
            };
            updateCount();
        };

        const observerOptions = { root: null, threshold: 0.3 };
        const observerCallback = (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && entry.target.parentElement && !entry.target.parentElement.classList.contains('counted')) {
                    animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        };
        const counterObserver = new IntersectionObserver(observerCallback, observerOptions);
        counters.forEach(counter => counterObserver.observe(counter));
    }

    // --- Basic Testimonial Slider (Fade Effect) ---
    const testimonialSlider = document.querySelector('.testimonial-slider');
    const testimonialSlides = document.querySelectorAll('.testimonial-slide');
    const testimonialDotsContainer = document.querySelector('.slider-dots');
    if (testimonialSlider && testimonialSlides.length > 0 && testimonialDotsContainer) {
        let currentTestimonialSlide = 0;
        const testimonialInterval = 5000;
        let testimonialTimer;
        let dots = [];

        testimonialSlides.forEach((_, index) => {
            const dot = document.createElement('span');
            dot.classList.add('dot');
            dot.setAttribute('data-slide', index);
            if (index === 0) dot.classList.add('active');
            testimonialDotsContainer.appendChild(dot);
            dots.push(dot);
        });

        function showTestimonialSlide(index) {
            if (index >= testimonialSlides.length || index < 0) index = 0; // Safety check
            testimonialSlides.forEach(slide => slide.classList.remove('active'));
            dots.forEach(dot => dot.classList.remove('active'));
            testimonialSlides[index].classList.add('active');
            if (dots[index]) dots[index].classList.add('active'); // Check if dot exists
            currentTestimonialSlide = index;
        }

        function nextTestimonialSlide() {
            let nextIndex = (currentTestimonialSlide + 1) % testimonialSlides.length;
            showTestimonialSlide(nextIndex);
        }

        dots.forEach(dot => {
            dot.addEventListener('click', () => {
                const slideIndex = parseInt(dot.getAttribute('data-slide'));
                clearInterval(testimonialTimer);
                showTestimonialSlide(slideIndex);
                testimonialTimer = setInterval(nextTestimonialSlide, testimonialInterval);
            });
        });

        if (testimonialSlides.length > 1) {
             testimonialTimer = setInterval(nextTestimonialSlide, testimonialInterval);
        }
        testimonialSlides[0].classList.add('active'); // Ensure first is active
    }


    // --- Simple Logo Slider (Marquee-like with steps) ---
    const logoSliderWrapper = document.querySelector('.logo-slider-wrapper');
    const logoSlider = document.querySelector('.logo-slider');
    const logoItemsOriginal = logoSlider ? logoSlider.querySelectorAll('.logo-item:not(.cloned)') : [];

    if (logoSliderWrapper && logoSlider && logoItemsOriginal.length > 0) {
        const slideIntervalLogo = 3000; // Use separate interval variable
        let itemWidth = 0;
        let totalItems = logoItemsOriginal.length;
        let currentIndex = 0;
        let slideTimerLogo;
        let isTransitioningLogo = false;
        let itemsVisibleLogo = 4; // Default, will be updated

        function getItemsVisibleCountLogo() {
             const width = window.innerWidth;
             if (width <= 576) return 2;
             if (width <= 767) return 3; // Match mobile breakpoint
             if (width <= 992) return 3; // Match tablet breakpoint
             if (width <= 1199) return 4; // Match large desktop breakpoint
             return 5; // Match extra large desktop breakpoint (>= 1200px as per CSS)
        }

        function calculateWidthsAndCloneLogo() {
            logoSlider.querySelectorAll('.cloned').forEach(clone => clone.remove());
            let clonedItems = [];
            itemsVisibleLogo = getItemsVisibleCountLogo();

            if (totalItems > itemsVisibleLogo) {
                for (let i = 0; i < itemsVisibleLogo && i < totalItems; i++) {
                    const clone = logoItemsOriginal[i].cloneNode(true);
                    clone.classList.add('cloned');
                    logoSlider.appendChild(clone);
                    clonedItems.push(clone);
                }
            }

            const currentItems = logoSlider.querySelectorAll('.logo-item');
            if (currentItems.length > 0) {
                requestAnimationFrame(() => {
                    itemWidth = currentItems[0].getBoundingClientRect().width;
                    const totalWidth = itemWidth * currentItems.length;
                    logoSlider.style.width = `${totalWidth}px`;
                     // console.log(`Logo Slider Recalc: itemsVisible=${itemsVisibleLogo}, itemWidth=${itemWidth.toFixed(2)}, totalWidth=${totalWidth.toFixed(2)}`);
                });
            }
        }

        function slideNextLogo() {
            if (isTransitioningLogo || totalItems <= itemsVisibleLogo) return;
            isTransitioningLogo = true;
            currentIndex++;

            logoSlider.style.transition = 'transform 0.8s ease-in-out';
            logoSlider.style.transform = `translateX(-${currentIndex * itemWidth}px)`;

            if (currentIndex >= totalItems) {
                setTimeout(() => {
                    logoSlider.style.transition = 'none';
                    currentIndex = 0;
                    logoSlider.style.transform = `translateX(0px)`;
                    void logoSlider.offsetWidth;
                    isTransitioningLogo = false;
                }, 800);
            } else {
                setTimeout(() => { isTransitioningLogo = false; }, 800);
            }
        }

        function startLogoSlider() {
            stopLogoSlider();
             // Recalculate visible items before starting timer
             itemsVisibleLogo = getItemsVisibleCountLogo();
            if (totalItems > itemsVisibleLogo) {
                slideTimerLogo = setInterval(slideNextLogo, slideIntervalLogo);
            }
        }

        function stopLogoSlider() {
            clearInterval(slideTimerLogo);
        }

        calculateWidthsAndCloneLogo(); // Initial setup
        startLogoSlider();

        logoSliderWrapper.addEventListener('mouseenter', stopLogoSlider);
        logoSliderWrapper.addEventListener('mouseleave', startLogoSlider);

        let resizeTimeoutLogo;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeoutLogo);
            resizeTimeoutLogo = setTimeout(() => {
                // console.log("Resizing logo slider...");
                stopLogoSlider();
                calculateWidthsAndCloneLogo();
                 logoSlider.style.transition = 'none';
                 currentIndex = 0;
                 logoSlider.style.transform = `translateX(0px)`;
                 void logoSlider.offsetWidth;
                startLogoSlider();
            }, 250);
        });

    }


    // --- Footer: Set Current Year & Scroll-to-Top ---
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    const scrollTopBtn = document.querySelector('.scroll-to-top');
    if (scrollTopBtn) {
        window.addEventListener('scroll', () => {
            scrollTopBtn.classList.toggle('visible', window.scrollY > 300);
        });
        scrollTopBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

}); // End MAIN DOMContentLoaded listener
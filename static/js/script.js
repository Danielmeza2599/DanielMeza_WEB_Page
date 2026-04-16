/**
 * Daniel Meza - Portfolio Website
 * Main JavaScript File
 * Handles navigation, carousel, mobile menu, and dynamic content loading
 */

(function() {
    'use strict';

    // ========================================
    // DOM Elements
    // ========================================
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.nav');
    const navLinks = document.querySelectorAll('.nav-link');
    const mainContent = document.getElementById('main-content');
    
    // Store initial carousel HTML for reset
    let carouselSectionHTML = '';
    let quickStatsHTML = '';

    // ========================================
    // Mobile Menu
    // ========================================
    function initMobileMenu() {
        if (!menuToggle || !nav) return;

        menuToggle.addEventListener('click', () => {
            const isActive = nav.classList.toggle('active');
            menuToggle.classList.toggle('active');
            menuToggle.setAttribute('aria-expanded', isActive);
        });

        // Close menu when clicking a link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('active');
                menuToggle.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
            });
        });

        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && nav.classList.contains('active')) {
                nav.classList.remove('active');
                menuToggle.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // ========================================
    // Navigation Active State
    // ========================================
    function updateActiveNavLink(section) {
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('onclick')?.includes(section)) {
                link.classList.add('active');
            }
        });
    }

    // ========================================
    // Carousel
    // ========================================
    function initCarousel() {
        const track = document.querySelector('.carousel-track');
        const slides = document.querySelectorAll('.carousel-slide');
        const prevBtn = document.querySelector('.carousel-btn.prev');
        const nextBtn = document.querySelector('.carousel-btn.next');
        const indicators = document.querySelectorAll('.indicator');

        if (!track || slides.length === 0) return;

        let currentIndex = 0;
        let autoplayInterval;
        const totalSlides = slides.length;
        const AUTOPLAY_DELAY = 7000;

        function goToSlide(index) {
            // Wrap around
            if (index < 0) index = totalSlides - 1;
            if (index >= totalSlides) index = 0;

            // Update slides
            slides.forEach((slide, i) => {
                slide.classList.toggle('active', i === index);
            });

            // Update indicators
            indicators.forEach((indicator, i) => {
                indicator.classList.toggle('active', i === index);
            });

            currentIndex = index;
        }

        function nextSlide() {
            goToSlide(currentIndex + 1);
        }

        function prevSlide() {
            goToSlide(currentIndex - 1);
        }

        function startAutoplay() {
            clearInterval(autoplayInterval);
            autoplayInterval = setInterval(nextSlide, AUTOPLAY_DELAY);
        }

        function stopAutoplay() {
            clearInterval(autoplayInterval);
        }

        // Event listeners
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                prevSlide();
                startAutoplay();
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                nextSlide();
                startAutoplay();
            });
        }

        // Indicator clicks
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                goToSlide(index);
                startAutoplay();
            });
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            const mainContentBounds = mainContent?.getBoundingClientRect();
            const isContentVisible = mainContentBounds && 
                mainContentBounds.top < window.innerHeight && 
                mainContentBounds.bottom > 0;

            if (!isContentVisible) return;

            if (e.key === 'ArrowLeft') {
                prevSlide();
                startAutoplay();
            } else if (e.key === 'ArrowRight') {
                nextSlide();
                startAutoplay();
            }
        });

        // Touch swipe support
        let touchStartX = 0;
        let touchEndX = 0;

        track.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            stopAutoplay();
        }, { passive: true });

        track.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
            startAutoplay();
        }, { passive: true });

        function handleSwipe() {
            const swipeThreshold = 50;
            const diff = touchStartX - touchEndX;

            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) {
                    nextSlide();
                } else {
                    prevSlide();
                }
            }
        }

        // Pause on hover (desktop only)
        if (window.matchMedia('(hover: hover)').matches) {
            track.addEventListener('mouseenter', stopAutoplay);
            track.addEventListener('mouseleave', startAutoplay);
        }

        // Intersection Observer - pause when not visible
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    startAutoplay();
                } else {
                    stopAutoplay();
                }
            });
        }, { threshold: 0.5 });

        observer.observe(track);

        // Start autoplay
        startAutoplay();
    }

    // ========================================
    // Section Loading
    // ========================================
    function storeHomeContent() {
        const carouselSection = document.querySelector('.carousel-section');
        const quickStats = document.querySelector('.quick-stats');
        
        if (carouselSection) {
            carouselSectionHTML = carouselSection.outerHTML;
        }
        if (quickStats) {
            quickStatsHTML = quickStats.outerHTML;
        }
    }

    window.loadSection = function(section) {
        let file = '';

        switch(section) {
            case 'projects':
                file = './static/pages/projects.html';
                break;
            case 'work_experience':
                file = './static/pages/work_experience.html';
                break;
            case 'academic_information':
                file = './static/pages/academic_information.html';
                break;
            case 'skills':
                file = './static/pages/skills.html';
                break;
            case 'home':
            default:
                restoreHomeContent();
                updateActiveNavLink('home');
                return;
        }

        // Show loading state
        mainContent.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i> Loading...</div>';

        fetch(file)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.text();
            })
            .then(html => {
                // Parse the HTML and extract body content
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                const bodyContent = doc.body.innerHTML;
                
                mainContent.innerHTML = `<div class="page-content">${bodyContent}</div>`;
                updateActiveNavLink(section);
                
                // Re-initialize any JS needed for the loaded content
                if (section === 'skills') {
                    // Add any specific init for skills page
                }
            })
            .catch(err => {
                console.error('Error loading section:', err);
                mainContent.innerHTML = `
                    <div class="error-state">
                        <i class="fas fa-exclamation-triangle"></i>
                        <p>Error loading content. Please try again.</p>
                        <button class="btn btn-primary" onclick="loadSection('home')">
                            <i class="fas fa-home"></i> Go Home
                        </button>
                    </div>
                `;
            });
    };

    function restoreHomeContent() {
        if (carouselSectionHTML && quickStatsHTML) {
            mainContent.innerHTML = carouselSectionHTML + quickStatsHTML;
            initCarousel();
        }
    }

    // ========================================
    // Smooth Scroll for Anchor Links
    // ========================================
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
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
    }

    // ========================================
    // Lazy Loading Images
    // ========================================
    function initLazyLoading() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                        }
                        imageObserver.unobserve(img);
                    }
                });
            });

            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    }

    // ========================================
    // Add Loading State Styles Dynamically
    // ========================================
    function addLoadingStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .loading {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 1rem;
                padding: 3rem;
                font-size: 1.25rem;
                color: var(--text-secondary);
            }
            .loading i {
                font-size: 2rem;
                color: var(--primary-color);
            }
            .error-state {
                text-align: center;
                padding: 3rem;
            }
            .error-state i {
                font-size: 3rem;
                color: var(--accent-color);
                margin-bottom: 1rem;
            }
            .error-state p {
                color: var(--text-secondary);
                margin-bottom: 1.5rem;
            }
        `;
        document.head.appendChild(style);
    }

    // ========================================
    // Initialize
    // ========================================
    function init() {
        // Store home content for restoration
        storeHomeContent();
        
        // Initialize components
        initMobileMenu();
        initCarousel();
        initSmoothScroll();
        initLazyLoading();
        addLoadingStyles();

        // Set initial active nav
        updateActiveNavLink('home');

        console.log('Portfolio initialized successfully');
    }

    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();

/* ============================================
   BLUEVERSE — Main JavaScript
   Premium Landing Page Interactions
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ========================================
    // NAVBAR
    // ========================================
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');

    // Scroll effect
    const handleScroll = () => {
        if (window.scrollY > 60) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // Mobile toggle
    const navBackdrop = document.getElementById('navBackdrop');
    const mobileMenuClose = document.getElementById('mobileMenuClose');
    
    navToggle.addEventListener('click', () => {
        const isOpen = navLinks.classList.contains('open');
        navToggle.classList.toggle('open');
        navLinks.classList.toggle('open');
        navBackdrop.classList.toggle('open');
        document.body.style.overflow = isOpen ? '' : 'hidden';
    });

    // Close when clicking backdrop
    navBackdrop.addEventListener('click', () => {
        navToggle.classList.remove('open');
        navLinks.classList.remove('open');
        navBackdrop.classList.remove('open');
        document.body.style.overflow = '';
    });

    // Close when clicking close button
    if (mobileMenuClose) {
        mobileMenuClose.addEventListener('click', () => {
            navToggle.classList.remove('open');
            navLinks.classList.remove('open');
            navBackdrop.classList.remove('open');
            document.body.style.overflow = '';
        });
    }

    // Close mobile menu on link click
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('open');
            navLinks.classList.remove('open');
            navBackdrop.classList.remove('open');
            document.body.style.overflow = '';
        });
    });

    // ========================================
    // GENERIC CAROUSEL ENGINE
    // ========================================
    class Carousel {
        constructor(options) {
            this.track = document.getElementById(options.trackId);
            this.prevBtn = document.getElementById(options.prevId);
            this.nextBtn = document.getElementById(options.nextId);
            this.dotsContainer = document.getElementById(options.dotsId);
            this.itemSelector = options.itemSelector;
            this.autoPlay = options.autoPlay || false;
            this.autoPlayInterval = options.autoPlayInterval || 5000;
            this.currentIndex = 0;
            this.autoPlayTimer = null;

            if (!this.track) return;

            this.items = this.track.querySelectorAll(this.itemSelector);
            this.totalItems = this.items.length;

            this.init();
        }

        init() {
            this.calculateVisibleCount();
            this.createDots();
            this.bindEvents();
            this.update();

            if (this.autoPlay) {
                this.startAutoPlay();
            }

            // Touch support
            this.initTouch();

            // Recalculate on resize
            window.addEventListener('resize', () => {
                this.calculateVisibleCount();
                this.createDots();
                if (this.currentIndex > this.maxIndex) {
                    this.currentIndex = this.maxIndex;
                }
                this.update();
            });
        }

        calculateVisibleCount() {
            if (!this.items.length) return;
            const trackWidth = this.track.parentElement.offsetWidth;
            const itemStyle = getComputedStyle(this.items[0]);
            const itemWidth = this.items[0].offsetWidth;
            const gap = parseInt(getComputedStyle(this.track).gap) || 24;
            this.visibleCount = Math.max(1, Math.floor((trackWidth + gap) / (itemWidth + gap)));
            this.maxIndex = Math.max(0, this.totalItems - this.visibleCount);
        }

        createDots() {
            if (!this.dotsContainer) return;
            this.dotsContainer.innerHTML = '';
            const totalDots = this.maxIndex + 1;
            for (let i = 0; i < totalDots; i++) {
                const dot = document.createElement('div');
                dot.className = `carousel-dot${i === this.currentIndex ? ' active' : ''}`;
                dot.addEventListener('click', () => this.goTo(i));
                this.dotsContainer.appendChild(dot);
            }
        }

        bindEvents() {
            if (this.prevBtn) {
                this.prevBtn.addEventListener('click', () => this.prev());
            }
            if (this.nextBtn) {
                this.nextBtn.addEventListener('click', () => this.next());
            }
        }

        prev() {
            this.currentIndex = this.currentIndex > 0 ? this.currentIndex - 1 : this.maxIndex;
            this.update();
            this.resetAutoPlay();
        }

        next() {
            this.currentIndex = this.currentIndex < this.maxIndex ? this.currentIndex + 1 : 0;
            this.update();
            this.resetAutoPlay();
        }

        goTo(index) {
            this.currentIndex = index;
            this.update();
            this.resetAutoPlay();
        }

        update() {
            if (!this.items.length) return;
            const gap = parseInt(getComputedStyle(this.track).gap) || 24;
            const itemWidth = this.items[0].offsetWidth;
            const offset = this.currentIndex * (itemWidth + gap);
            this.track.style.transform = `translateX(-${offset}px)`;

            // Update dots
            if (this.dotsContainer) {
                const dots = this.dotsContainer.querySelectorAll('.carousel-dot');
                dots.forEach((dot, i) => {
                    dot.classList.toggle('active', i === this.currentIndex);
                });
            }
        }

        startAutoPlay() {
            this.autoPlayTimer = setInterval(() => this.next(), this.autoPlayInterval);
        }

        resetAutoPlay() {
            if (this.autoPlay && this.autoPlayTimer) {
                clearInterval(this.autoPlayTimer);
                this.startAutoPlay();
            }
        }

        initTouch() {
            let startX = 0;
            let isDragging = false;

            this.track.addEventListener('touchstart', (e) => {
                startX = e.touches[0].clientX;
                isDragging = true;
            }, { passive: true });

            this.track.addEventListener('touchend', (e) => {
                if (!isDragging) return;
                const endX = e.changedTouches[0].clientX;
                const diff = startX - endX;

                if (Math.abs(diff) > 50) {
                    if (diff > 0) this.next();
                    else this.prev();
                }
                isDragging = false;
            }, { passive: true });
        }
    }

    // Initialize carousels
    const servicesCarousel = new Carousel({
        trackId: 'servicesCarousel',
        prevId: 'servicesPrev',
        nextId: 'servicesNext',
        dotsId: 'servicesDots',
        itemSelector: '.service-card',
        autoPlay: true,
        autoPlayInterval: 5000
    });

    const baCarousel = new Carousel({
        trackId: 'baCarousel',
        prevId: 'baPrev',
        nextId: 'baNext',
        dotsId: 'baDots',
        itemSelector: '.ba-slide',
        autoPlay: true,
        autoPlayInterval: 6000
    });

    const testimonialCarousel = new Carousel({
        trackId: 'testimonialCarousel',
        prevId: 'testPrev',
        nextId: 'testNext',
        dotsId: 'testDots',
        itemSelector: '.testimonial-card',
        autoPlay: true,
        autoPlayInterval: 5000
    });

    const protectionCarousel = new Carousel({
        trackId: 'protectionCarousel',
        dotsId: 'protectionDots',
        itemSelector: '.protection-card',
        autoPlay: true,
        autoPlayInterval: 5000
    });

    // ========================================
    // SCROLL REVEAL ANIMATIONS
    // ========================================
    const revealElements = document.querySelectorAll(
        '.section-header, .service-card, .value-card, .why-card, .testimonial-card, .quote-wrapper, .ba-slide, .trust-strip, .final-cta-content, .faq-item, .protection-card, .precision-content'
    );

    revealElements.forEach(el => {
        el.classList.add('reveal');
    });

    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -60px 0px',
        threshold: 0.1
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    revealElements.forEach(el => revealObserver.observe(el));

    // ========================================
    // FAQ ACCORDION
    // ========================================
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        if (!question) return;

        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Close all other items
            faqItems.forEach(other => {
                if (other !== item) {
                    other.classList.remove('active');
                    other.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
                }
            });

            // Toggle current
            item.classList.toggle('active', !isActive);
            question.setAttribute('aria-expanded', !isActive);
        });
    });

    // ========================================
    // LEAD FORM SUBMISSION
    // ========================================
    const form = document.getElementById('quoteForm');
    const formSuccess = document.getElementById('formSuccess');
    const submitBtn = document.getElementById('submitBtn');

    // Capture UTM parameters from URL on page load
    function getUTMParams() {
        const params = new URLSearchParams(window.location.search);
        return {
            medium: params.get('utm_medium') || '',
            source: params.get('utm_source') || '',
            campaign: params.get('utm_campaign') || '',
            ad_set: params.get('utm_adset') || params.get('utm_ad_set') || '',
            keyword: params.get('utm_term') || params.get('utm_keyword') || '',
            gclid: params.get('gclid') || '',
            adgroupid: params.get('adgroupid') || ''
        };
    }

    const utmData = getUTMParams();
    
    // Set hidden tracking inputs if they exist
    const gclidInput = document.getElementById('formGclid');
    if (gclidInput && utmData.gclid) {
        gclidInput.value = utmData.gclid;
    }
    const adgroupidInput = document.getElementById('formAdGroupId');
    if (adgroupidInput && utmData.adgroupid) {
        adgroupidInput.value = utmData.adgroupid;
    }

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Clear previous errors
            form.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
            form.querySelectorAll('.error-message').forEach(el => el.remove());

            // Gather data
            const name = document.getElementById('formName').value.trim();
            const phone = document.getElementById('formPhone').value.trim();
            const carType = form.querySelector('input[name="car_type"]:checked')?.value;
            const servicesChecked = Array.from(form.querySelectorAll('input[name="services"]:checked'))
                .map(cb => cb.value);
            const gclid = document.getElementById('formGclid')?.value || '';
            const adgroupid = document.getElementById('formAdGroupId')?.value || '';

            // Validation
            let hasError = false;

            if (!name) {
                showError('formName', 'Please enter your name');
                hasError = true;
            }

            if (!phone || phone.length < 8) {
                showError('formPhone', 'Please enter a valid phone number');
                hasError = true;
            }

            if (!carType) {
                // Since it's a radio group, we append error to the grid
                const checkboxGrid = form.querySelector('.checkbox-grid');
                if (checkboxGrid) {
                    const msg = document.createElement('div');
                    msg.className = 'error-message';
                    msg.textContent = 'Please select your car type';
                    checkboxGrid.parentElement.appendChild(msg);
                }
                hasError = true;
            }

            if (servicesChecked.length === 0) {
                const checkboxGrid = form.querySelector('.checkbox-grid');
                if (checkboxGrid) {
                    const msg = document.createElement('div');
                    msg.className = 'error-message';
                    msg.textContent = 'Please select at least one service';
                    checkboxGrid.parentElement.appendChild(msg);
                }
                hasError = true;
            }

            if (hasError) return;

            // Show loading
            submitBtn.classList.add('loading');
            submitBtn.textContent = 'Preparing WhatsApp...';

            // Build structured lead data
            const submissionDatetime = new Date().toISOString();
            const leadPayload = {
                submission_datetime: submissionDatetime,
                name,
                phone,
                car_type: carType,
                services: servicesChecked,
                status: 'New',
                medium: utmData.medium,
                source: utmData.source || 'Landing Page',
                campaign: utmData.campaign,
                ad_set: utmData.ad_set,
                keyword: utmData.keyword,
                gclid: gclid,
                adgroupid: adgroupid
            };

            // ========================================
            // SAVE TO GOOGLE SHEETS (non-blocking)
            // ========================================
            const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfycbwpXibiLwCNGE77UJOtg9TvSRD8VgVoVqAf_rmFNcl8ddQ1RxIOxdVaVWZe7SVavep8/exec';

            if (GOOGLE_SHEET_URL) {
                fetch(GOOGLE_SHEET_URL, {
                    method: 'POST',
                    mode: 'no-cors',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(leadPayload)
                }).then(() => {
                    console.log('✅ Lead sent to Google Sheets');
                    console.log('Data:', leadPayload);
                }).catch(err => {
                    console.error('❌ Google Sheets error:', err);
                    console.log('Data attempted:', leadPayload);
                });
            }

            // Also save to local database (non-blocking)
            try {
                fetch('tables/leads', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(leadPayload)
                });
            } catch (err) {
                console.log('Lead save note:', err);
            }

            // Build WhatsApp message
            const servicesList = servicesChecked.join(', ');
            const waMessage =
                `Hi, it's ${name}.\n` +
                `I want to get a quote for the following services: ${servicesList}.\n` +
                `My car type is ${carType}.\n` +
                `My phone is ${phone}.`;

            // WhatsApp number: 0544692205 → international format 971544692205
            const waNumber = '971559828767';
            const waURL = `https://wa.me/${waNumber}?text=${encodeURIComponent(waMessage)}`;

            // Show success state briefly, then redirect to WhatsApp
            form.style.display = 'none';
            formSuccess.style.display = 'block';

            // Small delay so user sees the confirmation, then open WhatsApp
            setTimeout(() => {
                window.open(waURL, '_blank');
            }, 600);
        });
    }

    function showError(fieldId, message) {
        const field = document.getElementById(fieldId);
        if (field) {
            field.classList.add('error');
            const msg = document.createElement('div');
            msg.className = 'error-message';
            msg.textContent = message;
            field.parentElement.appendChild(msg);
        }
    }

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    // ========================================
    // SMOOTH SCROLL FOR ANCHOR LINKS
    // ========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // ========================================
    // ACTIVE NAV LINK ON SCROLL
    // ========================================
    const sections = document.querySelectorAll('section[id]');
    const navLinkItems = document.querySelectorAll('.navbar-links a');

    const activateNavLink = () => {
        const scrollY = window.scrollY + 120;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                navLinkItems.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    };

    window.addEventListener('scroll', activateNavLink, { passive: true });

    // ========================================
    // COUNTER ANIMATION (Trust Strip)
    // ========================================
    const trustStrip = document.querySelector('.trust-strip');
    if (trustStrip) {
        const trustObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    trustObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        trustObserver.observe(trustStrip);
    }

    function animateCounters() {
        const statElements = document.querySelectorAll('.trust-stat');
        statElements.forEach(el => {
            const text = el.textContent.trim();
            const match = text.match(/^(\d+)/);
            if (match) {
                const target = parseInt(match[1]);
                const suffix = text.replace(match[1], '');
                let current = 0;
                const increment = Math.ceil(target / 40);
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        current = target;
                        clearInterval(timer);
                    }
                    el.textContent = current + suffix;
                }, 30);
            }
        });
    }

    // ========================================
    // PARALLAX EFFECT ON HERO
    // ========================================
    const heroImg = document.querySelector('.hero-bg-img');
    if (heroImg && window.innerWidth > 768) {
        window.addEventListener('scroll', () => {
            const scrolled = window.scrollY;
            if (scrolled < window.innerHeight) {
                heroImg.style.transform = `scale(1.05) translateY(${scrolled * 0.15}px)`;
            }
        }, { passive: true });
    }

    // ========================================
    // PRELOAD IMAGES
    // ========================================
    const imagesToPreload = document.querySelectorAll('.hero-bg-img, .service-card-img img');
    imagesToPreload.forEach(img => {
        if (img.complete) return;
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.6s ease';
        img.addEventListener('load', () => {
            img.style.opacity = '1';
        });
    });

});

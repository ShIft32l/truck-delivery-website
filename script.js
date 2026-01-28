document.addEventListener('DOMContentLoaded', () => {
    
    // Mobile Navigation Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            menuToggle.classList.toggle('active');
            
            // Animate hamburger to X (optional simple rotation)
            const bars = menuToggle.querySelectorAll('.bar');
            if (navLinks.classList.contains('active')) {
                // Add transform styles if needed dynamically or handle via CSS class
            }
        });
    }

    // Smooth Scrolling for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            // Close mobile menu if open
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
            }

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = 70; // Matches navbar height
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Initialize EmailJS
    // QUAN TRỌNG: Bạn cần thay thế 'YOUR_PUBLIC_KEY' bằng Public Key từ tài khoản EmailJS của bạn
    emailjs.init("y_7KkqgELQ7X65q0k");

    // Form Submission Handler
    const quoteForm = document.getElementById('quoteForm');
    if (quoteForm) {
        quoteForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const btn = quoteForm.querySelector('button[type="submit"]');
            const originalText = btn.innerText;
            
            // Show loading state
            btn.innerText = 'Đang Gửi...';
            btn.disabled = true;

            // QUAN TRỌNG: Thay thế 'YOUR_SERVICE_ID' và 'YOUR_TEMPLATE_ID' bằng ID thật của bạn
            emailjs.sendForm('service_2cuhp9s', 'template_sdvyw9m', quoteForm)
                .then(() => {
                    // Success
                    btn.innerText = 'Đã Gửi Yêu Cầu!';
                    btn.style.backgroundColor = '#28a745';
                    alert('Cảm ơn bạn đã gửi yêu cầu! Chúng tôi sẽ liên hệ sớm nhất.');
                    quoteForm.reset();
                    
                    setTimeout(() => {
                        btn.innerText = originalText;
                        btn.style.backgroundColor = '';
                        btn.disabled = false;
                    }, 3000);
                }, (error) => {
                    // Error
                    console.error('EmailJS Error:', error);
                    btn.innerText = 'Gửi Thất Bại';
                    btn.style.backgroundColor = '#dc3545';
                    alert('Có lỗi xảy ra khi gửi. Vui lòng thử lại hoặc gọi hotline: 0937 066 877');
                    
                    setTimeout(() => {
                        btn.innerText = originalText;
                        btn.style.backgroundColor = '';
                        btn.disabled = false;
                    }, 3000);
                });
        });
    }

    // Scroll Header Background Change (Optional polish)
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.boxShadow = "0 4px 20px rgba(0,0,0,0.1)";
        } else {
            navbar.style.boxShadow = "0 2px 10px rgba(0,0,0,0.05)";
        }
    });

    // Gallery Carousel
    const galleryCarousel = () => {
        const track = document.querySelector('.gallery-track');
        const slides = document.querySelectorAll('.gallery-slide');
        const prevBtn = document.querySelector('.gallery-btn-prev');
        const nextBtn = document.querySelector('.gallery-btn-next');
        const dotsContainer = document.querySelector('.gallery-dots');
        
        if (!track || slides.length === 0) return;

        let currentIndex = 0;
        let slidesPerView = 3;
        let autoPlayInterval;
        let isDragging = false;
        let startPos = 0;
        let currentTranslate = 0;
        let prevTranslate = 0;

        // Determine slides per view based on screen width
        const updateSlidesPerView = () => {
            if (window.innerWidth <= 576) {
                slidesPerView = 1;
            } else if (window.innerWidth <= 992) {
                slidesPerView = 2;
            } else {
                slidesPerView = 3;
            }
        };

        // Create dots
        const createDots = () => {
            dotsContainer.innerHTML = '';
            const totalDots = Math.ceil(slides.length / slidesPerView);
            for (let i = 0; i < totalDots; i++) {
                const dot = document.createElement('button');
                dot.classList.add('gallery-dot');
                if (i === 0) dot.classList.add('active');
                dot.addEventListener('click', () => goToSlide(i * slidesPerView));
                dotsContainer.appendChild(dot);
            }
        };

        // Update dots
        const updateDots = () => {
            const dots = document.querySelectorAll('.gallery-dot');
            const activeDotIndex = Math.floor(currentIndex / slidesPerView);
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === activeDotIndex);
            });
        };

        // Calculate slide width
        const getSlideWidth = () => {
            const slide = slides[0];
            const style = getComputedStyle(slide);
            const marginRight = parseInt(style.marginRight) || 0;
            return slide.offsetWidth + marginRight;
        };

        // Move to specific slide
        const goToSlide = (index) => {
            const maxIndex = slides.length - slidesPerView;
            currentIndex = Math.max(0, Math.min(index, maxIndex));
            const slideWidth = getSlideWidth();
            const offset = -currentIndex * slideWidth;
            track.style.transform = `translateX(${offset}px)`;
            prevTranslate = offset;
            updateDots();
        };

        // Next slide
        const nextSlide = () => {
            const maxIndex = slides.length - slidesPerView;
            if (currentIndex >= maxIndex) {
                goToSlide(0);
            } else {
                goToSlide(currentIndex + 1);
            }
        };

        // Previous slide
        const prevSlide = () => {
            if (currentIndex <= 0) {
                goToSlide(slides.length - slidesPerView);
            } else {
                goToSlide(currentIndex - 1);
            }
        };

        // Auto play
        const startAutoPlay = () => {
            stopAutoPlay();
            autoPlayInterval = setInterval(nextSlide, 4000);
        };

        const stopAutoPlay = () => {
            if (autoPlayInterval) {
                clearInterval(autoPlayInterval);
            }
        };

        // Touch/Drag events
        const dragStart = (e) => {
            isDragging = true;
            startPos = e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
            track.style.transition = 'none';
            stopAutoPlay();
        };

        const drag = (e) => {
            if (!isDragging) return;
            const currentPosition = e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
            currentTranslate = prevTranslate + currentPosition - startPos;
            track.style.transform = `translateX(${currentTranslate}px)`;
        };

        const dragEnd = () => {
            if (!isDragging) return;
            isDragging = false;
            track.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            
            const movedBy = currentTranslate - prevTranslate;
            const threshold = getSlideWidth() / 4;
            
            if (movedBy < -threshold) {
                nextSlide();
            } else if (movedBy > threshold) {
                prevSlide();
            } else {
                goToSlide(currentIndex);
            }
            
            startAutoPlay();
        };

        // Event listeners
        prevBtn.addEventListener('click', () => {
            prevSlide();
            stopAutoPlay();
            startAutoPlay();
        });

        nextBtn.addEventListener('click', () => {
            nextSlide();
            stopAutoPlay();
            startAutoPlay();
        });

        // Touch events
        track.addEventListener('touchstart', dragStart, { passive: true });
        track.addEventListener('touchmove', drag, { passive: true });
        track.addEventListener('touchend', dragEnd);

        // Mouse events
        track.addEventListener('mousedown', dragStart);
        track.addEventListener('mousemove', drag);
        track.addEventListener('mouseup', dragEnd);
        track.addEventListener('mouseleave', () => {
            if (isDragging) dragEnd();
        });

        // Prevent image dragging
        slides.forEach(slide => {
            slide.addEventListener('dragstart', (e) => e.preventDefault());
        });

        // Pause on hover
        track.parentElement.addEventListener('mouseenter', stopAutoPlay);
        track.parentElement.addEventListener('mouseleave', startAutoPlay);

        // Handle resize
        window.addEventListener('resize', () => {
            updateSlidesPerView();
            createDots();
            goToSlide(Math.min(currentIndex, slides.length - slidesPerView));
        });

        // Initialize
        updateSlidesPerView();
        createDots();
        startAutoPlay();
    };

    galleryCarousel();

});

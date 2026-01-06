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

});

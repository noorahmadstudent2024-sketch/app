// ==================== ANIMATED BACKGROUND ====================
class AnimatedBackground {
    constructor() {
        this.canvas = document.getElementById('bgCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.connections = [];
        this.init();
    }

    init() {
        this.resize();
        this.createParticles();
        this.animate();
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticles() {
        const particleCount = Math.floor((this.canvas.width * this.canvas.height) / 15000);

        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                radius: Math.random() * 2 + 1
            });
        }
    }

    drawParticle(particle) {
        this.ctx.beginPath();
        this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        this.ctx.fillStyle = 'rgba(0, 217, 255, 0.5)';
        this.ctx.fill();
    }

    drawConnection(p1, p2, distance) {
        const opacity = 1 - (distance / 150);
        this.ctx.beginPath();
        this.ctx.strokeStyle = `rgba(139, 92, 246, ${opacity * 0.3})`;
        this.ctx.lineWidth = 1;
        this.ctx.moveTo(p1.x, p1.y);
        this.ctx.lineTo(p2.x, p2.y);
        this.ctx.stroke();
    }

    update() {
        this.particles.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;

            if (particle.x < 0 || particle.x > this.canvas.width) particle.vx *= -1;
            if (particle.y < 0 || particle.y > this.canvas.height) particle.vy *= -1;
        });
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw connections
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 150) {
                    this.drawConnection(this.particles[i], this.particles[j], distance);
                }
            }
        }

        // Draw particles
        this.particles.forEach(particle => this.drawParticle(particle));
    }

    animate() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.animate());
    }
}

// ==================== TYPING EFFECT ====================
class TypingEffect {
    constructor(element, texts, speed = 100, deleteSpeed = 50, pauseTime = 2000) {
        this.element = element;
        this.texts = texts;
        this.speed = speed;
        this.deleteSpeed = deleteSpeed;
        this.pauseTime = pauseTime;
        this.textIndex = 0;
        this.charIndex = 0;
        this.isDeleting = false;
        this.start();
    }

    start() {
        this.type();
    }

    type() {
        const currentText = this.texts[this.textIndex];

        if (this.isDeleting) {
            this.element.textContent = currentText.substring(0, this.charIndex - 1);
            this.charIndex--;
        } else {
            this.element.textContent = currentText.substring(0, this.charIndex + 1);
            this.charIndex++;
        }

        let typeSpeed = this.isDeleting ? this.deleteSpeed : this.speed;

        if (!this.isDeleting && this.charIndex === currentText.length) {
            typeSpeed = this.pauseTime;
            this.isDeleting = true;
        } else if (this.isDeleting && this.charIndex === 0) {
            this.isDeleting = false;
            this.textIndex = (this.textIndex + 1) % this.texts.length;
            typeSpeed = 500;
        }

        setTimeout(() => this.type(), typeSpeed);
    }
}

// ==================== ANIMATED COUNTERS ====================
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    const speed = 200;

    const countUp = (counter) => {
        const target = +counter.getAttribute('data-target');
        const count = +counter.innerText;
        const increment = target / speed;

        if (count < target) {
            counter.innerText = Math.ceil(count + increment);
            setTimeout(() => countUp(counter), 10);
        } else {
            counter.innerText = target + '+';
        }
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                countUp(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
}

// ==================== NAVBAR SCROLL EFFECT ====================
function initNavbar() {
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Active link on scroll
    const sections = document.querySelectorAll('section[id]');

    window.addEventListener('scroll', () => {
        const scrollY = window.pageYOffset;

        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });

    // Close mobile menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
}

// ==================== SMOOTH SCROLL ====================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ==================== SCROLL ANIMATIONS ====================
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    document.querySelectorAll('.stat-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(50px)';
        card.style.transition = 'all 0.6s ease';
        observer.observe(card);
    });
}

// ==================== INITIALIZE EVERYTHING ====================
document.addEventListener('DOMContentLoaded', () => {
    // Initialize animated background
    new AnimatedBackground();

    // Initialize typing effect
    const typingElement = document.getElementById('typingText');
    const texts = [
        'Agentic AI & Robotics Engineer',
        'Freelance Web Developer',
        'Building Intelligent Solutions',
        'Custom Website Development'
    ];
    new TypingEffect(typingElement, texts);

    // Initialize all features
    initNavbar();
    initSmoothScroll();
    animateCounters();
    initScrollAnimations();
    initSkillBars();
    initAboutPageAnimations();
    initPortfolioFilter();
    initContactForm();
    initScrollToTop();

    // Add loading animation
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// ==================== SKILL BARS ANIMATION ====================
function initSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');

    if (skillBars.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progress = entry.target.getAttribute('data-progress');
                entry.target.style.width = progress + '%';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    skillBars.forEach(bar => observer.observe(bar));
}

// ==================== ABOUT PAGE ANIMATIONS ====================
function initAboutPageAnimations() {
    const animateElements = [
        '.education-card',
        '.cert-card',
        '.choose-card',
        '.skill-category'
    ];

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    animateElements.forEach(selector => {
        document.querySelectorAll(selector).forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(50px)';
            element.style.transition = `all 0.6s ease ${index * 0.1}s`;
            observer.observe(element);
        });
    });

    // Animate about image
    const aboutImage = document.querySelector('.about-image');
    if (aboutImage) {
        aboutImage.style.opacity = '0';
        aboutImage.style.transform = 'scale(0.8)';
        aboutImage.style.transition = 'all 0.8s ease';

        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'scale(1)';
                    imageObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        imageObserver.observe(aboutImage);
    }

    // Animate about text
    const aboutText = document.querySelector('.about-text');
    if (aboutText) {
        aboutText.style.opacity = '0';
        aboutText.style.transform = 'translateX(50px)';
        aboutText.style.transition = 'all 0.8s ease 0.3s';

        const textObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateX(0)';
                    textObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        textObserver.observe(aboutText);
    }
}

// ==================== PORTFOLIO FILTERING ====================
function initPortfolioFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioCards = document.querySelectorAll('.portfolio-card');

    if (filterBtns.length === 0 || portfolioCards.length === 0) return;

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));

            // Add active class to clicked button
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            portfolioCards.forEach(card => {
                const category = card.getAttribute('data-category');

                if (filterValue === 'all' || category === filterValue) {
                    card.classList.remove('hide');
                    setTimeout(() => {
                        card.style.display = 'block';
                    }, 10);
                } else {
                    card.classList.add('hide');
                    setTimeout(() => {
                        if (card.classList.contains('hide')) {
                            card.style.display = 'none';
                        }
                    }, 300);
                }
            });
        });
    });
}

// ==================== CONTACT FORM VALIDATION ====================
function initContactForm() {
    const form = document.getElementById('contactForm');
    const formSuccess = document.getElementById('formSuccess');

    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Clear previous errors
        clearErrors();

        // Validate form
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const service = document.getElementById('service').value;
        const message = document.getElementById('message').value.trim();

        let isValid = true;

        // Name validation
        if (name === '') {
            showError('nameError', 'Please enter your name');
            isValid = false;
        } else if (name.length < 2) {
            showError('nameError', 'Name must be at least 2 characters');
            isValid = false;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (email === '') {
            showError('emailError', 'Please enter your email');
            isValid = false;
        } else if (!emailRegex.test(email)) {
            showError('emailError', 'Please enter a valid email address');
            isValid = false;
        }

        // Service validation
        if (service === '') {
            showError('serviceError', 'Please select a service');
            isValid = false;
        }

        // Message validation
        if (message === '') {
            showError('messageError', 'Please enter your message');
            isValid = false;
        } else if (message.length < 10) {
            showError('messageError', 'Message must be at least 10 characters');
            isValid = false;
        }

        if (isValid) {
            // Create WhatsApp message
            const whatsappMessage = `
Hello! I'm interested in your services.

Name: ${name}
Email: ${email}
Service: ${service}
Message: ${message}
            `.trim();

            const whatsappUrl = `https://wa.me/923478302597?text=${encodeURIComponent(whatsappMessage)}`;

            // Show success message
            form.style.display = 'none';
            formSuccess.style.display = 'block';

            // Redirect to WhatsApp after 2 seconds
            setTimeout(() => {
                window.open(whatsappUrl, '_blank');
                form.reset();
                form.style.display = 'block';
                formSuccess.style.display = 'none';
            }, 2000);
        }
    });

    function showError(elementId, message) {
        const errorElement = document.getElementById(elementId);
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.parentElement.querySelector('input, select, textarea').style.borderColor = '#ef4444';
        }
    }

    function clearErrors() {
        const errorElements = document.querySelectorAll('.error-message');
        errorElements.forEach(element => {
            element.textContent = '';
        });

        const inputs = document.querySelectorAll('.form-group input, .form-group select, .form-group textarea');
        inputs.forEach(input => {
            input.style.borderColor = '';
        });
    }
}

// ==================== SCROLL TO TOP BUTTON ====================
function initScrollToTop() {
    const scrollBtn = document.getElementById('scrollToTop');

    if (!scrollBtn) return;

    // Show/hide button based on scroll position
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollBtn.classList.add('show');
        } else {
            scrollBtn.classList.remove('show');
        }
    });

    // Scroll to top on click
    scrollBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ==================== CURSOR EFFECT (OPTIONAL) ====================
document.addEventListener('mousemove', (e) => {
    const cursor = document.createElement('div');
    cursor.style.position = 'fixed';
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
    cursor.style.width = '5px';
    cursor.style.height = '5px';
    cursor.style.background = 'rgba(0, 217, 255, 0.5)';
    cursor.style.borderRadius = '50%';
    cursor.style.pointerEvents = 'none';
    cursor.style.zIndex = '9999';
    cursor.style.transition = 'opacity 0.5s ease';

    document.body.appendChild(cursor);

    setTimeout(() => {
        cursor.style.opacity = '0';
    }, 100);

    setTimeout(() => {
        cursor.remove();
    }, 600);
});

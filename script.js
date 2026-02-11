/* ============================================
   $WOO — Script
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // --- Snowfall Effect ---
    const canvas = document.getElementById('snowCanvas');
    const ctx = canvas.getContext('2d');

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Snowflake {
        constructor() {
            this.reset();
            this.y = Math.random() * canvas.height;
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = -10;
            this.size = Math.random() * 3 + 0.5;
            this.speed = Math.random() * 1 + 0.3;
            this.wind = Math.random() * 0.5 - 0.25;
            this.opacity = Math.random() * 0.6 + 0.1;
        }

        update() {
            this.y += this.speed;
            this.x += this.wind + Math.sin(this.y * 0.01) * 0.3;

            if (this.y > canvas.height + 10 || this.x < -10 || this.x > canvas.width + 10) {
                this.reset();
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(200, 225, 255, ${this.opacity})`;
            ctx.fill();
        }
    }

    const snowflakes = Array.from({ length: 80 }, () => new Snowflake());

    function animateSnow() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        snowflakes.forEach(flake => {
            flake.update();
            flake.draw();
        });
        requestAnimationFrame(animateSnow);
    }
    animateSnow();


    // --- Navbar is fully transparent at all times, no scroll effect needed ---


    // --- Scroll Animations (Intersection Observer) ---
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -60px 0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.dataset.delay || 0;
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, parseInt(delay));

                // Trigger supply bar animation
                const supplyFill = entry.target.querySelector('.supply-fill');
                if (supplyFill) {
                    setTimeout(() => {
                        supplyFill.classList.add('animated');
                    }, 400);
                }
            }
        });
    }, observerOptions);

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
    });


    // --- Animated Counters ---
    function animateCounter(el) {
        const target = parseInt(el.dataset.target);
        const duration = 2000;
        const start = performance.now();

        function update(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 4); // ease-out quart
            const current = Math.floor(eased * target);

            el.textContent = current.toLocaleString();

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }
        requestAnimationFrame(update);
    }

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.stat-number[data-target]').forEach(el => {
        counterObserver.observe(el);
    });


    // --- Meme Slider never pauses, always scrolling ---


    // --- Card Tilt Effect ---
    document.querySelectorAll('.card, .token-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -5;
            const rotateY = ((x - centerX) / centerX) * 5;

            card.style.transform = `translateY(-8px) perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });


    // --- Smooth Scroll for Nav Links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            e.preventDefault();
            const target = document.querySelector(targetId);
            if (target) {
                const offset = 80;
                const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });


    // --- Parallax on Hero ---
    const heroGlow = document.querySelector('.hero-glow');
    const orbElement = document.querySelector('.woo-orb');

    window.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 2;
        const y = (e.clientY / window.innerHeight - 0.5) * 2;

        if (heroGlow) {
            heroGlow.style.transform = `translateX(calc(-50% + ${x * 20}px)) translateY(${y * 20}px)`;
        }

        if (orbElement) {
            orbElement.style.transform = `translate(${x * 12}px, ${y * 12}px)`;
        }
    });

});

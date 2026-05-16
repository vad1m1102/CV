// ========== THEME TOGGLE ==========
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;

// Load saved theme
const savedTheme = localStorage.getItem('theme') || 'dark';
html.setAttribute('data-theme', savedTheme);

themeToggle.addEventListener('click', () => {
  const current = html.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
});

// ========== MOBILE MENU ==========
const burger = document.getElementById('burger');
const navLinks = document.getElementById('navLinks');

burger.addEventListener('click', () => {
  burger.classList.toggle('is-active');
  navLinks.classList.toggle('is-open');
});

// Close menu on link click
navLinks.querySelectorAll('.nav__link').forEach(link => {
  link.addEventListener('click', () => {
    burger.classList.remove('is-active');
    navLinks.classList.remove('is-open');
  });
});

// ========== SCROLL ANIMATIONS ==========
const animatedElements = document.querySelectorAll('[data-animate]');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const delay = entry.target.dataset.delay || 0;
      setTimeout(() => {
        entry.target.classList.add('is-visible');
      }, Number(delay));
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

animatedElements.forEach(el => observer.observe(el));

// ========== COUNTER ANIMATION ==========
const counters = document.querySelectorAll('[data-count]');

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const target = Number(entry.target.dataset.count);
      const duration = 1500;
      const start = performance.now();

      const animate = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
        entry.target.textContent = Math.round(target * eased);
        if (progress < 1) requestAnimationFrame(animate);
      };

      requestAnimationFrame(animate);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

counters.forEach(el => counterObserver.observe(el));

// ========== ACTIVE NAV LINK ==========
const sections = document.querySelectorAll('.section, .hero');
const navLinkEls = document.querySelectorAll('.nav__link');

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      navLinkEls.forEach(link => {
        link.classList.toggle('is-active', link.getAttribute('href') === `#${id}`);
      });
    }
  });
}, { threshold: 0.3 });

sections.forEach(section => navObserver.observe(section));

// ========== SMOOTH SCROLL FOR SAFARI ==========
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

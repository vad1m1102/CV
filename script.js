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
  document.body.classList.toggle('menu-open');
});

// Close menu on link click
navLinks.querySelectorAll('.nav__link').forEach(link => {
  link.addEventListener('click', () => {
    burger.classList.remove('is-active');
    navLinks.classList.remove('is-open');
    document.body.classList.remove('menu-open');
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

// ========== FEEDBACK FORM ==========
const feedbackForm = document.getElementById('feedbackForm');
const nameInput = document.getElementById('feedbackName');
const emailInput = document.getElementById('feedbackEmail');
const messageInput = document.getElementById('feedbackMessage');
const nameError = document.getElementById('nameError');
const emailError = document.getElementById('emailError');
const messageError = document.getElementById('messageError');
const toast = document.getElementById('successToast');

// Email regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Clear error on input
[nameInput, emailInput, messageInput].forEach(input => {
  input.addEventListener('input', () => {
    input.classList.remove('is-invalid');
    const errorEl = document.getElementById(input.name + 'Error');
    if (errorEl) errorEl.textContent = '';
  });
});

function validateForm() {
  let isValid = true;

  // Name validation
  const name = nameInput.value.trim();
  if (!name) {
    nameError.textContent = "Будь ласка, введіть ваше ім'я";
    nameInput.classList.add('is-invalid');
    isValid = false;
  } else if (name.length < 2) {
    nameError.textContent = "Ім'я повинно містити щонайменше 2 символи";
    nameInput.classList.add('is-invalid');
    isValid = false;
  } else {
    nameError.textContent = '';
    nameInput.classList.remove('is-invalid');
  }


  const email = emailInput.value.trim();
  if (!email) {
    emailError.textContent = 'Будь ласка, введіть email';
    emailInput.classList.add('is-invalid');
    isValid = false;
  } else if (!emailRegex.test(email)) {
    emailError.textContent = 'Введіть коректну email адресу';
    emailInput.classList.add('is-invalid');
    isValid = false;
  } else {
    emailError.textContent = '';
    emailInput.classList.remove('is-invalid');
  }


  const message = messageInput.value.trim();
  if (!message) {
    messageError.textContent = 'Будь ласка, введіть повідомлення';
    messageInput.classList.add('is-invalid');
    isValid = false;
  } else if (message.length < 10) {
    messageError.textContent = 'Повідомлення повинно містити щонайменше 10 символів';
    messageInput.classList.add('is-invalid');
    isValid = false;
  } else {
    messageError.textContent = '';
    messageInput.classList.remove('is-invalid');
  }

  return isValid;
}

function showToast() {
  toast.classList.add('is-visible');
  setTimeout(() => {
    toast.classList.remove('is-visible');
  }, 4000);
}

feedbackForm.addEventListener('submit', (e) => {
  e.preventDefault();

  if (!validateForm()) return;

  const feedbackData = {
    name: nameInput.value.trim(),
    email: emailInput.value.trim(),
    message: messageInput.value.trim(),
    date: new Date().toISOString()
  };

  const existing = JSON.parse(localStorage.getItem('feedbackMessages') || '[]');
  existing.push(feedbackData);
  localStorage.setItem('feedbackMessages', JSON.stringify(existing));

  feedbackForm.reset();


  showToast();
});

// ==========================================================
// assets/js/app.js
// CPES — Main App Controller (global utilities)
// ==========================================================

// ---------- DOM Ready ----------
document.addEventListener('DOMContentLoaded', () => {
  initNavbarToggle();
  initCounters();
  initFormValidation();
});

// ---------- Navbar Toggle (Mobile) ----------
function initNavbarToggle() {
  const toggle = document.querySelector('.navbar__toggle');
  const nav = document.querySelector('.navbar__nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', isOpen);
    });
  }
}

// ---------- Animated Counters (Hero Stats) ----------
function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-count'), 10);
        animateCounter(el, target);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.3 });

  counters.forEach((c) => observer.observe(c));
}

function animateCounter(el, target) {
  let current = 0;
  const increment = Math.ceil(target / 60);
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.textContent = current + (el.textContent.includes('%') ? '%' : '');
  }, 16);
}

// ---------- Basic Form Validation (client-side) ----------
function initFormValidation() {
  const forms = document.querySelectorAll('form[data-validate]');
  forms.forEach((form) => {
    form.addEventListener('submit', (e) => {
      const inputs = form.querySelectorAll('.form-control');
      let valid = true;
      inputs.forEach((input) => {
        const errorEl = input.parentElement.querySelector('.form-error');
        if (input.hasAttribute('required') && !input.value.trim()) {
          input.classList.add('error');
          if (errorEl) {
            errorEl.textContent = 'This field is required';
            errorEl.classList.add('show');
          }
          valid = false;
        } else {
          input.classList.remove('error');
          if (errorEl) errorEl.classList.remove('show');
        }
      });
      if (!valid) e.preventDefault();
    });
  });
}

// ---------- Utility: Show/Hide Spinner ----------
export function showSpinner(target) {
  const spinner = document.createElement('div');
  spinner.className = 'spinner';
  spinner.setAttribute('role', 'status');
  target.prepend(spinner);
  target.disabled = true;
  return spinner;
}

export function hideSpinner(spinner, target) {
  if (spinner) spinner.remove();
  if (target) target.disabled = false;
}

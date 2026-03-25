// Coastal Talent and Innovation Hack-A-Thon — Event JS

document.addEventListener('DOMContentLoaded', () => {
  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  // Scroll reveal animations
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  // FAQ Accordion
  document.querySelectorAll('.faq-item').forEach(item => {
    item.querySelector('.faq-question')?.addEventListener('click', () => {
      const wasActive = item.classList.contains('active');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
      if (!wasActive) item.classList.add('active');
    });
  });

  // Mobile menu toggle
  const menuBtn = document.querySelector('.mobile-menu-btn');
  const mobileMenu = document.querySelector('.mobile-menu');
  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => mobileMenu.classList.toggle('active'));
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => mobileMenu.classList.remove('active'));
    });
  }

  // Countdown Timer
  const countdownEl = document.getElementById('countdown');
  if (countdownEl) {
    const targetDate = new Date(countdownEl.dataset.target || '2026-09-01T09:00:00');
    function updateCountdown() {
      const now = new Date();
      const diff = targetDate - now;
      if (diff <= 0) {
        countdownEl.innerHTML = '<p class="text-2xl font-bold glow-gold">The event is LIVE!</p>';
        return;
      }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diff % (1000 * 60)) / 1000);
      countdownEl.innerHTML = `
        <div class="countdown-item"><div class="countdown-number">${days}</div><div class="countdown-label">Days</div></div>
        <div class="countdown-item"><div class="countdown-number">${hours}</div><div class="countdown-label">Hours</div></div>
        <div class="countdown-item"><div class="countdown-number">${mins}</div><div class="countdown-label">Minutes</div></div>
        <div class="countdown-item"><div class="countdown-number">${secs}</div><div class="countdown-label">Seconds</div></div>
      `;
    }
    updateCountdown();
    setInterval(updateCountdown, 1000);
  }

  // Navbar scroll effect
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.style.background = window.scrollY > 50
        ? 'rgba(10,14,39,0.95)'
        : 'rgba(10,14,39,0.9)';
    });
  }

  // Form validation
  window.validateForm = function(formEl) {
    let valid = true;
    formEl.querySelectorAll('[required]').forEach(input => {
      if (!input.value.trim()) {
        input.style.borderColor = '#ff6b6b';
        valid = false;
      } else {
        input.style.borderColor = '';
      }
    });
    const emailInput = formEl.querySelector('[type="email"]');
    if (emailInput && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value)) {
      emailInput.style.borderColor = '#ff6b6b';
      valid = false;
    }
    return valid;
  };

  // Registration form handler
  const regForm = document.getElementById('registration-form');
  if (regForm) {
    regForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!window.validateForm(regForm)) return;

      const formData = new FormData(regForm);
      const data = Object.fromEntries(formData.entries());
      const submitBtn = regForm.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Processing...';

      try {
        const res = await fetch('/api/event/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        const result = await res.json();
        if (result.success) {
          const checkoutRes = await fetch('/api/event/checkout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              ticketType: data.ticketType,
              email: data.email,
              name: data.name,
              registrationId: result.registrationId
            })
          });
          const checkout = await checkoutRes.json();
          if (checkout.url) window.location.href = checkout.url;
        }
      } catch (err) {
        console.error('Registration error:', err);
        alert('Something went wrong. Please try again.');
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Register & Pay';
      }
    });
  }

  // Sponsor inquiry form handler
  const sponsorForm = document.getElementById('sponsor-form');
  if (sponsorForm) {
    sponsorForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!window.validateForm(sponsorForm)) return;

      const formData = new FormData(sponsorForm);
      const data = Object.fromEntries(formData.entries());
      const submitBtn = sponsorForm.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Submitting...';

      try {
        const res = await fetch('/api/event/sponsor-inquiry', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        const result = await res.json();
        if (result.success) {
          sponsorForm.innerHTML = '<div class="text-center py-8"><h3 class="text-2xl font-bold glow-gold mb-4">Thank You!</h3><p class="text-gray-400">We\'ll be in touch within 24 hours to discuss your sponsorship.</p></div>';
        }
      } catch (err) {
        console.error('Sponsor inquiry error:', err);
        alert('Something went wrong. Please try again.');
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit Inquiry';
      }
    });
  }

  // Track filter (schedule page)
  document.querySelectorAll('[data-track-filter]').forEach(btn => {
    btn.addEventListener('click', () => {
      const track = btn.dataset.trackFilter;
      document.querySelectorAll('[data-track-filter]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      document.querySelectorAll('[data-track]').forEach(item => {
        item.style.display = (track === 'all' || item.dataset.track === track) ? '' : 'none';
      });
    });
  });

  // Analytics placeholder
  window.trackEvent = function(category, action, label) {
    if (typeof gtag !== 'undefined') gtag('event', action, { event_category: category, event_label: label });
    console.log('[CTIH Analytics]', category, action, label);
  };
});
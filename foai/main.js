// FOAI Cloud — Main Application Logic

// Parallax ambient glows on mouse move
document.addEventListener('mousemove', (e) => {
  const x = e.clientX / window.innerWidth;
  const y = e.clientY / window.innerHeight;

  const glows = document.querySelectorAll('.ambient-glow');
  glows.forEach((glow, i) => {
    const factor = (i + 1) * 15;
    const dirX = i % 2 === 0 ? 1 : -1;
    const dirY = i % 2 === 0 ? 1 : -1;
    glow.style.transform = `translate(${x * factor * dirX}px, ${y * factor * dirY}px)`;
  });
});

// Smooth card reveal on scroll
const observerOptions = {
  root: null,
  rootMargin: '0px 0px -60px 0px',
  threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

document.addEventListener('DOMContentLoaded', () => {
  const cards = document.querySelectorAll('.bento-card, .orchestration-card');

  cards.forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(28px)';
    card.style.transition = `all 0.65s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.08}s`;
    observer.observe(card);
  });

  // Animate stats counter
  const statNumbers = document.querySelectorAll('.stat-number');
  statNumbers.forEach(stat => {
    stat.style.opacity = '0';
    stat.style.transform = 'translateY(12px)';
    stat.style.transition = 'all 0.6s ease-out 0.5s';

    const statObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          statObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    statObserver.observe(stat);
  });
});

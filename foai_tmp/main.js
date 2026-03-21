// Main application logic

// Add subtle parallax effect to glowing orbs
document.addEventListener('mousemove', (e) => {
  const x = e.clientX / window.innerWidth;
  const y = e.clientY / window.innerHeight;
  
  const glow1 = document.querySelector('.glow-1');
  const glow2 = document.querySelector('.glow-2');
  
  if (glow1) {
    glow1.style.transform = `translate(${x * 50}px, ${y * 50}px)`;
  }
  
  if (glow2) {
    glow2.style.transform = `translate(${x * -40}px, ${y * -40}px)`;
  }
});

// Smooth reveal for cards
const observerOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 0.1
};

const observer = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

document.addEventListener('DOMContentLoaded', () => {
  const cards = document.querySelectorAll('.card');
  
  cards.forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = `all 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.1}s`;
    observer.observe(card);
  });
});

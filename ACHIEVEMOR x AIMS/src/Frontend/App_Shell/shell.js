/* ═══════════════════════════════════════════════════════════
   A.I.M.S Shell — JavaScript (Interactions & Animations)
   ═══════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Mobile Nav Toggle ── */
  const hamburger = document.getElementById('nav-hamburger');
  const nav = document.getElementById('main-nav');
  if (hamburger && nav) {
    hamburger.addEventListener('click', () => {
      nav.classList.toggle('nav--open');
      const spans = hamburger.querySelectorAll('span');
      if (nav.classList.contains('nav--open')) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
      } else {
        spans[0].style.transform = '';
        spans[1].style.opacity = '';
        spans[2].style.transform = '';
      }
    });
  }

  /* ── Scroll-Triggered Animations ── */
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -60px 0px'
  };

  const animObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animationPlayState = 'running';
        entry.target.classList.add('is-visible');
        animObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.animate-fade-in-up, .animate-scale-in, .animate-slide-right').forEach(el => {
    if (!el.closest('.hero')) {
      el.style.animationPlayState = 'paused';
      animObserver.observe(el);
    }
  });

  /* ── Nav Scroll Effect ── */
  let lastScrollY = 0;
  const navEl = document.getElementById('main-nav');
  
  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    if (navEl) {
      if (currentScrollY > 50) {
        navEl.style.backdropFilter = 'blur(30px)';
        navEl.style.background = 'rgba(13, 15, 23, 0.85)';
        navEl.style.boxShadow = '0 4px 20px rgba(0,0,0,0.3)';
      } else {
        navEl.style.backdropFilter = '';
        navEl.style.background = '';
        navEl.style.boxShadow = '';
      }
    }
    lastScrollY = currentScrollY;
  }, { passive: true });

  /* ── Smooth Scroll for Nav Links ── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        if (nav && nav.classList.contains('nav--open')) {
          nav.classList.remove('nav--open');
        }
      }
    });
  });

  /* ── Terminal Typing Effect Loop ── */
  const terminalLines = [
    { agent: 'ACHEEVY', cls: 't-cyan', msg: 'Intent normalized', status: '✓', statusCls: 't-emerald' },
    { agent: 'NTNTN', cls: 't-violet', msg: 'Context pack built', status: '✓', statusCls: 't-emerald' },
    { agent: 'Picker_Ang', cls: 't-violet', msg: 'Route: CFO_Ang', status: '', statusCls: '' },
    { agent: 'CFO_Ang', cls: 't-amber', msg: 'Quota gate: PASS', status: '', statusCls: '' },
    { agent: 'Boomer_Ang', cls: 't-cyan', msg: 'Executing task_043...', status: '', statusCls: '' },
    { agent: 'BuildSmith', cls: 't-cyan', msg: 'Assembly: 100%', status: '✓', statusCls: 't-emerald' },
    { agent: 'Review_Hone', cls: 't-emerald', msg: 'Validation passed', status: '✓', statusCls: 't-emerald' },
    { agent: 'ACHEEVY', cls: 't-cyan', msg: 'Packaged → delivered', status: '●', statusCls: 't-emerald' }
  ];

  const terminalBody = document.getElementById('terminal-output');
  if (terminalBody) {
    let cycleCount = 0;
    
    function runTerminalCycle() {
      cycleCount++;
      if (cycleCount <= 1) return; // skip first cycle, HTML handles it
      
      terminalBody.innerHTML = '';
      
      terminalLines.forEach((line, i) => {
        setTimeout(() => {
          const div = document.createElement('div');
          div.className = 'terminal__line';
          div.style.animation = 'fade-in-up 0.3s ease both';
          
          const statusPart = line.status 
            ? ` <span class="${line.statusCls}">${line.status}</span>` 
            : '';
          
          div.innerHTML = `<span class="${line.cls}">${line.agent}</span> <span class="t-muted">→</span> ${line.msg}${statusPart}`;
          terminalBody.appendChild(div);
          
          // Keep scrolled to bottom
          terminalBody.scrollTop = terminalBody.scrollHeight;
        }, i * 600);
      });
    }

    // Start cycling after initial animation
    setTimeout(() => {
      setInterval(runTerminalCycle, terminalLines.length * 600 + 2000);
    }, 5000);
  }

  /* ── Stat Counter Animation ── */
  function animateCounter(el, target, suffix = '') {
    const isFloat = target % 1 !== 0;
    const duration = 1500;
    const start = performance.now();
    
    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = isFloat 
        ? (target * eased).toFixed(1) 
        : Math.round(target * eased);
      el.textContent = current + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const agentsStat = document.getElementById('stat-agents');
        const uptimeStat = document.getElementById('stat-uptime');
        const latencyStat = document.getElementById('stat-latency');
        
        if (agentsStat) animateCounter(agentsStat, 24, '');
        if (uptimeStat) animateCounter(uptimeStat, 99.7, '%');
        if (latencyStat) { latencyStat.textContent = '<120ms'; }
        
        statsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  const statsSection = document.querySelector('.hero__stats');
  if (statsSection) statsObserver.observe(statsSection);

  /* ── Feature Card Hover Tilt ── */
  document.querySelectorAll('.feature-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(600px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) translateY(-2px)`;
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  /* ── Console CTA Redirect ── */
  ['btn-launch', 'hero-cta', 'cta-deploy'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('click', () => {
        // Placeholder — wire to your auth / console URL
        window.location.href = '/console';
      });
    }
  });

  ['btn-login'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('click', () => {
        window.location.href = '/login';
      });
    }
  });

});

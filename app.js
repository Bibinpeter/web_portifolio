/* ==========================================================================
   Bibin Peter - Minimalist Interactive Engine
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initParticleCanvas();
  initTypewriter();
  initScrollReveals();
  initScrollProgress();
  initCounters();
  initSkillMeters();
  initFilters();
  initProjectModals();
  initContactForm();
  initScrollEffects();
  initShowcaseScroll();
});

/* --- 1. Background Particle Mesh --- */
function initParticleCanvas() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  const mouse = { x: null, y: null, radius: 140 };

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', resize);
  resize();

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 2 + 1;
      this.vx = (Math.random() - 0.5) * 0.5;
      this.vy = (Math.random() - 0.5) * 0.5;
      this.color = Math.random() > 0.5 ? '#00f2fe' : '#3a7bd5';
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      if (mouse.x != null && mouse.y != null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < mouse.radius) {
          const angle = Math.atan2(dy, dx);
          const force = (mouse.radius - distance) / mouse.radius;
          this.x -= Math.cos(angle) * force * 2.5;
          this.y -= Math.sin(angle) * force * 2.5;
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
    }
  }

  const particleCount = Math.min(Math.floor(window.innerWidth / 16), 75);
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function connect() {
    for (let a = 0; a < particles.length; a++) {
      for (let b = a; b < particles.length; b++) {
        const dx = particles[a].x - particles[b].x;
        const dy = particles[a].y - particles[b].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 110) {
          const opacity = (1 - distance / 110) * 0.15;
          ctx.strokeStyle = `rgba(0, 242, 254, ${opacity})`;
          ctx.lineWidth = 0.7;
          ctx.beginPath();
          ctx.moveTo(particles[a].x, particles[a].y);
          ctx.lineTo(particles[b].x, particles[b].y);
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    connect();
    requestAnimationFrame(animate);
  }

  animate();
}

/* --- 2. Typewriter Effect --- */
function initTypewriter() {
  const target = document.querySelector('.typed-text');
  if (!target) return;

  const phrases = [
    'Flutter & Mobile Developer',
    'GetX State Management Expert',
    'Full-Stack Software Engineer'
  ];

  let phraseIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  let speed = 90;

  function type() {
    const currentPhrase = phrases[phraseIdx];

    if (isDeleting) {
      target.textContent = currentPhrase.substring(0, charIdx - 1);
      charIdx--;
      speed = 35;
    } else {
      target.textContent = currentPhrase.substring(0, charIdx + 1);
      charIdx++;
      speed = 80;
    }

    if (!isDeleting && charIdx === currentPhrase.length) {
      speed = 2000;
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
      speed = 300;
    }

    setTimeout(type, speed);
  }

  type();
}

/* --- 3. Scroll Reveal --- */
function initScrollReveals() {
  const reveals = document.querySelectorAll('.scroll-reveal');
  if (!reveals.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
      }
    });
  }, { threshold: 0.1 });

  reveals.forEach(el => observer.observe(el));
}

/* --- 4. Scroll Progress Indicator --- */
function initScrollProgress() {
  const progressBar = document.getElementById('scroll-progress');
  if (!progressBar) return;

  window.addEventListener('scroll', () => {
    const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (window.scrollY / totalScroll) * 100;
    progressBar.style.width = `${Math.min(progress, 100)}%`;
  });
}

/* --- 5. Stat Counter Animation --- */
function initCounters() {
  const counters = document.querySelectorAll('.counter-num');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        const target = parseInt(counter.getAttribute('data-count'), 10);
        const suffix = counter.getAttribute('data-suffix') || '';
        let start = 0;
        const duration = 1200;
        const stepTime = 20;
        const steps = duration / stepTime;
        const increment = target / steps;

        const timer = setInterval(() => {
          start += increment;
          if (start >= target) {
            counter.textContent = target + suffix;
            clearInterval(timer);
          } else {
            counter.textContent = Math.floor(start) + suffix;
          }
        }, stepTime);

        observer.unobserve(counter);
      }
    });
  }, { threshold: 0.4 });

  counters.forEach(c => observer.observe(c));
}

/* --- 6. Skill Progress Fill --- */
function initSkillMeters() {
  const skillFills = document.querySelectorAll('.skill-progress-fill');
  if (!skillFills.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fill = entry.target;
        fill.style.width = fill.getAttribute('data-progress') || '85%';
        observer.unobserve(fill);
      }
    });
  }, { threshold: 0.2 });

  skillFills.forEach(fill => observer.observe(fill));
}

/* --- 7. Category Filter --- */
function initFilters() {
  const skillTabs = document.querySelectorAll('.skills-tabs .tab-btn');
  const skillCards = document.querySelectorAll('.skill-card');

  skillTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      skillTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.getAttribute('data-filter');
      skillCards.forEach(card => {
        if (filter === 'all' || card.getAttribute('data-category') === filter) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  const projectTabs = document.querySelectorAll('.project-tabs .tab-btn');
  const projectCards = document.querySelectorAll('.project-card');

  projectTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      projectTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.getAttribute('data-filter');
      projectCards.forEach(card => {
        if (filter === 'all' || card.getAttribute('data-category') === filter) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* --- 8. Real GitHub Project Data Dictionary --- */
const projectData = {
  hostelmate: {
    title: 'Hostel Mate - Integrated Management App',
    tags: ['Flutter', 'Firebase Auth', 'Firestore', 'Admin & User Roles'],
    image: 'assets/hostel_mate.jpg',
    isGraphic: false,
    description: 'Cross-platform hostel management solution built in Flutter with integrated Firebase services for both Admin and Residents.',
    features: [
      'Dual-role authentication and interface for Admin & Residents',
      'Instant broadcast notifications ("Notify Them") & Announcement board',
      'Food menu scheduling, hostel rules, and complaint history tracking',
      'Integrated KSRTC bus booking shortcut'
    ],
    github: 'https://github.com/Bibinpeter/hostelmates_app'
  },
  hotelbooking: {
    title: 'Hotel Booking App with Riverpod',
    tags: ['Flutter', 'Riverpod', 'Google Maps Polygons', 'REST APIs'],
    image: 'assets/hotel_booking.png',
    isGraphic: false,
    description: 'Feature-rich hotel reservation mobile application built with Riverpod state management and Google Maps polygon rate integration.',
    features: [
      'Interactive Google Maps integration showing hotel polygons and pricing',
      'Location search (e.g., Kochi) with stay date selection',
      'Detailed facility breakdown (WiFi, AC, Pool, Airport Pickup)',
      'Multi-photo room gallery and slide-to-login authentication'
    ],
    github: 'https://github.com/Bibinpeter/HOTEL_BOOKING_APP_RIVERPOD'
  },
  gemini: {
    title: 'Gemini AI Chat App',
    tags: ['Flutter', 'Dart', 'Gemini AI API', 'Real-Time Messaging'],
    isGraphic: true,
    icon: 'fa-robot',
    titleGraphic: 'Gemini AI Engine',
    glow: 'rgba(112, 0, 255, 0.18)',
    gradient: 'linear-gradient(135deg, #7000ff 0%, #00f2fe 100%)',
    description: 'AI messaging application leveraging Google\'s Gemini API for real-time intelligent conversations, code assistance, and multimedia sharing.',
    features: [
      'Real-time streaming response integration with Gemini API',
      'Secure encrypted chat session storage',
      'Clean high-contrast dark theme optimized for readability'
    ],
    github: 'https://github.com/Bibinpeter/Gemini_AI_chatapp'
  },
  shoesneak: {
    title: 'Shoesneak E-Commerce App',
    tags: ['Flutter', 'BLoC Pattern', 'REST API', 'Footwear Store'],
    isGraphic: true,
    icon: 'fa-socks',
    titleGraphic: 'Shoesneak Store',
    glow: 'rgba(244, 63, 94, 0.18)',
    gradient: 'linear-gradient(135deg, #f43f5e 0%, #ff7e5f 100%)',
    description: 'Seamless footwear shopping mobile app featuring BLoC state management, product catalog filtering, order tracking, and secure payments.',
    features: [
      'BLoC architecture for predictable state management',
      'REST API catalog data fetching & instant search',
      'Interactive cart management & checkout workflow'
    ],
    github: 'https://github.com/Bibinpeter/Shoesneak_Ecommerce_Bloc_Api'
  },
  carrental: {
    title: 'Car Rental Flutter App',
    tags: ['Flutter', 'BLoC', 'Firebase Auth', 'Flutter Maps'],
    isGraphic: true,
    icon: 'fa-car-side',
    titleGraphic: 'Car Rental Hub',
    glow: 'rgba(0, 242, 254, 0.18)',
    gradient: 'linear-gradient(135deg, #00f2fe 0%, #3a7bd5 100%)',
    description: 'Complete vehicle rental application featuring interactive maps, vehicle reservation flow, Firebase authentication, and BLoC pattern.',
    features: [
      'Interactive Flutter Maps vehicle pickup location selection',
      'Firebase Auth & real-time booking ledger',
      'Smooth vehicle catalog filtering and booking confirmation'
    ],
    github: 'https://github.com/Bibinpeter/Car_Rental'
  },
  finance: {
    title: 'Finance & Expense Tracker',
    tags: ['Flutter', 'Provider', 'Hive DB', 'Pie Charts'],
    isGraphic: true,
    icon: 'fa-chart-pie',
    titleGraphic: 'Finance Engine',
    glow: 'rgba(79, 172, 254, 0.18)',
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    description: 'Personal expense and income tracking app utilizing Hive local database, Provider state management, and spending analytics charts.',
    features: [
      'Hive database for lightning-fast offline data persistence',
      'Interactive spending breakdown pie charts',
      'Income & expense categories with monthly budgeting analytics'
    ],
    github: 'https://github.com/Bibinpeter/FinanceApp'
  }
};

function initProjectModals() {
  const modal = document.getElementById('project-modal');
  if (!modal) return;

  const modalImg = document.getElementById('modal-img');
  const graphicPlaceholder = document.getElementById('modal-placeholder-graphic');
  const placeholderIcon = document.getElementById('modal-placeholder-icon');
  const placeholderTitle = document.getElementById('modal-placeholder-title');

  const modalTitle = document.getElementById('modal-title');
  const modalTags = document.getElementById('modal-tags');
  const modalDesc = document.getElementById('modal-desc');
  const modalFeatures = document.getElementById('modal-features');
  const modalGithub = document.getElementById('modal-github');
  const closeBtn = modal.querySelector('.modal-close-btn');

  document.querySelectorAll('.btn-view-project').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const projectId = e.currentTarget.getAttribute('data-project');
      const data = projectData[projectId];
      if (!data) return;

      if (data.isGraphic) {
        modalImg.style.display = 'none';
        graphicPlaceholder.style.display = 'flex';
        graphicPlaceholder.style.setProperty('--glow-color', data.glow);
        placeholderIcon.className = `fa-solid ${data.icon} project-placeholder-icon`;
        placeholderIcon.style.setProperty('--icon-gradient', data.gradient);
        placeholderTitle.textContent = data.titleGraphic;
      } else {
        graphicPlaceholder.style.display = 'none';
        modalImg.style.display = 'block';
        modalImg.src = data.image;
      }

      modalTitle.textContent = data.title;
      modalDesc.textContent = data.description;
      modalGithub.href = data.github || 'https://github.com/Bibinpeter';

      modalTags.innerHTML = data.tags.map(t => `<span class="tag">${t}</span>`).join('');
      modalFeatures.innerHTML = data.features.map(f => `<li><i class="fa-solid fa-check"></i> ${f}</li>`).join('');

      modal.showModal();
    });
  });

  closeBtn.addEventListener('click', () => modal.close());

  modal.addEventListener('click', (e) => {
    const rect = modal.getBoundingClientRect();
    const isInDialog = (
      rect.top <= e.clientY &&
      e.clientY <= rect.top + rect.height &&
      rect.left <= e.clientX &&
      e.clientX <= rect.left + rect.width
    );
    if (!isInDialog) {
      modal.close();
    }
  });
}

/* --- 9. Contact Form email dispatcher --- */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('form-name').value;
    const email = document.getElementById('form-email').value;
    const message = document.getElementById('form-message').value;

    if (!name || !email || !message) {
      showToast('Please fill out all fields.', 'warning');
      return;
    }

    // Prefilled direct mail draft URL creation
    const emailSubject = encodeURIComponent(`Portfolio Message from ${name}`);
    const emailBody = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
    const mailtoUrl = `mailto:bibinpeter2018@gmail.com?subject=${emailSubject}&body=${emailBody}`;

    // Programmatically open in a new frame using an anchor tag to guarantee browser support
    const mailLink = document.createElement('a');
    mailLink.href = mailtoUrl;
    mailLink.target = '_blank';
    document.body.appendChild(mailLink);
    mailLink.click();
    document.body.removeChild(mailLink);

    showToast('Opening default mail application...', 'success');
    form.reset();
  });
}

function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  const icon = type === 'success' ? 'fa-circle-check' : 'fa-triangle-exclamation';
  const color = type === 'success' ? '#00f2fe' : '#f43f5e';

  toast.innerHTML = `<i class="fa-solid ${icon}" style="color: ${color}; font-size: 1.1rem;"></i> <span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => toast.classList.add('show'), 50);

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

/* --- 10. Scroll & Nav --- */
function initScrollEffects() {
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
    });

    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => navMenu.classList.remove('open'));
    });
  }

  const backToTopBtn = document.getElementById('back-to-top');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 350) {
      backToTopBtn?.classList.add('visible');
    } else {
      backToTopBtn?.classList.remove('visible');
    }

    const sections = document.querySelectorAll('section[id]');
    let currentId = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 140;
      const height = sec.offsetHeight;
      if (window.scrollY >= top && window.scrollY < top + height) {
        currentId = sec.getAttribute('id');
      }
    });

    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      }
    });
  });

  backToTopBtn?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* --- 11. Scroll-Driven Smartphone App Showcase --- */
function initShowcaseScroll() {
  const showcase = document.getElementById('showcase');
  if (!showcase) return;

  const textBlocks = document.querySelectorAll('.showcase-text-block');
  const navIcons = document.querySelectorAll('.phone-nav-bar .phone-nav-icon');
  const appContainer = document.getElementById('phone-app-container');

  let currentTranslateY = 0;
  let targetTranslateY = 0;

  function updateShowcase() {
    const rect = showcase.getBoundingClientRect();
    const sectionHeight = rect.height;
    const viewHeight = window.innerHeight;

    // Calculate progress based on relative scroll position inside showcase section
    let progress = 0;
    if (rect.top <= 0) {
      const scrolled = -rect.top;
      const totalScrollable = sectionHeight - viewHeight;
      progress = Math.min(Math.max(scrolled / totalScrollable, 0), 1);
    }

    // Set target translate Y (0% to -75% since container has 4 screens, so shifting by 75% of container height reveals the 4th screen)
    targetTranslateY = progress * -75;

    // Calculate active block index based on progress stage thresholds (0% to 100%)
    let activeIdx = 0;
    if (progress < 0.25) {
      activeIdx = 0;
    } else if (progress >= 0.25 && progress < 0.5) {
      activeIdx = 1;
    } else if (progress >= 0.5 && progress < 0.75) {
      activeIdx = 2;
    } else {
      activeIdx = 3;
    }

    // Update active state on text blocks
    textBlocks.forEach((block, idx) => {
      if (idx === activeIdx) {
        block.classList.add('active');
      } else {
        block.classList.remove('active');
      }
    });

    // Update active state on phone navigation icons
    navIcons.forEach((icon, idx) => {
      if (idx === activeIdx) {
        icon.classList.add('active');
      } else {
        icon.classList.remove('active');
      }
    });
  }

  // Smooth lerp (linear interpolation) animation loop for high performance scroll physics
  function animateShowcase() {
    const easing = 0.1;
    const diff = targetTranslateY - currentTranslateY;

    if (Math.abs(diff) > 0.01) {
      currentTranslateY += diff * easing;
    } else {
      currentTranslateY = targetTranslateY;
    }

    if (appContainer) {
      appContainer.style.transform = `translate3d(0, ${currentTranslateY}%, 0)`;
    }

    requestAnimationFrame(animateShowcase);
  }

  window.addEventListener('scroll', () => {
    updateShowcase();
  }, { passive: true });

  // Initial calls
  updateShowcase();
  animateShowcase();
}

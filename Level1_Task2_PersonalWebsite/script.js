// ===== Mobile Menu Toggle =====
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.querySelector('.nav-links');

menuToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

// Close mobile menu after clicking a link
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
  });
});

// ===== Typing Effect for Hero Subtitle =====
const typingEl = document.querySelector('.typing-text');
const phrases = [
  'Web Developer & AI Enthusiast',
  'React & Tailwind Builder',
  'Aspiring Full-Stack Developer'
];

let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeLoop() {
  const currentPhrase = phrases[phraseIndex];

  if (!isDeleting) {
    typingEl.textContent = currentPhrase.substring(0, charIndex + 1);
    charIndex++;

    if (charIndex === currentPhrase.length) {
      isDeleting = true;
      setTimeout(typeLoop, 1500);
      return;
    }
  } else {
    typingEl.textContent = currentPhrase.substring(0, charIndex - 1);
    charIndex--;

    if (charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
    }
  }

  setTimeout(typeLoop, isDeleting ? 40 : 80);
}

typeLoop();

// ===== Animate Skill Bars on Scroll =====
const skillSection = document.querySelector('.skills');
const bars = document.querySelectorAll('.bar-fill');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      bars.forEach(bar => {
        bar.style.width = bar.style.width; // triggers transition (already set inline)
      });
      observer.disconnect();
    }
  });
}, { threshold: 0.3 });

if (skillSection) observer.observe(skillSection);

// ===== Active Nav Link Highlight on Scroll =====
const sections = document.querySelectorAll('section');
const navItems = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 100;
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute('id');
    }
  });

  navItems.forEach(item => {
    item.style.color = '';
    if (item.getAttribute('href') === `#${current}`) {
      item.style.color = '#14b8c4';
    }
  });
});


// ===== Scroll Reveal =====

const revealElements = document.querySelectorAll(
  '.hero-content, .hero-visual, .skill-card, .project-card, .stat-box'
);

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {

    if(entry.isIntersecting){

      entry.target.style.opacity = "1";
      entry.target.style.transform = "translateY(0)";

    }

  });
},{
  threshold:0.2
});

revealElements.forEach(el=>{

  el.style.opacity="0";
  el.style.transform="translateY(40px)";
  el.style.transition="all .8s ease";

  revealObserver.observe(el);

});
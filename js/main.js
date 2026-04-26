/* ─── Header scroll ─── */
const header = document.getElementById('header');
if (header) {
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });
}

/* ─── Mobile menu ─── */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');
if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', isOpen);
  });
  document.addEventListener('click', (e) => {
    if (header && !header.contains(e.target)) {
      mobileMenu.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    }
  });
}

/* ─── Scroll reveal ─── */
const reveals = document.querySelectorAll('.reveal');
if (reveals.length && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  reveals.forEach(el => observer.observe(el));
} else {
  reveals.forEach(el => el.classList.add('visible'));
}

/* ─── Contact form (Web3Forms) ─── */
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('.form-submit');
    const alertBox = document.getElementById('form-alert');
    const originalText = btn.textContent;

    btn.disabled = true;
    btn.textContent = 'Envoi en cours…';
    alertBox.style.display = 'none';

    const data = Object.fromEntries(new FormData(contactForm));

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: 'c407e147-fa61-40e1-85bb-65805e42491f',
          subject: 'Nouveau message — Claude Sanchez',
          ...data
        })
      });
      const json = await res.json();
      if (json.success) {
        alertBox.className = 'form-alert success';
        alertBox.textContent = 'Votre message a bien été envoyé. Nous vous recontacterons rapidement.';
        alertBox.style.display = 'block';
        contactForm.reset();
      } else {
        throw new Error('API error');
      }
    } catch {
      alertBox.className = 'form-alert error';
      alertBox.textContent = 'Une erreur est survenue. Veuillez réessayer ou nous appeler directement au 06 46 42 57 88.';
      alertBox.style.display = 'block';
    } finally {
      btn.disabled = false;
      btn.textContent = originalText;
    }
  });
}

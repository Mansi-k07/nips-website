/**
 * New Ideal Public School – script.js
 * Handles: Navbar scroll, mobile menu, scroll reveal,
 *          counter animation, gallery filter + lightbox,
 *          form validation, back-to-top.
 */

/* ── DOM References ─────────────────────────────────────── */
const navbar      = document.getElementById('navbar');
const hamburger   = document.getElementById('hamburger');
const navLinks    = document.getElementById('navLinks');
const backToTop   = document.getElementById('backToTop');
const navLinkEls  = document.querySelectorAll('.nav-link');

/* ============================================================
   NAVBAR — scroll effect + active link tracking
   ============================================================ */
function handleScroll() {
  /* Sticky glass effect */
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  /* Back-to-top visibility */
  if (window.scrollY > 400) {
    backToTop.classList.add('visible');
  } else {
    backToTop.classList.remove('visible');
  }

  /* Active nav link based on section in view */
  const sections = document.querySelectorAll('section[id]');
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) {
      current = sec.getAttribute('id');
    }
  });
  navLinkEls.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
}

window.addEventListener('scroll', handleScroll, { passive: true });

/* ── Mobile hamburger toggle ────────────────────────────── */
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

/* Close mobile menu when a link is clicked */
navLinkEls.forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

/* ── Back to Top ────────────────────────────────────────── */
backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ============================================================
   SCROLL REVEAL — IntersectionObserver
   ============================================================ */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target); // fire once
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ============================================================
   COUNTER ANIMATION — runs once when stats enter viewport
   ============================================================ */
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = 1800; // ms
  const step = 16;       // ~60fps
  const increment = target / (duration / step);
  let current = 0;

  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.textContent = Math.floor(current);
  }, step);
}

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 }
);

document.querySelectorAll('.stat-number[data-target]').forEach(el => {
  counterObserver.observe(el);
});

/* ============================================================
   GALLERY — Filter + Lightbox
   ============================================================ */
const filterBtns   = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('.gallery-item');
const lightbox     = document.getElementById('lightbox');
const lightboxContent = document.getElementById('lightboxContent');
const lightboxClose   = document.getElementById('lightboxClose');

/* Filter buttons */
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    /* Update active state */
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;

    galleryItems.forEach(item => {
      if (filter === 'all' || item.dataset.category === filter) {
        item.classList.remove('hidden');
        /* Re-trigger reveal animation */
        item.classList.remove('visible');
        setTimeout(() => {
          item.classList.add('visible');
        }, 50);
      } else {
        item.classList.add('hidden');
      }
    });
  });
});

/* Lightbox open */
galleryItems.forEach(item => {
  item.addEventListener('click', () => {
    const placeholder = item.querySelector('.gallery-placeholder');
    const caption     = item.querySelector('.gallery-overlay p').textContent;

    /* Build lightbox content (placeholder — replace with <img> when real photos added) */
    lightboxContent.innerHTML = `
      <div style="
        width: min(520px, 90vw);
        aspect-ratio: 4/3;
        border-radius: 16px;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 12px;
        background: ${getComputedStyle(placeholder).background};
        position: relative;
      ">
        <i class="${placeholder.querySelector('i').className}"
           style="font-size:4rem; color:rgba(255,255,255,0.7)"></i>
        <span style="color:rgba(255,255,255,0.7); font-size:1rem; font-weight:500">${caption}</span>
        <div style="
          position:absolute; bottom:0; left:0; right:0;
          padding:14px 20px;
          background:rgba(0,0,0,0.55);
          backdrop-filter:blur(8px);
          font-size:0.9rem;
          color:#fff;
          text-align:center;
          font-family:'Poppins',sans-serif;
        ">${caption}</div>
      </div>
    `;

    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  });
});

/* Lightbox close — button */
lightboxClose.addEventListener('click', closeLightbox);

/* Lightbox close — backdrop click */
lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) closeLightbox();
});

/* Lightbox close — Escape key */
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeLightbox();
});

function closeLightbox() {
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
}

/* ============================================================
   FORM VALIDATION — Admission Form
   ============================================================ */
const admissionForm = document.getElementById('admissionForm');
const formSuccess   = document.getElementById('formSuccess');

if (admissionForm) {
  admissionForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;

    /* Helper */
    function validateField(id, message) {
      const field = document.getElementById(id);
      const errEl = document.getElementById('err-' + id);
      if (!field || !errEl) return;

      const value = field.value.trim();
      if (!value) {
        field.classList.add('error');
        errEl.textContent = message || 'This field is required.';
        valid = false;
      } else {
        field.classList.remove('error');
        errEl.textContent = '';
      }
    }

    function validatePhone(id) {
      const field = document.getElementById(id);
      const errEl = document.getElementById('err-' + id);
      if (!field || !errEl) return;

      const value = field.value.trim();
      if (!value) {
        field.classList.add('error');
        errEl.textContent = 'Phone number is required.';
        valid = false;
      } else if (!/^[6-9]\d{9}$/.test(value)) {
        field.classList.add('error');
        errEl.textContent = 'Enter a valid 10-digit Indian mobile number.';
        valid = false;
      } else {
        field.classList.remove('error');
        errEl.textContent = '';
      }
    }

    /* Validate fields */
    validateField('studentName', 'Student name is required.');
    validateField('dob',         'Date of birth is required.');
    validateField('classApply',  'Please select a class.');
    validateField('parentName',  'Parent / Guardian name is required.');
    validatePhone('phone');

    if (valid) {
      /* Simulate submission */
      const submitBtn = admissionForm.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting…';

      // BACKEND CONNECTION //
      const data = {
        student_name: document.getElementById("studentName").value,
        dob: document.getElementById("dob").value,
        class_apply: document.getElementById("classApply").value,
        parent_name: document.getElementById("parentName").value,
        phone: document.getElementById("phone").value,
        email: document.getElementById("email").value,
        address: document.getElementById("address").value
      };

      fetch("http://127.0.0.1:8000/admission", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      })
      .then(res => res.json())
      .then(result => {
        formSuccess.classList.remove("hidden");
        admissionForm,reset();

        setTimeout(() => formSuccess.classList.add("hidden"), 6000);
      })
      .catch(err => {
        console.error(err);
        alert("Error submitting form");
      })
      .finally(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Submit Enquiry';
      });
    }
  });

  /* Real-time error clearing */
  admissionForm.querySelectorAll('input, select, textarea').forEach(field => {
    field.addEventListener('input', () => {
      field.classList.remove('error');
      const errEl = document.getElementById('err-' + field.id);
      if (errEl) errEl.textContent = '';
    });
  });
}

/* ============================================================
   FORM VALIDATION — Contact Form
   ============================================================ */
const contactForm    = document.getElementById('contactForm');
const contactSuccess = document.getElementById('contactSuccess');

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;

    function validateField(id, msg) {
      const field = document.getElementById(id);
      const errEl = document.getElementById('err-' + id);
      if (!field || !errEl) return;
      if (!field.value.trim()) {
        field.classList.add('error');
        errEl.textContent = msg || 'Required.';
        valid = false;
      } else {
        field.classList.remove('error');
        errEl.textContent = '';
      }
    }

    function validatePhone(id) {
      const field = document.getElementById(id);
      const errEl = document.getElementById('err-' + id);
      if (!field || !errEl) return;
      const v = field.value.trim();
      if (!v) {
        field.classList.add('error');
        errEl.textContent = 'Phone is required.';
        valid = false;
      } else if (!/^[6-9]\d{9}$/.test(v)) {
        field.classList.add('error');
        errEl.textContent = 'Enter a valid 10-digit mobile number.';
        valid = false;
      } else {
        field.classList.remove('error');
        errEl.textContent = '';
      }
    }

    validateField('cName',    'Name is required.');
    validatePhone('cPhone');
    validateField('cSubject', 'Please select a subject.');
    validateField('cMessage', 'Message cannot be empty.');

    if (valid) {
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending…';

      const data = {
        name: document.getElementById("cNmae").value,
        phone: document.getElementById("cPhone").value,
        subject: document.getElementById("cSubject").value,
        message: document.getElementById("cMessage").value
      };

      fetch("http://127.0.0.1:8000/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringfy(data)
      })
      .then(res => res.json())
      .then(result => {
        contactSuccess.classList.remove('hidden');
        contactForm.reset();

        setTimeout(() => contactSuccess.classList.add('hidden'), 6000);
      })
      .catch(err => {
        console.error(err);
        alert("Error sending message");
      })
      .finally(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
      });
    }
  });

  /* Real-time error clearing */
  contactForm.querySelectorAll('input, select, textarea').forEach(field => {
    field.addEventListener('input', () => {
      field.classList.remove('error');
      const errEl = document.getElementById('err-' + field.id);
      if (errEl) errEl.textContent = '';
    });
  });
}

/* ============================================================
   SMOOTH SCROLL — handle internal anchor links
   ============================================================ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = target.getBoundingClientRect().top + window.scrollY - (parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 72);
    window.scrollTo({ top: offset, behavior: 'smooth' });
  });
});

/* ── Init on page load ──────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  handleScroll(); /* Set initial state */
  console.log('✅ New Ideal Public School website loaded successfully.');
});

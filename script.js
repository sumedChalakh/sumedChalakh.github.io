
```javascript
// ============================================
// SUMED CHALAKH - JUNIOR DATA SCIENTIST
// Portfolio JavaScript - Updated for Resume
// ============================================

// 1. THEME TOGGLE (No localStorage for Claude.ai)
const themeToggle = document.getElementById("theme-toggle");
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");
let currentTheme = prefersDark.matches ? "dark" : "light";

const setTheme = (mode) => {
  document.body.classList.toggle("light", mode === "light");
  if (themeToggle) {
    const icon = themeToggle.querySelector(".theme-icon");
    if (icon) {
      icon.textContent = mode === "light" ? "☀️" : "🌙";
    }
  }
  currentTheme = mode;
};

setTheme(prefersDark.matches ? "dark" : "light");
prefersDark.addEventListener("change", (event) => {
  setTheme(event.matches ? "dark" : "light");
});

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const nextTheme = currentTheme === "light" ? "dark" : "light";
    setTheme(nextTheme);
  });
}

// 2. MOBILE NAVIGATION
const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.querySelector(".nav-links");

if (navToggle && navMenu) {
  navToggle.addEventListener("click", () => {
    const isOpen = navMenu.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", isOpen);
  });

  navMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
}

// 3. SMOOTH SCROLL
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    const href = this.getAttribute("href");
    if (href !== "#" && document.querySelector(href)) {
      e.preventDefault();
      document.querySelector(href).scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
});

// 4. SCROLL REVEAL ANIMATIONS
const revealElements = document.querySelectorAll(
  ".section, .project-card, .skill-card, .about-card, .timeline-item"
);

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
);

revealElements.forEach((element) => {
  element.classList.add("reveal");
  observer.observe(element);
});

// 5. CONTACT FORM
const contactForm = document.querySelector(".contact-form");

if (contactForm) {
  contactForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const name = this.querySelector('input[name="name"]').value.trim();
    const email = this.querySelector('input[name="email"]').value.trim();
    const message = this.querySelector('textarea[name="message"]').value.trim();

    if (!name || !email || !message) {
      alert("Please fill in all fields.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Please enter a valid email address.");
      return;
    }

    const submitBtn = this.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;

    submitBtn.textContent = "✓ Message sent!";
    submitBtn.disabled = true;

    console.log("Contact Form:", { name, email, message });

    setTimeout(() => {
      this.reset();
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }, 2000);
  });
}

// 6. ACTIVE NAV HIGHLIGHTING
const navLinks = document.querySelectorAll(".nav-links a");
const sections = document.querySelectorAll(".section");

window.addEventListener("scroll", () => {
  let current = "";

  sections.forEach((section) => {
    if (window.pageYOffset >= section.offsetTop - 200) {
      current = section.getAttribute("id");
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href").slice(1) === current) {
      link.classList.add("active");
    }
  });
});

// 7. BACK TO TOP
const backToTop = document.querySelector(".back-to-top");
if (backToTop) {
  window.addEventListener("scroll", () => {
    backToTop.style.opacity = window.pageYOffset > 300 ? "1" : "0";
    backToTop.style.pointerEvents = window.pageYOffset > 300 ? "auto" : "none";
  });
  backToTop.addEventListener("click", (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

// 8. KEYBOARD SHORTCUTS
document.addEventListener("keydown", (e) => {
  if (e.key.toLowerCase() === "t" && e.ctrlKey && themeToggle) {
    e.preventDefault();
    themeToggle.click();
  }
  if (e.key === "Escape" && navMenu) {
    navMenu.classList.remove("open");
    navToggle?.setAttribute("aria-expanded", "false");
  }
});

// 9. INITIALIZATION
console.log("🚀 Sumed Chalakh's Portfolio Loaded");
console.log("Junior Data Scientist | ML Specialist");
console.log("📧 sumedchalakh528@gmail.com");
```


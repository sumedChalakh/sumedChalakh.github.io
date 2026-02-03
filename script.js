 (cd "$(git rev-parse --show-toplevel)" && git apply --3way <<'EOF' 
diff --git a/script.js b/script.js
new file mode 100644
index 0000000000000000000000000000000000000000..ee6d69aeac1928081a3df79bd722f889b30c87f6
--- /dev/null
+++ b/script.js
@@ -0,0 +1,77 @@
+// Theme toggle with localStorage persistence
+const themeToggle = document.getElementById("theme-toggle");
+const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");
+
+const setTheme = (mode) => {
+  document.body.classList.toggle("light", mode === "light");
+  if (themeToggle) {
+    themeToggle.querySelector(".theme-icon").textContent = mode === "light" ? "☀️" : "🌙";
+  }
+  localStorage.setItem("theme", mode);
+};
+
+const storedTheme = localStorage.getItem("theme");
+if (storedTheme) {
+  setTheme(storedTheme);
+} else {
+  setTheme(prefersDark.matches ? "dark" : "light");
+}
+
+prefersDark.addEventListener("change", (event) => {
+  if (!localStorage.getItem("theme")) {
+    setTheme(event.matches ? "dark" : "light");
+  }
+});
+
+if (themeToggle) {
+  themeToggle.addEventListener("click", () => {
+    const nextTheme = document.body.classList.contains("light") ? "dark" : "light";
+    setTheme(nextTheme);
+  });
+}
+
+// Mobile navigation
+const navToggle = document.querySelector(".nav-toggle");
+const navMenu = document.querySelector(".nav-links");
+
+if (navToggle && navMenu) {
+  navToggle.addEventListener("click", () => {
+    const isOpen = navMenu.classList.toggle("open");
+    navToggle.setAttribute("aria-expanded", isOpen);
+  });
+
+  navMenu.querySelectorAll("a").forEach((link) => {
+    link.addEventListener("click", () => {
+      navMenu.classList.remove("open");
+      navToggle.setAttribute("aria-expanded", "false");
+    });
+  });
+}
+
+// Scroll reveal animations
+const revealElements = document.querySelectorAll(".section, .project-card, .skill-card, .about-card");
+const observer = new IntersectionObserver(
+  (entries) => {
+    entries.forEach((entry) => {
+      if (entry.isIntersecting) {
+        entry.target.classList.add("visible");
+      }
+    });
+  },
+  { threshold: 0.15 }
+);
+
+revealElements.forEach((element) => {
+  element.classList.add("reveal");
+  observer.observe(element);
+});
+
+// Contact form interaction (basic demo)
+const contactForm = document.querySelector(".contact-form");
+if (contactForm) {
+  contactForm.addEventListener("submit", (event) => {
+    event.preventDefault();
+    contactForm.reset();
+    alert("Thanks for reaching out! I'll get back to you soon.");
+  });
+}
 
EOF
)

// Mobile Navigation Toggle with Animation
const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-menu");

hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("active");
  navMenu.classList.toggle("active");
  
  // Add slight body blur when menu is active (mobile only)
  if (window.innerWidth <= 768) {
    if (hamburger.classList.contains("active")) {
      document.body.style.overflow = "hidden";
      document.querySelectorAll('section').forEach(section => {
        section.style.filter = "blur(5px)";
        section.style.transition = "filter 0.3s ease";
      });
    } else {
      document.body.style.overflow = "";
      document.querySelectorAll('section').forEach(section => {
        section.style.filter = "";
      });
    }
  }
});

// Close mobile menu when resizing to desktop
window.addEventListener("resize", () => {
  if (window.innerWidth > 768 && navMenu.classList.contains("active")) {
    hamburger.classList.remove("active");
    navMenu.classList.remove("active");
    document.body.style.overflow = "";
    document.querySelectorAll('section').forEach(section => {
      section.style.filter = "";
    });
  }
});

// Close mobile menu when clicking on a link
document.querySelectorAll(".nav-link").forEach((n) =>
  n.addEventListener("click", () => {
    hamburger.classList.remove("active");
    navMenu.classList.remove("active");
  })
);

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
});

// Enhanced navbar effects on scroll
window.addEventListener("scroll", () => {
  const navbar = document.querySelector(".navbar");
  const scrollPosition = window.scrollY;
  
  if (scrollPosition > 100) {
    navbar.classList.add("scrolled");
    
    // Change logo color intensity based on scroll depth (up to a point)
    const logoOpacity = Math.min(1, 0.7 + (scrollPosition - 100) / 500);
    document.querySelector('.nav-logo span').style.opacity = logoOpacity;
    
    // Add subtle shadow that intensifies with scroll
    const shadowIntensity = Math.min(0.15, 0.05 + (scrollPosition / 5000));
    navbar.style.boxShadow = `0 4px 20px rgba(0, 0, 0, ${shadowIntensity})`;
  } else {
    navbar.classList.remove("scrolled");
    document.querySelector('.nav-logo span').style.opacity = 0.9;
    navbar.style.boxShadow = "none";
  }
});

// Active navigation link highlighting
window.addEventListener("scroll", () => {
  let current = "";
  const sections = document.querySelectorAll("section");

  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    if (scrollY >= sectionTop - 200) {
      current = section.getAttribute("id");
    }
  });

  document.querySelectorAll(".nav-link").forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href").slice(1) === current) {
      link.classList.add("active");
    }
  });
});

// Enhanced Intersection Observer for staggered animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
};

// Creates a staggered animation delay for grouped elements
function createStaggeredAnimations(elements, baseDelay = 0, increment = 0.1) {
  elements.forEach((el, index) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(30px)";
    el.style.transition = "all 0.6s cubic-bezier(0.215, 0.61, 0.355, 1)";
    el.style.transitionDelay = `${baseDelay + (index * increment)}s`;
  });
}

// Main observer for section elements
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      // If this is a container with multiple items that should stagger
      if (entry.target.classList.contains('skills-grid') || 
          entry.target.classList.contains('projects-grid') ||
          entry.target.classList.contains('timeline')) {
        
        // Handle different animation directions based on element type
        const childElements = entry.target.children;
        Array.from(childElements).forEach((el, index) => {
          el.style.opacity = "1";
          el.style.transform = "translateY(0)";
        });
      } else {
        // Standard animation for single elements
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
      }
    }
  });
}, observerOptions);

// Set up animations for different element types
document.addEventListener('DOMContentLoaded', () => {
  // Project cards with right-to-left stagger
  const projectCards = document.querySelectorAll('.project-card');
  createStaggeredAnimations(projectCards, 0.1, 0.15);
  
  // Skill categories with bottom-to-top stagger
  const skillCategories = document.querySelectorAll('.skill-category');
  createStaggeredAnimations(skillCategories, 0.1, 0.2);
  
  // Timeline items with top-to-bottom sequence
  const timelineItems = document.querySelectorAll('.timeline-item');
  createStaggeredAnimations(timelineItems, 0.1, 0.15);
  
  // Observe containers and individual elements
  document.querySelectorAll(
    '.timeline-item, .project-card, .skill-category, .skills-grid, .projects-grid, .timeline, .contact-info, .contact-form'
  ).forEach(el => {
    observer.observe(el);
  });
});


// Enhanced contact form handling with visual feedback
const contactForm = document.querySelector(".contact-form");
if (contactForm) {
  // Add animation to form fields on focus
  const formFields = contactForm.querySelectorAll('input, textarea');
  formFields.forEach(field => {
    field.addEventListener('focus', function() {
      this.parentElement.classList.add('focused');
    });
    
    field.addEventListener('blur', function() {
      if (this.value === '') {
        this.parentElement.classList.remove('focused');
      }
    });
    
    // Initialize with 'focused' class if field has content
    if (field.value !== '') {
      field.parentElement.classList.add('focused');
    }
  });
  
  // Handle form submission with enhanced feedback
  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();

    // Get form data
    const formData = new FormData(this);
    const name = formData.get("name");
    const email = formData.get("email");
    const message = formData.get("message");

    // Create feedback element if it doesn't exist
    let feedbackEl = contactForm.querySelector('.form-feedback');
    if (!feedbackEl) {
      feedbackEl = document.createElement('div');
      feedbackEl.className = 'form-feedback';
      contactForm.appendChild(feedbackEl);
    }

    // Basic validation with visual feedback
    if (!name || !email || !message) {
      feedbackEl.textContent = "Please fill in all fields";
      feedbackEl.className = 'form-feedback error';
      feedbackEl.style.display = 'block';
      
      // Highlight empty fields
      formFields.forEach(field => {
        if (!field.value) {
          field.classList.add('error');
        }
      });
      return;
    }

    // Email validation with visual feedback
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      feedbackEl.textContent = "Please enter a valid email address";
      feedbackEl.className = 'form-feedback error';
      feedbackEl.style.display = 'block';
      contactForm.querySelector('#email').classList.add('error');
      return;
    }

    // Clear any previous errors
    formFields.forEach(field => field.classList.remove('error'));

    // Update submit button with loading state
    const submitBtn = this.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.innerHTML = `<span class="loading-spinner"></span> Sending...`;
    submitBtn.disabled = true;
    submitBtn.classList.add('loading');

    // Simulate API call delay with success feedback
    setTimeout(() => {
      // Show success message
      feedbackEl.textContent = "Thank you for your message! I'll get back to you soon.";
      feedbackEl.className = 'form-feedback success';
      feedbackEl.style.display = 'block';
      
      // Reset form
      this.reset();
      formFields.forEach(field => field.parentElement.classList.remove('focused'));
      
      // Restore button
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
      submitBtn.classList.remove('loading');
      
      // Hide success message after a delay
      setTimeout(() => {
        feedbackEl.style.display = 'none';
      }, 5000);
    }, 2000);
  });
}

// Add custom form styles
const formStyles = document.createElement('style');
formStyles.textContent = `
  .form-group {
    position: relative;
    margin-bottom: 1.5rem;
  }
  
  .form-group.focused label {
    top: -12px;
    left: 12px;
    font-size: 0.8rem;
    padding: 0 5px;
    background: white;
    color: var(--primary-color);
  }
  
  .form-feedback {
    padding: 12px 16px;
    margin-top: 1rem;
    border-radius: 8px;
    font-weight: 500;
    display: none;
  }
  
  .form-feedback.error {
    background-color: rgba(239, 68, 68, 0.1);
    color: #ef4444;
    border: 1px solid rgba(239, 68, 68, 0.2);
  }
  
  .form-feedback.success {
    background-color: rgba(34, 197, 94, 0.1);
    color: #22c55e;
    border: 1px solid rgba(34, 197, 94, 0.2);
  }
  
  input.error, textarea.error {
    border-color: #ef4444 !important;
  }
  
  .loading-spinner {
    display: inline-block;
    width: 16px;
    height: 16px;
    border: 2px solid rgba(255,255,255,0.3);
    border-radius: 50%;
    border-top-color: white;
    animation: spin 1s ease-in-out infinite;
    margin-right: 8px;
  }
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;
document.head.appendChild(formStyles);

// Enhanced typing animation with cursor effect
function typeWriter(element, text, speed = 100) {
  let i = 0;
  element.innerHTML = "";
  element.style.position = "relative";
  
  // Create cursor element
  const cursor = document.createElement('span');
  cursor.className = 'typing-cursor';
  cursor.innerHTML = '|';
  cursor.style.position = "relative";
  cursor.style.animation = "blink 1s step-end infinite";
  element.parentNode.appendChild(cursor);

  function type() {
    if (i < text.length) {
      // Special handling for the highlight span
      if (text.substring(i).startsWith('<span class="highlight">')) {
        const endIndex = text.indexOf('</span>', i) + 7;
        const spanContent = text.substring(i, endIndex);
        element.innerHTML += spanContent;
        i = endIndex;
      } else {
        element.innerHTML += text.charAt(i);
        i++;
      }
      
      // Position cursor after the current text
      const rect = element.getBoundingClientRect();
      cursor.style.marginLeft = "5px";
      
      setTimeout(type, speed);
    } else {
      // Keep cursor blinking at the end
      setTimeout(() => {
        cursor.style.animation = "blink 1s step-end infinite";
      }, 1000);
    }
  }

  type();
  
  // Add cursor animation style
  const cursorStyle = document.createElement('style');
  cursorStyle.textContent = `
    @keyframes blink {
      from, to { opacity: 1; }
      50% { opacity: 0; }
    }
    
    .typing-cursor {
      color: var(--primary-color);
      font-weight: 700;
    }
  `;
  document.head.appendChild(cursorStyle);
}

// Initialize enhanced typing animation with delay
window.addEventListener("load", () => {
  // Wait a bit to let the page render first
  setTimeout(() => {
    const heroTitle = document.querySelector(".hero-title");
    if (heroTitle) {
      const originalText = heroTitle.textContent;
      typeWriter(heroTitle, originalText, 60);
    }
  }, 500);
});

// Skill tags hover effect
document.querySelectorAll(".skill-tag").forEach((tag) => {
  tag.addEventListener("mouseenter", function () {
    this.style.transform = "translateY(-3px) scale(1.05)";
  });

  tag.addEventListener("mouseleave", function () {
    this.style.transform = "translateY(0) scale(1)";
  });
});

// Project cards tilt effect
document.querySelectorAll(".project-card").forEach((card) => {
  card.addEventListener("mouseenter", function (e) {
    this.style.transform = "translateY(-10px) rotateX(5deg)";
  });

  card.addEventListener("mouseleave", function () {
    this.style.transform = "translateY(0) rotateX(0)";
  });
});

// Enhanced parallax effects for hero section
window.addEventListener("scroll", () => {
  const scrolled = window.pageYOffset;
  const hero = document.querySelector(".hero");
  const heroContent = document.querySelector(".hero-content");
  const heroImage = document.querySelector(".hero-image");
  
  if (hero && scrolled < hero.offsetHeight) {
    // Subtle parallax for the entire hero section
    const speed = scrolled * 0.3;
    hero.style.transform = `translateY(${speed}px)`;
    
    // Counter-parallax for hero content (moves slower)
    if (heroContent) {
      heroContent.style.transform = `translateY(${scrolled * 0.1}px)`;
      heroContent.style.opacity = 1 - (scrolled * 0.002);
    }
    
    // Different parallax rate for the hero image (moves faster)
    if (heroImage) {
      heroImage.style.transform = `translateY(${scrolled * -0.15}px)`;
    }
    
    // Parallax for decorative elements
    document.querySelectorAll('.hero::before, .hero::after').forEach(el => {
      el.style.transform = `translate(-30%, 30%) translateY(${scrolled * -0.2}px)`;
    });
  }
  
  // Add parallax to section titles for subtle movement
  document.querySelectorAll('.section-title').forEach(title => {
    const titlePosition = title.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;
    
    if (titlePosition < windowHeight && titlePosition > 0) {
      const parallaxValue = (windowHeight - titlePosition) * 0.05;
      title.style.transform = `translateX(-50%) translateY(${-parallaxValue}px)`;
    }
  });
});

// Dynamic greeting based on time
function updateGreeting() {
  const now = new Date();
  const hour = now.getHours();
  let greeting;

  if (hour < 12) {
    greeting = "Good morning!";
  } else if (hour < 18) {
    greeting = "Good afternoon!";
  } else {
    greeting = "Good evening!";
  }

  // Add greeting to contact section if needed
  const contactInfo = document.querySelector(".contact-info");
  if (contactInfo && !contactInfo.querySelector(".greeting")) {
    const greetingElement = document.createElement("p");
    greetingElement.className = "greeting";
    greetingElement.textContent = greeting;
    greetingElement.style.fontWeight = "600";
    greetingElement.style.color = "var(--primary-color)";
    greetingElement.style.marginBottom = "1rem";
    contactInfo.insertBefore(greetingElement, contactInfo.firstChild);
  }
}

// Initialize greeting
updateGreeting();

// Add loading animation
window.addEventListener("load", () => {
  document.body.classList.add("loaded");
});

// Add CSS for loading state
const style = document.createElement("style");
style.textContent = `
    body:not(.loaded) {
        overflow: hidden;
    }
    
    body:not(.loaded)::before {
        content: '';
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: white;
        z-index: 9999;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .nav-link.active {
        color: var(--primary-color);
    }
    
    .nav-link.active::after {
        width: 100%;
    }
`;
document.head.appendChild(style);

// ===== Mobile Menu Toggle =====
const mobileMenuBtn = document.getElementById('mobile-menu');
const mobileOverlay = document.getElementById('mobile-overlay');
const overlayClose = document.getElementById('overlay-close');

mobileMenuBtn.addEventListener('click', () => {
  mobileOverlay.classList.add('open');
});
overlayClose.addEventListener('click', () => {
  mobileOverlay.classList.remove('open');
});

// Close overlay menu when clicking a link
document.querySelectorAll('.overlay-link').forEach(link => {
  link.addEventListener('click', () => {
    mobileOverlay.classList.remove('open');
  });
});

// ===== Smooth Scroll for nav links =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute('href')).scrollIntoView({
      behavior: 'smooth'
    });
  });
});

// ===== Navbar background change on scroll =====
window.addEventListener('scroll', function() {
  const header = document.querySelector('header');
  if (window.scrollY > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});

// ===== Hero Slideshow =====
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');

function showSlide(index) {
  slides.forEach((slide, i) => {
    slide.style.opacity = (i === index) ? '1' : '0';
  });
}

function nextSlide() {
  currentSlide = (currentSlide + 1) % slides.length;
  showSlide(currentSlide);
}

if (slides.length) {
  showSlide(currentSlide);
  setInterval(nextSlide, 5000);
}

// ===== Active Menu Highlight on Scroll =====
const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll(".nav-link");

window.addEventListener("scroll", () => {
  let current = "";

  sections.forEach(section => {
    const sectionTop = section.offsetTop - 70;
    const sectionHeight = section.clientHeight;
    if (pageYOffset >= sectionTop && pageYOffset < sectionTop + sectionHeight) {
      current = section.getAttribute("id");
    }
  });

  navLinks.forEach(link => {
    link.classList.remove("active");
    if (link.getAttribute("href") === `#${current}`) {
      link.classList.add("active");
    }
  });
});

// ===== Scroll-triggered animations =====
const animatedElements = document.querySelectorAll('[data-animate]');
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

animatedElements.forEach(el => observer.observe(el));

// ===== Gallery Lightbox =====
const galleryImages = document.querySelectorAll('.gallery-slide img');

const lightbox = document.createElement('div');
lightbox.id = 'lightbox';
document.body.appendChild(lightbox);

lightbox.style.position = 'fixed';
lightbox.style.top = '0';
lightbox.style.left = '0';
lightbox.style.width = '100%';
lightbox.style.height = '100%';
lightbox.style.background = 'rgba(0,0,0,0.9)';
lightbox.style.display = 'none';
lightbox.style.alignItems = 'center';
lightbox.style.justifyContent = 'center';
lightbox.style.zIndex = '9999';

lightbox.addEventListener('click', () => {
  lightbox.style.display = 'none';
  lightbox.innerHTML = '';
});

galleryImages.forEach(img => {
  img.addEventListener('click', () => {
    const imgClone = document.createElement('img');
    imgClone.src = img.src;
    imgClone.style.maxWidth = '90%';
    imgClone.style.maxHeight = '90%';
    imgClone.style.boxShadow = '0 0 20px rgba(255,255,255,0.8)';
    lightbox.innerHTML = '';
    lightbox.appendChild(imgClone);
    lightbox.style.display = 'flex';
  });
});

// ===== Gallery Carousel =====
const galleryCarousel = document.querySelector('.gallery-carousel');
const prevBtn = document.querySelector('.gallery-nav.prev');
const nextBtn = document.querySelector('.gallery-nav.next');

let autoSlideInterval;
let currentGalleryIndex = 0;

// Helper: scroll to specific slide index
function scrollToSlide(index) {
  const slideWidth = galleryCarousel.clientWidth;
  galleryCarousel.scrollTo({
    left: slideWidth * index,
    behavior: 'smooth'
  });
}

// Auto-slide (mobile only)
function startAutoSlide() {
  autoSlideInterval = setInterval(() => {
    currentGalleryIndex++;
    if (currentGalleryIndex >= galleryImages.length) {
      currentGalleryIndex = 0;
    }
    scrollToSlide(currentGalleryIndex);
  }, 5000);
}
function stopAutoSlide() {
  clearInterval(autoSlideInterval);
}

// Arrow navigation
if (prevBtn && nextBtn) {
  prevBtn.addEventListener('click', () => {
    stopAutoSlide();
    currentGalleryIndex = (currentGalleryIndex - 1 + galleryImages.length) % galleryImages.length;
    scrollToSlide(currentGalleryIndex);
    if (window.innerWidth <= 1024) startAutoSlide();
  });

  nextBtn.addEventListener('click', () => {
    stopAutoSlide();
    currentGalleryIndex = (currentGalleryIndex + 1) % galleryImages.length;
    scrollToSlide(currentGalleryIndex);
    if (window.innerWidth <= 1024) startAutoSlide();
  });
}

// Touch swipe (mobile only)
if (window.innerWidth <= 1024) {
  let isDragging = false;
  let startX;
  let scrollLeft;

  galleryCarousel.addEventListener('touchstart', e => {
    isDragging = true;
    startX = e.touches[0].pageX;
    scrollLeft = galleryCarousel.scrollLeft;
    stopAutoSlide();
  });

  galleryCarousel.addEventListener('touchend', () => {
    isDragging = false;
    startAutoSlide();
  });

  galleryCarousel.addEventListener('touchmove', e => {
    if (!isDragging) return;
    const x = e.touches[0].pageX;
    const walk = (x - startX);
    galleryCarousel.scrollLeft = scrollLeft - walk;
  });

  // Start auto-slide for mobile
  startAutoSlide();
}

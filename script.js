// ========== DARK MODE TOGGLE ==========
const darkModeToggle = document.getElementById('darkmodeToggleBtn');
const body = document.body;

const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
  body.classList.add('dark');
  updateToggleIcon(true);
} else {
  body.classList.remove('dark');
  updateToggleIcon(false);
}

darkModeToggle.addEventListener('click', () => {
  body.classList.toggle('dark');
  const isDark = body.classList.contains('dark');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
  updateToggleIcon(isDark);
});

function updateToggleIcon(isDark) {
  const icon = darkModeToggle.querySelector('i');
  if (isDark) {
    icon.classList.remove('fa-moon');
    icon.classList.add('fa-sun');
  } else {
    icon.classList.remove('fa-sun');
    icon.classList.add('fa-moon');
  }
}

// ========== CAROUSEL DATA (Gamit ang iyong folder structure) ==========
// IMPORTANTE: Palitan ang mga filename sa ibaba ng aktwal na pangalan ng iyong images.
// Siguraduhing nasa tamang folder ang mga ito: DESIGNS/Graphic, DESIGNS/GRAPHIC, DESIGNS/LOGO

const imageDatabase = {
  ui: [],        // 12 images mula sa DESIGNS/UI/
  graphic: [],   // 21 images mula sa DESIGNS/GRAPHIC/
  logo: []       // 6 images mula sa DESIGNS/LOGO/
};

// ---------- UI DESIGN (12 images) ----------
// Isulat dito ang eksaktong pangalan ng bawat UI image file mo.
// Halimbawa: 'DESIGNS/UI/homepage.jpg', 'DESIGNS/UI/dashboard.png', etc.
imageDatabase.ui = [
  'Picsart_24-09-21_12-12-31-755.jpg',
  'Picsart_24-09-21_12-22-11-125.jpg',
  'Picsart_24-09-21_12-33-14-962.jpg',
  'Picsart_24-09-25_11-13-57-508.jpg',
  'Picsart_24-09-25_11-22-50-644.jpg',
  'Picsart_24-09-25_12-46-00-280.jpg',
  'Picsart_24-10-17_11-04-31-797.jpg',
  'Picsart_24-10-17_11-09-31-374.jpg',
  'Picsart_24-10-17_11-13-17-265.jpg',
  'Picsart_24-10-17_11-16-29-287.jpg',
  'Picsart_24-10-17_11-19-34-647.jpg',
  'Picsart_24-11-30_18-39-55-844.jpg'
];

imageDatabase.graphic = [
  'FB_IMG_1771754014126.jpg',
  'Picsart_25-02-08_20-00-44-126.jpg',
  'Picsart_25-04-07_19-24-05-386.jpg',
  'Picsart_25-04-09_08-19-54-004.jpg',
  'Picsart_25-04-09_13-19-31-085.jpg',
  'Picsart_25-05-08_19-16-02-414.jpg',
  'Picsart_25-05-10_11-17-18-466.jpg',
  'Picsart_25-05-10_11-59-47-195.jpg',
  'Picsart_25-05-11_17-36-24-886.jpg',
  'Picsart_25-06-12_10-05-10-728.jpg',
  'Picsart_26-01-05_16-38-44-573.png',
  'Picsart_26-02-22_18-03-20-806.jpg',
  'received_1007597001532884.jpeg',
  'received_1289527565804571.jpeg',
  'received_1645807606025081.jpeg',
  'received_2044557325919651.jpeg',
  'received_2168172663655833.jpeg',
  'received_401192048953185.jpeg',
  'received_8036803483079105.jpeg',
  'received_818026505587623.jpeg',
  'received_928320815995629.jpeg'
];
// ---------- LOGO DESIGNS (6 images) ----------
// Ilagay ang mga path ng 6 na logo images
imageDatabase.logo = [
  'Picsart_25-02-09_19-23-29-633.jpg',
  'received_1439160897023187.jpeg',
  'received_218016564266247.jpeg',
  'received_289091387357166.jpeg',
  'received_299427609643115.jpeg',
  'received_688965639247787.jpeg'
];

// ========== CAROUSEL GLOBALS ==========
let currentCategory = 'ui';    // default category
let currentIndex = 0;
let totalSlides = 0;
let slides = [];

const carouselTrack = document.getElementById('carouselTrack');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const dotsContainer = document.getElementById('carouselDots');

// Build carousel slides from image array
function buildCarousel(category) {
  const images = imageDatabase[category];
  if (!images || images.length === 0) {
    console.error(`Walang images para sa category: ${category}`);
    carouselTrack.innerHTML = '<div class="carousel-slide" style="justify-content:center; text-align:center; padding:3rem;">⚠️ Walang nakitang images. Pakisiguradong may laman ang folder at tama ang mga path sa script.</div>';
    dotsContainer.innerHTML = '';
    totalSlides = 1;
    currentIndex = 0;
    return;
  }
  
  totalSlides = images.length;
  currentIndex = 0;
  
  // Clear track and dots
  carouselTrack.innerHTML = '';
  dotsContainer.innerHTML = '';
  
  // Create slides
  images.forEach((src, idx) => {
    const slide = document.createElement('div');
    slide.className = 'carousel-slide';
    const img = document.createElement('img');
    img.src = src;
    img.alt = `${category} design ${idx + 1}`;
    img.loading = 'lazy';
    // Optional: kung may error sa pag-load ng image, display fallback
    img.onerror = function() {
      this.src = 'https://via.placeholder.com/800x600?text=Image+Not+Found';
      this.alt = 'Missing image';
    };
    slide.appendChild(img);
    carouselTrack.appendChild(slide);
  });
  
  slides = document.querySelectorAll('.carousel-slide');
  
  // Create dots
  for (let i = 0; i < totalSlides; i++) {
    const dot = document.createElement('div');
    dot.classList.add('dot');
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goToSlide(i));
    dotsContainer.appendChild(dot);
  }
  
  updateCarouselPosition();
  updateDots();
  toggleArrowVisibility();
}

// Update track transform
function updateCarouselPosition() {
  if (!carouselTrack) return;
  carouselTrack.style.transform = `translateX(-${currentIndex * 100}%)`;
}

// Go to specific slide
function goToSlide(index) {
  if (index < 0) index = 0;
  if (index >= totalSlides) index = totalSlides - 1;
  currentIndex = index;
  updateCarouselPosition();
  updateDots();
  toggleArrowVisibility();
}

function nextSlide() {
  if (currentIndex + 1 < totalSlides) {
    goToSlide(currentIndex + 1);
  }
}

function prevSlide() {
  if (currentIndex - 1 >= 0) {
    goToSlide(currentIndex - 1);
  }
}

function updateDots() {
  const dots = document.querySelectorAll('.dot');
  dots.forEach((dot, idx) => {
    if (idx === currentIndex) dot.classList.add('active');
    else dot.classList.remove('active');
  });
}

function toggleArrowVisibility() {
  if (prevBtn && nextBtn) {
    prevBtn.style.opacity = currentIndex === 0 ? '0.4' : '1';
    nextBtn.style.opacity = currentIndex === totalSlides - 1 ? '0.4' : '1';
  }
}

// Adjust carousel position on window resize
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    updateCarouselPosition();
  }, 150);
});

// ========== CATEGORY SWITCH (UI, Graphic, Logo) ==========
const categoryBtns = document.querySelectorAll('.filter-btn');
categoryBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    // Update active class
    categoryBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    // Get category
    const category = btn.getAttribute('data-category');
    if (category === 'ui') currentCategory = 'ui';
    else if (category === 'graphic') currentCategory = 'graphic';
    else if (category === 'logo') currentCategory = 'logo';
    
    // Rebuild carousel
    buildCarousel(currentCategory);
  });
});

// Attach event listeners for arrows
if (prevBtn) prevBtn.addEventListener('click', prevSlide);
if (nextBtn) nextBtn.addEventListener('click', nextSlide);

// Initialize default carousel (UI Design)
buildCarousel('ui');

// ========== SMOOTH SCROLLING FOR NAVIGATION LINKS ==========
const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(link => {
  link.addEventListener('click', function(e) {
    e.preventDefault();
    const targetId = this.getAttribute('href').substring(1);
    const targetSection = document.getElementById(targetId);
    if (targetSection) {
      targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// Hero button "View projects" smooth scroll
const viewProjectsBtn = document.querySelector('.hero-buttons .btn-primary');
if (viewProjectsBtn && viewProjectsBtn.getAttribute('href') === '#work') {
  viewProjectsBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const workSection = document.getElementById('work');
    if (workSection) workSection.scrollIntoView({ behavior: 'smooth' });
  });
}

// Contact form demo alert
const contactForm = document.getElementById('dummyForm');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const nameInput = contactForm.querySelector('input[type="text"]');
    const emailInput = contactForm.querySelector('input[type="email"]');
    if (nameInput.value.trim() === '' || emailInput.value.trim() === '') {
      alert('✨ Pakilagay ang iyong pangalan at email address.');
    } else {
      alert(`Salamat ${nameInput.value.trim()}! Naipadala na ang iyong mensahe. Magsa-response ako sa lalong madaling panahon.`);
      contactForm.reset();
    }
  });
}

// Optional: Log kung ilang images ang na-load sa bawat category
console.log(`UI images: ${imageDatabase.ui.length}`);
console.log(`Graphic images: ${imageDatabase.graphic.length}`);
console.log(`Logo images: ${imageDatabase.logo.length}`);
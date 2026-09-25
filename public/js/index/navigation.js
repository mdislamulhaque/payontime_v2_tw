// Landing page navigation, language menu, mobile menu, and section highlighting.
        
 // ================================
// State Management
// ================================
let selectedLang = 'EN';
let isMobileMenuOpen = false;
let isLangOpen = false;

const languages = [
  { code: 'EN', label: 'English (EN)', flagCode: 'gb' },
  { code: 'SV', label: 'Swedish (SV)', flagCode: 'se' },
];

function flagImageMarkup(code, label = '') {
  return `<img src="https://flagcdn.com/w40/${code.toLowerCase()}.png" alt="${label} flag" class="inline-block w-8 h-auto rounded-sm align-middle mr-1.5" loading="lazy">`;
}

const navItems = [
  'hero',
  'why-us',
  'services',
  'debit-card',
  'locations',
  'app',
  'contact'
];


// ================================
// Initialize Lucide Icons
// ================================
lucide.createIcons();


// ================================
// DOM Elements
// ================================
const langBtn = document.getElementById('lang-btn');
const langDropdown = document.getElementById('lang-dropdown');
const langOptionsContainer = document.getElementById('lang-options');
const activeFlag = document.getElementById('active-flag');
const activeLangCode = document.getElementById('active-lang-code');
activeFlag.innerHTML = flagImageMarkup('gb', 'English');

const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const menuIconOpen = document.getElementById('menu-icon-open');
const menuIconClose = document.getElementById('menu-icon-close');

const loginBtn = document.getElementById('login-btn');
const signupBtn = document.getElementById('signup-btn');

const mobileLoginBtn = document.getElementById('mobile-login-btn');
const mobileSignupBtn = document.getElementById('mobile-signup-btn');

const brandLogo = document.getElementById('brand-logo');


// ================================
// Language Dropdown
// ================================
function renderLanguageOptions() {
  langOptionsContainer.innerHTML = '';

  languages.forEach((lang) => {
    const isSelected = lang.code === selectedLang;

    const btn = document.createElement('button');

    btn.type = 'button';

    btn.className = `
      w-full text-left px-3 py-2 text-xs font-medium
      flex items-center justify-between
      transition-colors
      ${
        isSelected
          ? 'bg-green-50  text-green-500 font-bold'
          : 'text-slate-700 hover:bg-slate-50'
      }
    `;

    btn.innerHTML = `
      <span class="inline-flex items-center gap-2">${flagImageMarkup(lang.flagCode, lang.label)} ${lang.label}</span>
      ${isSelected ? '<span class="text-green-500">âœ“</span>' : ''}
    `;

    btn.addEventListener('click', (e) => {
      e.stopPropagation();

      selectedLang = lang.code;

      activeFlag.innerHTML = flagImageMarkup(lang.flagCode, lang.label);
      activeLangCode.textContent = lang.code;

      langDropdown.classList.add('hidden');

      isLangOpen = false;

      renderLanguageOptions();
    });

    langOptionsContainer.appendChild(btn);
  });
}


// ================================
// Language Dropdown Toggle
// ================================
langBtn.addEventListener('click', (e) => {
  e.stopPropagation();

  isLangOpen = !isLangOpen;

  langDropdown.classList.toggle(
    'hidden',
    !isLangOpen
  );
});


// Close language dropdown when clicking outside
document.addEventListener('click', () => {
  if (isLangOpen) {
    langDropdown.classList.add('hidden');

    isLangOpen = false;
  }
});


// ================================
// Mobile Menu Toggle
// ================================
mobileMenuBtn.addEventListener('click', () => {
  isMobileMenuOpen = !isMobileMenuOpen;

  mobileMenu.classList.toggle(
    'hidden',
    !isMobileMenuOpen
  );

  menuIconOpen.classList.toggle(
    'hidden',
    isMobileMenuOpen
  );

  menuIconClose.classList.toggle(
    'hidden',
    !isMobileMenuOpen
  );
});


// ================================
// Smooth Scroll Navigation
// ================================
function scrollToSection(id) {
  const targetElement = document.getElementById(id);

  if (targetElement) {
    targetElement.scrollIntoView({
      behavior: 'smooth'
    });
  }

  // Close mobile menu after navigation
  if (isMobileMenuOpen) {
    mobileMenuBtn.click();
  }
}


// ================================
// Navigation Buttons
// ================================
document
  .querySelectorAll('.nav-btn, .mobile-nav-btn')
  .forEach((btn) => {

    btn.addEventListener('click', (e) => {
      const sectionId =
        e.currentTarget.getAttribute('data-section');

      scrollToSection(sectionId);
    });

  });


// ================================
// Brand Logo
// ================================
brandLogo.addEventListener('click', () => {
  scrollToSection('hero');
});


// ================================
// Scroll Observer
// ================================
window.addEventListener('scroll', () => {

  const scrollPosition =
    window.scrollY + 200;

  for (const id of navItems) {

    const element =
      document.getElementById(id);

    if (element) {

      const top =
        element.offsetTop;

      const height =
        element.offsetHeight;

      if (
        scrollPosition >= top &&
        scrollPosition < top + height
      ) {

        updateActiveNavStyles(id);

        break;
      }
    }
  }
});


// ================================
// Active Navigation Styles
// ================================
function updateActiveNavStyles(activeId) {

  // Desktop navigation
  document
    .querySelectorAll('.nav-btn')
    .forEach((btn) => {

      const id =
        btn.getAttribute('data-section');

      if (id === activeId) {

        btn.className =
          'nav-btn text-sm transition-all py-1 font-bold text-green-400 border-b-2 border-green-400';

      } else {

        btn.className =
          'nav-btn text-sm transition-all py-1 font-medium text-slate-500 hover:text-slate-900';

      }

    });


  // Mobile navigation
  document
    .querySelectorAll('.mobile-nav-btn')
    .forEach((btn) => {

      const id =
        btn.getAttribute('data-section');

      if (id === activeId) {

        btn.className =
          'mobile-nav-btn text-left py-2 px-3 rounded-lg transition-colors bg-green-50  font-bold text-green-500';

      } else {

        btn.className =
          'mobile-nav-btn text-left py-2 px-3 rounded-lg transition-colors hover:bg-slate-50 text-slate-700';

      }

    });
}


// ================================
// LOGIN / SIGNUP NAVIGATION
// ================================

// Desktop Login
if (loginBtn) {
  loginBtn.addEventListener('click', () => {
    window.location.href = '/login.html';
  });
}


// Desktop Sign Up
if (signupBtn) {
  signupBtn.addEventListener('click', () => {
    window.location.href = '/signup.html';
  });
}


// Mobile Login
if (mobileLoginBtn) {
  mobileLoginBtn.addEventListener('click', () => {
    window.location.href = '/login';
  });
}


// Mobile Sign Up
if (mobileSignupBtn) {
  mobileSignupBtn.addEventListener('click', () => {
    window.location.href = '/signup';
  });
}
const sendNowBtn = document.getElementById('send-now-btn');
sendNowBtn.addEventListener('click', () => {
  window.location.href = '/dashboard.html';
});


// ================================
// Initialization
// ================================
renderLanguageOptions();
  

    // footer js 

    // Initialize Lucide Icons
    lucide.createIcons();

    // Dynamically set current year
    document.getElementById('year').textContent = new Date().getFullYear();

    // Scroll To Top Handler
    const scrollToTop = () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    document.getElementById('scroll-top-btn').addEventListener('click', scrollToTop);

    // Custom Actions for Home and Send Money buttons
    document.getElementById('nav-home-btn').addEventListener('click', () => {
      scrollToTop();
      // Add custom navigation logic if needed
    });

    document.getElementById('nav-send-btn').addEventListener('click', () => {
      alert('Redirecting to Send Money Dashboard...');
      // Add custom dashboard tab switch logic if needed
    });
    
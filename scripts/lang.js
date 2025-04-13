// Language Management System
let currentLanguage = localStorage.getItem('preferredLanguage') || 'ar';
let translationsCache = {};
const countContainer = document.getElementById('Countdown-container');
let recaptchaWidgetId = null;
let recaptchaLoaded = false;

// Cleanup existing reCAPTCHA resources
function cleanupRecaptcha() {
  // Remove all existing reCAPTCHA scripts
  document.querySelectorAll('script[src*="google.com/recaptcha"]').forEach(el => el.remove());
  
  // Remove any existing reCAPTCHA badges and iframes
  document.querySelectorAll('.grecaptcha-badge, .grecaptcha-logo, iframe[src*="recaptcha"]').forEach(el => el.remove());
  
  // Clear the container
  const container = document.getElementById('recaptcha-container');
  if (container) container.innerHTML = '';
  
  // Remove global objects
  if (window.grecaptcha) delete window.grecaptcha;
  if (window.onRecaptchaLoadCallback) delete window.onRecaptchaLoadCallback;
  
  recaptchaWidgetId = null;
  recaptchaLoaded = false;
}

// Reload reCAPTCHA with specified language
function reloadRecaptcha(lang) {
  return new Promise((resolve, reject) => {
    try {
      cleanupRecaptcha();
      
      const script = document.createElement('script');
      script.src = `https://www.google.com/recaptcha/api.js?render=explicit&hl=${lang}&onload=onRecaptchaLoadCallback`;
      script.async = true;
      script.defer = true;
      
      window.onRecaptchaLoadCallback = function() {
        try {
          const container = document.getElementById('recaptcha-container');
          if (!container) throw new Error('reCAPTCHA container not found');
          
          recaptchaWidgetId = grecaptcha.render(container, {
            sitekey: CONFIG.RECAPTCHA_SITE_KEY,
            callback: onRecaptchaSuccess,
            'expired-callback': onRecaptchaExpired,
            'error-callback': onRecaptchaError
          });
          
          recaptchaLoaded = true;
          resolve();
        } catch (error) {
          reject(error);
        }
      };
      
      script.onerror = () => {
        reject(new Error('Failed to load reCAPTCHA script'));
      };
      
      document.head.appendChild(script);
    } catch (error) {
      reject(error);
    }
  });
}

// reCAPTCHA callback functions
function onRecaptchaSuccess(token) {
  const submitBtn = document.getElementById('submit-btn');
  if (submitBtn) submitBtn.disabled = false;
}

function onRecaptchaExpired() {
  const submitBtn = document.getElementById('submit-btn');
  if (submitBtn) submitBtn.disabled = true;
  if (recaptchaWidgetId !== null && window.grecaptcha) {
    grecaptcha.reset(recaptchaWidgetId);
  }
}

function onRecaptchaError() {
  const submitBtn = document.getElementById('submit-btn');
  if (submitBtn) submitBtn.disabled = true;
}

// Load translations with caching
async function loadTranslations(lang) {
  if (translationsCache[lang]) {
    return translationsCache[lang];
  }

  try {
    const response = await fetch(`./locales/${lang}.json?v=${Date.now()}`);
    if (!response.ok) throw new Error('Network response was not ok');
    
    const translations = await response.json();
    translationsCache[lang] = translations;
    return translations;
  } catch (error) {
    console.error('Error loading translations:', error);
    return {};
  }
}

// Main language switching function with page reload
async function setLanguage(lang) {
  if (currentLanguage === lang) return;

  // Save the new language preference
  localStorage.setItem('preferredLanguage', lang);
  
  // Reload the page to apply language changes
  window.location.reload();
}

// Initialize language switcher
function initLanguageSwitcher() {
  const savedLang = localStorage.getItem('preferredLanguage') || 'ar';
  currentLanguage = savedLang;
  
  // Set initial document attributes
  document.documentElement.lang = currentLanguage;
  document.documentElement.dir = currentLanguage === 'ar' ? 'rtl' : 'ltr';

  // Apply translations
  loadTranslations(currentLanguage)
    .then(translations => {
      applyTranslations(translations);
      return reloadRecaptcha(currentLanguage);
    })
    .catch(console.error);

  // Set up language switch buttons
  document.addEventListener('click', (e) => {
    if (e.target.closest('#en-button')) {
      setLanguage('en');
    } else if (e.target.closest('#ar-button')) {
      setLanguage('ar');
    }
  });

  // Preload other language for better UX
  const otherLang = savedLang === 'ar' ? 'en' : 'ar';
  loadTranslations(otherLang).catch(console.error);
}

// Apply translations to DOM elements
function applyTranslations(translations) {
  const updateBatch = [];

  document.querySelectorAll('[data-i18n]').forEach(element => {
    const key = element.getAttribute('data-i18n');
    if (translations[key]) {
      updateBatch.push({ element, text: translations[key] });
    }
  });

  document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
    const key = element.getAttribute('data-i18n-placeholder');
    if (translations[key]) {
      updateBatch.push({ element, attribute: 'placeholder', value: translations[key] });
    }
  });

  document.querySelectorAll('[data-i18n-value]').forEach(element => {
    const key = element.getAttribute('data-i18n-value');
    if (translations[key]) {
      updateBatch.push({ element, attribute: 'value', value: translations[key] });
    }
  });

  updateBatch.forEach(update => {
    if (update.text) {
      update.element.textContent = update.text;
    } else if (update.attribute) {
      update.element.setAttribute(update.attribute, update.value);
    }
  });
}

// Initialize on DOM ready
if (document.readyState !== 'loading') {
  initLanguageSwitcher();
} else {
  document.addEventListener('DOMContentLoaded', initLanguageSwitcher);
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { 
    setLanguage, 
    currentLanguage,
    reloadRecaptcha,
    initLanguageSwitcher
  };
}
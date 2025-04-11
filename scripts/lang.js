// Language Management - Optimized Version
let currentLanguage = 'ar';
let translationsCache = {};

// Cache translations for better performance
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

// Apply translations with performance optimizations
async function setLanguage(lang) {
  // Skip if already set to this language
  if (currentLanguage === lang) return;
  
  currentLanguage = lang;
  const translations = await loadTranslations(lang);
  
  // Set document attributes
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  
  // Create a single DOM update batch
  const updateBatch = [];
  
  // Process all translatable elements
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
  
  // Apply all updates in a single batch
  updateBatch.forEach(update => {
    if (update.text) {
      update.element.textContent = update.text;
    } else if (update.attribute) {
      update.element.setAttribute(update.attribute, update.value);
    }
  });
  
  // Add language switch animation
  const header = document.getElementById('header');
  if (header) {
    header.classList.remove('animate-fade-in');
    void header.offsetWidth; // Trigger reflow
    header.classList.add('animate-fade-in');
  }
  
  // Dispatch language change event
  document.dispatchEvent(new CustomEvent('languageChanged', { detail: lang }));
}

// Initialize with Intersection Observer for better performance
function initLanguageSwitcher() {
  // Set default language
  setLanguage('ar');
  
  // Initialize language buttons with event delegation
  document.addEventListener('click', (e) => {
    if (e.target.closest('#en-button')) {
      setLanguage('en');
    } else if (e.target.closest('#ar-button')) {
      setLanguage('ar');
    }
  });
  
  // Preload other language
  loadTranslations('en').catch(console.error);
}

// Optimized DOMContentLoaded handler
if (document.readyState !== 'loading') {
  initLanguageSwitcher();
} else {
  document.addEventListener('DOMContentLoaded', initLanguageSwitcher);
}

// Export for module usage if needed
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { setLanguage, currentLanguage };
}
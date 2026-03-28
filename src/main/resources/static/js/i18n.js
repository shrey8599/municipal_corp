// i18n - Internationalization Helper
// Loads locale files and provides translation function

let currentLocale = 'en';
let translations = {};

// Initialize i18n
async function initI18n(defaultLocale = 'en') {
    currentLocale = localStorage.getItem('municipal_language') || defaultLocale;
    await loadLocale(currentLocale);
    console.log(`✅ i18n initialized with locale: ${currentLocale}`);
}

// Load locale file
async function loadLocale(locale) {
    try {
        const response = await fetch(`/locales/${locale}.json`);
        if (!response.ok) {
            console.error(`Failed to load locale file: ${locale}.json`);
            // Fallback to English
            if (locale !== 'en') {
                return loadLocale('en');
            }
            throw new Error(`Failed to load locale: ${locale}`);
        }
        translations = await response.json();
        currentLocale = locale;
        document.documentElement.lang = locale;
        localStorage.setItem('municipal_language', locale);
        console.log(`✅ Loaded locale: ${locale}`);
    } catch (error) {
        console.error('Error loading locale:', error);
        translations = {};
    }
}

// Get translation by key (supports nested keys like 'profile.fieldPhone')
function t(key, defaultValue = key) {
    const keys = key.split('.');
    let value = translations;
    
    for (const k of keys) {
        if (typeof value === 'object' && value !== null && k in value) {
            value = value[k];
        } else {
            console.warn(`Translation key not found: ${key}`);
            return defaultValue;
        }
    }
    
    return typeof value === 'string' ? value : defaultValue;
}

// Change locale
async function changeLocale(locale) {
    await loadLocale(locale);
    
    // Re-render all UI elements with translations
    if (typeof renderUIWithTranslations === 'function') {
        renderUIWithTranslations();
    }
    
    // Dispatch event for other listeners
    window.dispatchEvent(new CustomEvent('localeChanged', { detail: { locale } }));
}

// Get current locale
function getCurrentLocale() {
    return currentLocale;
}

// Get all available locales
function getAvailableLocales() {
    return ['en', 'hi'];
}

// Get locale display name
function getLocaleDisplayName(locale) {
    const names = {
        'en': 'English',
        'hi': 'हिन्दी'
    };
    return names[locale] || locale;
}

// Export functions globally
window.t = t;
window.initI18n = initI18n;
window.changeLocale = changeLocale;
window.getCurrentLocale = getCurrentLocale;
window.getAvailableLocales = getAvailableLocales;
window.getLocaleDisplayName = getLocaleDisplayName;

// Auto-initialize when this script loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        initI18n();
    });
} else {
    initI18n();
}

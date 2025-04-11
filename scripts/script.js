const CONFIG = {
    APPS_SCRIPT_URL: "https://script.google.com/macros/s/AKfycbzmuctpf-wvcIimvSykxwCWu9yv0R4ustyJGhAUiL206ojcou6s8X-wdN1UJ6y9gPay/exec",
    WEBINAR_TITLE: "علاج الألم العصبي: أحدث الطرق والتقنيات",
    WEBINAR_DATE: "15 ديسمبر 2025",
    WEBINAR_TIME: "8:00 مساءً بتوقيت القاهرة",
    WEBINAR_LINK: "https://example.com/webinar-link",
    COMPANY_NUMBER: "201200241817",
    COMPANY_EMAIL: "olaadel.967@gmail.com",
    WEBSITE_NAME: "موقع_الندوات_الطبية",
    RECAPTCHA_SITE_KEY: "6LduhQsrAAAAAMpRjpSqis-_UNyVy7KUq8GTL5k4",

    COUNTRIES: [
        { code: "EG", name: "مصر", dialCode: "20", flag: "🇪🇬" },
        { code: "SA", name: "السعودية", dialCode: "966", flag: "🇸🇦" },
        { code: "AE", name: "الإمارات", dialCode: "971", flag: "🇦🇪" },
        { code: "KW", name: "الكويت", dialCode: "965", flag: "🇰🇼" },
        { code: "QA", name: "قطر", dialCode: "974", flag: "🇶🇦" }
    ]
};

// WhatsApp message template
const WHATSAPP_MESSAGE_TEMPLATE = `مرحباً {name}،

شكراً لتسجيلك في ندوتنا "${CONFIG.WEBINAR_TITLE}"

التفاصيل:
📅 التاريخ: ${CONFIG.WEBINAR_DATE}
⏰ الوقت: ${CONFIG.WEBINAR_TIME}
🔗 رابط الندوة: ${CONFIG.WEBINAR_LINK}

للمساعدة أو الاستفسار، يرجى اختيار أحد الخيارات التالية:
1️⃣ استفسار عن رابط الندوة
2️⃣ استفسار عن موعد الندوة
3️⃣ استفسار عن المحتوى العلمي
4️⃣ تواصل مع فريق الدعم

أو اكتب استفسارك مباشرة وسنكون سعداء بمساعدتك.

مع تحيات،
فريق ${CONFIG.WEBINAR_TITLE}`;

// Global variables
let lastSubmissionTime = 0;
let recaptchaLoaded = false;

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    initCountdown();
    initTabs();
    initModal();
    initForm();
    init3DScrollEffect();
    loadRecaptcha();
});

// Initialize countdown timer
function initCountdown() {
    const webinarDate = new Date('December 15, 2025 20:00:00 GMT+0200').getTime();

    function updateCountdown() {
        const now = new Date().getTime();
        const distance = webinarDate - now;

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById('days').textContent = days.toString().padStart(2, '0');
        document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
        document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
        document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');

        if (distance < 0) {
            clearInterval(countdownTimer);
            document.getElementById('countdown-section').innerHTML = `
        <div class="bg-white/20 p-4 rounded-lg text-center">
          <h3 class="font-bold">الندوة قد بدأت!</h3>
          <p>يمكنك الانضمام الآن عبر الرابط التالي:</p>
          <a href="${CONFIG.WEBINAR_LINK}" class="text-blue-300 underline mt-2 inline-block">
            انضم إلى الندوة
          </a>
        </div>
      `;
        }
    }

    const countdownTimer = setInterval(updateCountdown, 1000);
    updateCountdown();
}

// Initialize tabs functionality
// Initialize tabs functionality
function initTabs() {
    const tabs = {
        'about-instructor': document.getElementById('about-instructor-content'),
        'webinar-info': document.getElementById('webinar-info-content'),
        'agenda': document.getElementById('agenda-content')
    };

    function switchTab(tabName) {
        // Hide all tab contents
        Object.values(tabs).forEach(tab => {
            tab.classList.add('hidden');
        });

        // Remove active styles from all tabs
        document.querySelectorAll('[id$="-btn"]').forEach(btn => {
            btn.classList.remove('text-medical-primary', 'border-medical-primary');
            btn.classList.add('text-gray-500', 'border-transparent');
        });

        // Show selected tab content
        tabs[tabName].classList.remove('hidden');

        // Add active style to clicked tab
        const tabBtn = document.getElementById(`${tabName}-btn`);
        tabBtn.classList.add('text-medical-primary', 'border-medical-primary');
        tabBtn.classList.remove('text-gray-500', 'border-transparent');
    }

    // Add event listeners
    document.getElementById('about-instructor-btn').addEventListener('click', () => switchTab('about-instructor'));
    document.getElementById('webinar-info-btn').addEventListener('click', () => switchTab('webinar-info'));
    document.getElementById('agenda-btn').addEventListener('click', () => switchTab('agenda'));

    // Activate first tab by default
    switchTab('about-instructor');
}

// Initialize modal functionality
function initModal() {
    const openButtons = document.querySelectorAll('[id^="open-registration-btn"]');
    const closeButton = document.getElementById('close-modal');
    const modal = document.getElementById('registration-modal');

    openButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            modal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        });
    });

    closeButton.addEventListener('click', () => {
        modal.classList.add('hidden');
        document.body.style.overflowY = 'auto';
    });

    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.add('hidden');
            document.body.style.overflowY = 'auto';
        }
    });
}

// Initialize form functionality
function initForm() {
    const form = document.getElementById('webinar-form');
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }

    // Field validation
    document.getElementById('name')?.addEventListener('blur', validateName);
    document.getElementById('phone')?.addEventListener('blur', validatePhone);
    document.getElementById('email')?.addEventListener('blur', validateEmail);

    // Country change updates phone validation
    document.getElementById('country')?.addEventListener('change', validatePhone);
}

// Validate name field
function validateName() {
    const nameInput = document.getElementById('name');
    const errorElement = document.getElementById('name-error');
    const name = nameInput.value.trim();

    if (!name) {
        showError(errorElement, 'الرجاء إدخال الاسم الكامل');
        return false;
    }

    if (name.length < 3) {
        showError(errorElement, 'الاسم يجب أن يكون 3 أحرف على الأقل');
        return false;
    }

    hideError(errorElement);
    return true;
}

// Validate phone field
function validatePhone() {
    const countrySelect = document.getElementById('country');
    const phoneInput = document.getElementById('phone');
    const errorElement = document.getElementById('phone-error');
    const countryCode = countrySelect.value;
    const phoneNumber = phoneInput.value.replace(/\D/g, '');

    let isValid = true;
    let errorMessage = '';

    if (countryCode === 'EG') {
        if (!/^(12|15|11|10)\d{8,9}$/.test(phoneNumber)) {
            isValid = false;
            errorMessage = 'يجب أن يبدأ الرقم بـ 11 أو 15 أو 12 أو 10 ويتكون من 10-11 رقمًا';
        }
    } else if (countryCode === 'SA') {
        if (!/^5\d{8}$/.test(phoneNumber)) {
            isValid = false;
            errorMessage = 'يجب أن يبدأ الرقم بـ 5 ويتكون من 9 أرقام';
        }
    } else if (countryCode === 'AE') {
        if (!/^5\d{8}$/.test(phoneNumber)) {
            isValid = false;
            errorMessage = 'يجب أن يبدأ الرقم بـ 5 ويتكون من 9 أرقام';
        }
    } else if (countryCode === 'KW') {
        if (!/^[569]\d{7}$/.test(phoneNumber)) {
            isValid = false;
            errorMessage = 'يجب أن يبدأ الرقم بـ 5، 6، أو 9 ويتكون من 8 أرقام';
        }
    } else if (countryCode === 'QA') {
        if (!/^[3-7]\d{7}$/.test(phoneNumber)) {
            isValid = false;
            errorMessage = 'يجب أن يبدأ الرقم بين 3-7 ويتكون من 8 أرقام';
        }
    }

    if (!phoneNumber) {
        isValid = false;
        errorMessage = 'الرجاء إدخال رقم الهاتف';
    }

    if (isValid) {
        const selectedCountry = CONFIG.COUNTRIES.find(c => c.code === countryCode);
        const fullNumber = `+${selectedCountry.dialCode}${phoneNumber}`;
        document.getElementById('full-phone-number').value = fullNumber;
        hideError(errorElement);
    } else {
        showError(errorElement, errorMessage);
    }

    return isValid;
}

// Validate email field
function validateEmail() {
    const emailInput = document.getElementById('email');
    const errorElement = document.getElementById('email-error');
    const email = emailInput.value.trim();

    if (email && !isValidEmail(email)) {
        showError(errorElement, 'البريد الإلكتروني غير صالح');
        return false;
    }

    hideError(errorElement);
    return true;
}

// Check if email is valid
function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
}

// Show error message
function showError(element, message) {
    if (!element) return;
    element.textContent = message;
    element.classList.remove('hidden');
}

// Hide error message
function hideError(element) {
    if (!element) return;
    element.classList.add('hidden');
}

// Load reCAPTCHA
function loadRecaptcha() {
    const script = document.createElement('script');
    script.src = 'https://www.google.com/recaptcha/api.js?onload=onRecaptchaLoad&render=explicit';
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
}

// reCAPTCHA callback
function onRecaptchaLoad() {
    grecaptcha.render('recaptcha-container', {
        sitekey: CONFIG.RECAPTCHA_SITE_KEY,
        callback: onRecaptchaSuccess,
        'expired-callback': onRecaptchaExpired,
        'error-callback': onRecaptchaError
    });
    recaptchaLoaded = true;
}

function onRecaptchaSuccess(token) {
    document.getElementById('submit-btn').disabled = false;
}

function onRecaptchaExpired() {
    document.getElementById('submit-btn').disabled = true;
}

function onRecaptchaError() {
    document.getElementById('submit-btn').disabled = true;
}

// Modal animation functions
function showModal() {
    const modal = document.getElementById('registration-modal');
    const overlay = document.getElementById('modal-overlay');
    const content = document.getElementById('modal-content');

    modal.classList.remove('hidden');
    document.body.classList.add('overflow-hidden');

    // Trigger animations
    setTimeout(() => {
        overlay.classList.remove('opacity-0');
        overlay.classList.add('opacity-75');

        content.classList.remove('opacity-0', 'translate-y-10', 'scale-95');
        content.classList.add('opacity-100', 'translate-y-0', 'scale-100');
    }, 10);
}

// تعديل دالة handleSuccess
function handleSuccess() {
    const formContent = document.getElementById('form-content');
    const thankYouMessage = document.getElementById('thank-you-message');
    const socialMedia = document.getElementById('success-social-media');

    formContent.classList.add('hidden');
    thankYouMessage.classList.remove('hidden');
    socialMedia.classList.remove('hidden');
}

function hideModal() {
    const modal = document.getElementById('registration-modal');
    const overlay = document.getElementById('modal-overlay');
    const content = document.getElementById('modal-content');

    // Trigger exit animations
    overlay.classList.remove('opacity-75');
    overlay.classList.add('opacity-0');

    content.classList.remove('opacity-100', 'translate-y-0', 'scale-100');
    content.classList.add('opacity-0', 'translate-y-10', 'scale-95');

    setTimeout(() => {
        modal.classList.add('hidden');
        document.getElementById('webinar-form').reset();
        document.getElementById('thank-you-message').classList.add('hidden');
        document.getElementById('form-content').classList.remove('hidden');
        document.getElementById('success-social-media').classList.add('hidden');

        if (typeof grecaptcha !== 'undefined') {
            grecaptcha.reset();
        }
    }, 300);
}


// Event listeners
document.querySelectorAll('[id^="open-registration-btn"]').forEach(btn => {
    btn.addEventListener('click', showModal);
});

document.getElementById('close-modal').addEventListener('click', hideModal);
document.getElementById('close-after-success').addEventListener('click', hideModal);

// Close when clicking outside
document.getElementById('registration-modal').addEventListener('click', (e) => {
    if (e.target === document.getElementById('registration-modal')) {
        hideModal();
    }
});


// Handle form submission
async function handleFormSubmit(e) {
    e.preventDefault();

    // Validate fields
    const isNameValid = validateName();
    const isPhoneValid = validatePhone();
    const isEmailValid = validateEmail();

    if (!isNameValid || !isPhoneValid || !isEmailValid) {
        return;
    }

    // Prevent rapid submissions
    const now = Date.now();
    if (now - lastSubmissionTime < 5000) {
        alert('الرجاء الانتظار 5 ثواني بين كل محاولة');
        return;
    }
    lastSubmissionTime = now;

    const form = e.target;
    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.textContent;

    try {
        // Verify reCAPTCHA
        if (typeof grecaptcha === 'undefined' || !grecaptcha.getResponse()) {
            throw new Error('الرجاء التحقق من أنك لست روبوت');
        }

        const countrySelect = document.getElementById('country');
        const selectedCountry = CONFIG.COUNTRIES.find(c => c.code === countrySelect.value);

        const formData = {
            name: document.getElementById('name').value.trim(),
            whatsapp: document.getElementById('full-phone-number').value,
            email: document.getElementById('email')?.value.trim() || null,
            country: selectedCountry.name,
            website: CONFIG.WEBSITE_NAME,
            'g-recaptcha-response': grecaptcha.getResponse()
        };

        // Update UI
        btn.disabled = true;
        btn.innerHTML = '<span class="loading"></span> جاري التسجيل...';
        // Submit to Google Apps Script
        const result = await submitToGoogleAppsScript(formData);

        if (result.status !== 'success') {
            throw new Error(result.message || 'فشل في التسجيل');
        }

        // Send WhatsApp message
        await sendWhatsAppMessage(formData.whatsapp, formData.name);

        // Reset form after 3 seconds
        setTimeout(() => {
            form.reset();
            if (typeof grecaptcha !== 'undefined') {
                grecaptcha.reset();
            }
            document.getElementById('submit-btn').disabled = true;
            document.body.style.overflow = 'auto';
        }, 3000);

    } catch (error) {
        console.error('Form Error:', error);
        alert(`حدث خطأ: ${error.message}`);
    } finally {
        btn.disabled = false;
        btn.textContent = originalText;
    }
}

// Submit form data to Google Apps Script
async function submitToGoogleAppsScript(data) {
    try {
        const formData = new URLSearchParams();
        formData.append('name', data.name);
        formData.append('whatsapp', data.whatsapp);
        if (data.email) formData.append('email', data.email);
        formData.append('country', data.country);
        formData.append('website', data.website);
        formData.append('g-recaptcha-response', data['g-recaptcha-response']);

        const response = await fetch(CONFIG.APPS_SCRIPT_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formData.toString()
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const responseText = await response.text();
        if (!responseText) {
            throw new Error('الخادم لم يرد بأي بيانات');
        }

        handleSuccess()
        return JSON.parse(responseText);

    } catch (error) {
        console.error('Error submitting to Google Apps Script:', error);
        return {
            status: 'error',
            message: error.message || 'فشل الاتصال بالخادم'
        };
    }
}

// Send WhatsApp message
async function sendWhatsAppMessage(number, name) {
    const message = WHATSAPP_MESSAGE_TEMPLATE.replace('{name}', name);
    const whatsappUrl = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;

    // Open WhatsApp in new tab
    window.open(whatsappUrl, '_blank');

    // Copy link to clipboard
    try {
        await navigator.clipboard.writeText(whatsappUrl);
    } catch (err) {
        console.warn('Failed to copy to clipboard:', err);
    }
}

function init3DScrollEffect() {
    const element = document.getElementById('scroll-3d-element');
    if (!element) return;

    let lastScrollY = window.scrollY;
    let ticking = false;

    function updateElementTransform() {
        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;
        const elementRect = element.getBoundingClientRect();
        const elementCenter = elementRect.top + elementRect.height / 2;

        // حساب نسبة التمرير بالنسبة لمركز العنصر
        const scrollRatio = Math.min(Math.max((windowHeight / 1.25 - elementCenter) / windowHeight, -0.5), 0.5);

        // تطبيق التحويلات
        const rotateX = 15 - scrollRatio * 30;
        const translateY = scrollRatio * 100;

        element.style.transform = `
        perspective(1000px)
        rotateX(${rotateX}deg)
        translateY(${translateY}px)
      `;

        // إضافة تأثير الظل أثناء التمرير
        const shadowIntensity = Math.abs(scrollRatio) * 0.3;
        element.style.boxShadow = `0 ${25 + shadowIntensity * 20}px ${50 + shadowIntensity * 30}px -12px rgba(0, 0, 0, ${0.25 + shadowIntensity})`;

        ticking = false;
    }

    function onScroll() {
        lastScrollY = window.scrollY;
        if (!ticking) {
            window.requestAnimationFrame(updateElementTransform);
            ticking = true;
        }
    }

    window.addEventListener('scroll', onScroll);
    window.addEventListener('resize', updateElementTransform);

    // التهيئة الأولية
    updateElementTransform();
}


// Webinar Registration System
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
let countdownTimer;

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initCountdown();
    initTabs();
    initModal();
    initForm();
    init3DScrollEffect();
});

// Countdown initialization
function initCountdown() {
    const webinarDate = new Date('April 14, 2025 13:00:00 GMT+0200').getTime();

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
                    <a href="${CONFIG.WEBINAR_LINK}" class="text-red-600 font-bold underline mt-2 inline-block">
                        انضم إلى الندوة
                    </a>
                </div>
            `;
        }
    }

    countdownTimer = setInterval(updateCountdown, 1000);
    updateCountdown();
}

// Tabs system
function initTabs() {
    const tabs = {
        'about-instructor': document.getElementById('about-instructor-content'),
        'webinar-info': document.getElementById('webinar-info-content'),
        'agenda': document.getElementById('agenda-content')
    };

    function switchTab(tabName) {
        Object.values(tabs).forEach(tab => tab.classList.add('hidden'));
        document.querySelectorAll('[id$="-btn"]').forEach(btn => {
            btn.classList.remove('text-medical-primary', 'border-medical-primary');
            btn.classList.add('text-gray-500', 'border-transparent');
        });

        tabs[tabName].classList.remove('hidden');
        const tabBtn = document.getElementById(`${tabName}-btn`);
        tabBtn.classList.add('text-medical-primary', 'border-medical-primary');
        tabBtn.classList.remove('text-gray-500', 'border-transparent');
    }

    document.getElementById('about-instructor-btn').addEventListener('click', () => switchTab('about-instructor'));
    document.getElementById('webinar-info-btn').addEventListener('click', () => switchTab('webinar-info'));
    document.getElementById('agenda-btn').addEventListener('click', () => switchTab('agenda'));

    switchTab('about-instructor');
}

// Modal system
function initModal() {
    const modal = document.getElementById('registration-modal');
    if (!modal) return;

    const openButtons = document.querySelectorAll('[id^="open-registration-button"]');
    const closeButton = document.getElementById('close-modal');
    const overlay = document.getElementById('modal-overlay');
    const content = document.getElementById('modal-content');

    function showModal() {
        modal.classList.remove('hidden');
        document.body.classList.add('overflow-hidden');
        
        setTimeout(() => {
            overlay.classList.remove('opacity-0');
            overlay.classList.add('opacity-75');
            content.classList.remove('opacity-0', 'translate-y-10', 'scale-95');
            content.classList.add('opacity-100', 'translate-y-0', 'scale-100');
        }, 10);
    }

    function hideModal() {
        overlay.classList.remove('opacity-75');
        overlay.classList.add('opacity-0');
        content.classList.remove('opacity-100', 'translate-y-0', 'scale-100');
        content.classList.add('opacity-0', 'translate-y-10', 'scale-95');

        setTimeout(() => {
            modal.classList.add('hidden');
            document.body.classList.remove('overflow-hidden');
            
            const form = document.getElementById('webinar-form');
            if (form) form.reset();
            
            document.getElementById('thank-you-message').classList.add('hidden');
            document.getElementById('form-content').classList.remove('hidden');
            document.getElementById('success-social-media').classList.add('hidden');
        }, 300);
    }

    openButtons.forEach(btn => btn.addEventListener('click', showModal));
    closeButton.addEventListener('click', hideModal);
    document.getElementById('close-after-success')?.addEventListener('click', hideModal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) hideModal();
    });
}

// Form validation and submission
function initForm() {
    const form = document.getElementById('webinar-form');
    if (!form) return;

    form.addEventListener('submit', handleFormSubmit);
    document.getElementById('name')?.addEventListener('blur', validateName);
    document.getElementById('phone')?.addEventListener('blur', validatePhone);
    document.getElementById('email')?.addEventListener('blur', validateEmail);
    document.getElementById('country')?.addEventListener('change', validatePhone);
}

async function validateName() {
    const nameInput = document.getElementById('name');
    const errorElement = document.getElementById('name-error');
    const name = nameInput.value.trim();
    const translations = await loadTranslations(currentLanguage);

    if (!name) {
        showError(errorElement, translations['error_name_required']);
        return false;
    }

    if (name.length < 3) {
        showError(errorElement, translations['error_name_min_length'] || 'Name must be at least 3 characters');
        return false;
    }

    hideError(errorElement);
    return true;
}

async function validatePhone() {
    const countrySelect = document.getElementById('country');
    const phoneInput = document.getElementById('phone');
    const errorElement = document.getElementById('phone-error');
    const countryCode = countrySelect.value;
    const phoneNumber = phoneInput.value.replace(/\D/g, '');
    const translations = await loadTranslations(currentLanguage);

    let isValid = true;
    let errorMessage = '';

    if (!phoneNumber) {
        isValid = false;
        errorMessage = translations['error_phone_required'];
    } else {
        switch (countryCode) {
            case 'EG':
                if (!/^(12|15|11|10)\d{8,9}$/.test(phoneNumber)) {
                    isValid = false;
                    errorMessage = translations['error_phone_egypt'] || 'Egyptian number must start with 11, 15, 12 or 10 and be 10-11 digits';
                }
                break;
            case 'SA':
            case 'AE':
                if (!/^5\d{8}$/.test(phoneNumber)) {
                    isValid = false;
                    errorMessage = translations['error_phone_gulf'] || 'Gulf number must start with 5 and be 9 digits';
                }
                break;
            case 'KW':
                if (!/^[569]\d{7}$/.test(phoneNumber)) {
                    isValid = false;
                    errorMessage = translations['error_phone_kuwait'] || 'Kuwaiti number must start with 5, 6 or 9 and be 8 digits';
                }
                break;
            case 'QA':
                if (!/^[3-7]\d{7}$/.test(phoneNumber)) {
                    isValid = false;
                    errorMessage = translations['error_phone_qatar'] || 'Qatari number must start with 3-7 and be 8 digits';
                }
                break;
        }
    }

    if (isValid) {
        const selectedCountry = CONFIG.COUNTRIES.find(c => c.code === countryCode);
        document.getElementById('full-phone-number').value = `+${selectedCountry.dialCode}${phoneNumber}`;
        hideError(errorElement);
    } else {
        showError(errorElement, errorMessage);
    }

    return isValid;
}

async function validateEmail() {
    const emailInput = document.getElementById('email');
    const errorElement = document.getElementById('email-error');
    const email = emailInput.value.trim();
    const translations = await loadTranslations(currentLanguage);

    if (email && !isValidEmail(email)) {
        showError(errorElement, translations['error_email_invalid']);
        return false;
    }

    hideError(errorElement);
    return true;
}

function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
}

function showError(element, message) {
    if (!element) return;
    element.textContent = message;
    element.classList.remove('hidden');
}

function hideError(element) {
    if (!element) return;
    element.classList.add('hidden');
}

async function handleFormSubmit(e) {
    e.preventDefault();

    try {
        if (!validateName() || !validatePhone() || !validateEmail()) {
            throw new Error('الرجاء تصحيح الأخطاء في النموذج');
        }

        const now = Date.now();
        if (now - lastSubmissionTime < 5000) {
            throw new Error('الرجاء الانتظار 5 ثواني بين كل محاولة');
        }
        lastSubmissionTime = now;

        if (!window.grecaptcha || !grecaptcha.getResponse()) {
            throw new Error('الرجاء التحقق من أنك لست روبوت');
        }

        const formData = getFormData();
        const btn = e.target.querySelector('button[type="submit"]');
        const originalText = btn.textContent;

        btn.disabled = true;
        btn.innerHTML = '<span class="loading"></span> جاري التسجيل...';

        const result = await submitToGoogleAppsScript(formData);
        
        if (result.status !== 'success') {
            throw new Error(result.message || 'فشل في التسجيل');
        }

        handleSuccess();
        await sendWhatsAppMessage(formData.whatsapp, formData.name);
    } catch (error) {
        console.error('Form submission error:', error);
        alert(`حدث خطأ: ${error.message}`);
    } finally {
        const btn = e.target.querySelector('button[type="submit"]');
        if (btn) {
            btn.disabled = false;
            btn.textContent = 'سجل الآن';
        }
    }
}

function getFormData() {
    const countrySelect = document.getElementById('country');
    const selectedCountry = CONFIG.COUNTRIES.find(c => c.code === countrySelect.value);
    const phoneInput = document.getElementById('phone').value.replace(/\D/g, '');

    return {
        name: document.getElementById('name').value.trim(),
        whatsapp: `+${selectedCountry.dialCode}${phoneInput}`,
        email: document.getElementById('email')?.value.trim() || null,
        country: selectedCountry.name,
        website: CONFIG.WEBSITE_NAME,
        'g-recaptcha-response': grecaptcha.getResponse()
    };
}

async function submitToGoogleAppsScript(data) {
    try {
        const formData = new URLSearchParams();
        for (const key in data) {
            if (data[key]) formData.append(key, data[key]);
        }

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

        return JSON.parse(responseText);
    } catch (error) {
        console.error('Error submitting to Google Apps Script:', error);
        return {
            status: 'error',
            message: error.message || 'فشل الاتصال بالخادم'
        };
    }
}

function handleSuccess() {
    document.getElementById('form-content').classList.add('hidden');
    document.getElementById('thank-you-message').classList.remove('hidden');
    document.getElementById('success-social-media').classList.remove('hidden');
}

async function sendWhatsAppMessage(number, name) {
    try {
        const message = WHATSAPP_MESSAGE_TEMPLATE
            .replace('{name}', name)
            .replace('{webinar_title}', CONFIG.WEBINAR_TITLE)
            .replace('{webinar_date}', CONFIG.WEBINAR_DATE)
            .replace('{webinar_time}', CONFIG.WEBINAR_TIME)
            .replace('{webinar_link}', CONFIG.WEBINAR_LINK);

        const cleanNumber = number.replace(/\D/g, '');
        const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
        
        window.open(whatsappUrl, '_blank');
    } catch (error) {
        console.error('Failed to send WhatsApp message:', error);
    }
}

// 3D scroll effect
function init3DScrollEffect() {
    const element = document.getElementById('scroll-3d-element');
    if (!element) return;

    let ticking = false;

    function updateElementTransform() {
        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;
        const elementRect = element.getBoundingClientRect();
        const elementCenter = elementRect.top + elementRect.height / 2;
        const scrollRatio = Math.min(Math.max((windowHeight / 1.25 - elementCenter) / windowHeight, -0.5), 0.5);

        const rotateX = 15 - scrollRatio * 30;
        const translateY = scrollRatio * 100;
        const shadowIntensity = Math.abs(scrollRatio) * 0.3;

        element.style.transform = `
            perspective(1000px)
            rotateX(${rotateX}deg)
            translateY(${translateY}px)
        `;
        element.style.boxShadow = `0 ${25 + shadowIntensity * 20}px ${50 + shadowIntensity * 30}px -12px rgba(0, 0, 0, ${0.25 + shadowIntensity})`;

        ticking = false;
    }

    function onScroll() {
        if (!ticking) {
            window.requestAnimationFrame(updateElementTransform);
            ticking = true;
        }
    }

    window.addEventListener('scroll', onScroll);
    window.addEventListener('resize', updateElementTransform);
    updateElementTransform();
}
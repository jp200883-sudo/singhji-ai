// Singh Ji AI Ultra - Main JavaScript
// PPP Pricing, Payment Integration, Language Toggle

// ==================== CONFIGURATION ====================
const API_BASE_URL = 'https://singhji-api.onrender.com'; // Update with your actual API URL

const PRICING_DATA = {
    tier1: {
        name: "Ultra Pro Global",
        countries: ["US", "GB", "CA", "AU", "DE", "FR", "IT", "ES", "JP", "SG", "AE", "CH", "NL", "SE", "NO", "DK", "FI", "AT", "BE", "LU", "IE", "NZ", "KR", "TW", "HK", "IL", "QA", "KW"],
        prices: {
            monthly: { USD: 4.99, EUR: 4.99, GBP: 3.99, JPY: 750, SGD: 6.99, AED: 18.99, CHF: 4.50, CAD: 6.99, AUD: 7.99 },
            annual: { USD: 49.99, EUR: 49.99, GBP: 39.99, JPY: 7500, SGD: 69.99, AED: 189.99, CHF: 45.00, CAD: 69.99, AUD: 79.99 }
        },
        currency: "USD",
        gateway: "stripe"
    },
    tier2: {
        name: "Ultra Pro",
        countries: ["IN", "BR", "MX", "TR", "ZA", "MY", "TH", "ID", "VN", "PH", "CL", "CO", "AR", "PE", "RU", "PL", "CZ", "HU", "RO", "BG", "HR", "GR", "PT", "LT", "LV", "EE", "SK", "SI", "CN", "SA", "OM", "BH"],
        prices: {
            monthly: { INR: 99, BRL: 15.99, MXN: 89.99, TRY: 79.99, ZAR: 89.99, MYR: 22.99, THB: 179.99, IDR: 75000, VND: 115000, PHP: 279.99, RUB: 449.99, PLN: 19.99 },
            annual: { INR: 999, BRL: 159.99, MXN: 899.99, TRY: 799.99, ZAR: 899.99, MYR: 229.99, THB: 1799.99, IDR: 750000, VND: 1150000, PHP: 2799.99, RUB: 4499.99, PLN: 199.99 }
        },
        currency: "INR",
        gateway: "razorpay"
    },
    tier3: {
        name: "Ultra Pro Lite",
        countries: ["BD", "PK", "NP", "LK", "KE", "NG", "EG", "GH", "MM", "KH", "LA", "BT", "MV", "AF", "TJ", "KG", "UZ", "TM", "MN", "BO", "PY", "EC", "GT", "HN", "SV", "NI", "CR", "PA", "DO", "JM", "TT", "BB", "GY", "SR", "BZ", "HT"],
        prices: {
            monthly: { BDT: 120, PKR: 249, NPR: 149, LKR: 299, KES: 450, NGN: 3500, EGP: 149, GHS: 59, MMK: 8500, KHR: 19900 },
            annual: { BDT: 1199, PKR: 2499, NPR: 1499, LKR: 2999, KES: 4499, NGN: 34999, EGP: 1499, GHS: 589, MMK: 84999, KHR: 198999 }
        },
        currency: "BDT",
        gateway: "manual"
    }
};

const COUNTRY_INFO = {
    "IN": { name: "India", flag: "🇮🇳", currency: "INR", symbol: "₹", tier: "tier2" },
    "US": { name: "USA", flag: "🇺🇸", currency: "USD", symbol: "$", tier: "tier1" },
    "GB": { name: "UK", flag: "🇬🇧", currency: "GBP", symbol: "£", tier: "tier1" },
    "CA": { name: "Canada", flag: "🇨🇦", currency: "CAD", symbol: "C$", tier: "tier1" },
    "AU": { name: "Australia", flag: "🇦🇺", currency: "AUD", symbol: "A$", tier: "tier1" },
    "DE": { name: "Germany", flag: "🇩🇪", currency: "EUR", symbol: "€", tier: "tier1" },
    "FR": { name: "France", flag: "🇫🇷", currency: "EUR", symbol: "€", tier: "tier1" },
    "JP": { name: "Japan", flag: "🇯🇵", currency: "JPY", symbol: "¥", tier: "tier1" },
    "SG": { name: "Singapore", flag: "🇸🇬", currency: "SGD", symbol: "S$", tier: "tier1" },
    "AE": { name: "UAE", flag: "🇦🇪", currency: "AED", symbol: "AED", tier: "tier1" },
    "BR": { name: "Brazil", flag: "🇧🇷", currency: "BRL", symbol: "R$", tier: "tier2" },
    "MX": { name: "Mexico", flag: "🇲🇽", currency: "MXN", symbol: "Mex$", tier: "tier2" },
    "TR": { name: "Turkey", flag: "🇹🇷", currency: "TRY", symbol: "₺", tier: "tier2" },
    "ZA": { name: "South Africa", flag: "🇿🇦", currency: "ZAR", symbol: "R", tier: "tier2" },
    "MY": { name: "Malaysia", flag: "🇲🇾", currency: "MYR", symbol: "RM", tier: "tier2" },
    "TH": { name: "Thailand", flag: "🇹🇭", currency: "THB", symbol: "฿", tier: "tier2" },
    "ID": { name: "Indonesia", flag: "🇮🇩", currency: "IDR", symbol: "Rp", tier: "tier2" },
    "VN": { name: "Vietnam", flag: "🇻🇳", currency: "VND", symbol: "₫", tier: "tier2" },
    "PH": { name: "Philippines", flag: "🇵🇭", currency: "PHP", symbol: "₱", tier: "tier2" },
    "BD": { name: "Bangladesh", flag: "🇧🇩", currency: "BDT", symbol: "৳", tier: "tier3" },
    "PK": { name: "Pakistan", flag: "🇵🇰", currency: "PKR", symbol: "Rs.", tier: "tier3" },
    "NP": { name: "Nepal", flag: "🇳🇵", currency: "NPR", symbol: "Rs.", tier: "tier3" },
    "LK": { name: "Sri Lanka", flag: "🇱🇰", currency: "LKR", symbol: "Rs.", tier: "tier3" },
    "KE": { name: "Kenya", flag: "🇰🇪", currency: "KES", symbol: "KSh", tier: "tier3" },
    "NG": { name: "Nigeria", flag: "🇳🇬", currency: "NGN", symbol: "₦", tier: "tier3" },
    "EG": { name: "Egypt", flag: "🇪🇬", currency: "EGP", symbol: "E£", tier: "tier3" },
    "GH": { name: "Ghana", flag: "🇬🇭", currency: "GHS", symbol: "GH₵", tier: "tier3" }
};

// Currency symbols
const CURRENCY_SYMBOLS = {
    "INR": "₹", "USD": "$", "EUR": "€", "GBP": "£", "JPY": "¥",
    "SGD": "S$", "AED": "AED", "CHF": "CHF", "CAD": "C$", "AUD": "A$",
    "BRL": "R$", "MXN": "Mex$", "TRY": "₺", "ZAR": "R", "MYR": "RM",
    "THB": "฿", "IDR": "Rp", "VND": "₫", "PHP": "₱", "RUB": "₽",
    "PLN": "zł", "BDT": "৳", "PKR": "Rs.", "NPR": "Rs.", "LKR": "Rs.",
    "KES": "KSh", "NGN": "₦", "EGP": "E£", "GHS": "GH₵", "MMK": "K",
    "KHR": "៛"
};

// ==================== STATE ====================
let currentCountry = "IN";
let currentLanguage = "en";
let selectedPlan = "monthly";
let selectedTier = "pro";
let userCountryData = null;

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', async () => {
    await detectCountry();
    populateCountryModal();
    updatePricingDisplay();
    setupPWA();
});

// ==================== COUNTRY DETECTION ====================
async function detectCountry() {
    try {
        // Try IP geolocation
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();

        const countryCode = data.country_code;
        userCountryData = data;

        if (COUNTRY_INFO[countryCode]) {
            currentCountry = countryCode;
        } else {
            // Default to India if country not in our list
            currentCountry = "IN";
        }
    } catch (error) {
        console.log('Country detection failed, defaulting to India');
        currentCountry = "IN";
    }

    updateCountryDisplay();
}

function updateCountryDisplay() {
    const info = COUNTRY_INFO[currentCountry] || COUNTRY_INFO["IN"];
    const tier = PRICING_DATA[info.tier];

    document.getElementById('country-flag').textContent = info.flag;
    document.getElementById('country-name').textContent = info.name;

    const badge = document.getElementById('tier-badge');
    badge.textContent = tier.name;
    badge.className = `tier-badge ${info.tier}`;
}

// ==================== PRICING DISPLAY ====================
function updatePricingDisplay() {
    const info = COUNTRY_INFO[currentCountry] || COUNTRY_INFO["IN"];
    const tier = PRICING_DATA[info.tier];
    const symbol = CURRENCY_SYMBOLS[info.currency] || info.symbol;

    // Update Free plan currency symbol
    document.getElementById('free-currency').textContent = symbol;

    // Update Pro plan
    const proMonthly = tier.prices.monthly[info.currency] || tier.prices.monthly[Object.keys(tier.prices.monthly)[0]];
    const proAnnual = tier.prices.annual[info.currency] || tier.prices.annual[Object.keys(tier.prices.annual)[0]];

    document.getElementById('pro-currency').textContent = symbol;
    document.getElementById('pro-price').textContent = formatPrice(proMonthly);
    document.getElementById('pro-strikethrough').textContent = `${symbol}${formatPrice(proMonthly * 12)}`;
    document.getElementById('pro-annual').textContent = `${symbol}${formatPrice(proAnnual)}`;

    // Update Ultra plan (2x Pro price)
    const ultraMonthly = proMonthly * 2;
    const ultraAnnual = proAnnual * 2;

    document.getElementById('ultra-currency').textContent = symbol;
    document.getElementById('ultra-price').textContent = formatPrice(ultraMonthly);
    document.getElementById('ultra-strikethrough').textContent = `${symbol}${formatPrice(ultraMonthly * 12)}`;
    document.getElementById('ultra-annual').textContent = `${symbol}${formatPrice(ultraAnnual)}`;

    // Update gateway info
    updateGatewayInfo(tier.gateway, info.tier);

    // Update payment modal prices
    document.getElementById('monthly-price').textContent = `${symbol}${formatPrice(proMonthly)}`;
    document.getElementById('annual-price-display').textContent = `${symbol}${formatPrice(proAnnual)}`;
}

function formatPrice(price) {
    if (price >= 1000) {
        return price.toLocaleString('en-IN');
    }
    return price.toString();
}

function updateGatewayInfo(gateway, tier) {
    const gatewayTexts = {
        stripe: "💳 Cards, PayPal, Apple Pay (Stripe)",
        razorpay: "💳 UPI, Cards, Netbanking (Razorpay)",
        manual: "📱 bKash, JazzCash, Bank Transfer (Manual)"
    };

    const text = gatewayTexts[gateway] || gatewayTexts.razorpay;
    document.getElementById('pro-gateway').textContent = text;
    document.getElementById('ultra-gateway').textContent = text;
    document.getElementById('payment-gateway-info').textContent = `🔒 Secure payment via ${gateway === 'stripe' ? 'Stripe' : gateway === 'razorpay' ? 'Razorpay' : 'Manual Verification'}`;
}

// ==================== COUNTRY MODAL ====================
function populateCountryModal() {
    const grid = document.getElementById('country-grid');
    grid.innerHTML = '';

    // Group by tier
    const tiers = [
        { key: 'tier1', label: '🌍 Tier 1 - Rich Countries' },
        { key: 'tier2', label: '🌏 Tier 2 - Upper-Mid Countries' },
        { key: 'tier3', label: '🌎 Tier 3 - Low-Mid Countries (Discount!)' }
    ];

    tiers.forEach(tierGroup => {
        const label = document.createElement('div');
        label.style.cssText = 'grid-column: 1 / -1; font-weight: bold; margin-top: 15px; color: var(--primary); padding: 10px; background: rgba(254,202,87,0.1); border-radius: 10px;';
        label.textContent = tierGroup.label;
        grid.appendChild(label);

        Object.entries(COUNTRY_INFO).forEach(([code, info]) => {
            if (info.tier === tierGroup.key) {
                const btn = document.createElement('button');
                btn.className = 'country-btn';
                const price = PRICING_DATA[tierGroup.key].prices.monthly[info.currency] || 
                             PRICING_DATA[tierGroup.key].prices.monthly[Object.keys(PRICING_DATA[tierGroup.key].prices.monthly)[0]];
                btn.innerHTML = `
                    <span class="flag">${info.flag}</span>
                    <span>${info.name}</span>
                    <span class="price-tag">${info.symbol}${price}</span>
                `;
                btn.onclick = () => selectCountry(code);
                grid.appendChild(btn);
            }
        });
    });
}

function openCountryModal() {
    document.getElementById('country-modal').classList.add('active');
}

function closeCountryModal() {
    document.getElementById('country-modal').classList.remove('active');
}

function selectCountry(code) {
    currentCountry = code;
    updateCountryDisplay();
    updatePricingDisplay();
    closeCountryModal();
    showToast(`Country changed to ${COUNTRY_INFO[code].name} ${COUNTRY_INFO[code].flag}`, 'success');
}

function filterCountries() {
    const search = document.getElementById('country-search').value.toLowerCase();
    const buttons = document.querySelectorAll('.country-btn');

    buttons.forEach(btn => {
        const text = btn.textContent.toLowerCase();
        btn.style.display = text.includes(search) ? 'flex' : 'none';
    });
}

// ==================== PAYMENT MODAL ====================
function openPaymentModal(tier) {
    selectedTier = tier;
    document.getElementById('payment-modal').classList.add('active');

    // Reset plan selection
    selectPlan('monthly');

    // Update modal title based on tier
    const tierNames = { pro: 'Ultra Pro', ultra: 'Ultra Max' };
    // Update prices in modal
    updatePaymentModalPrices();
}

function closePaymentModal() {
    document.getElementById('payment-modal').classList.remove('active');
}

function selectPlan(plan) {
    selectedPlan = plan;
    document.querySelectorAll('.plan-option').forEach(el => el.classList.remove('selected'));
    document.getElementById(`plan-${plan}`).classList.add('selected');
    updatePaymentModalPrices();
}

function updatePaymentModalPrices() {
    const info = COUNTRY_INFO[currentCountry] || COUNTRY_INFO["IN"];
    const tier = PRICING_DATA[info.tier];
    const symbol = CURRENCY_SYMBOLS[info.currency] || info.symbol;

    const multiplier = selectedTier === 'ultra' ? 2 : 1;
    const monthlyPrice = (tier.prices.monthly[info.currency] || tier.prices.monthly[Object.keys(tier.prices.monthly)[0]]) * multiplier;
    const annualPrice = (tier.prices.annual[info.currency] || tier.prices.annual[Object.keys(tier.prices.annual)[0]]) * multiplier;

    document.getElementById('monthly-price').textContent = `${symbol}${formatPrice(monthlyPrice)}`;
    document.getElementById('annual-price-display').textContent = `${symbol}${formatPrice(annualPrice)}`;
}

// ==================== PAYMENT PROCESSING ====================
async function processPayment() {
    const email = document.getElementById('payment-email').value;
    if (!email || !email.includes('@')) {
        showToast('Please enter a valid email address', 'error');
        return;
    }

    const payBtn = document.getElementById('pay-btn');
    payBtn.classList.add('loading');

    try {
        const info = COUNTRY_INFO[currentCountry] || COUNTRY_INFO["IN"];
        const tier = PRICING_DATA[info.tier];

        const response = await fetch(`${API_BASE_URL}/api/create-payment`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                country_code: currentCountry,
                plan: selectedPlan,
                tier: selectedTier,
                email: email,
                currency: info.currency
            })
        });

        const data = await response.json();

        if (data.gateway === 'razorpay') {
            // Initialize Razorpay
            const options = {
                key: data.key,
                amount: data.amount * 100,
                currency: data.currency,
                name: 'Singh Ji AI Ultra',
                description: `${selectedTier === 'pro' ? 'Ultra Pro' : 'Ultra Max'} - ${selectedPlan}`,
                order_id: data.order_id,
                handler: function(response) {
                    showToast('Payment successful! Welcome to Singh Ji AI Ultra 🎉', 'success');
                    closePaymentModal();
                },
                prefill: {
                    email: email
                },
                theme: {
                    color: '#feca57'
                }
            };

            // Load Razorpay script dynamically if not loaded
            if (typeof Razorpay === 'undefined') {
                await loadScript('https://checkout.razorpay.com/v1/checkout.js');
            }

            const rzp = new Razorpay(options);
            rzp.open();
        } else if (data.gateway === 'stripe') {
            // Redirect to Stripe checkout
            window.location.href = data.url;
        } else {
            // Manual payment - show instructions
            showToast(`Please complete payment via ${data.method}. Reference: SINGHJI`, 'success');
            alert(`Payment Instructions:

${data.instructions}

After payment, click OK to verify.`);
        }
    } catch (error) {
        console.error('Payment error:', error);
        showToast('Payment failed. Please try again.', 'error');
    } finally {
        payBtn.classList.remove('loading');
    }
}

function loadScript(src) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

// ==================== LANGUAGE TOGGLE ====================
function toggleLanguage() {
    currentLanguage = currentLanguage === 'en' ? 'hi' : 'en';

    // Update button text
    const btn = document.querySelector('.lang-toggle');
    btn.textContent = currentLanguage === 'en' ? '🇮🇳 हिंदी' : '🇺🇸 English';

    // Update all elements with data attributes
    document.querySelectorAll('[data-en][data-hi]').forEach(el => {
        el.textContent = el.getAttribute(`data-${currentLanguage}`);
    });

    showToast(currentLanguage === 'hi' ? 'भाषा बदल दी गई! 🇮🇳' : 'Language changed! 🇺🇸', 'success');
}

// ==================== PWA ====================
function setupPWA() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js')
            .then(reg => console.log('Service Worker registered'))
            .catch(err => console.log('Service Worker registration failed'));
    }
}

function installApp() {
    // Trigger PWA install prompt
    if (window.deferredPrompt) {
        window.deferredPrompt.prompt();
        window.deferredPrompt.userChoice.then(choice => {
            if (choice.outcome === 'accepted') {
                showToast('App installed successfully! 🎉', 'success');
            }
            window.deferredPrompt = null;
        });
    } else {
        showToast('Add to Home Screen from browser menu 📱', 'success');
    }
}

// Listen for beforeinstallprompt
window.addEventListener('beforeinstallprompt', (e) => {
    window.deferredPrompt = e;
});

// ==================== FREE TIER ====================
function startFree() {
    window.open('https://t.me/singhjiai_bot', '_blank');
}

// ==================== TOAST NOTIFICATIONS ====================
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type} show`;

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// ==================== SMOOTH SCROLL ====================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ==================== HEADER SCROLL EFFECT ====================
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (window.scrollY > 50) {
        header.style.background = 'rgba(10,10,26,0.98)';
    } else {
        header.style.background = 'rgba(10,10,26,0.9)';
    }
});

// ==================== ANIMATION ON SCROLL ====================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.feature-card, .pricing-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.6s ease';
    observer.observe(el);
});

console.log('🤖 Singh Ji AI Ultra - Loaded successfully!');
console.log('🇮🇳 Made with love in India');

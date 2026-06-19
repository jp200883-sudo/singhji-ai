// Singh Ji AI Ultra - Free Trial System
// Strategy: Free trial -> Habit -> Paid conversion

const API_BASE_URL = 'https://singhji-api.onrender.com';

function startTrial(planType = 'pro') {
    // Email check karo
    const email = document.getElementById('trial-email')?.value;
    
    if (!email || !email.includes('@')) {
        showToast('Please enter valid email!', 'error');
        return; // Yahan stop karo agar email nahi hai
    }
    
    // Ab trial start karo
    const info = COUNTRY_INFO[currentCountry] || COUNTRY_INFO["IN"];
    const trialConfig = TRIAL_CONFIG[info.tier];
    
    const trialData = {
        active: true,
        email: email, // Email save karo
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + trialConfig.duration * 24 * 60 * 60 * 1000).toISOString(),
        daysLeft: trialConfig.duration,
        plan: planType,
        country: currentCountry
    };
    
    localStorage.setItem('singhji_trial', JSON.stringify(trialData));
    userTrialStatus = trialData;
    
    showToast(`🎉 ${trialConfig.label} activated!`, 'success');
    renderPricingCards();
    showTrialBanner();
    registerTrialOnServer(trialData);
}
// ==================== 5 TIER PRICING ====================
const PRICING_DATA = {
    tier1: {
        name: "Global",
        countries: ["US", "GB", "CA", "AU", "DE", "FR", "IT", "ES", "JP", "SG", "AE", "CH", "NL", "SE", "NO", "DK", "FI", "AT", "BE", "LU", "IE", "NZ", "KR", "TW", "HK", "IL", "QA", "KW"],
        plans: {
            free: { monthly: 0, annual: 0 },
            basic: { monthly: 2.99, annual: 29.99 },
            pro: { monthly: 4.99, annual: 49.99 },
            ultra: { monthly: 9.99, annual: 99.99 },
            ultraMax: { monthly: 19.99, annual: 199.99 }
        },
        currency: "USD",
        symbol: "$",
        gateway: "stripe"
    },
    tier2: {
        name: "India",
        countries: ["IN", "BR", "MX", "TR", "ZA", "MY", "TH", "ID", "VN", "PH", "CL", "CO", "AR", "PE", "RU", "PL", "CZ", "HU", "RO", "BG", "HR", "GR", "PT", "LT", "LV", "EE", "SK", "SI", "CN", "SA", "OM", "BH"],
        plans: {
            free: { monthly: 0, annual: 0 },
            basic: { monthly: 49, annual: 499 },
            pro: { monthly: 99, annual: 999 },
            ultra: { monthly: 199, annual: 1999 },
            ultraMax: { monthly: 399, annual: 3999 }
        },
        currency: "INR",
        symbol: "₹",
        gateway: "razorpay"
    },
    tier3: {
        name: "Lite",
        countries: ["BD", "PK", "NP", "LK", "KE", "NG", "EG", "GH", "MM", "KH", "LA", "BT", "MV", "AF", "TJ", "KG", "UZ", "TM", "MN", "BO", "PY", "EC", "GT", "HN", "SV", "NI", "CR", "PA", "DO", "JM", "TT", "BB", "GY", "SR", "BZ", "HT"],
        plans: {
            free: { monthly: 0, annual: 0 },
            basic: { monthly: 39, annual: 399 },
            pro: { monthly: 79, annual: 799 },
            ultra: { monthly: 149, annual: 1499 },
            ultraMax: { monthly: 299, annual: 2999 }
        },
        currency: "BDT",
        symbol: "৳",
        gateway: "manual"
    }
};

const COUNTRY_INFO = {
    "IN": { name: "India", flag: "🇮🇳", tier: "tier2" },
    "US": { name: "USA", flag: "🇺🇸", tier: "tier1" },
    "GB": { name: "UK", flag: "🇬🇧", tier: "tier1" },
    "CA": { name: "Canada", flag: "🇨🇦", tier: "tier1" },
    "AU": { name: "Australia", flag: "🇦🇺", tier: "tier1" },
    "DE": { name: "Germany", flag: "🇩🇪", tier: "tier1" },
    "FR": { name: "France", flag: "🇫🇷", tier: "tier1" },
    "JP": { name: "Japan", flag: "🇯🇵", tier: "tier1" },
    "SG": { name: "Singapore", flag: "🇸🇬", tier: "tier1" },
    "AE": { name: "UAE", flag: "🇦🇪", tier: "tier1" },
    "BR": { name: "Brazil", flag: "🇧🇷", tier: "tier2" },
    "MX": { name: "Mexico", flag: "🇲🇽", tier: "tier2" },
    "TR": { name: "Turkey", flag: "🇹🇷", tier: "tier2" },
    "ZA": { name: "South Africa", flag: "🇿🇦", tier: "tier2" },
    "MY": { name: "Malaysia", flag: "🇲🇾", tier: "tier2" },
    "TH": { name: "Thailand", flag: "🇹🇭", tier: "tier2" },
    "ID": { name: "Indonesia", flag: "🇮🇩", tier: "tier2" },
    "VN": { name: "Vietnam", flag: "🇻🇳", tier: "tier2" },
    "PH": { name: "Philippines", flag: "🇵🇭", tier: "tier2" },
    "BD": { name: "Bangladesh", flag: "🇧🇩", tier: "tier3" },
    "PK": { name: "Pakistan", flag: "🇵🇰", tier: "tier3" },
    "NP": { name: "Nepal", flag: "🇳🇵", tier: "tier3" },
    "LK": { name: "Sri Lanka", flag: "🇱🇰", tier: "tier3" },
    "KE": { name: "Kenya", flag: "🇰🇪", tier: "tier3" },
    "NG": { name: "Nigeria", flag: "🇳🇬", tier: "tier3" },
    "EG": { name: "Egypt", flag: "🇪🇬", tier: "tier3" },
    "GH": { name: "Ghana", flag: "🇬🇭", tier: "tier3" }
};

const PLAN_FEATURES = {
    free: [
        { text: "Basic Chat", included: true },
        { text: "Hindi + English", included: true },
        { text: "AI Image Generator (5/day)", included: true },
        { text: "Voice Chat", included: false },
        { text: "Image Analysis", included: false },
        { text: "Code Generation", included: false },
        { text: "Live Crypto + Stocks", included: false },
        { text: "Priority Support", included: false },
        { text: "Guard Agent (CCTV)", included: false },
        { text: "API Access", included: false }
    ],
    basic: [
        { text: "Basic Chat", included: true },
        { text: "Hindi + English", included: true },
        { text: "AI Image Generator (20/day)", included: true },
        { text: "Voice Chat", included: true },
        { text: "Image Analysis (10/day)", included: true },
        { text: "Code Generation", included: false },
        { text: "Live Crypto + Stocks", included: false },
        { text: "Priority Support", included: false },
        { text: "Guard Agent (CCTV)", included: false },
        { text: "API Access", included: false }
    ],
    pro: [
        { text: "Basic Chat", included: true },
        { text: "Hindi + English", included: true },
        { text: "AI Image Generator (Unlimited)", included: true },
        { text: "Voice Chat", included: true },
        { text: "Image Analysis (Unlimited)", included: true },
        { text: "Code Generation", included: true },
        { text: "Live Crypto + Stocks", included: true },
        { text: "Priority Support", included: true },
        { text: "Guard Agent (CCTV)", included: false },
        { text: "API Access", included: false }
    ],
    ultra: [
        { text: "Basic Chat", included: true },
        { text: "Hindi + English", included: true },
        { text: "AI Image Generator (Unlimited)", included: true },
        { text: "Voice Chat", included: true },
        { text: "Image Analysis (Unlimited)", included: true },
        { text: "Code Generation", included: true },
        { text: "Live Crypto + Stocks", included: true },
        { text: "Priority Support", included: true },
        { text: "Guard Agent (CCTV)", included: true },
        { text: "API Access", included: false }
    ],
    ultraMax: [
        { text: "Basic Chat", included: true },
        { text: "Hindi + English", included: true },
        { text: "AI Image Generator (Unlimited)", included: true },
        { text: "Voice Chat", included: true },
        { text: "Image Analysis (Unlimited)", included: true },
        { text: "Code Generation", included: true },
        { text: "Live Crypto + Stocks", included: true },
        { text: "Priority Support", included: true },
        { text: "Guard Agent (CCTV)", included: true },
        { text: "API Access", included: true }
    ]
};

const PLAN_NAMES = {
    free: { en: "Free", hi: "Free" },
    basic: { en: "Basic", hi: "Basic" },
    pro: { en: "Pro", hi: "Pro" },
    ultra: { en: "Ultra", hi: "Ultra" },
    ultraMax: { en: "Ultra Max", hi: "Ultra Max" }
};

// ==================== STATE ====================
let currentCountry = "IN";
let currentLanguage = "en";
let selectedPlanType = "pro";
let selectedBilling = "monthly";
let userTrialStatus = null; // { active: true, daysLeft: 90, plan: "pro" }

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', async () => {
    await detectCountry();
    populateCountryModal();
    checkTrialStatus();
    renderPricingCards();
    showTrialBanner();
    setupPWA();
});

// ==================== TRIAL SYSTEM ====================
function checkTrialStatus() {
    // Check localStorage for trial
    const trialData = localStorage.getItem('singhji_trial');
    if (trialData) {
        userTrialStatus = JSON.parse(trialData);
    }
}

function startTrial(planType = 'pro') {
    const info = COUNTRY_INFO[currentCountry] || COUNTRY_INFO["IN"];
    const trialConfig = TRIAL_CONFIG[info.tier];

    const trialData = {
        active: true,
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + trialConfig.duration * 24 * 60 * 60 * 1000).toISOString(),
        daysLeft: trialConfig.duration,
        plan: planType,
        country: currentCountry
    };

    localStorage.setItem('singhji_trial', JSON.stringify(trialData));
    userTrialStatus = trialData;

    showToast(`🎉 ${trialConfig.label} activated! Enjoy all ${planType} features!`, 'success');
    renderPricingCards();
    showTrialBanner();

    // Send to API
    registerTrialOnServer(trialData);
}

async function registerTrialOnServer(trialData) {
    try {
        await fetch(`${API_BASE_URL}/api/start-trial`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                country: trialData.country,
                plan: trialData.plan,
                duration: TRIAL_CONFIG[COUNTRY_INFO[trialData.country].tier].duration,
                start_date: trialData.startDate,
                end_date: trialData.endDate
            })
        });
    } catch (e) {
        console.log('Trial registration failed, but local trial is active');
    }
}

function getDaysLeft() {
    if (!userTrialStatus || !userTrialStatus.active) return 0;
    const end = new Date(userTrialStatus.endDate);
    const now = new Date();
    const diff = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
    return Math.max(0, diff);
}

function showTrialBanner() {
    const info = COUNTRY_INFO[currentCountry] || COUNTRY_INFO["IN"];
    const trialConfig = TRIAL_CONFIG[info.tier];
    const daysLeft = getDaysLeft();

    // Remove existing banner
    const existing = document.getElementById('trial-banner');
    if (existing) existing.remove();

    if (daysLeft > 0) {
        // Active trial banner
        const banner = document.createElement('div');
        banner.id = 'trial-banner';
        banner.style.cssText = `
            position: fixed;
            top: 70px;
            left: 50%;
            transform: translateX(-50%);
            background: linear-gradient(90deg, #4cd137, #44bd32);
            color: #0a0a1a;
            padding: 12px 30px;
            border-radius: 50px;
            font-weight: bold;
            z-index: 999;
            animation: slideDown 0.5s ease;
            box-shadow: 0 5px 20px rgba(76,209,55,0.4);
        `;
        banner.innerHTML = `🎉 ${daysLeft} days left in your free trial!`;
        document.body.appendChild(banner);
    } else {
        // Offer trial banner
        const banner = document.createElement('div');
        banner.id = 'trial-banner';
        banner.style.cssText = `
            position: fixed;
            top: 70px;
            left: 50%;
            transform: translateX(-50%);
            background: linear-gradient(90deg, var(--primary), var(--secondary));
            color: #0a0a1a;
            padding: 12px 30px;
            border-radius: 50px;
            font-weight: bold;
            z-index: 999;
            animation: slideDown 0.5s ease;
            box-shadow: 0 5px 20px rgba(254,202,87,0.4);
            cursor: pointer;
        `;
        banner.innerHTML = `${trialConfig.badge} - Click to Claim!`;
        banner.onclick = () => openTrialModal();
        document.body.appendChild(banner);
    }
}

function openTrialModal() {
    const info = COUNTRY_INFO[currentCountry] || COUNTRY_INFO["IN"];
    const trialConfig = TRIAL_CONFIG[info.tier];

    const modal = document.createElement('div');
    modal.className = 'modal-overlay active';
    modal.id = 'trial-modal';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 500px; text-align: center;">
            <div class="modal-header" style="justify-content: center;">
                <h2>🎁 ${trialConfig.badge}</h2>
            </div>
            <div style="padding: 20px 0;">
                <p style="font-size: 1.1rem; margin-bottom: 20px;">
                    ${currentLanguage === 'hi' 
                        ? `आपको <strong>${trialConfig.label}</strong> मिल रहा है! सभी Pro features FREE में इस्तेमाल करें।`
                        : `You get <strong>${trialConfig.label}</strong>! Use all Pro features for FREE.`}
                </p>
                <div style="background: rgba(254,202,87,0.1); padding: 20px; border-radius: 15px; margin-bottom: 20px;">
                    <div style="font-size: 3rem; font-weight: 900; color: var(--primary);">${trialConfig.duration}</div>
                    <div style="color: var(--text-muted);">${currentLanguage === 'hi' ? 'दिन FREE' : 'Days FREE'}</div>
                </div>
                <ul style="text-align: left; list-style: none; margin-bottom: 20px;">
                    <li>✅ ${currentLanguage === 'hi' ? 'सभी Pro Features' : 'All Pro Features'}</li>
                    <li>✅ ${currentLanguage === 'hi' ? 'Unlimited Chat' : 'Unlimited Chat'}</li>
                    <li>✅ ${currentLanguage === 'hi' ? 'Voice + Image + Code' : 'Voice + Image + Code'}</li>
                    <li>✅ ${currentLanguage === 'hi' ? 'Live Crypto + Stocks' : 'Live Crypto + Stocks'}</li>
                    <li>✅ ${currentLanguage === 'hi' ? 'Cancel anytime' : 'Cancel anytime'}</li>
                </ul>
                <button class="btn btn-primary" onclick="startTrial('pro'); closeTrialModal();" style="width: 100%;">
                    ${currentLanguage === 'hi' ? 'FREE Trial शुरू करें' : 'Start FREE Trial'}
                </button>
                <p style="margin-top: 15px; font-size: 0.85rem; color: var(--text-muted);">
                    ${currentLanguage === 'hi' ? 'कोई credit card नहीं चाहिए!' : 'No credit card required!'}
                </p>
            </div>
            <button class="close-btn" onclick="closeTrialModal()" style="position: absolute; top: 15px; right: 20px;">✕</button>
        </div>
    `;
    document.body.appendChild(modal);
}

function closeTrialModal() {
    const modal = document.getElementById('trial-modal');
    if (modal) modal.remove();
}

// ==================== COUNTRY DETECTION ====================
async function detectCountry() {
    try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        const countryCode = data.country_code;

        if (COUNTRY_INFO[countryCode]) {
            currentCountry = countryCode;
        } else {
            currentCountry = "IN";
        }
    } catch (error) {
        currentCountry = "IN";
    }
    updateCountryDisplay();
}

function updateCountryDisplay() {
    const info = COUNTRY_INFO[currentCountry] || COUNTRY_INFO["IN"];
    const tier = PRICING_DATA[info.tier];
    const trialConfig = TRIAL_CONFIG[info.tier];

    document.getElementById('country-flag').textContent = info.flag;
    document.getElementById('country-name').textContent = info.name;

    const badge = document.getElementById('tier-badge');
    badge.textContent = `${tier.name} Pricing • ${trialConfig.label}`;
    badge.className = `tier-badge ${info.tier}`;
}

// ==================== RENDER PRICING CARDS ====================
function renderPricingCards() {
    const container = document.getElementById('pricing-cards-container');
    const info = COUNTRY_INFO[currentCountry] || COUNTRY_INFO["IN"];
    const tier = PRICING_DATA[info.tier];
    const trialConfig = TRIAL_CONFIG[info.tier];
    const daysLeft = getDaysLeft();
    const plans = ['free', 'basic', 'pro', 'ultra', 'ultraMax'];

    container.innerHTML = plans.map((planKey, index) => {
        const plan = tier.plans[planKey];
        const features = PLAN_FEATURES[planKey];
        const isPopular = planKey === 'pro';
        const isFree = planKey === 'free';
        const isPro = planKey === 'pro';

        const monthlyPrice = plan.monthly;
        const annualPrice = plan.annual;
        const monthlyDisplay = isFree ? '0' : formatPrice(monthlyPrice);
        const annualDisplay = isFree ? '0' : formatPrice(annualPrice);
        const annualStrikethrough = isFree ? '0' : formatPrice(monthlyPrice * 12);
        const savePercent = isFree ? 0 : Math.round(((monthlyPrice * 12 - annualPrice) / (monthlyPrice * 12)) * 100);

        // Trial button for Pro plan
        const trialButton = (isPro && daysLeft === 0) 
            ? `<button class="btn btn-primary" onclick="openTrialModal()" style="background: linear-gradient(90deg, #4cd137, #44bd32); width: 100%;">
                 <span>🎁</span>
                 <span>${currentLanguage === 'hi' ? `${trialConfig.label} FREE लें` : `Get ${trialConfig.label} FREE`}</span>
               </button>
               <div class="gateway-info" style="color: #4cd137;">✨ ${currentLanguage === 'hi' ? 'कोई Card नहीं चाहिए' : 'No card required'}</div>`
            : (isPro && daysLeft > 0)
            ? `<button class="btn btn-primary" onclick="openPaymentModal('pro')" style="width: 100%;">
                 <span class="spinner"></span>
                 <span class="btn-text">${currentLanguage === 'hi' ? 'अभी Upgrade करें' : 'Upgrade Now'}</span>
               </button>
               <div class="gateway-info">${getGatewayText(tier.gateway)}</div>`
            : isFree
            ? `<button class="btn btn-secondary" onclick="startFree()" style="width: 100%;">
                 <span>${currentLanguage === 'hi' ? 'शुरू करें' : 'Get Started'}</span>
               </button>`
            : `<button class="btn btn-primary" onclick="openPaymentModal('${planKey}')" style="width: 100%;">
                 <span class="spinner"></span>
                 <span class="btn-text">${currentLanguage === 'hi' ? 'Upgrade करें' : 'Upgrade Now'}</span>
               </button>
               <div class="gateway-info">${getGatewayText(tier.gateway)}</div>`;

        // Show trial badge on Pro
        const trialBadge = (isPro && daysLeft === 0) 
            ? `<div class="popular-badge" style="background: linear-gradient(90deg, #4cd137, #44bd32); color: #0a0a1a;">${trialConfig.badge}</div>`
            : isPopular 
            ? '<div class="popular-badge">🔥 Most Popular</div>' 
            : planKey === 'ultraMax' 
            ? '<div class="popular-badge" style="background: linear-gradient(90deg, #a29bfe, #6c5ce7);">👑 Best Value</div>' 
            : '';

        // Price display with trial info
        const priceDisplay = (isPro && daysLeft > 0)
            ? `<div class="price" style="font-size: 2rem;">
                 <span style="color: #4cd137;">🎉 FREE</span>
                 <div style="font-size: 0.9rem; color: var(--text-muted); margin-top: 5px;">${daysLeft} days left</div>
               </div>
               <div style="text-decoration: line-through; color: var(--text-muted); font-size: 1rem;">${tier.symbol}${monthlyDisplay}/mo</div>`
            : `<div class="price">
                 <span class="currency">${tier.symbol}</span>
                 <span class="amount">${monthlyDisplay}</span>
                 <span class="period">/month</span>
               </div>
               ${!isFree ? `
               <div class="annual-price">
                 <span class="strikethrough">${tier.symbol}${annualStrikethrough}</span>
                 <span class="final">${tier.symbol}${annualDisplay}</span>
                 <span class="save">Save ${savePercent}%</span>
                 <span>/year</span>
               </div>` : ''}`;

        return `
            <div class="pricing-card ${planKey} ${isPopular ? 'popular' : ''}">
                ${trialBadge}

                <div class="card-header">
                    <h3>${getPlanIcon(planKey)} ${PLAN_NAMES[planKey][currentLanguage]}</h3>
                    ${priceDisplay}
                </div>

                <ul class="features-list">
                    ${features.map(f => `
                        <li>
                            <span class="${f.included ? 'check' : 'cross'}">${f.included ? '✅' : '❌'}</span>
                            <span>${f.text}</span>
                        </li>
                    `).join('')}
                </ul>

                ${trialButton}
            </div>
        `;
    }).join('');

    // Re-observe for animations
    document.querySelectorAll('.pricing-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });
}

function getPlanIcon(plan) {
    const icons = { free: '🆓', basic: '⭐', pro: '⚡', ultra: '🚀', ultraMax: '👑' };
    return icons[plan] || '⭐';
}

function getGatewayText(gateway) {
    const texts = {
        stripe: "💳 Cards, PayPal, Apple Pay",
        razorpay: "💳 UPI, Cards, Netbanking",
        manual: "📱 bKash, JazzCash, Bank Transfer"
    };
    return texts[gateway] || "💳 Secure Payment";
}

function formatPrice(price) {
    if (price >= 1000) return price.toLocaleString('en-IN');
    return price.toString();
}

// ==================== COUNTRY MODAL ====================
function populateCountryModal() {
    const grid = document.getElementById('country-grid');
    grid.innerHTML = '';

    const tiers = [
        { key: 'tier1', label: '🌍 Tier 1 - Rich (1 Month Free)' },
        { key: 'tier2', label: '🌏 Tier 2 - India & Mid (3 Months Free)' },
        { key: 'tier3', label: '🌎 Tier 3 - Poor (6 Months Free!)' }
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
                const tier = PRICING_DATA[tierGroup.key];
                const trial = TRIAL_CONFIG[tierGroup.key];
                btn.innerHTML = `
                    <span class="flag">${info.flag}</span>
                    <span>${info.name}</span>
                    <span class="price-tag">${tier.symbol}${tier.plans.pro.monthly}</span>
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
    renderPricingCards();
    showTrialBanner();
    closeCountryModal();
    showToast(`Country changed to ${COUNTRY_INFO[code].name} ${COUNTRY_INFO[code].flag}`, 'success');
}

function filterCountries() {
    const search = document.getElementById('country-search').value.toLowerCase();
    document.querySelectorAll('.country-btn').forEach(btn => {
        btn.style.display = btn.textContent.toLowerCase().includes(search) ? 'flex' : 'none';
    });
}

// ==================== PAYMENT MODAL ====================
function openPaymentModal(plan) {
    selectedPlanType = plan;
    document.getElementById('payment-modal').classList.add('active');
    selectBilling('monthly');
    updatePaymentModalPrices();
}

function closePaymentModal() {
    document.getElementById('payment-modal').classList.remove('active');
}

function selectBilling(billing) {
    selectedBilling = billing;
    document.querySelectorAll('.plan-option').forEach(el => el.classList.remove('selected'));
    document.getElementById(`billing-${billing}`).classList.add('selected');
    updatePaymentModalPrices();
}

function updatePaymentModalPrices() {
    const info = COUNTRY_INFO[currentCountry] || COUNTRY_INFO["IN"];
    const tier = PRICING_DATA[info.tier];
    const plan = tier.plans[selectedPlanType];

    document.getElementById('monthly-price').textContent = `${tier.symbol}${formatPrice(plan.monthly)}`;
    document.getElementById('annual-price-display').textContent = `${tier.symbol}${formatPrice(plan.annual)}`;

    document.getElementById('pay-btn').querySelector('.btn-text').textContent = 
        currentLanguage === 'hi' ? `${tier.symbol}${formatPrice(selectedBilling === 'monthly' ? plan.monthly : plan.annual)} Pay करें` : `Pay ${tier.symbol}${formatPrice(selectedBilling === 'monthly' ? plan.monthly : plan.annual)}`;
}

// ==================== PAYMENT PROCESSING ====================
async function processPayment() {
    const email = document.getElementById('payment-email').value;
    if (!email || !email.includes('@')) {
        showToast(currentLanguage === 'hi' ? 'Valid email डालें' : 'Please enter valid email', 'error');
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
                plan: selectedPlanType,
                billing: selectedBilling,
                email: email,
                currency: tier.currency
            })
        });

        const data = await response.json();

        if (data.gateway === 'razorpay') {
            if (typeof Razorpay === 'undefined') await loadScript('https://checkout.razorpay.com/v1/checkout.js');
            const rzp = new Razorpay({
                key: data.key,
                amount: data.amount * 100,
                currency: data.currency,
                name: 'Singh Ji AI Ultra',
                description: `${PLAN_NAMES[selectedPlanType].en} - ${selectedBilling}`,
                order_id: data.order_id,
                handler: (response) => {
                    showToast('Payment successful! 🎉', 'success');
                    closePaymentModal();
                },
                prefill: { email: email },
                theme: { color: '#feca57' }
            });
            rzp.open();
        } else if (data.gateway === 'stripe') {
            window.location.href = data.url;
        } else {
            showToast(`Pay via ${data.method}. Ref: SINGHJI`, 'success');
            alert(`Payment Instructions:

${data.instructions}`);
        }
    } catch (error) {
        showToast('Payment failed. Try again.', 'error');
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
    document.querySelector('.lang-toggle').textContent = currentLanguage === 'en' ? '🇮🇳 हिंदी' : '🇺🇸 English';
    document.querySelectorAll('[data-en][data-hi]').forEach(el => {
        el.textContent = el.getAttribute(`data-${currentLanguage}`);
    });
    renderPricingCards();
    showTrialBanner();
    showToast(currentLanguage === 'hi' ? 'भाषा बदल दी गई! 🇮🇳' : 'Language changed! 🇺🇸', 'success');
}

// ==================== FREE TIER ====================
function startFree() {
    window.open('https://t.me/singhjiai_bot', '_blank');
}

// ==================== TOAST ====================
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type} show`;
    setTimeout(() => toast.classList.remove('show'), 3000);
}

// ==================== PWA ====================
function setupPWA() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js')
            .then(() => console.log('SW registered'))
            .catch(err => console.log('SW failed', err));
    }
}

function installApp() {
    if (window.deferredPrompt) {
        window.deferredPrompt.prompt();
        window.deferredPrompt.userChoice.then(choice => {
            if (choice.outcome === 'accepted') showToast('App installed! 🎉', 'success');
            window.deferredPrompt = null;
        });
    } else {
        showToast('Add to Home Screen from browser menu 📱', 'success');
    }
}

window.addEventListener('beforeinstallprompt', (e) => {
    window.deferredPrompt = e;
});

// ==================== SCROLL & ANIMATION ====================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});

window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    header.style.background = window.scrollY > 50 ? 'rgba(10,10,26,0.98)' : 'rgba(10,10,26,0.9)';
});

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.feature-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.6s ease';
    observer.observe(el);
});

console.log('🤖 Singh Ji AI Ultra - Free Trial System Loaded!');
console.log('🎁 Strategy: Free Trial -> Habit -> Paid Conversion');

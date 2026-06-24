/**
 * Singh Ji AI Ultra v4.0 — Frontend API Connect
 * KELA Mode: Zero phone load, full automation
 */

// 🔗 API BASE URL — Render pe deploy hua hai
const API_BASE = "https://singhji-api.onrender.com";  // Tera Render URL
// Local test ke liye: "http://localhost:5000"

/**
 * Singh Ji AI Ultra v4.0 — Frontend API Connect
 */

// 🔗 API BASE URL
const API_BASE = "https://singhji-api.onrender.com";

// ⚡ MODULE CONFIG — FEATURES OBJECT YAHAN ADD KARO!
const FEATURES = {
    weather: {icon:'🌤️', title:'Weather', ph:'Enter city...', url:'/api/weather/', get:(q)=>q, method:'GET'},
    stock: {icon:'📊', title:'Stocks', ph:'Enter symbol (RELIANCE)...', url:'/api/stock/', get:(q)=>q.toUpperCase(), method:'GET'},
    cricket: {icon:'🏏', title:'Cricket', ph:'', url:'/api/cricket', get:()=>'', method:'GET', auto:true},
    horoscope: {icon:'🔮', title:'Horoscope', ph:'Enter sign (leo, aries)...', url:'/api/horoscope/', get:(q)=>q.toLowerCase(), method:'GET'},
    train: {icon:'🚆', title:'Train', ph:'Enter train number...', url:'/api/train/', get:(q)=>q, method:'GET'},
    mandi: {icon:'🌾', title:'Mandi Rates', ph:'Enter commodity (wheat)...', url:'/api/mandi?commodity=', get:(q)=>q.toLowerCase()+'&limit=5', method:'GET'},
    news: {icon:'📰', title:'News', ph:'Enter topic...', url:'/api/news?query=', get:(q)=>q, method:'GET'},
    vision: {icon:'👁️', title:'Image Analysis', ph:'', url:'/api/vision', type:'upload'},
    plant: {icon:'🌱', title:'Plant ID', ph:'', url:'/api/u11/webhook', type:'upload', action:'identify'}  
};

// 🎯 DOM Ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('🧠 Singh Ji AI Frontend Loaded');
    setupButtons();
    checkHealth();
    registerSW();
});

// ... baaki functions ...
// 🎯 DOM Ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('🧠 Singh Ji AI Frontend Loaded — KELA Mode ON');
    
    // Sab buttons ko event listener do
    setupButtons();
    
    // Health check karo
    checkHealth();
    
    // Service Worker register karo
    registerSW();
});

// 🔘 Button Setup
function setupButtons() {
    Object.keys(MODULE_MAP).forEach(btnId => {
        const btn = document.getElementById(btnId);
        if (!btn) return;
        
        btn.addEventListener('click', async () => {
            const config = MODULE_MAP[btnId];
            const input = getInputValue(btnId);
            
            // Loading state
            setLoading(btn, true);
            showOutput('⏳ Soch raha hoon...', 'loading');
            
            try {
                const result = await callAPI(config.module, config.action, input);
                showOutput(result, 'success');
            } catch (err) {
                showOutput(`❌ Error: ${err.message}`, 'error');
            } finally {
                setLoading(btn, false);
            }
        });
    });
}

// 📝 Input Value Lo
function getInputValue(btnId) {
    const inputField = document.getElementById('user-input');
    if (inputField && inputField.value.trim()) {
        return inputField.value.trim();
    }
    
    const btn = document.getElementById(btnId);
    return btn?.dataset.query || btn?.textContent || '';
}

// 📡 API Call
async function callAPI(module, action, query) {
    const url = `${API_BASE}/api/${module}/webhook`;
    
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            action: action,
            query: query,
            timestamp: new Date().toISOString()
        })
    });
    
    if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.result || data.message || JSON.stringify(data);
}

// 💓 Health Check
async function checkHealth() {
    try {
        const res = await fetch(`${API_BASE}/api/health`);
        const data = await res.json();
        console.log('✅ API Health:', data.status);
        showStatus('🟢 Online', 'online');
    } catch (e) {
        console.log('❌ API Offline:', e.message);
        showStatus('🔴 Offline', 'offline');
    }
}

// 🖥️ Output Dikhao
function showOutput(text, type) {
    const output = document.getElementById('output-box');
    if (!output) return;
    
    output.innerHTML = text;
    output.className = `output-box ${type}`;
}

// 📊 Status Dikhao
function showStatus(text, type) {
    const status = document.getElementById('status-bar');
    if (!status) return;
    
    status.textContent = text;
    status.className = `status-bar ${type}`;
}

// ⏳ Loading State
function setLoading(btn, isLoading) {
    if (!btn) return;
    
    if (isLoading) {
        btn.dataset.originalText = btn.textContent;
        btn.textContent = '⏳...';
        btn.disabled = true;
    } else {
        btn.textContent = btn.dataset.originalText || btn.textContent;
        btn.disabled = false;
    }
}

// 🌐 Language Toggle (Basic)
function setLanguage(lang) {
    document.documentElement.lang = lang;
    localStorage.setItem('preferred-lang', lang);
    console.log('🌐 Language set to:', lang);
}

// 🔍 Quick Search Shortcut
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
        const input = document.getElementById('user-input');
        if (input && input.value.trim()) {
            document.getElementById('btn-chat')?.click();
        }
    }
});

// 📱 Service Worker Register
async function registerSW() {
    if ('serviceWorker' in navigator) {
        try {
            const reg = await navigator.serviceWorker.register('/sw.js');
            console.log('✅ SW Registered:', reg.scope);
        } catch (err) {
            console.log('❌ SW Failed:', err);
        }
    }
}

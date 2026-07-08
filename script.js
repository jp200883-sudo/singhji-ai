// ==================== SINGH JI AI ULTRA v7.0 ====================
// 🙏 Jai Shri Ram | 👑 JP Singh Ji Kanpur | 🍌 KELA Mode ON

// ==================== HYBRID API SETUP ====================
// Primary: Railway (24/7 live)
// Fallback: Render (has all API keys but 15min sleep)
const API_URL_PRIMARY = "https://singhji-api-production-85ca.up.railway.app";
const API_URL_FALLBACK = "https://singhji-api.onrender.com";
const API_URL = API_URL_PRIMARY; // Default to Railway

// ==================== HYBRID FETCH ====================
async function hybridFetch(endpoint, options = {}) {
    // Try Railway first
    try {
        const response = await fetch(`${API_URL_PRIMARY}${endpoint}`, {
            ...options,
            signal: AbortSignal.timeout(8000) // 8 second timeout
        });
        if (response.ok) {
            const data = await response.json();
            data._source = "Railway";
            return data;
        }
    } catch (e) {
        console.log("Railway failed, trying Render fallback...");
    }
    
    // Fallback to Render
    try {
        const response = await fetch(`${API_URL_FALLBACK}${endpoint}`, {
            ...options,
            signal: AbortSignal.timeout(15000) // 15 second timeout (Render may be sleeping)
        });
        if (response.ok) {
            const data = await response.json();
            data._source = "Render (Fallback)";
            return data;
        }
    } catch (e) {
        console.error("Both APIs failed:", e);
    }
    
    return { error: "Both APIs unavailable", _source: "none" };
}

// ==================== 🌡️ WEATHER ====================
async function getWeather(city) {
    const data = await hybridFetch(`/api/weather/${encodeURIComponent(city)}`);
    console.log("🌡️ Weather:", data);
    return data;
}

// ==================== 📰 NEWS ====================
async function getNews() {
    const data = await hybridFetch("/api/news/latest");
    console.log("📰 News:", data);
    return data;
}

// ==================== 🤖 SWARM ====================
async function getSwarmStatus() {
    const data = await hybridFetch("/api/swarm/");
    console.log("🤖 Swarm:", data);
    return data;
}

async function executeAgent(agentId, task) {
    const data = await hybridFetch(`/api/swarm/agent/${agentId}/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task })
    });
    console.log("🤖 Agent executed:", data);
    return data;
}

// ==================== 💰 TAX CALCULATOR ====================
async function calculateTax(income, regime = "new") {
    const data = await hybridFetch("/api/retirement/tax-calculate", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ income, regime })
    });
    console.log("💰 Tax:", data);
    return data;
}

// ==================== 🧠 MEMORY ====================
async function saveMemory(key, value) {
    const data = await hybridFetch("/api/memory/", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, value })
    });
    console.log("🧠 Memory saved:", data);
    return data;
}

async function getMemory(key) {
    const data = await hybridFetch(`/api/memory/${encodeURIComponent(key)}`);
    console.log("🧠 Memory:", data);
    return data;
}

// ==================== 📊 SYSTEM STATUS ====================
async function checkSystemStatus() {
    const data = await hybridFetch("/api/status");
    console.log("📊 Status:", data);
    return data;
}

// ==================== 🔔 AUTO CHECK ON LOAD ====================
document.addEventListener('DOMContentLoaded', function() {
    console.log("🙏 Singh Ji AI Ultra v7.0 Hybrid Loaded!");
    console.log("👑 JP Singh Ji Kanpur");
    console.log("🍌 KELA Mode ON");
    console.log("🔗 Primary API:", API_URL_PRIMARY);
    console.log("🔗 Fallback API:", API_URL_FALLBACK);
    
    checkSystemStatus();
});

// ==================== 🎯 UTILITY ====================
function showLoading() { console.log("⏳ Loading..."); }
function hideLoading() { console.log("✅ Loaded!"); }
function showError(msg) { console.error("❌", msg); alert("❌ " + msg); }
function showSuccess(msg) { console.log("✅", msg); }

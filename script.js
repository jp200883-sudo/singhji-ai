// ==================== SINGH JI AI ULTRA v5.0 ====================
// 🙏 Jai Shri Ram | 👑 JP Singh Ji Kanpur | 🍌 KELA Mode ON
// केला नहीं होता भाई अकेला!

// ==================== API BASE URL ====================
const API_URL = "https://singhji-api.onrender.com";

// ==================== 🎵 MUSIC ====================
function openMusic() {
    window.location.href = "#music-section";
    console.log("🎵 Music Hub opened");
}

async function searchMusic(query) {
    try {
        const response = await fetch(`${API_URL}/entertainment/music/search?query=${query}`);
        const data = await response.json();
        console.log("🎵 Music search:", data);
        return data;
    } catch (error) {
        console.error("❌ Music search error:", error);
    }
}

async function getTrendingMusic() {
    try {
        const response = await fetch(`${API_URL}/entertainment/music/trending`);
        const data = await response.json();
        console.log("🔥 Trending music:", data);
        return data;
    } catch (error) {
        console.error("❌ Trending music error:", error);
    }
}

// ==================== 🎬 VIDEO ====================
function openVideo() {
    window.location.href = "#video-section";
    console.log("🎬 Video Hub opened");
}

async function searchVideo(query) {
    try {
        const response = await fetch(`${API_URL}/entertainment/video/search?query=${query}`);
        const data = await response.json();
        console.log("🎬 Video search:", data);
        return data;
    } catch (error) {
        console.error("❌ Video search error:", error);
    }
}

async function getVideoCatalog(category) {
    try {
        const url = category 
            ? `${API_URL}/entertainment/video/catalog?category=${category}`
            : `${API_URL}/entertainment/video/catalog`;
        const response = await fetch(url);
        const data = await response.json();
        console.log("📂 Video catalog:", data);
        return data;
    } catch (error) {
        console.error("❌ Video catalog error:", error);
    }
}

async function getLiveTV() {
    try {
        const response = await fetch(`${API_URL}/entertainment/video/livetv`);
        const data = await response.json();
        console.log("📺 Live TV:", data);
        return data;
    } catch (error) {
        console.error("❌ Live TV error:", error);
    }
}

// ==================== 📖 RAMAYAN & PUJA ====================
function openRamayan() {
    window.location.href = "#ramayan-section";
    console.log("📖 Ramayan Hub opened");
}

async function getRamayanChapters() {
    try {
        const response = await fetch(`${API_URL}/entertainment/ramayan/chapters`);
        const data = await response.json();
        console.log("📖 Ramayan chapters:", data);
        return data;
    } catch (error) {
        console.error("❌ Ramayan error:", error);
    }
}

async function getRamayanAudio(kand, chapter) {
    try {
        const response = await fetch(`${API_URL}/entertainment/ramayan/audio/${kand}/${chapter}`);
        const data = await response.json();
        console.log("🎵 Ramayan audio:", data);
        return data;
    } catch (error) {
        console.error("❌ Ramayan audio error:", error);
    }
}

async function getBhagwatChapters() {
    try {
        const response = await fetch(`${API_URL}/entertainment/ramayan/bhagwat/chapters`);
        const data = await response.json();
        console.log("🙏 Bhagwat Gita:", data);
        return data;
    } catch (error) {
        console.error("❌ Bhagwat error:", error);
    }
}

async function getPujaList() {
    try {
        const response = await fetch(`${API_URL}/entertainment/ramayan/puja`);
        const data = await response.json();
        console.log("🙏 Puja list:", data);
        return data;
    } catch (error) {
        console.error("❌ Puja error:", error);
    }
}

async function getAartiCollection() {
    try {
        const response = await fetch(`${API_URL}/entertainment/ramayan/aarti`);
        const data = await response.json();
        console.log("🔔 Aarti collection:", data);
        return data;
    } catch (error) {
        console.error("❌ Aarti error:", error);
    }
}

async function getPanchang() {
    try {
        const response = await fetch(`${API_URL}/entertainment/ramayan/panchang`);
        const data = await response.json();
        console.log("📅 Panchang:", data);
        return data;
    } catch (error) {
        console.error("❌ Panchang error:", error);
    }
}

// ==================== 🎮 GAMING ====================
function openGaming() {
    window.location.href = "#gaming-section";
    console.log("🎮 Gaming Hub opened");
}

async function getGamingMap() {
    try {
        const response = await fetch(`${API_URL}/entertainment/gaming/map`);
        const data = await response.json();
        console.log("🗺️ Gaming map:", data);
        return data;
    } catch (error) {
        console.error("❌ Gaming map error:", error);
    }
}

async function playGame(gameId) {
    try {
        const response = await fetch(`${API_URL}/entertainment/gaming/play/${gameId}`);
        const data = await response.json();
        console.log("🎮 Play game:", data);
        return data;
    } catch (error) {
        console.error("❌ Play game error:", error);
    }
}

async function getLeaderboard() {
    try {
        const response = await fetch(`${API_URL}/entertainment/gaming/leaderboard`);
        const data = await response.json();
        console.log("🏆 Leaderboard:", data);
        return data;
    } catch (error) {
        console.error("❌ Leaderboard error:", error);
    }
}

async function submitScore(gameId, playerName, score) {
    try {
        const response = await fetch(`${API_URL}/entertainment/gaming/score?game_id=${gameId}&player_name=${playerName}&score=${score}`, {
            method: 'POST'
        });
        const data = await response.json();
        console.log("🎯 Score submitted:", data);
        return data;
    } catch (error) {
        console.error("❌ Score submit error:", error);
    }
}

async function getDailyReward() {
    try {
        const response = await fetch(`${API_URL}/entertainment/gaming/daily_reward`);
        const data = await response.json();
        console.log("🎁 Daily reward:", data);
        return data;
    } catch (error) {
        console.error("❌ Daily reward error:", error);
    }
}

// ==================== 🍔 LIFESTYLE (PHASE 3) ====================
function openFood() {
    window.location.href = "#food-section";
    console.log("🍕 Food Hub opened");
}

function openFashion() {
    window.location.href = "#fashion-section";
    console.log("👗 Fashion Hub opened");
}

function openHealth() {
    window.location.href = "#health-section";
    console.log("💊 Health Hub opened");
}

function openTravel() {
    window.location.href = "#travel-section";
    console.log("✈️ Travel Hub opened");
}

function openShopping() {
    window.location.href = "#shopping-section";
    console.log("🛒 Shopping Hub opened");
}

// ==================== 📊 SYSTEM STATUS ====================
async function checkSystemStatus() {
    try {
        const response = await fetch(`${API_URL}/status`);
        const data = await response.json();
        console.log("📊 System status:", data);
        return data;
    } catch (error) {
        console.error("❌ Status check error:", error);
    }
}

// ==================== 🔔 AUTO CHECK ON LOAD ====================
document.addEventListener('DOMContentLoaded', function() {
    console.log("🙏 Singh Ji AI Ultra v5.0 Loaded!");
    console.log("👑 JP Singh Ji Kanpur");
    console.log("🍌 KELA Mode ON — केला नहीं होता भाई अकेला!");
    
    // Auto check system status
    checkSystemStatus();
});

// ==================== 🎯 UTILITY FUNCTIONS ====================
function showLoading() {
    console.log("⏳ Loading...");
}

function hideLoading() {
    console.log("✅ Loaded!");
}

function showError(message) {
    console.error("❌ Error:", message);
    alert("❌ " + message);
}

function showSuccess(message) {
    console.log("✅ Success:", message);
}

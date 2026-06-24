/**
 * Singh Ji AI Ultra v4.0 — Frontend API Connect
 * KELA Mode: Zero phone load, full automation
 */

// 🔗 API BASE URL
const API_BASE = "https://singhji-api.onrender.com";

// 👤 User ID
let userId = localStorage.getItem('uid') || 'u_' + Date.now();
localStorage.setItem('uid', userId);

// ⚡ FEATURES CONFIG
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
    console.log('🧠 Singh Ji AI Frontend Loaded — KELA Mode ON');
    checkHealth();
    registerSW();
});

// 💓 Health Check
async function checkHealth() {
    try {
        const res = await fetch(`${API_BASE}/api/health`);
        const data = await res.json();
        console.log('✅ API Health:', data.status);
        showToast('🟢 Online', 'success');
    } catch (e) {
        console.log('❌ API Offline:', e.message);
        showToast('🔴 Offline', 'error');
    }
}

// 🍞 Toast Notification
function showToast(msg, type) {
    const t = document.getElementById('toast');
    if (!t) return;
    t.textContent = msg;
    t.className = 'toast ' + type + ' show';
    setTimeout(() => t.classList.remove('show'), 3000);
}

// 💬 Chat Message Add
function addMsg(text, sender) {
    const chatMessages = document.getElementById('chatMessages');
    if (!chatMessages) return;
    
    const div = document.createElement('div');
    div.className = 'message message-' + sender;
    div.textContent = text;
    chatMessages.appendChild(div);
    chatMessages.scrollTop = 99999;
}

// ⏳ Typing Indicator
function showTyping() {
    const chatMessages = document.getElementById('chatMessages');
    if (!chatMessages) return;
    
    const div = document.createElement('div');
    div.className = 'message message-ai';
    div.id = 'typing';
    div.innerHTML = '<span class="loading"></span> Soch raha hoon...';
    chatMessages.appendChild(div);
    chatMessages.scrollTop = 99999;
}

function hideTyping() {
    const t = document.getElementById('typing');
    if (t) t.remove();
}

// 💬 Send Message (Chat)
async function sendMessage() {
    const inp = document.getElementById('chatInput');
    const text = inp.value.trim();
    if (!text) return;
    
    addMsg(text, 'user');
    inp.value = '';
    showTyping();
    
    try {
        const r = await fetch(API_BASE + '/api/ai-chat', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({message: text, user_id: userId})
        });
        const d = await r.json();
        hideTyping();
        
        if (d.success) {
            addMsg(d.response, 'ai');
        } else {
            throw new Error(d.error);
        }
    } catch (e) {
        hideTyping();
        addMsg('⚠️ Server busy. Try again!', 'error');
    }
}

// 🎤 Voice Input
function startVoice() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
        showToast('Voice not supported', 'error');
        return;
    }
    const r = new SR();
    r.lang = 'hi-IN';
    r.start();
    r.onresult = e => {
        document.getElementById('chatInput').value = e.results[0][0].transcript;
        sendMessage();
    };
}

// 🪟 Modal Functions
function openModal(key) {
    const f = FEATURES[key];
    if (!f) return;
    
    const modal = document.getElementById('modal');
    const content = document.getElementById('modal-content');
    if (!modal || !content) return;

    if (f.type === 'upload') {
        const uploadText = key === 'plant' ? '📤 Click to upload plant photo' : '📤 Click to upload image';
        const onchangeFunc = key === 'plant' ? 'uploadPlantImage()' : 'uploadImage()';
        
        content.innerHTML = `
            <h2>${f.icon} ${f.title}</h2>
            <div class="upload-area" onclick="document.getElementById('upfile').click()">${uploadText}</div>
            <input type="file" id="upfile" accept="image/*" style="display:none" onchange="${onchangeFunc}">
            <div class="feature-result" id="result">Result here...</div>
        `;
    } else if (f.auto) {
        content.innerHTML = `<h2>${f.icon} ${f.title}</h2><div class="feature-result" id="result">Loading...</div>`;
        setTimeout(() => executeFeature(key, ''), 300);
    } else {
        content.innerHTML = `
            <h2>${f.icon} ${f.title}</h2>
            <input class="feature-input" id="featInput" placeholder="${f.ph}" onkeypress="if(event.key==='Enter')executeFeature('${key}',this.value)">
            <button class="btn btn-primary" onclick="executeFeature('${key}',document.getElementById('featInput').value)" style="width:100%">Search</button>
            <div class="feature-result" id="result">Result here...</div>
        `;
    }
    modal.classList.add('active');
}

function closeModal() {
    const modal = document.getElementById('modal');
    if (modal) modal.classList.remove('active');
}

// 🔍 Execute Feature
async function executeFeature(key, query) {
    const f = FEATURES[key];
    const res = document.getElementById('result');
    if (!res) return;
    
    res.innerHTML = '<span class="loading"></span> Loading...';
    
    try {
        const url = API_BASE + f.url + encodeURIComponent(f.get(query));
        const r = await fetch(url, {method: f.method});
        const d = await r.json();

        if (key === 'weather') {
            res.innerHTML = d.error ? '❌ ' + d.error : '🌡️ ' + d.result;
        } else if (key === 'stock') {
            res.innerHTML = d.error ? '❌ ' + d.error : '<strong>' + d.symbol + '</strong> ₹' + d.current_price;
        } else if (key === 'cricket') {
            res.innerHTML = d.matches ? d.matches.map(m => '<div><strong>' + m.title + '</strong><br>' + m.status + '</div>').join('') : 'No matches';
        } else if (key === 'horoscope') {
            res.innerHTML = d.success ? '🔮 <strong>' + d.hindi_name + '</strong><br>' + d.horoscope : '❌ ' + d.error;
        } else if (key === 'train') {
            res.innerHTML = d.success ? '🚆 <strong>' + d.train_number + '</strong><br>' + d.train_name : '❌ Error';
        } else if (key === 'mandi') {
            res.innerHTML = d.rates ? d.rates.map(r => '<div>' + r.market + ': ' + r.price + '</div>').join('') : 'No data';
        } else if (key === 'news') {
            res.innerHTML = d.news ? d.news.slice(0, 5).map(n => '<div><a href="' + n.url + '" target="_blank">' + n.title + '</a></div>').join('') : 'No news';
        }
    } catch (e) {
        res.innerHTML = '❌ Error: ' + e.message;
    }
}

// 👁️ Upload Image (Vision)
async function uploadImage() {
    const file = document.getElementById('upfile').files[0];
    if (!file) return;
    
    const res = document.getElementById('result');
    res.innerHTML = '<span class="loading"></span> Analyzing...';
    
    const fd = new FormData();
    fd.append('image', file);
    fd.append('prompt', 'Describe this image in detail');
    
    try {
        const r = await fetch(API_BASE + '/api/vision', {method: 'POST', body: fd});
        const d = await r.json();
        res.innerHTML = d.success ? d.analysis : '❌ ' + d.error;
    } catch (e) {
        res.innerHTML = '❌ Upload failed';
    }
}

// 🌱 Upload Plant Image
async function uploadPlantImage() {
    const file = document.getElementById('upfile').files[0];
    if (!file) return;
    
    const res = document.getElementById('result');
    res.innerHTML = '<span class="loading"></span> Paudha pehchan raha hoon...';
    
    const reader = new FileReader();
    reader.readAsDataURL(file);
    
    reader.onload = async () => {
        const base64 = reader.result.split(',')[1];
        
        try {
            const r = await fetch(API_BASE + '/api/u11/webhook', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({image: base64, action: 'identify'})
            });
            const d = await r.json();
            
            if (d.success) {
                res.innerHTML = `
                    🌱 <b>${d.plant_name}</b><br>
                    🎯 Confidence: ${d.probability}%<br>
                    📛 Common Names: ${d.common_names?.join(', ') || 'N/A'}<br>
                    📝 ${d.description?.substring(0, 200)}...
                `;
            } else {
                res.innerHTML = '❌ ' + d.error;
            }
        } catch (e) {
            res.innerHTML = '❌ Error: ' + e.message;
        }
    };
}

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

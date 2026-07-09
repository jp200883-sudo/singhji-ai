// 🦁 Singh Ji AI Ultra v7.0 — Frontend JS Update
// Video + Image + Butterfly Effect modules

const API_BASE = "https://singhji-api-production-85ca.up.railway.app";

// ============ VIDEO MODULE ============

async function generateVideo(email, prompt, duration = 5) {
    try {
        const response = await fetch(`${API_BASE}/api/oauth_connector/video/generate?email=${encodeURIComponent(email)}&prompt=${encodeURIComponent(prompt)}&duration=${duration}`);
        const data = await response.json();

        if (data.success) {
            showNotification(`🎬 Video generating! ID: ${data.video_id}`, 'success');
            return data;
        } else {
            showNotification(`❌ ${data.message}`, 'error');
        }
    } catch (e) {
        showNotification('❌ Video generation failed!', 'error');
    }
}

async function checkVideoStatus(videoId) {
    try {
        const response = await fetch(`${API_BASE}/api/oauth_connector/video/status/${videoId}`);
        return await response.json();
    } catch (e) {
        console.error("Status check failed:", e);
    }
}

async function downloadVideo(videoId) {
    try {
        const response = await fetch(`${API_BASE}/api/oauth_connector/video/download/${videoId}`);
        const data = await response.json();

        if (data.success) {
            window.open(data.clean_video_url, '_blank');
        } else {
            showNotification(`⏳ ${data.message}`, 'info');
        }
    } catch (e) {
        showNotification('❌ Download failed!', 'error');
    }
}

// ============ IMAGE MODULE ============

async function generateImage(prompt, style = 'realistic', width = 1024, height = 1024) {
    try {
        const url = `${API_BASE}/api/aavishkar/image/generate?prompt=${encodeURIComponent(prompt)}&style=${style}&width=${width}&height=${height}`;
        const response = await fetch(url);

        if (response.ok) {
            const blob = await response.blob();
            const imageUrl = URL.createObjectURL(blob);
            showImage(imageUrl, prompt);
            showNotification('🎨 Image generated!', 'success');
            return imageUrl;
        } else {
            showNotification('❌ Image generation failed!', 'error');
        }
    } catch (e) {
        showNotification('❌ Image generation failed!', 'error');
    }
}

async function butterflyEffect(imageUrl, prompt = 'butterfly flying, magical, dreamy') {
    try {
        const url = `${API_BASE}/api/aavishkar/image/butterfly-effect?image_url=${encodeURIComponent(imageUrl)}&prompt=${encodeURIComponent(prompt)}`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.success) {
            showNotification(`🦋 ${data.message}`, 'success');
            return data;
        }
    } catch (e) {
        showNotification('❌ Butterfly effect failed!', 'error');
    }
}

// ============ UI HELPERS ============

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => notification.remove(), 3000);
}

function showImage(imageUrl, prompt) {
    const container = document.getElementById('image-container');
    if (container) {
        container.innerHTML = `
            <div class="image-card">
                <img src="${imageUrl}" alt="${prompt}">
                <p>${prompt}</p>
                <button onclick="butterflyEffect('${imageUrl}')">🦋 Butterfly Effect</button>
            </div>
        `;
    }
}

// ============ EVENT LISTENERS ============

document.addEventListener('DOMContentLoaded', () => {
    // Video generate button
    const videoBtn = document.getElementById('generate-video-btn');
    if (videoBtn) {
        videoBtn.addEventListener('click', () => {
            const email = document.getElementById('user-email').value;
            const prompt = document.getElementById('video-prompt').value;
            const duration = document.getElementById('video-duration').value;
            generateVideo(email, prompt, duration);
        });
    }
    // ====== 🎬 VIDEO GENERATOR ======
async function generateVideo() {
    const output = document.getElementById('video-output');
    const email = document.getElementById('videoEmail').value;
    const prompt = document.getElementById('videoPrompt').value;
    const platform = document.getElementById('videoPlatform').value;
    const duration = document.getElementById('videoDuration').value;

    if (!email || !prompt) {
        output.innerHTML = '<span style="color:#ff4444;">❌ Email aur Prompt dono daalein!</span>';
        return;
    }

    output.innerHTML = '<span class="loading">🎬 Video generate ho raha hai...</span>';

    const data = await smartFetch(`/api/oauth_connector/video/generate?email=${encodeURIComponent(email)}&prompt=${encodeURIComponent(prompt)}&duration=${duration}`);

    if (data.success) {
        output.innerHTML = `
            <strong style="color:#00ff88;">🎬 Video Generated!</strong><br>
            Video ID: ${data.video_id}<br>
            Platform: ${data.platform_name}<br>
            Duration: ${data.duration}s<br>
            Status: ${data.status}<br>
            Watermark: ${data.watermark ? 'Yes (will be removed)' : 'No'}<br>
            <small style="color:#888;">${data.message}</small>
        `;
        // Store video ID for status check
        window.currentVideoId = data.video_id;
    } else {
        output.innerHTML = `<span style="color:#ff4444;">❌ ${data.message || 'Failed'}</span>`;
    }
}

async function checkVideoStatus() {
    const output = document.getElementById('video-output');
    const videoId = window.currentVideoId;

    if (!videoId) {
        output.innerHTML = '<span style="color:#ff4444;">❌ Pehle video generate karo!</span>';
        return;
    }

    output.innerHTML = '<span class="loading">⏳ Status check kar raha hoon...</span>';

    const data = await smartFetch(`/api/oauth_connector/video/status/${videoId}`);

    if (data.success) {
        output.innerHTML = `
            <strong style="color:#ffd700;">📊 Video Status</strong><br>
            ID: ${data.video_id}<br>
            Status: ${data.status}<br>
            Progress: ${data.progress || 0}%<br>
            ${data.video_url ? `URL: <a href="${data.video_url}" target="_blank">View</a>` : ''}<br>
            <small style="color:#888;">${data.message}</small>
        `;
    } else {
        output.innerHTML = `<span style="color:#ff4444;">❌ ${data.error || 'Status check failed'}</span>`;
    }
}

async function downloadVideo() {
    const output = document.getElementById('video-output');
    const videoId = window.currentVideoId;

    if (!videoId) {
        output.innerHTML = '<span style="color:#ff4444;">❌ Pehle video generate karo!</span>';
        return;
    }

    output.innerHTML = '<span class="loading">📥 Download link generate ho raha hai...</span>';

    const data = await smartFetch(`/api/oauth_connector/video/download/${videoId}`);

    if (data.success) {
        output.innerHTML = `
            <strong style="color:#00ff88;">📥 Download Ready!</strong><br>
            <a href="${data.clean_video_url}" target="_blank" style="color:#ffd700;">Click to Download Clean Video</a><br>
            <small style="color:#888;">Watermark removed!</small>
        `;
    } else {
        output.innerHTML = `<span style="color:#ffaa00;">⏳ ${data.message || 'Video abhi ban raha hai...'}</span>`;
    }
}

    // Image generate button
    const imageBtn = document.getElementById('generate-image-btn');
    if (imageBtn) {
        imageBtn.addEventListener('click', () => {
            const prompt = document.getElementById('image-prompt').value;
            const style = document.getElementById('image-style').value;
            generateImage(prompt, style);
        });
    }
});

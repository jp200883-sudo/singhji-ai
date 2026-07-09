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

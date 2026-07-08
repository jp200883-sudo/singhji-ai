/**
 * Singh Ji AI Ultra v7.0 — India Super App
 * Main JavaScript File
 * Features: Video Aggregator, YouTube Creator, Watermark Remover, CDN Delivery
 * Backend: Render API (singhji-api) + AWS EC2 (15.134.36.7)
 */

// ============================================
// CONFIGURATION
// ============================================
const CONFIG = {
    API_BASE: 'https://singhji-api.onrender.com',
    // Fallback: AWS EC2
    API_FALLBACK: 'http://15.134.36.7:8000',
    VERSION: '7.0',
    BUILD_DATE: '2026-07-08',
    LANGUAGES: ['hi', 'en', 'bn', 'ta', 'te', 'mr', 'gu', 'kn', 'ml', 'pa', 'ur', 'or', 'as', 'ne', 'si', 'sd', 'kok', 'mni', 'doi', 'sat', 'mai', 'brx', 'bho', 'raj', 'awa', 'hne'],
    PLATFORMS: ['seedance', 'kling', 'hailuo', 'luma', 'pika', 'veo'],
    CDN_PROVIDERS: ['bunny', 'cloudflare_r2', 'cloudflare_stream']
};

// ============================================
// STATE MANAGEMENT
// ============================================
const AppState = {
    user: null,
    token: localStorage.getItem('sj_token'),
    language: localStorage.getItem('sj_lang') || 'hi',
    theme: localStorage.getItem('sj_theme') || 'dark',
    currentModule: 'home',
    videoQueue: [],
    platformStatus: {},
    youtubeConnected: false,
    quotaUsed: 0
};

// ============================================
// API CLIENT
// ============================================
class APIClient {
    constructor() {
        this.base = CONFIG.API_BASE;
        this.fallback = CONFIG.API_FALLBACK;
        this.retryCount = 0;
        this.maxRetries = 2;
    }

    async request(endpoint, options = {}) {
        const url = `${this.base}${endpoint}`;
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };

        if (AppState.token) {
            headers['Authorization'] = `Bearer ${AppState.token}`;
        }

        try {
            const response = await fetch(url, {
                ...options,
                headers,
                signal: AbortSignal.timeout(30000) // 30s timeout
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            this.retryCount = 0;
            return await response.json();

        } catch (error) {
            console.warn(`API fail (attempt ${this.retryCount + 1}):`, error);

            if (this.retryCount < this.maxRetries) {
                this.retryCount++;
                // Try fallback
                this.base = this.fallback;
                return this.request(endpoint, options);
            }

            throw error;
        }
    }

    get(endpoint) {
        return this.request(endpoint, { method: 'GET' });
    }

    post(endpoint, data) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }
}

const api = new APIClient();

// ============================================
// VIDEO AGGREGATOR MODULE
// ============================================
class VideoAggregator {
    constructor() {
        this.platforms = CONFIG.PLATFORMS;
        this.isGenerating = false;
    }

    async checkPlatformStatus() {
        try {
            const status = await api.get('/api/v1/platforms/status');
            AppState.platformStatus = status;
            this.renderPlatformCards(status);
            return status;
        } catch (e) {
            console.error('Platform status check failed:', e);
            return {};
        }
    }

    renderPlatformCards(status) {
        const container = document.getElementById('platform-grid');
        if (!container) return;

        const platformConfig = {
            seedance: { name: 'Seedance 2.0', icon: 'fa-seedling', color: 'yellow', credits: '100/day' },
            kling: { name: 'Kling AI', icon: 'fa-bolt', color: 'blue', credits: '66/day' },
            hailuo: { name: 'Hailuo AI', icon: 'fa-wave-square', color: 'pink', credits: '3/day' },
            luma: { name: 'Luma Ray', icon: 'fa-sun', color: 'green', credits: '8/month' },
            pika: { name: 'Pika Labs', icon: 'fa-paw', color: 'indigo', credits: '150 credits' },
            veo: { name: 'Google Veo', icon: 'fa-google', color: 'purple', credits: '10/month' }
        };

        container.innerHTML = Object.entries(platformConfig).map(([key, config]) => {
            const platStatus = status[key] || { valid: false, credits: 0, status: 'unknown' };
            const isActive = platStatus.valid && platStatus.credits > 0;
            const percent = platStatus.credits ? Math.min((platStatus.credits / parseInt(config.credits)) * 100, 100) : 0;
            const lowCredit = percent < 25;

            return `
                <div class="platform-card ${isActive ? 'active' : 'inactive'}" data-platform="${key}">
                    <div class="platform-header">
                        <i class="fas ${config.icon} platform-icon text-${config.color}-500"></i>
                        <div>
                            <h4>${config.name}</h4>
                            <span class="status-badge ${isActive ? 'green' : 'red'}">
                                ${isActive ? '● Active' : '○ Inactive'}
                            </span>
                        </div>
                        <span class="credit-badge">${config.credits}</span>
                    </div>
                    <div class="credit-bar">
                        <div class="progress-fill ${lowCredit ? 'red' : ''}" style="width: ${percent}%"></div>
                    </div>
                    <p class="credit-text">${platStatus.credits || 0} credits left</p>
                    ${lowCredit ? '<p class="warning-text">⚠️ Low credits! Refill soon.</p>' : ''}
                </div>
            `;
        }).join('');
    }

    async generateVideo(prompt, options = {}) {
        if (this.isGenerating) {
            showToast('⚠️ Already generating! Please wait...', 'warning');
            return;
        }

        this.isGenerating = true;
        const btn = document.getElementById('generate-btn');
        if (btn) {
            btn.disabled = true;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';
        }

        try {
            showToast('🎬 Video generation started! Smart router active...', 'info');

            const result = await api.post('/api/v1/video/generate', {
                prompt,
                duration: options.duration || 5,
                aspect_ratio: options.aspectRatio || '16:9',
                resolution: options.resolution || '1080p',
                language: AppState.language,
                style: options.style || 'cinematic',
                remove_watermark: options.removeWatermark !== false,
                platform_preference: options.platform || 'auto'
            });

            if (result.success) {
                showToast(`✅ Video generated! Platform: ${result.platform_used}`, 'success');
                this.addToQueue(result);
                return result;
            } else {
                throw new Error(result.error || 'Generation failed');
            }

        } catch (error) {
            console.error('Video generation error:', error);
            showToast(`❌ Error: ${error.message}`, 'error');
        } finally {
            this.isGenerating = false;
            if (btn) {
                btn.disabled = false;
                btn.innerHTML = '<i class="fas fa-magic"></i> Generate Video';
            }
        }
    }

    addToQueue(video) {
        AppState.videoQueue.unshift({
            ...video,
            createdAt: new Date().toISOString(),
            status: 'completed'
        });

        if (AppState.videoQueue.length > 50) {
            AppState.videoQueue.pop();
        }

        this.renderVideoQueue();
    }

    renderVideoQueue() {
        const container = document.getElementById('video-queue');
        if (!container) return;

        if (AppState.videoQueue.length === 0) {
            container.innerHTML = '<p class="empty-text">No videos yet. Generate your first video!</p>';
            return;
        }

        container.innerHTML = AppState.videoQueue.map(video => `
            <div class="video-item" data-id="${video.id}">
                <div class="video-thumb">
                    <img src="${video.thumbnail_url || 'assets/placeholder.jpg'}" alt="${video.title}">
                    <span class="video-duration">${video.duration || '5s'}</span>
                </div>
                <div class="video-info">
                    <h5>${video.title || 'Untitled'}</h5>
                    <p class="video-meta">
                        <span class="platform-tag ${video.platform}">${video.platform}</span>
                        <span class="time-ago">${timeAgo(video.createdAt)}</span>
                    </p>
                </div>
                <div class="video-actions">
                    <button onclick="downloadVideo('${video.video_url}')" title="Download">
                        <i class="fas fa-download"></i>
                    </button>
                    <button onclick="shareVideo('${video.id}')" title="Share">
                        <i class="fas fa-share-alt"></i>
                    </button>
                    <button onclick="uploadToYouTube('${video.id}')" title="Upload to YouTube">
                        <i class="fab fa-youtube"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }
}

// ============================================
// YOUTUBE CREATOR MODULE
// ============================================
class YouTubeCreator {
    constructor() {
        this.isConnected = false;
        this.channelInfo = null;
    }

    async connectYouTube() {
        try {
            // OAuth 2.0 flow
            const authUrl = await api.get('/api/v1/youtube/auth-url');
            window.open(authUrl.url, '_blank', 'width=500,height=600');

            showToast('🔗 YouTube auth opened in new tab!', 'info');

            // Poll for connection status
            this.pollConnectionStatus();
        } catch (e) {
            showToast('❌ YouTube connection failed!', 'error');
        }
    }

    async pollConnectionStatus() {
        const checkInterval = setInterval(async () => {
            try {
                const status = await api.get('/api/v1/youtube/status');
                if (status.connected) {
                    this.isConnected = true;
                    AppState.youtubeConnected = true;
                    this.channelInfo = status.channel;
                    clearInterval(checkInterval);
                    showToast(`✅ Connected: ${status.channel.name}!`, 'success');
                    this.renderChannelInfo();
                }
            } catch (e) {
                console.log('Waiting for YouTube auth...');
            }
        }, 3000);

        // Stop after 5 minutes
        setTimeout(() => clearInterval(checkInterval), 300000);
    }

    renderChannelInfo() {
        const container = document.getElementById('youtube-channel-info');
        if (!container || !this.channelInfo) return;

        container.innerHTML = `
            <div class="channel-card">
                <img src="${this.channelInfo.profile_image}" alt="Channel" class="channel-avatar">
                <div class="channel-details">
                    <h4>${this.channelInfo.channel_name}</h4>
                    <p>${this.channelInfo.subscribers.toLocaleString()} subscribers</p>
                    <p>${this.channelInfo.total_views.toLocaleString()} total views</p>
                </div>
                <div class="channel-stats">
                    <div class="stat">
                        <span class="stat-value">${this.channelInfo.total_videos}</span>
                        <span class="stat-label">Videos</span>
                    </div>
                </div>
            </div>
        `;
    }

    async createYouTubeVideo(topic, options = {}) {
        showToast('🎬 Starting YouTube Creator pipeline...', 'info');

        try {
            // Step 1: Generate script
            showToast('📝 AI script likh raha hai...', 'info');
            const script = await api.post('/api/v1/youtube/script', {
                topic,
                language: options.language || AppState.language,
                duration: options.duration || 120,
                style: options.style || 'engaging',
                category: options.category || 'education'
            });

            // Step 2: Generate video
            showToast('🎬 Video generate ho raha hai...', 'info');
            const video = await api.post('/api/v1/youtube/video', {
                script_id: script.id,
                style: options.videoStyle || 'cinematic'
            });

            // Step 3: Generate thumbnail
            showToast('🖼️ Thumbnail ban raha hai...', 'info');
            const thumbnail = await api.post('/api/v1/youtube/thumbnail', {
                prompt: script.thumbnail_prompt,
                style: options.thumbnailStyle || 'viral'
            });

            // Step 4: Upload to YouTube
            showToast('📤 YouTube pe upload ho raha hai...', 'info');
            const upload = await api.post('/api/v1/youtube/upload', {
                video_path: video.path,
                thumbnail_path: thumbnail.path,
                title: script.title,
                description: script.description,
                tags: script.tags,
                category_id: script.category_id,
                privacy: options.privacy || 'public',
                schedule: options.schedule || null
            });

            if (upload.success) {
                showToast(`✅ Video uploaded! ${upload.video_url}`, 'success');
                return upload;
            }

        } catch (error) {
            console.error('YouTube creation error:', error);
            showToast(`❌ Error: ${error.message}`, 'error');
        }
    }

    async getAnalytics() {
        try {
            const analytics = await api.get('/api/v1/youtube/analytics');
            this.renderAnalytics(analytics);
            return analytics;
        } catch (e) {
            console.error('Analytics fetch failed:', e);
        }
    }

    renderAnalytics(data) {
        const container = document.getElementById('youtube-analytics');
        if (!container) return;

        container.innerHTML = `
            <div class="analytics-grid">
                <div class="analytics-card">
                    <i class="fas fa-eye text-blue-500"></i>
                    <h5>${data.summary.total_views_recent.toLocaleString()}</h5>
                    <p>Recent Views</p>
                </div>
                <div class="analytics-card">
                    <i class="fas fa-thumbs-up text-green-500"></i>
                    <h5>${data.summary.total_likes_recent.toLocaleString()}</h5>
                    <p>Recent Likes</p>
                </div>
                <div class="analytics-card">
                    <i class="fas fa-chart-line text-orange-500"></i>
                    <h5>${data.summary.avg_views_per_video.toFixed(0)}</h5>
                    <p>Avg Views/Video</p>
                </div>
            </div>
            <div class="recommendations">
                <h6>💡 AI Recommendations</h6>
                ${data.recommendations.map(r => `<p>• ${r}</p>`).join('')}
            </div>
        `;
    }
}

// ============================================
// WATERMARK REMOVER MODULE
// ============================================
class WatermarkTool {
    constructor() {
        this.isProcessing = false;
    }

    async removeWatermark(file, platform) {
        if (this.isProcessing) {
            showToast('⚠️ Already processing!', 'warning');
            return;
        }

        this.isProcessing = true;
        showToast('🧹 Watermark hata raha hai...', 'info');

        try {
            const formData = new FormData();
            formData.append('video', file);
            formData.append('platform', platform);
            formData.append('method', 'auto');

            const response = await fetch(`${CONFIG.API_BASE}/api/v1/watermark/remove`, {
                method: 'POST',
                body: formData,
                headers: {
                    'Authorization': `Bearer ${AppState.token}`
                }
            });

            const result = await response.json();

            if (result.success) {
                showToast(`✅ Watermark removed! Method: ${result.method_used}`, 'success');
                return result;
            } else {
                throw new Error(result.error);
            }

        } catch (error) {
            console.error('Watermark removal error:', error);
            showToast(`❌ Error: ${error.message}`, 'error');
        } finally {
            this.isProcessing = false;
        }
    }
}

// ============================================
// CDN DELIVERY MODULE
// ============================================
class CDNDelivery {
    async uploadToCDN(file, provider = 'bunny') {
        showToast(`☁️ Uploading to ${provider}...`, 'info');

        try {
            const formData = new FormData();
            formData.append('video', file);
            formData.append('provider', provider);

            const response = await fetch(`${CONFIG.API_BASE}/api/v1/cdn/upload`, {
                method: 'POST',
                body: formData,
                headers: {
                    'Authorization': `Bearer ${AppState.token}`
                }
            });

            const result = await response.json();

            if (result.success) {
                showToast(`✅ Uploaded! CDN URL: ${result.cdn_url}`, 'success');
                return result;
            } else {
                throw new Error(result.error);
            }

        } catch (error) {
            console.error('CDN upload error:', error);
            showToast(`❌ Upload failed: ${error.message}`, 'error');
        }
    }

    async getSignedUrl(videoPath, expiryHours = 24) {
        try {
            const result = await api.post('/api/v1/cdn/signed-url', {
                video_path: videoPath,
                expiry_hours: expiryHours
            });
            return result.url;
        } catch (e) {
            console.error('Signed URL error:', e);
            return null;
        }
    }
}

// ============================================
// UI UTILITIES
// ============================================
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-times-circle' : type === 'warning' ? 'fa-exclamation-triangle' : 'fa-info-circle'}"></i>
        <span>${message}</span>
    `;

    document.body.appendChild(toast);

    setTimeout(() => toast.classList.add('show'), 100);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

function timeAgo(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    return `${Math.floor(seconds / 86400)} days ago`;
}

function downloadVideo(url) {
    const a = document.createElement('a');
    a.href = url;
    a.download = `singhji_video_${Date.now()}.mp4`;
    a.click();
    showToast('📥 Download started!', 'success');
}

function shareVideo(videoId) {
    const url = `${window.location.origin}/video/${videoId}`;
    if (navigator.share) {
        navigator.share({ title: 'Singh Ji AI Video', url });
    } else {
        navigator.clipboard.writeText(url);
        showToast('🔗 Link copied to clipboard!', 'success');
    }
}

function uploadToYouTube(videoId) {
    showToast('🎬 Opening YouTube upload...', 'info');
    // Trigger YouTube creator flow
    youtubeCreator.createYouTubeVideo(null, { videoId });
}

// ============================================
// LANGUAGE SUPPORT
// ============================================
const TRANSLATIONS = {
    hi: {
        generate: 'वीडियो बनाओ',
        upload: 'अपलोड करो',
        download: 'डाउनलोड करो',
        share: 'शेयर करो',
        processing: 'प्रोसेसिंग...',
        success: 'सफल!',
        error: 'गड़बड़ हो गई!',
        connect_youtube: 'YouTube जोड़ो',
        create_content: 'कंटेंट बनाओ',
        analytics: 'एनालिटिक्स',
        settings: 'सेटिंग्स'
    },
    en: {
        generate: 'Generate Video',
        upload: 'Upload',
        download: 'Download',
        share: 'Share',
        processing: 'Processing...',
        success: 'Success!',
        error: 'Something went wrong!',
        connect_youtube: 'Connect YouTube',
        create_content: 'Create Content',
        analytics: 'Analytics',
        settings: 'Settings'
    }
};

function t(key) {
    const lang = AppState.language;
    return TRANSLATIONS[lang]?.[key] || TRANSLATIONS.en[key] || key;
}

function setLanguage(lang) {
    AppState.language = lang;
    localStorage.setItem('sj_lang', lang);
    document.documentElement.lang = lang;
    // Reload page to apply translations
    // Or implement live translation
}

// ============================================
// PWA SUPPORT
// ============================================
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js')
        .then(reg => console.log('SW registered:', reg))
        .catch(err => console.log('SW error:', err));
}

// ============================================
// INITIALIZATION
// ============================================
const videoAggregator = new VideoAggregator();
const youtubeCreator = new YouTubeCreator();
const watermarkTool = new WatermarkTool();
const cdnDelivery = new CDNDelivery();

document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Singh Ji AI Ultra v7.0 loaded!');

    // Check platform status on load
    videoAggregator.checkPlatformStatus();

    // Check YouTube connection
    if (AppState.token) {
        youtubeCreator.getAnalytics().catch(() => {});
    }

    // Setup event listeners
    setupEventListeners();
});

function setupEventListeners() {
    // Generate video button
    const generateBtn = document.getElementById('generate-btn');
    if (generateBtn) {
        generateBtn.addEventListener('click', () => {
            const prompt = document.getElementById('video-prompt')?.value;
            if (!prompt) {
                showToast('⚠️ Pehle prompt likho!', 'warning');
                return;
            }
            videoAggregator.generateVideo(prompt, {
                duration: parseInt(document.getElementById('duration')?.value || 5),
                aspectRatio: document.getElementById('aspect-ratio')?.value || '16:9',
                removeWatermark: document.getElementById('remove-watermark')?.checked
            });
        });
    }

    // YouTube connect button
    const youtubeBtn = document.getElementById('connect-youtube');
    if (youtubeBtn) {
        youtubeBtn.addEventListener('click', () => youtubeCreator.connectYouTube());
    }

    // Watermark remove button
    const watermarkBtn = document.getElementById('remove-watermark-btn');
    if (watermarkBtn) {
        watermarkBtn.addEventListener('click', async () => {
            const fileInput = document.getElementById('watermark-input');
            const platform = document.getElementById('watermark-platform')?.value;
            if (fileInput?.files[0]) {
                await watermarkTool.removeWatermark(fileInput.files[0], platform);
            }
        });
    }

    // Language selector
    const langSelect = document.getElementById('language-select');
    if (langSelect) {
        langSelect.value = AppState.language;
        langSelect.addEventListener('change', (e) => setLanguage(e.target.value));
    }
}

// ============================================
// EXPORT FOR MODULES
// ============================================
window.SinghJiAI = {
    config: CONFIG,
    state: AppState,
    api,
    videoAggregator,
    youtubeCreator,
    watermarkTool,
    cdnDelivery,
    showToast,
    t
};

console.log('✅ Singh Ji AI v7.0 — All modules loaded!');

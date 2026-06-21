// Full Auto Voice System
const VOICE_CONFIG = {
    lang: 'hi-IN',
    rate: 1.0,
    pitch: 1.0,
    volume: 1.0
};

// Speech Recognition
function startListening() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
        showToast('❌ Voice not supported in this browser', 'error');
        return;
    }
    
    const recognition = new SR();
    recognition.lang = VOICE_CONFIG.lang;
    recognition.continuous = false;
    recognition.interimResults = false;
    
    recognition.start();
    showToast('🎤 Listening... Speak now!', 'success');
    
    recognition.onresult = async (event) => {
        const transcript = event.results[0][0].transcript;
        showToast('✅ Heard: ' + transcript, 'success');
        
        // Auto-process
        await processAutoCommand(transcript);
    };
    
    recognition.onerror = (event) => {
        showToast('❌ Voice error: ' + event.error, 'error');
    };
    
    recognition.onend = () => {
        console.log('Voice recognition ended');
    };
}

// Auto-process command
async function processAutoCommand(text) {
    showTyping();
    
    try {
        const response = await fetch(API_BASE_URL + '/api/ai-chat', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                message: text,
                user_id: getUserId()
            })
        });
        
        const data = await response.json();
        hideTyping();
        
        if (data.success) {
            // Display text
            addMessage(data.response, 'ai');
            
            // Auto-speak result
            speakResponse(data.response);
            
            // Show auto-detected badge
            if (data.auto_feature) {
                showToast('🤖 Auto-detected: ' + data.intent + ' → ' + data.param, 'success');
            }
        } else {
            throw new Error(data.error);
        }
    } catch (e) {
        hideTyping();
        addMessage('❌ Error: ' + e.message, 'error');
        speakResponse('Sorry, kuch problem ho gayi. Please try again.');
    }
}

// Text-to-Speech with Hindi support
function speakResponse(text) {
    // Clean text for speech (remove emojis, URLs)
    const cleanText = text
        .replace(/[\u{1F300}-\u{1F9FF}]/gu, '')
        .replace(/https?:\/\/\S+/g, 'link')
        .replace(/📍|🌾|🚆|🌤️|📊|🏏|🔮|📰|🛡️|💡|🔗/g, '');
    
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = VOICE_CONFIG.lang;
    utterance.rate = VOICE_CONFIG.rate;
    utterance.pitch = VOICE_CONFIG.pitch;
    utterance.volume = VOICE_CONFIG.volume;
    
    // Voice selection (prefer Hindi voice)
    const voices = window.speechSynthesis.getVoices();
    const hindiVoice = voices.find(v => v.lang.includes('hi') || v.lang.includes('Hindi'));
    if (hindiVoice) {
        utterance.voice = hindiVoice;
    }
    
    window.speechSynthesis.speak(utterance);
    
    // Visual feedback
    showToast('🔊 Speaking...', 'success');
}

// Initialize voices
window.speechSynthesis.onvoiceschanged = () => {
    console.log('Voices loaded:', window.speechSynthesis.getVoices().length);
};

<!DOCTYPE html>
<html lang="hi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🦁 सिंह जी AI Ultra v4.0 — 26 भाषाएं | बोलो, सुनो, जानो</title>
    <link rel="manifest" href="manifest.json">
    <link rel="icon" href="icon-192.png">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Segoe UI', 'Noto Sans Devanagari', 'Noto Sans Bengali', 'Noto Sans Tamil', 'Noto Sans Telugu', 'Noto Sans Malayalam', 'Noto Sans Kannada', 'Noto Sans Gujarati', 'Noto Sans Oriya', 'Noto Sans Punjabi', sans-serif;
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
            min-height: 100vh;
            color: #fff;
        }
        .container { max-width: 900px; margin: 0 auto; padding: 15px; }
        .header {
            text-align: center;
            padding: 20px 0;
            border-bottom: 2px solid #e94560;
            margin-bottom: 15px;
        }
        .header h1 { font-size: 2.2rem; color: #e94560; text-shadow: 0 0 20px rgba(233,69,96,0.5); }
        .header p { color: #aaa; margin-top: 8px; font-size: 1rem; }

        /* 🌍 LANGUAGE SELECTOR */
        .lang-selector {
            display: flex;
            gap: 8px;
            overflow-x: auto;
            padding: 10px 0;
            margin-bottom: 15px;
            scrollbar-width: thin;
        }
        .lang-selector::-webkit-scrollbar { height: 4px; }
        .lang-selector::-webkit-scrollbar-thumb { background: #e94560; border-radius: 2px; }
        .lang-btn {
            padding: 8px 14px;
            border: 1px solid rgba(255,255,255,0.2);
            border-radius: 20px;
            background: rgba(255,255,255,0.05);
            color: #fff;
            cursor: pointer;
            transition: all 0.3s;
            font-size: 0.85rem;
            white-space: nowrap;
            min-width: fit-content;
        }
        .lang-btn:hover { background: rgba(233,69,96,0.2); border-color: #e94560; transform: translateY(-2px); }
        .lang-btn.active {
            background: linear-gradient(135deg, #e94560, #ff6b6b);
            border-color: #e94560;
            box-shadow: 0 0 15px rgba(233,69,96,0.4);
        }
        .lang-btn .lang-name { font-size: 0.75rem; opacity: 0.8; }

        /* 🎤 VOICE SECTION */
        .voice-section {
            text-align: center;
            padding: 15px;
            margin-bottom: 15px;
            border-radius: 20px;
            background: rgba(255,255,255,0.05);
            border: 1px solid rgba(255,255,255,0.1);
        }
        .mic-button {
            width: 90px;
            height: 90px;
            border-radius: 50%;
            background: linear-gradient(135deg, #e94560, #ff6b6b);
            border: none;
            color: #fff;
            font-size: 2.5rem;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 15px auto;
            transition: all 0.3s;
            box-shadow: 0 5px 25px rgba(233,69,96,0.5);
            position: relative;
        }
        .mic-button:hover { transform: scale(1.1); }
        .mic-button.listening {
            animation: micPulse 1.2s infinite;
            background: linear-gradient(135deg, #ff0000, #ff6b6b);
        }
        @keyframes micPulse {
            0% { box-shadow: 0 0 0 0 rgba(233,69,96,0.7); }
            70% { box-shadow: 0 0 0 25px rgba(233,69,96,0); }
            100% { box-shadow: 0 0 0 0 rgba(233,69,96,0); }
        }
        .voice-status-text {
            font-size: 1rem;
            color: #aaa;
            margin-top: 10px;
        }
        .voice-status-text .lang-name { color: #e94560; font-weight: bold; }

        /* 🗣️ SPEAKING INDICATOR */
        .speaking-box {
            display: none;
            text-align: center;
            padding: 15px;
            margin: 15px 0;
            border-radius: 15px;
            background: rgba(0, 210, 106, 0.1);
            border: 1px solid #00d26a;
        }
        .speaking-box.active { display: block; }
        .speaking-box .waves {
            display: flex;
            justify-content: center;
            gap: 4px;
            margin-top: 10px;
        }
        .speaking-box .wave {
            width: 4px;
            height: 15px;
            background: #00d26a;
            border-radius: 2px;
            animation: waveAnim 0.5s ease infinite;
        }
        .speaking-box .wave:nth-child(2) { animation-delay: 0.1s; }
        .speaking-box .wave:nth-child(3) { animation-delay: 0.2s; }
        .speaking-box .wave:nth-child(4) { animation-delay: 0.3s; }
        .speaking-box .wave:nth-child(5) { animation-delay: 0.4s; }
        @keyframes waveAnim {
            0%, 100% { height: 15px; }
            50% { height: 35px; }
        }

        /* 💬 CHAT */
        .chat-container {
            background: rgba(255,255,255,0.05);
            border-radius: 20px;
            border: 1px solid rgba(255,255,255,0.1);
            overflow: hidden;
            margin-bottom: 15px;
        }
        .chat-header {
            background: linear-gradient(90deg, #e94560, #ff6b6b);
            padding: 12px 18px;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .chat-header .avatar {
            width: 36px; height: 36px;
            background: #fff;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.3rem;
        }
        .chat-box {
            height: 300px;
            overflow-y: auto;
            padding: 15px;
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
        .message {
            max-width: 85%;
            padding: 10px 14px;
            border-radius: 16px;
            animation: fadeIn 0.3s ease;
            line-height: 1.5;
            font-size: 0.95rem;
            position: relative;
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .message.user {
            align-self: flex-end;
            background: linear-gradient(135deg, #e94560, #ff6b6b);
            border-bottom-right-radius: 4px;
        }
        .message.ai {
            align-self: flex-start;
            background: rgba(255,255,255,0.1);
            border: 1px solid rgba(255,255,255,0.15);
            border-bottom-left-radius: 4px;
        }
        .message.ai .source-badge {
            font-size: 0.7rem;
            opacity: 0.7;
            margin-bottom: 3px;
            display: block;
        }
        .message .speak-btn {
            position: absolute;
            right: -28px;
            top: 50%;
            transform: translateY(-50%);
            background: none;
            border: none;
            color: #00d26a;
            font-size: 1.1rem;
            cursor: pointer;
            opacity: 0.6;
            transition: opacity 0.2s;
        }
        .message .speak-btn:hover { opacity: 1; }
        .message.loading {
            align-self: flex-start;
            background: rgba(255,255,255,0.05);
            color: #888;
            font-style: italic;
        }
        .chat-input-area {
            display: flex;
            gap: 8px;
            padding: 12px 15px;
            background: rgba(0,0,0,0.2);
            border-top: 1px solid rgba(255,255,255,0.1);
        }
        .chat-input {
            flex: 1;
            padding: 10px 16px;
            border: none;
            border-radius: 22px;
            background: rgba(255,255,255,0.1);
            color: #fff;
            font-size: 0.95rem;
            outline: none;
        }
        .chat-input::placeholder { color: #888; }
        .send-btn {
            padding: 10px 20px;
            border: none;
            border-radius: 22px;
            background: linear-gradient(135deg, #e94560, #ff6b6b);
            color: #fff;
            font-size: 0.95rem;
            cursor: pointer;
            transition: transform 0.2s;
        }
        .send-btn:hover { transform: scale(1.05); }
        .send-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

        /* 🎛️ CONTROLS */
        .controls {
            display: flex;
            justify-content: center;
            gap: 10px;
            margin: 10px 0;
            flex-wrap: wrap;
        }
        .control-btn {
            padding: 8px 16px;
            border: 1px solid rgba(255,255,255,0.2);
            border-radius: 18px;
            background: rgba(255,255,255,0.05);
            color: #fff;
            cursor: pointer;
            transition: all 0.3s;
            font-size: 0.85rem;
        }
        .control-btn:hover { background: rgba(233,69,96,0.2); border-color: #e94560; }
        .control-btn.active { background: rgba(0, 210, 106, 0.2); border-color: #00d26a; }

        /* 📱 INFO BAR */
        .info-bar {
            text-align: center;
            padding: 10px;
            color: #666;
            font-size: 0.8rem;
        }
        .info-bar .highlight { color: #e94560; }

        @media (max-width: 600px) {
            .header h1 { font-size: 1.6rem; }
            .chat-box { height: 250px; }
            .mic-button { width: 70px; height: 70px; font-size: 2rem; }
            .lang-btn { padding: 6px 10px; font-size: 0.8rem; }
        }
    </style>
<base target="_blank">
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <h1>🦁 सिंह जी AI</h1>
            <p>Ultra v4.0 — <span id="current-lang-display">26 भाषाएं</span> | बोलो, सुनो, जानो 🎤</p>
        </div>

        <!-- 🌍 LANGUAGE SELECTOR -->
        <div class="lang-selector" id="lang-selector">
            <!-- Languages injected by JS -->
        </div>

        <!-- 🎤 VOICE SECTION -->
        <div class="voice-section">
            <div class="voice-status-text">
                <span class="lang-name" id="active-lang-name">हिन्दी</span> में बोलो...
                <br><small id="voice-hint">🎤 माइक दबाओ और बोलो</small>
            </div>
            <button class="mic-button" id="mic-btn" onclick="toggleVoice()">🎤</button>
        </div>

        <!-- 🗣️ SPEAKING INDICATOR -->
        <div class="speaking-box" id="speaking-box">
            <div>🔊 <span id="speaking-lang">सिंह जी</span> बोल रहे हैं...</div>
            <div class="waves">
                <div class="wave"></div>
                <div class="wave"></div>
                <div class="wave"></div>
                <div class="wave"></div>
                <div class="wave"></div>
            </div>
        </div>

        <!-- 🎛️ CONTROLS -->
        <div class="controls">
            <button class="control-btn active" id="auto-speak-btn" onclick="toggleAutoSpeak()">
                🔊 ऑटो-बोल
            </button>
            <button class="control-btn" onclick="stopSpeaking()">
                ⏹️ रोको
            </button>
            <button class="control-btn" onclick="clearChat()">
                🗑️ साफ़ करो
            </button>
        </div>

        <!-- 💬 CHAT -->
        <div class="chat-container">
            <div class="chat-header">
                <div class="avatar">🦁</div>
                <div>
                    <div style="font-weight: bold; font-size: 0.95rem;">सिंह जी AI</div>
                    <div style="font-size: 0.75rem; opacity: 0.8;"><span id="chat-lang">हिन्दी</span> | बोलो → सुनो → जानो</div>
                </div>
            </div>
            <div class="chat-box" id="chat-box">
                <div class="message ai">
                    <span class="source-badge">🦁 सिंह जी</span>
                    नमस्ते! मैं सिंह जी AI हूँ। ऊपर भाषा चुनो, माइक दबाओ, और बोलो! 🙏🎤
                    <button class="speak-btn" onclick="speakText('नमस्ते! मैं सिंह जी AI हूँ। ऊपर भाषा चुनो, माइक दबाओ, और बोलो!')">🔊</button>
                </div>
            </div>
            <div class="chat-input-area">
                <input type="text" class="chat-input" id="chat-input" 
                       placeholder="यहाँ लिखें या माइक दबाएं..." 
                       onkeypress="if(event.key==='Enter') sendMessage()">
                <button class="send-btn" id="send-btn" onclick="sendMessage()">भेजें ➤</button>
            </div>
        </div>

        <div class="info-bar">
            🦁 सिंह जी AI Ultra v4.0 | KELA Mode | <span class="highlight">26 भाषाएं</span> | Render + GitHub Pages<br>
            <span class="highlight">"अकेला सही रास्ते पे"</span>
        </div>
    </div>

    <script>
        // ═══════════════════════════════════════════════════════
        // 🌍 26 LANGUAGES DATABASE
        // ═══════════════════════════════════════════════════════
        const LANGUAGES = {
            'hi': { name: 'हिन्दी', nameEn: 'Hindi', speech: 'hi-IN', tts: 'hi-IN', 
                    prompt: 'तुम सिंह जी AI हो। हमेशा हिन्दी में जवाब दो।', 
                    greeting: 'नमस्ते! मैं सिंह जी AI हूँ।' },
            'en': { name: 'English', nameEn: 'English', speech: 'en-US', tts: 'en-US', 
                    prompt: 'You are Singh Ji AI. Always reply in English.', 
                    greeting: 'Hello! I am Singh Ji AI.' },
            'bho': { name: 'भोजपुरी', nameEn: 'Bhojpuri', speech: 'hi-IN', tts: 'hi-IN', 
                     prompt: 'तुम सिंह जी AI हो। हमेशा भोजपुरी में जवाब दो।', 
                     greeting: 'राम राम! हम सिंह जी AI बानी।' },
            'pa': { name: 'ਪੰਜਾਬੀ', nameEn: 'Punjabi', speech: 'pa-IN', tts: 'pa-IN', 
                    prompt: 'ਤੁਸੀਂ ਸਿੰਘ ਜੀ AI ਹੋ। ਹਮੇਸ਼ਾ ਪੰਜਾਬੀ ਵਿੱਚ ਜਵਾਬ ਦਿਓ।', 
                    greeting: 'ਸਤ ਸ੍ਰੀ ਅਕਾਲ! ਮੈਂ ਸਿੰਘ ਜੀ AI ਹਾਂ।' },
            'ta': { name: 'தமிழ்', nameEn: 'Tamil', speech: 'ta-IN', tts: 'ta-IN', 
                    prompt: 'நீங்கள் சிங் ஜி AI. எப்போதும் தமிழில் பதில் அளிக்கவும்।', 
                    greeting: 'வணக்கம்! நான் சிங் ஜி AI.' },
            'te': { name: 'తెలుగు', nameEn: 'Telugu', speech: 'te-IN', tts: 'te-IN', 
                    prompt: 'మీరు సింగ్ జీ AI. ఎల్లప్పుడూ తెలుగులో సమాధానం ఇవ్వండి।', 
                    greeting: 'నమస్తే! నేను సింగ్ జీ AI.' },
            'ml': { name: 'മലയാളം', nameEn: 'Malayalam', speech: 'ml-IN', tts: 'ml-IN', 
                    prompt: 'നിങ്ങൾ സിംഗ് ജി AI ആണ്. എപ്പോഴും മലയാളത്തിൽ മറുപടി നൽകുക।', 
                    greeting: 'നമസ്കാരം! ഞാൻ സിംഗ് ജി AI ആണ്.' },
            'kn': { name: 'ಕನ್ನಡ', nameEn: 'Kannada', speech: 'kn-IN', tts: 'kn-IN', 
                    prompt: 'ನೀವು ಸಿಂಗ್ ಜಿ AI. ಯಾವಾಗಲೂ ಕನ್ನಡದಲ್ಲಿ ಉತ್ತರಿಸಿ।', 
                    greeting: 'ನಮಸ್ಕಾರ! ನಾನು ಸಿಂಗ್ ಜಿ AI.' },
            'mr': { name: 'मराठी', nameEn: 'Marathi', speech: 'mr-IN', tts: 'mr-IN', 
                    prompt: 'तुम्ही सिंह जी AI आहात. नेहमी मराठीत उत्तर द्या।', 
                    greeting: 'नमस्कार! मी सिंह जी AI आहे.' },
            'gu': { name: 'ગુજરાતી', nameEn: 'Gujarati', speech: 'gu-IN', tts: 'gu-IN', 
                    prompt: 'તમે સિંહ જી AI છો. હમેશાં ગુજરાતીમાં જવાબ આપો।', 
                    greeting: 'નમસ્તે! હું સિંહ જી AI છું.' },
            'bn': { name: 'বাংলা', nameEn: 'Bengali', speech: 'bn-IN', tts: 'bn-IN', 
                    prompt: 'আপনি সিংহ জি AI। সর্বদা বাংলায় উত্তর দিন।', 
                    greeting: 'নমস্কার! আমি সিংহ জি AI।' },
            'or': { name: 'ଓଡ଼ିଆ', nameEn: 'Odia', speech: 'or-IN', tts: 'or-IN', 
                    prompt: 'ଆପଣ ସିଂହ ଜୀ AI। ସର୍ବଦା ଓଡ଼ିଆରେ ଉତ୍ତର ଦିଅନ୍ତୁ।', 
                    greeting: 'ନମସ୍କାର! ମୁଁ ସିଂହ ଜୀ AI।' },
            'as': { name: 'অসমীয়া', nameEn: 'Assamese', speech: 'as-IN', tts: 'as-IN', 
                    prompt: 'আপুনি সিংহ জী AI। সদায় অসমীয়াতে উত্তৰ দিয়ক।', 
                    greeting: 'নমস্কাৰ! মই সিংহ জী AI।' },
            'ne': { name: 'नेपाली', nameEn: 'Nepali', speech: 'ne-NP', tts: 'ne-NP', 
                    prompt: 'तपाईं सिंह जी AI हुनुहुन्छ। सधैं नेपालीमा जवाफ दिनुहोस्।', 
                    greeting: 'नमस्ते! म सिंह जी AI हुँ।' },
            'mai': { name: 'मैथिली', nameEn: 'Maithili', speech: 'hi-IN', tts: 'hi-IN', 
                     prompt: 'अहाँ सिंह जी AI छी। हमेशा मैथिली में जवाब दी।', 
                     greeting: 'नमस्कार! हम सिंह जी AI छी।' },
            'sa': { name: 'संस्कृत', nameEn: 'Sanskrit', speech: 'hi-IN', tts: 'hi-IN', 
                    prompt: 'त्वं सिंह जी AI असि। सदा संस्कृते उत्तरं देहि।', 
                    greeting: 'नमस्ते! अहं सिंह जी AI अस्मि।' },
            'ur': { name: 'اردو', nameEn: 'Urdu', speech: 'ur-IN', tts: 'ur-IN', 
                    prompt: 'آپ سنگھ جی AI ہیں۔ ہمیشہ اردو میں جواب دیں۔', 
                    greeting: 'السلام علیکم! میں سنگھ جی AI ہوں۔' },
            'ks': { name: 'کٲشُر', nameEn: 'Kashmiri', speech: 'hi-IN', tts: 'hi-IN', 
                    prompt: 'تہِ سِنگھ جی AI چھُ۔ ہمیشہ کٲشُر منز جواب دِیو۔', 
                    greeting: 'السلام علیکم! بچھس سِنگھ جی AI۔' },
            'sat': { name: 'संथाली', nameEn: 'Santhali', speech: 'hi-IN', tts: 'hi-IN', 
                     prompt: 'आम सिंह जी AI काना। हमेशा संथाली रे जवाब दो।', 
                     greeting: 'जोहार! इं सिंह जी AI काना।' },
            'kok': { name: 'कोंकणी', nameEn: 'Konkani', speech: 'hi-IN', tts: 'hi-IN', 
                     prompt: 'तूं सिंह जी AI आसा। सदांच कोंकणींत उत्तर दी।', 
                     greeting: 'नमस्कार! हांव सिंह जी AI आसा।' },
            'mni': { name: 'মণিপুরী', nameEn: 'Manipuri', speech: 'hi-IN', tts: 'hi-IN', 
                     prompt: 'আপনি সিংহ জী AI। সর্বদা মণিপুরীতে উত্তর দিন।', 
                     greeting: 'খুরুমজরি! আমি সিংহ জী AI।' },
            'brx': { name: 'बोडो', nameEn: 'Bodo', speech: 'hi-IN', tts: 'hi-IN', 
                     prompt: 'नोंगो सिंह जी AI नि। सैथो बोडोआव जाबाय।', 
                     greeting: 'नमस्कार! आं सिंह जी AI नि।' },
            'doi': { name: 'डोगरी', nameEn: 'Dogri', speech: 'hi-IN', tts: 'hi-IN', 
                     prompt: 'तुस सिंह जी AI ओ। हमेशा डोगरी च जवाब देओ।', 
                     greeting: 'नमस्कार! मैं सिंह जी AI आं।' },
            'sd': { name: 'سنڌي', nameEn: 'Sindhi', speech: 'hi-IN', tts: 'hi-IN', 
                    prompt: 'تون سنگھ جي AI آهين۔ هميشه سنڌي ۾ جواب ڏي।', 
                    greeting: 'سلام! مان سنگھ جي AI آهيان।' },
            'raj': { name: 'राजस्थानी', nameEn: 'Rajasthani', speech: 'hi-IN', tts: 'hi-IN', 
                     prompt: 'थारे सिंह जी AI हो। हमेशा राजस्थानी में जवाब द्यो।', 
                     greeting: 'राम राम! म्हारो नांव सिंह जी AI।' },
            'haryanvi': { name: 'हरियाणवी', nameEn: 'Haryanvi', speech: 'hi-IN', tts: 'hi-IN', 
                          prompt: 'तू सिंह जी AI से। हमेशा हरियाणवी में जवाब दे।', 
                          greeting: 'राम राम! मैं सिंह जी AI सूं।' },
        };

        // ═══════════════════════════════════════════════════════
        // 🌐 STATE
        // ═══════════════════════════════════════════════════════
        let currentLang = 'hi';
        let recognition = null;
        let isListening = false;
        let autoSpeak = true;
        const API_BASE = 'https://singhji-api.onrender.com';

        // ═══════════════════════════════════════════════════════
        // 🌍 RENDER LANGUAGE SELECTOR
        // ═══════════════════════════════════════════════════════
        function renderLanguageSelector() {
            const container = document.getElementById('lang-selector');
            container.innerHTML = '';

            for (const [code, data] of Object.entries(LANGUAGES)) {
                const btn = document.createElement('button');
                btn.className = `lang-btn ${code === currentLang ? 'active' : ''}`;
                btn.innerHTML = `${data.name}<br><span class="lang-name">${data.nameEn}</span>`;
                btn.onclick = () => selectLanguage(code);
                container.appendChild(btn);
            }
        }

        function selectLanguage(code) {
            currentLang = code;
            const lang = LANGUAGES[code];

            // Update UI
            document.getElementById('active-lang-name').textContent = lang.name;
            document.getElementById('chat-lang').textContent = lang.name;
            document.getElementById('current-lang-display').textContent = lang.name;
            document.getElementById('voice-hint').textContent = `🎤 ${lang.name} में बोलो`;
            document.getElementById('speaking-lang').textContent = lang.name;
            document.getElementById('chat-input').placeholder = `${lang.name} में लिखें या माइक दबाएं...`;

            // Re-render buttons
            renderLanguageSelector();

            // Re-init speech with new language
            if (recognition) {
                recognition.lang = lang.speech;
            }

            // Welcome message in new language
            appendMessage('ai', `${lang.greeting}\n\n${lang.name} चुनी गई। माइक दबाओ और बोलो! 🎤`, `🦁 ${lang.name}`, true);
        }

        // ═══════════════════════════════════════════════════════
        // 🎤 SPEECH RECOGNITION
        // ═══════════════════════════════════════════════════════
        function initSpeechRecognition() {
            if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
                document.getElementById('voice-hint').textContent = '❌ ब्राउज़र वॉइस सपोर्ट नहीं करता';
                document.getElementById('mic-btn').style.display = 'none';
                return false;
            }

            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            recognition = new SpeechRecognition();
            recognition.continuous = false;
            recognition.interimResults = true;
            recognition.lang = LANGUAGES[currentLang].speech;

            recognition.onstart = () => {
                isListening = true;
                document.getElementById('mic-btn').classList.add('listening');
                document.getElementById('voice-hint').textContent = `🎤 सुन रहा हूँ... ${LANGUAGES[currentLang].name} में बोलो!`;
            };

            recognition.onresult = (event) => {
                let final = '', interim = '';
                for (let i = event.resultIndex; i < event.results.length; i++) {
                    const t = event.results[i][0].transcript;
                    if (event.results[i].isFinal) final += t;
                    else interim += t;
                }

                if (final) {
                    document.getElementById('chat-input').value = final;
                    document.getElementById('voice-hint').textContent = `✅ सुना: "${final}"`;
                    setTimeout(() => sendMessage(), 400);
                } else if (interim) {
                    document.getElementById('chat-input').value = interim;
                }
            };

            recognition.onerror = (e) => {
                isListening = false;
                document.getElementById('mic-btn').classList.remove('listening');
                let err = e.error === 'no-speech' ? 'कोई आवाज़ नहीं' : 
                          e.error === 'audio-capture' ? 'माइक नहीं मिला' :
                          e.error === 'not-allowed' ? 'माइक अनुमति दो' : e.error;
                document.getElementById('voice-hint').textContent = `❌ ${err}`;
            };

            recognition.onend = () => {
                isListening = false;
                document.getElementById('mic-btn').classList.remove('listening');
                document.getElementById('voice-hint').textContent = `🎤 ${LANGUAGES[currentLang].name} में बोलो`;
            };

            return true;
        }

        function toggleVoice() {
            if (!recognition && !initSpeechRecognition()) return;

            if (isListening) {
                recognition.stop();
            } else {
                window.speechSynthesis.cancel();
                recognition.lang = LANGUAGES[currentLang].speech;
                navigator.mediaDevices.getUserMedia({ audio: true })
                    .then(() => recognition.start())
                    .catch(err => {
                        document.getElementById('voice-hint').textContent = '❌ माइक अनुमति दो!';
                    });
            }
        }

        // ═══════════════════════════════════════════════════════
        // 🔊 TEXT TO SPEECH
        // ═══════════════════════════════════════════════════════
        function speakText(text) {
            if (!autoSpeak) return;
            window.speechSynthesis.cancel();

            const u = new SpeechSynthesisUtterance(text);
            u.lang = LANGUAGES[currentLang].tts;
            u.rate = 0.9;
            u.pitch = 1;

            const voices = window.speechSynthesis.getVoices();
            const langVoices = voices.filter(v => v.lang.includes(currentLang) || v.lang.includes(LANGUAGES[currentLang].tts.split('-')[0]));
            if (langVoices.length > 0) u.voice = langVoices[0];

            u.onstart = () => document.getElementById('speaking-box').classList.add('active');
            u.onend = () => document.getElementById('speaking-box').classList.remove('active');
            u.onerror = () => document.getElementById('speaking-box').classList.remove('active');

            window.speechSynthesis.speak(u);
        }

        function stopSpeaking() {
            window.speechSynthesis.cancel();
            document.getElementById('speaking-box').classList.remove('active');
        }

        function toggleAutoSpeak() {
            autoSpeak = !autoSpeak;
            const btn = document.getElementById('auto-speak-btn');
            btn.textContent = autoSpeak ? '🔊 ऑटो-बोल' : '🔇 ऑटो-बोल';
            btn.classList.toggle('active', autoSpeak);
        }

        function clearChat() {
            document.getElementById('chat-box').innerHTML = `
                <div class="message ai">
                    <span class="source-badge">🦁 सिंह जी</span>
                    चैट साफ़ हो गई। ${LANGUAGES[currentLang].name} में बोलो! 🎤
                    <button class="speak-btn" onclick="speakText('चैट साफ़ हो गई। ${LANGUAGES[currentLang].name} में बोलो!')">🔊</button>
                </div>
            `;
        }

        // ═══════════════════════════════════════════════════════
        // 💬 AI CHAT
        // ═══════════════════════════════════════════════════════
        async function sendMessage() {
            const input = document.getElementById('chat-input');
            const sendBtn = document.getElementById('send-btn');
            const message = input.value.trim();
            if (!message) return;

            appendMessage('user', message);
            input.value = '';
            sendBtn.disabled = true;

            const loadingId = appendMessage('loading', '⏳ सिंह जी सोच रहे हैं...');

            try {
                const response = await fetch(`${API_BASE}/api/ai-chat`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        message: message,
                        user_id: 'voice_user_' + Date.now(),
                        system_prompt: LANGUAGES[currentLang].prompt
                    })
                });

                if (!response.ok) throw new Error(`HTTP ${response.status}`);

                const data = await response.json();
                removeMessage(loadingId);

                if (data.success) {
                    let badge = '🦁', src = 'सिंह जी AI';
                    if (data.source === 'groq') { badge = '🚀'; src = 'Groq'; }
                    else if (data.source === 'gemini') { badge = '💎'; src = 'Gemini'; }
                    else if (data.source === 'cerebras') { badge = '⚡'; src = 'Cerebras'; }
                    else if (data.source === 'openrouter') { badge = '🔌'; src = 'OpenRouter'; }
                    else if (data.source === 'local') { badge = '📴'; src = 'Offline'; }

                    appendMessage('ai', data.response, `${badge} ${src} | ${LANGUAGES[currentLang].name}`, true);
                } else {
                    appendMessage('ai', `⚠️ त्रुटि: ${data.error}`, '❌', false);
                }
            } catch (error) {
                removeMessage(loadingId);
                appendMessage('ai', `🙏 क्षमा करें: ${error.message}`, '📴 Offline', false);
            } finally {
                sendBtn.disabled = false;
            }
        }

        function appendMessage(role, text, badge = '', speak = false) {
            const box = document.getElementById('chat-box');
            const div = document.createElement('div');
            div.className = `message ${role}`;
            div.id = 'msg-' + Date.now();

            if (role === 'ai') {
                const clean = text.replace(/<br>/g, ' ').replace(/\n/g, ' ');
                div.innerHTML = `<span class="source-badge">${badge}</span><p>${text.replace(/\n/g, '<br>')}</p><button class="speak-btn" onclick="speakText('${clean.replace(/'/g, "\'")}')">🔊</button>`;
                if (speak) setTimeout(() => speakText(clean), 300);
            } else {
                div.innerHTML = `<p>${text}</p>`;
            }
            box.appendChild(div);
            box.scrollTop = box.scrollHeight;
            return div.id;
        }

        function removeMessage(id) {
            const el = document.getElementById(id);
            if (el) el.remove();
        }

        // ═══════════════════════════════════════════════════════
        // 🚀 INIT
        // ═══════════════════════════════════════════════════════
        document.addEventListener('DOMContentLoaded', () => {
            renderLanguageSelector();
            initSpeechRecognition();
            window.speechSynthesis.getVoices();
            window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
        });

        // PWA
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('sw.js').catch(err => console.log('SW error:', err));
        }
    </script>
</body>
</html>

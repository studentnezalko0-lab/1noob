// Қазіргі таңдалған API провайдері
let currentProvider = localStorage.getItem('api_provider') || 'groq';
let userApiKey = localStorage.getItem(`${currentProvider}_api_key`) || '';

// Қолданыстағы ключті көрсету
function updateActiveKeyDisplay() {
    const activeKeyDiv = document.getElementById("activeKeyInfo");
    const activeKeySpan = document.getElementById("activeKeyDisplay");
    
    if (userApiKey) {
        const maskedKey = userApiKey.substring(0, 10) + '...' + userApiKey.substring(userApiKey.length - 4);
        activeKeySpan.innerText = maskedKey;
        activeKeyDiv.style.display = "flex";
    } else {
        activeKeyDiv.style.display = "none";
    }
}

// API ключін өшіру
function clearApiKey() {
    localStorage.removeItem(`${currentProvider}_api_key`);
    userApiKey = '';
    updateActiveKeyDisplay();
    
    const apiInput = document.getElementById("apiKeyInput");
    if (apiInput) {
        apiInput.value = '';
        apiInput.placeholder = "API ключін тікелей енгізіңіз...";
    }
    
    showApiStatus(`🗑️ API ключі өшірілді. Жаңасын енгізіңіз.`, "info");
    
    const responseDiv = document.getElementById("response");
    if (responseDiv) {
        responseDiv.innerHTML = `💡 Ключ өшірілді. Жаңа API ключін енгізіп, "Сақтау" батырмасын басыңыз.`;
    }
}

// Провайдер ауысқанда
function switchProvider(provider) {
    currentProvider = provider;
    localStorage.setItem('api_provider', provider);
    
    userApiKey = localStorage.getItem(`${provider}_api_key`) || '';
    
    const apiInput = document.getElementById("apiKeyInput");
    if (apiInput) {
        if (userApiKey) {
            const maskedKey = userApiKey.substring(0, 10) + '...' + userApiKey.substring(userApiKey.length - 4);
            apiInput.placeholder = `Ағымдағы ключ: ${maskedKey}`;
            apiInput.value = '';
        } else {
            if (provider === 'gemini') {
                apiInput.placeholder = "Google Gemini API ключін тікелей енгізіңіз (AIza...)";
            } else if (provider === 'grok') {
                apiInput.placeholder = "xAI Grok API ключін тікелей енгізіңіз (xai-...)";
            } else {
                apiInput.placeholder = "Groq API ключін тікелей енгізіңіз (gsk_...)";
            }
        }
    }
    
    // Ақпараттық блоктарды ауыстыру
    const geminiInfo = document.getElementById("geminiInfo");
    const grokInfo = document.getElementById("grokInfo");
    const groqInfo = document.getElementById("groqInfo");
    
    if (geminiInfo && grokInfo && groqInfo) {
        geminiInfo.style.display = provider === 'gemini' ? "block" : "none";
        grokInfo.style.display = provider === 'grok' ? "block" : "none";
        groqInfo.style.display = provider === 'groq' ? "block" : "none";
    }
    
    updateActiveKeyDisplay();
    
    if (userApiKey) {
        let name = provider === 'gemini' ? 'Gemini' : (provider === 'grok' ? 'Grok' : 'Groq');
        showApiStatus(`✅ ${name} API ключі сақталған`, "success");
    } else {
        let name = provider === 'gemini' ? 'Gemini' : (provider === 'grok' ? 'Grok' : 'Groq');
        showApiStatus(`✏️ ${name} API ключін енгізіңіз`, "info");
    }
}

// API ключін сақтау (ТІКЕЛЕЙ ЕНГІЗУ)
function saveApiKey() {
    const apiKeyInput = document.getElementById("apiKeyInput");
    const newApiKey = apiKeyInput.value.trim();
    
    if (!newApiKey) {
        showApiStatus("❌ Қате: API ключін енгізіңіз!", "error");
        return;
    }
    
    // Провайдерге байланысты тексеру (міндетті емес, ескерту ғана)
    if (currentProvider === 'gemini' && !newApiKey.startsWith('AIza')) {
        if (!confirm("Gemini ключі 'AIza...' түрінде басталуы керек. Қалай болса да сақтаймын?")) {
            return;
        }
    }
    
    if (currentProvider === 'grok' && !newApiKey.startsWith('xai-')) {
        if (!confirm("Grok ключі 'xai-...' түрінде басталуы керек. Қалай болса да сақтаймын?")) {
            return;
        }
    }
    
    if (currentProvider === 'groq' && !newApiKey.startsWith('gsk_')) {
        if (!confirm("Groq ключі 'gsk_...' түрінде басталуы керек. Қалай болса да сақтаймын?")) {
            return;
        }
    }
    
    // ТІКЕЛЕЙ САҚТАУ (тексерусіз)
    saveKeyAndUpdate(newApiKey);
}

// Ключті сақтау және жаңарту
function saveKeyAndUpdate(apiKey) {
    userApiKey = apiKey;
    localStorage.setItem(`${currentProvider}_api_key`, apiKey);
    let providerName = currentProvider === 'gemini' ? 'Gemini' : (currentProvider === 'grok' ? 'Grok' : 'Groq');
    showApiStatus(`✅ ${providerName} API ключі тікелей сақталды!`, "success");
    
    const apiInput = document.getElementById("apiKeyInput");
    if (apiInput) {
        apiInput.value = '';
        const maskedKey = apiKey.substring(0, 10) + '...' + apiKey.substring(apiKey.length - 4);
        apiInput.placeholder = `Ағымдағы ключ: ${maskedKey}`;
    }
    
    updateActiveKeyDisplay();
    
    const responseDiv = document.getElementById("response");
    if (responseDiv) {
        responseDiv.innerHTML = `✅ ${providerName} API ключі орнатылды! Енді сұрағыңызды жазыңыз...`;
    }
}

// Статусты көрсету
function showApiStatus(message, type) {
    const apiStatus = document.getElementById("apiStatus");
    if (apiStatus) {
        apiStatus.innerHTML = message;
        apiStatus.className = `api-status ${type}`;
        
        setTimeout(() => {
            if (apiStatus.innerHTML === message) {
                apiStatus.style.opacity = '0';
                setTimeout(() => {
                    if (apiStatus.innerHTML === message) {
                        apiStatus.innerHTML = '';
                        apiStatus.className = 'api-status';
                        apiStatus.style.opacity = '1';
                    }
                }, 500);
            }
        }, 4000);
    }
}

// Нұсқаулық көрсету (өзгеріссіз)
function showApiInstructions() {
    let instructions = '';
    
    if (currentProvider === 'gemini') {
        instructions = `
🔑 <b>Google Gemini API ключін қалай алуға болады:</b><br><br>
1. <a href='https://makersuite.google.com/app/apikey' target='_blank'>Google AI Studio</a> сайтына өтіңіз<br>
2. Google аккаунтыңызбен кіріңіз<br>
3. "Create API Key" батырмасын басыңыз<br>
4. Жаңа ключті көшіріп алыңыз<br>
⚠️ Ключ форматы: <b>AIza...</b>
        `;
    } else if (currentProvider === 'grok') {
        instructions = `
🔑 <b>xAI Grok API ключін қалай алуға болады:</b><br><br>
1. <a href='https://console.x.ai' target='_blank'>xAI Cloud Console</a> сайтына өтіңіз<br>
2. Аккаунт тіркеңіз<br>
3. "API Keys" → "Create API Key"<br>
4. Ключті көшіріңіз<br>
⚠️ Ключ форматы: <b>xai-...</b>
        `;
    } else {
        instructions = `
🔑 <b>Groq API ключін қалай алуға болады:</b><br><br>
1. <a href='https://console.groq.com' target='_blank'>Groq Cloud Console</a> сайтына өтіңіз<br>
2. Аккаунт тіркеңіз (GitHub, Google немесе email арқылы)<br>
3. "API Keys" бөліміне өтіңіз<br>
4. "Create API Key" батырмасын басыңыз<br>
5. Ключті көшіріп алыңыз<br><br>
💰 <b>Тегін!</b> Groq API толығымен тегін!<br>
⚠️ Ключ форматы: <b>gsk_...</b>
        `;
    }
    
    const responseDiv = document.getElementById("response");
    if (responseDiv) {
        responseDiv.innerHTML = instructions;
    }
}

// API функциялары (өзгеріссіз)
async function sendToGroq(question, apiKey) {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: "POST",
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model: 'llama-3.3-70b-versatile',
            messages: [{ role: 'user', content: question }],
            temperature: 0.7,
            max_tokens: 4096
        })
    });
    
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Groq API қатесі (${response.status}): ${errorData.error?.message || response.statusText}`);
    }
    
    const data = await response.json();
    return data.choices?.[0]?.message?.content;
}

async function sendToGemini(question, apiKey) {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            contents: [{ parts: [{ text: question }] }]
        })
    });
    
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (response.status === 403 || response.status === 401) {
            userApiKey = '';
            localStorage.removeItem(`${currentProvider}_api_key`);
            updateActiveKeyDisplay();
            showApiStatus("❌ API ключі жарамсыз болды!", "error");
        }
        throw new Error(`Gemini API қатесі (${response.status}): ${errorData.error?.message || response.statusText}`);
    }
    
    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text;
}

async function sendToGrok(question, apiKey) {
    const response = await fetch('https://api.x.ai/v1/chat/completions', {
        method: "POST",
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model: 'grok-beta',
            messages: [{ role: 'user', content: question }],
            temperature: 0.7,
            max_tokens: 4096
        })
    });
    
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (response.status === 401) {
            userApiKey = '';
            localStorage.removeItem(`${currentProvider}_api_key`);
            updateActiveKeyDisplay();
            showApiStatus("❌ Grok API ключі жарамсыз болды!", "error");
        }
        throw new Error(`Grok API қатесі (${response.status}): ${errorData.error?.message || response.statusText}`);
    }
    
    const data = await response.json();
    return data.choices?.[0]?.message?.content;
}

// Хабарлама жіберу
async function sendMessage() {
    const input = document.getElementById("userInput");
    const responseDiv = document.getElementById("response");
    
    if (!input || !responseDiv) return;
    
    if (!userApiKey) {
        responseDiv.innerHTML = `❌ Алдымен API ключін енгізіп, "Сақтау" батырмасын басыңыз!`;
        return;
    }
    
    const question = input.value.trim();
    if (question === "") {
        responseDiv.innerHTML = "⚠️ Сұрақ жазыңыз!";
        return;
    }
    
    let requestCount = parseInt(localStorage.getItem('request_count') || '0');
    requestCount++;
    localStorage.setItem('request_count', requestCount);
    document.getElementById("count").innerText = requestCount;
    
    responseDiv.innerHTML = '<div class="loading-spinner"></div> Ойлануда...';
    input.value = "";
    
    try {
        let answer;
        
        if (currentProvider === 'gemini') {
            answer = await sendToGemini(question, userApiKey);
        } else if (currentProvider === 'grok') {
            answer = await sendToGrok(question, userApiKey);
        } else {
            answer = await sendToGroq(question, userApiKey);
        }
        
        if (answer) {
            let providerIcon = currentProvider === 'gemini' ? '🔵' : (currentProvider === 'grok' ? '🟢' : '🟣');
            let providerName = currentProvider === 'gemini' ? 'Gemini' : (currentProvider === 'grok' ? 'Grok' : 'Groq');
            responseDiv.innerHTML = `${providerIcon} <b>${providerName} жауабы:</b><br>${answer}`;
        } else {
            responseDiv.innerHTML = "❌ Жауап алынбады. Қайталап көріңіз.";
        }
        
    } catch (error) {
        console.error("Қате:", error);
        responseDiv.innerHTML = `❌ Қате: ${error.message}`;
    }
}

function setupEnterKey() {
    const input = document.getElementById("userInput");
    if (input) {
        input.addEventListener("keypress", function(event) {
            if (event.key === "Enter") {
                event.preventDefault();
                sendMessage();
            }
        });
    }
}

function animateCards() {
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
        setTimeout(() => {
            card.classList.add('show');
        }, index * 100);
    });
}

function toggleTheme() {
    document.body.classList.toggle('dark');
    const btn = document.querySelector('.theme-btn');
    if (btn) {
        btn.textContent = document.body.classList.contains('dark') ? '☀️ Жарық тақырып' : '🌙 Қараңғы тақырып';
    }
}

document.addEventListener("DOMContentLoaded", () => {
    animateCards();
    setupEnterKey();
    
    const radioButtons = document.querySelectorAll('input[name="apiProvider"]');
    radioButtons.forEach(radio => {
        if (radio.value === currentProvider) {
            radio.checked = true;
        }
    });
    
    switchProvider(currentProvider);
    
    const count = parseInt(localStorage.getItem('request_count') || '0');
    document.getElementById("count").innerText = count;
});

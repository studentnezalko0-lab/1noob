let requestCount = 0;
let GROQ_API_KEY = ""; // Бос қалдырыңыз - апай өзі енгізеді

function toggleTheme() {
    document.body.classList.toggle("dark");
    const btn = document.querySelector(".theme-btn");
    if (btn) {
        btn.innerHTML = document.body.classList.contains("dark") ? "Ашық тақырып" : "Қараңғы тақырып";
    }
}

async function sendMessage() {
    const input = document.getElementById("userInput");
    const responseDiv = document.getElementById("response");
    
    if (!input || !responseDiv) return;
    
    const question = input.value.trim();

    if (!question) {
        responseDiv.innerHTML = "Сұрақ жазыңыз";
        return;
    }
    
    // API кілтін тексеру
    if (!GROQ_API_KEY || GROQ_API_KEY === "") {
        responseDiv.innerHTML = `⚠️ Groq API ключі орнатылмаған.<br><br>
        <strong>🔑 GroqCloud-тан API кілтін қалай алуға болады:</strong><br><br>
        1. <a href="https://console.groq.com" target="_blank" style="color: var(--main);">https://console.groq.com</a> сайтына өтіңіз<br>
        2. Google немесе GitHub аккаунтымен кіріңіз<br>
        3. "API Keys" бөліміне өтіңіз<br>
        4. "Create API Key" батырмасын басыңыз<br>
        5. Кілтті көшіріп алыңыз<br>
        6. Осы бетте F12 немесе оң жақ түймені басып "Инспекциялау" -> Console (Консоль) ашыңыз<br>
        7. Консольға мынаны жазыңыз: <strong style="background: #333; padding: 2px 5px;">localStorage.setItem('groq_key', 'СІЗДІҢ_КІЛТІҢІЗ')</strong><br><br>
        Немесе script.js файлының 7-ші жолындағы GROQ_API_KEY = "" ішіне кілтті қойыңыз.`;
        return;
    }

    requestCount++;
    const countSpan = document.getElementById("count");
    if (countSpan) countSpan.innerText = requestCount;

    responseDiv.innerHTML = '<div class="loading-spinner"></div> Ойлануда...';
    input.value = "";

    try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + GROQ_API_KEY,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "llama3-70b-8192",
                messages: [
                    {
                        role: "user",
                        content: question
                    }
                ],
                temperature: 0.7,
                max_tokens: 1024
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            let errorMsg = "Қате " + response.status;
            if (response.status === 401) {
                errorMsg = "❌ API ключі қате. GroqCloud-тан дұрыс кілт алыңыз. https://console.groq.com";
            } else if (response.status === 429) {
                errorMsg = "⏰ Лимиттен асып кеттіңіз. Бір минут күтіңіз, қайталаңыз";
            } else if (errorData.error?.message) {
                errorMsg = errorData.error.message;
            }
            throw new Error(errorMsg);
        }

        const data = await response.json();
        const answer = data.choices?.[0]?.message?.content;

        if (answer) {
            responseDiv.innerHTML = "<b>🤖 Groq (Llama 3) жауабы:</b><br><br>" + answer.replace(/\n/g, "<br>");
        } else {
            responseDiv.innerHTML = "Жауап алынбады";
        }

    } catch (error) {
        console.error("Groq API қатесі:", error);
        responseDiv.innerHTML = "❌ Қате: " + error.message;
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

function setupCardAnimations() {
    const cards = document.querySelectorAll(".card");
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add("show");
            }
        });
    }, { threshold: 0.2 });
    
    cards.forEach(function(card) {
        observer.observe(card);
    });
}

// Сақталған кілтті localStorage-тан оқу
function loadApiKey() {
    const savedKey = localStorage.getItem('groq_key');
    if (savedKey && savedKey !== "") {
        GROQ_API_KEY = savedKey;
        console.log("✅ API ключі жүктелді");
    }
}

// Кілтті сақтау функциясы (консоль арқылы қолдану үшін)
window.saveGroqKey = function(key) {
    if (key && key.startsWith('gsk_')) {
        localStorage.setItem('groq_key', key);
        GROQ_API_KEY = key;
        alert("✅ API ключі сақталды! Енді чатты қолдануға болады.");
        location.reload();
    } else {
        alert("❌ Қате формат! Кілт 'gsk_' әріптерімен басталуы керек.");
    }
};

document.addEventListener("DOMContentLoaded", function() {
    loadApiKey();
    setupEnterKey();
    setupCardAnimations();
    
    // Егер кілт жоқ болса, нұсқаулық көрсету
    if (!GROQ_API_KEY) {
        const responseDiv = document.getElementById("response");
        if (responseDiv) {
            responseDiv.innerHTML = `🔑 <strong>GroqCloud API кілтін енгізіңіз:</strong><br><br>
            📍 <strong>1-әдіс (қарапайым):</strong><br>
            → <a href="https://console.groq.com" target="_blank" style="color: var(--main);">GroqConsole.com</a> сайтына өтіңіз<br>
            → Тіркеліп, API Key алыңыз<br>
            → Төмендегі ұяшыққа кілтті қойып, "Сақтау" басыңыз<br><br>
            <input type="text" id="tempKeyInput" placeholder="gsk_... кілтті қойыңыз" style="width: 70%; padding: 8px; margin-right: 5px;">
            <button onclick="saveGroqKey(document.getElementById('tempKeyInput').value)">💾 Сақтау</button><br><br>
            📍 <strong>2-әдіс (әзірлеушілерге):</strong><br>
            → F12 немесе оң түйме → "Инспекциялау" → Console<br>
            → Мынаны жазыңыз: <strong style="background: #333;">saveGroqKey('gsk_СІЗДІҢ_КІЛТІҢІЗ')</strong>`;
            
            // Input стилін түзету
            const style = document.createElement('style');
            style.textContent = `#tempKeyInput { background: var(--bg); color: var(--text); border: 1px solid var(--main); border-radius: 5px; }`;
            document.head.appendChild(style);
        }
    }
});

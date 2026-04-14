// 🔥 Gemini API KEY - Google AI Studio-дан алыңыз
// Мына сайттан алыңыз: https://aistudio.google.com/
const API_KEY = "";  // AIzaSy... түрінде болады

// 🔢 Сұраныстар санауышы
let requestCount = 0;

/**
 * Қараңғы/ашық тақырыпты ауыстыру функциясы
 */
function toggleTheme() {
    document.body.classList.toggle("dark");
    const themeBtn = document.querySelector(".theme-btn");
    if (document.body.classList.contains("dark")) {
        themeBtn.innerHTML = "☀️ Ашық тақырып";
    } else {
        themeBtn.innerHTML = "🌙 Қараңғы тақырып";
    }
}

/**
 * Gemini API-ға сұрақ жіберу функциясы
 * Google AI Studio арқылы жұмыс істейді
 */
async function sendMessage() {
    const input = document.getElementById("userInput");
    const responseDiv = document.getElementById("response");
    const question = input.value.trim();

    if (question === "") {
        responseDiv.innerHTML = "⚠️ Сұрақ жазыңыз!";
        return;
    }

    if (API_KEY === "МЫНДА_СІЗДІҢ_API_KEY_ҚОЙЫҢЫЗ" || !API_KEY.startsWith("AIza")) {
        responseDiv.innerHTML = "❌ API кілті орнатылмаған!<br>📌 Мына сайттан алыңыз: https://aistudio.google.com/<br>🔑 'Get API key' батырмасын басып, кілтті көшіріңіз.";
        return;
    }

    // Сұраныс санауышын арттыру
    requestCount++;
    document.getElementById("count").innerText = requestCount;

    // Жүктеу индикаторы
    responseDiv.innerHTML = "🤔 Ойлануда... <span class='loading-spinner'></span>";
    
    // Енгізу өрісін босату
    input.value = "";

    try {
        // Gemini API-ге сұраныс (OpenAI орнына)
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                contents: [
                    {
                        role: "user",
                        parts: [
                            { text: question }
                        ]
                    }
                ],
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 500
                }
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || "API қатесі");
        }

        const data = await response.json();
        
        // Gemini жауабын алу
        const geminiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;
        
        if (geminiResponse) {
            responseDiv.innerHTML = `💬 <strong>Gemini жауабы:</strong><br>${geminiResponse}`;
        } else {
            responseDiv.innerHTML = "❌ Жауап алынбады. Қайталап көріңіз.";
        }

    } catch (error) {
        console.error("API қатесі:", error);
        responseDiv.innerHTML = `❌ Қате: ${error.message}<br>
        📌 Тексеріңіз:<br>
        1. API кілті дұрыс па?<br>
        2. Интернет қосылымы тұрақты ма?<br>
        3. Бүгінгі тегін лимитті пайдаланбадыңыз ба? (күніне 1500 сұраныс)`;
    }
}

/**
 * Enter пернесін басқанда сұрақ жіберу
 */
function setupEnterKey() {
    const input = document.getElementById("userInput");
    input.addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            sendMessage();
        }
    });
}

/**
 * Карточкалардың пайда болу анимациясы
 */
function setupCardAnimations() {
    const cards = document.querySelectorAll(".card");
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("show");
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.2,
        rootMargin: "50px"
    });
    
    cards.forEach(card => {
        observer.observe(card);
    });
}

// Бет жүктелгенде
document.addEventListener("DOMContentLoaded", () => {
    setupEnterKey();
    setupCardAnimations();
    
    if (API_KEY === "МЫНДА_СІЗДІҢ_API_KEY_ҚОЙЫҢЫЗ" || !API_KEY.startsWith("AIza")) {
        console.warn("⚠️ Gemini API кілті орнатылмаған");
        const responseDiv = document.getElementById("response");
        if (responseDiv) {
            responseDiv.innerHTML = "⚠️ <strong>Gemini API кілті қажет!</strong><br>📌 <a href='https://aistudio.google.com/' target='_blank'>Google AI Studio</a> сайтына кіріп,<br>🔑 'Get API key' батырмасын басып, кілтті алыңыз.<br>💰 Тегін, кредит картасы қажет емес!";
        }
    }
});

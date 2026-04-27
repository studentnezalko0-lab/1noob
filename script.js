let requestCount = 0;
let GROQ_API_KEY = "    ";

function setupAPIKey() {
    const savedKey = localStorage.getItem('groq_api_key');
    if (savedKey) {
        GROQ_API_KEY = savedKey;
        showMessage("Groq API ключі дайын");
    } else {
        const userKey = prompt("Groq API ключін енгізіңіз (тегін):\nhttps://console.groq.com");
        if (userKey && userKey.trim()) {
            GROQ_API_KEY = userKey.trim();
            localStorage.setItem('groq_api_key', GROQ_API_KEY);
            showMessage("Groq API ключі сақталды");
        } else {
            showMessage("API ключі енгізілмеді. Чат жұмыс істемейді", true);
        }
    }
}

function showMessage(msg, isError = false) {
    const responseDiv = document.getElementById("response");
    if (responseDiv) {
        responseDiv.innerHTML = isError ? "Қате: " + msg : "Ақпарат: " + msg;
        setTimeout(() => {
            if (responseDiv.innerHTML.includes(msg)) {
                responseDiv.innerHTML = "Сұрағыңызды жазыңыз...";
            }
        }, 4000);
    }
}

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
    
    if (!GROQ_API_KEY) {
        responseDiv.innerHTML = "API ключі жоқ. Бетті жаңартып, ключіңізді енгізіңіз.";
        return;
    }

    requestCount++;
    const countSpan = document.getElementById("count");
    if (countSpan) countSpan.innerText = requestCount;

    responseDiv.innerHTML = 'Ойлануда...';
    input.value = "";

    try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + GROQ_API_KEY,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "qwen-qwen-32b",
                messages: [
                    {
                        role: "user",
                        content: "Қазақ тілінде жауап бер. Сұрақ: " + question
                    }
                ],
                temperature: 0.7,
                max_tokens: 2048,
                top_p: 0.95
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            
            if (response.status === 401 || response.status === 403) {
                localStorage.removeItem('groq_api_key');
                GROQ_API_KEY = "";
                throw new Error("API ключі жарамсыз. Бетті жаңартып, жаңа ключ енгізіңіз.");
            }
            
            throw new Error(errorData.error?.message || "Қате " + response.status);
        }

        const data = await response.json();
        const answer = data.choices?.[0]?.message?.content;

        if (answer) {
            responseDiv.innerHTML = "<b>Groq жауабы:</b><br><br>" + answer.replace(/\n/g, '<br>');
        } else {
            responseDiv.innerHTML = "Жауап алынбады. Қайталап көріңіз.";
        }

    } catch (error) {
        console.error("Groq API қатесі:", error);
        responseDiv.innerHTML = "Қате: " + error.message;
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

document.addEventListener("DOMContentLoaded", function() {
    setupAPIKey();
    setupEnterKey();
    setupCardAnimations();
});

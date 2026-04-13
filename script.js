// 🔥 API KEY ОСЫ ЖЕР
const API_KEY = "МЫНДА_ӨЗ_API_KEY_ҚОЙ";

// 🔢 САНАУ
let count = 0;

// 🌙 DARK MODE
function toggleTheme() {
    document.body.classList.toggle("dark");
}

// 🤖 ЧАТ
async function sendMessage() {
    let input = document.getElementById("userInput").value;
    let response = document.getElementById("response");

    if (input === "") {
        response.innerText = "Сұрақ жазыңыз!";
        return;
    }

    // санау
    count++;
    document.getElementById("count").innerText = count;

    response.innerText = "Жауап күтілуде...";

    try {
        let res = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + API_KEY
            },
            body: JSON.stringify({
                model: "gpt-4o-mini",
                messages: [
                    { role: "user", content: input }
                ]
            })
        });

        let data = await res.json();
        response.innerText = data.choices[0].message.content;

    } catch (error) {
        response.innerText = "Қате шықты!";
    }
}

// ✨ АНИМАЦИЯ
const cards = document.querySelectorAll(".card");

function showCards() {
    cards.forEach(card => {
        let position = card.getBoundingClientRect().top;
        let screen = window.innerHeight;

        if (position < screen - 100) {
            card.classList.add("show");
        }
    });
}

window.addEventListener("load", showCards);
window.addEventListener("scroll", showCards);

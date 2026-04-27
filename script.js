let requestCount = 0;

function toggleTheme() {
    document.body.classList.toggle("dark");

    const btn = document.querySelector(".theme-btn");

    if (document.body.classList.contains("dark")) {
        btn.innerHTML = "Ашық тақырып";
    } else {
        btn.innerHTML = "Қараңғы тақырып";
    }
}

const API_KEY = " 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 ";

async function sendMessage() {
    const input = document.getElementById("userInput");
    const responseDiv = document.getElementById("response");
    const question = input.value.trim();

    if (!question) {
        responseDiv.innerHTML = "Сұрақ жазыңыз";
        return;
    }

    requestCount++;
    document.getElementById("count").innerText = requestCount;

    responseDiv.innerHTML = "Ойлануда...";
    input.value = "";

    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [{ text: question }]
                        }
                    ]
                })
            }
        );

        const data = await response.json();

        const answer =
            data.candidates?.[0]?.content?.parts?.[0]?.text;

        responseDiv.innerHTML = answer
            ? `<b>Жауап:</b><br>${answer}`
            : "Жауап жоқ";

    } catch (error) {
        console.error(error);
        responseDiv.innerHTML = "Қате болды";
    }
}

function setupEnterKey() {
    const input = document.getElementById("userInput");

    input.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            sendMessage();
        }
    });
}

function setupCardAnimations() {
    const cards = document.querySelectorAll(".card");

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("show");
            }
        });
    }, {
        threshold: 0.2
    });

    cards.forEach((card) => {
        observer.observe(card);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    setupEnterKey();
    setupCardAnimations();
});
